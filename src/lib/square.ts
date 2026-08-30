const SQUARE_API_BASE = "https://connect.squareup.com";
const SQUARE_VERSION = "2025-01-23";

export type SquareTeamMember = {
  id: string;
  given_name?: string;
  family_name?: string;
  status?: string;
};

export type SquareItemVariationData = {
  item_id: string;
  name?: string;
  price_money?: { amount: number; currency: string };
  service_duration?: number;
  team_member_ids?: string[];
};

export type SquareCatalogVariation = {
  type: "ITEM_VARIATION";
  id: string;
  is_deleted?: boolean;
  item_variation_data: SquareItemVariationData;
};

export type SquareCatalogItem = {
  type: "ITEM";
  id: string;
  is_deleted?: boolean;
  item_data: {
    name: string;
    product_type?: string;
    variations?: SquareCatalogVariation[];
  };
};

async function squareFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SQUARE_API_BASE}${path}`, {
    ...init,
    headers: {
      "Square-Version": SQUARE_VERSION,
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Square API ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchActiveTeamMembers(): Promise<SquareTeamMember[]> {
  const data = await squareFetch<{ team_members?: SquareTeamMember[] }>("/v2/team-members/search", {
    method: "POST",
    body: JSON.stringify({ query: { filter: { status: "ACTIVE" } } }),
  });
  return data.team_members ?? [];
}

export async function fetchCatalogItems(): Promise<SquareCatalogItem[]> {
  const items: SquareCatalogItem[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({ types: "ITEM" });
    if (cursor) qs.set("cursor", cursor);
    const data = await squareFetch<{ objects?: SquareCatalogItem[]; cursor?: string }>(
      `/v2/catalog/list?${qs.toString()}`
    );
    for (const obj of data.objects ?? []) {
      if (obj.type === "ITEM" && !obj.is_deleted) items.push(obj);
    }
    cursor = data.cursor;
  } while (cursor);
  return items;
}
