import { writeClient } from "../../sanity/lib/write-client";
import { fetchActiveTeamMembers, fetchCatalogItems, type SquareCatalogItem } from "./square";

type ServiceCategory = "cuts" | "beards" | "shaves" | "students";

function guessCategory(name: string): ServiceCategory {
  const n = name.toLowerCase();
  if (n.includes("student")) return "students";
  if (n.includes("shave") || n.includes("towel") || n.includes("facial")) return "shaves";
  if (n.includes("beard")) return "beards";
  return "cuts";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDuration(msValues: number[]): string {
  const minutes = [...new Set(msValues.map((ms) => Math.round(ms / 60000)))].sort((a, b) => a - b);
  if (minutes.length === 0) return "";
  if (minutes.length === 1) return `${minutes[0]} min`;
  return `${minutes[0]}–${minutes[minutes.length - 1]} min`;
}

function formatPrice(amountsInPence: number[]): string {
  if (amountsInPence.length === 0) return "";
  const pounds = amountsInPence.map((a) => a / 100);
  const min = Math.min(...pounds);
  const allSame = pounds.every((a) => a === pounds[0]);
  return allSame ? `£${min}` : `from £${min}`;
}

function cleanSquareName(name: string): string {
  return name.replace(/\s*\.\s*$/, "").trim();
}

export type SquareSyncResult = {
  barbersCreated: number;
  servicesCreated: number;
  servicesUpdated: number;
  pricingEntriesWritten: number;
  syncedAt: string;
};

export async function syncFromSquare(): Promise<SquareSyncResult> {
  const client = writeClient;

  // ---- 1. Team members -> barbers ----
  const teamMembers = await fetchActiveTeamMembers();

  const existingBarbers = await client.fetch<
    { _id: string; squareTeamMemberId?: string; name: string }[]
  >(`*[_type == "barber"]{_id, squareTeamMemberId, name}`);

  const barberBySquareId = new Map(
    existingBarbers.filter((b) => b.squareTeamMemberId).map((b) => [b.squareTeamMemberId as string, b])
  );
  // Match on first name: Square often has full names ("Amir Baghery") where Sanity has
  // just a first name ("Amir"). A barbershop team is small, so first-name collisions are unlikely.
  const barberByFirstName = new Map(
    existingBarbers.map((b) => [b.name.trim().split(/\s+/)[0].toLowerCase(), b])
  );

  const squareIdToBarberId = new Map<string, string>();
  let barbersCreated = 0;
  let nextBarberOrder = existingBarbers.length;

  const barberTx = client.transaction();
  for (const tm of teamMembers) {
    const name = cleanSquareName([tm.given_name, tm.family_name].filter(Boolean).join(" ")) || "Unnamed";
    const firstName = name.split(/\s+/)[0].toLowerCase();
    const existing = barberBySquareId.get(tm.id) ?? barberByFirstName.get(firstName);

    if (existing) {
      squareIdToBarberId.set(tm.id, existing._id);
      if (!barberBySquareId.has(tm.id)) {
        barberTx.patch(existing._id, { set: { squareTeamMemberId: tm.id } });
      }
    } else {
      nextBarberOrder += 1;
      const id = `barber-square-${tm.id.toLowerCase()}`;
      barberTx.createIfNotExists({
        _id: id,
        _type: "barber",
        name,
        active: true,
        order: nextBarberOrder,
        squareTeamMemberId: tm.id,
      });
      squareIdToBarberId.set(tm.id, id);
      barbersCreated += 1;
    }
  }
  await barberTx.commit();

  // ---- 2. Catalog items -> services ----
  const items = await fetchCatalogItems();

  const existingServices = await client.fetch<
    { _id: string; squareItemId?: string; name: string; order?: number }[]
  >(`*[_type == "service"]{_id, squareItemId, name, order}`);

  const serviceBySquareId = new Map(
    existingServices.filter((s) => s.squareItemId).map((s) => [s.squareItemId as string, s])
  );
  const serviceByName = new Map(existingServices.map((s) => [s.name.toLowerCase(), s]));
  let nextServiceOrder = existingServices.reduce((max, s) => Math.max(max, s.order ?? 0), 0);

  let servicesCreated = 0;
  let servicesUpdated = 0;

  const pricingByBarber = new Map<string, { serviceId: string; price: number; durationMinutes: number }[]>();

  const serviceTx = client.transaction();
  for (const item of items as SquareCatalogItem[]) {
    const variations = (item.item_data.variations ?? []).filter((v) => !v.is_deleted);
    if (variations.length === 0) continue;

    const existing = serviceBySquareId.get(item.id) ?? serviceByName.get(item.item_data.name.toLowerCase());
    const serviceId = existing?._id ?? `service-square-${item.id.toLowerCase()}`;

    const prices = variations
      .map((v) => v.item_variation_data.price_money?.amount)
      .filter((n): n is number => typeof n === "number");
    const durations = variations
      .map((v) => v.item_variation_data.service_duration)
      .filter((n): n is number => typeof n === "number");

    const displayPrice = formatPrice(prices);
    const durationRange = formatDuration(durations);

    if (existing) {
      serviceTx.patch(existing._id, { set: { displayPrice, durationRange, squareItemId: item.id } });
      servicesUpdated += 1;
    } else {
      nextServiceOrder += 1;
      serviceTx.createIfNotExists({
        _id: serviceId,
        _type: "service",
        name: item.item_data.name,
        slug: { _type: "slug", current: slugify(item.item_data.name) },
        category: guessCategory(item.item_data.name),
        displayPrice,
        durationRange,
        featured: false,
        order: nextServiceOrder,
        squareItemId: item.id,
      });
      servicesCreated += 1;
    }

    for (const variation of variations) {
      const vd = variation.item_variation_data;
      if (typeof vd.price_money?.amount !== "number" || typeof vd.service_duration !== "number") continue;
      const durationMinutes = Math.round(vd.service_duration / 60000);
      const price = vd.price_money.amount / 100;
      for (const teamMemberId of vd.team_member_ids ?? []) {
        const barberId = squareIdToBarberId.get(teamMemberId);
        if (!barberId) continue;
        const list = pricingByBarber.get(barberId) ?? [];
        list.push({ serviceId, price, durationMinutes });
        pricingByBarber.set(barberId, list);
      }
    }
  }
  await serviceTx.commit();

  // ---- 3. Per-barber pricing (Square is the source of truth: replace entirely) ----
  let pricingEntriesWritten = 0;
  const pricingTx = client.transaction();
  for (const [barberId, entries] of pricingByBarber) {
    pricingTx.patch(barberId, {
      set: {
        pricing: entries.map((e, i) => ({
          _type: "servicePrice",
          _key: `sq-${i}-${e.serviceId}`,
          service: { _type: "reference", _ref: e.serviceId },
          price: e.price,
          durationMinutes: e.durationMinutes,
        })),
      },
    });
    pricingEntriesWritten += entries.length;
  }
  if (pricingByBarber.size > 0) await pricingTx.commit();

  return {
    barbersCreated,
    servicesCreated,
    servicesUpdated,
    pricingEntriesWritten,
    syncedAt: new Date().toISOString(),
  };
}
