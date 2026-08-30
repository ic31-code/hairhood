import type { PortableBlock } from "../../sanity/lib/queries";

export function blocksToParagraphs(blocks: PortableBlock[] | null | undefined): string[] {
  if (!blocks?.length) return [];
  return blocks.map((block) => (block.children ?? []).map((c) => c.text ?? "").join(""));
}
