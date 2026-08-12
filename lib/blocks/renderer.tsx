/**
 * BlockRenderer (React Server Component)
 *
 * Takes a `blocksRaw` payload from WPGraphQL (either a JSON string or an already-
 * parsed array), walks each block, resolves it via the manifest, and dynamically
 * imports the matching component on the server. No client-side lazy loading —
 * the block markup ships as pre-rendered HTML.
 *
 * ACF field data is shaped through the repeater/group flatteners in ./acf.ts
 * before being passed as props.
 */

import { shapeAcfProps } from "./acf";
import { blockImports } from "./imports";
import { getBlockEntry, normalizeSlug } from "./registry";
import type { RawBlock } from "./types";

type BlocksRawInput = string | RawBlock[] | null | undefined;

const parseBlocks = (input: BlocksRawInput): RawBlock[] => {
  if (!input) return [];
  if (typeof input === "string") {
    try {
      return JSON.parse(input) as RawBlock[];
    } catch {
      return [];
    }
  }
  return input;
};

const renderOne = async (block: RawBlock, index: number) => {
  if (!block.blockName) return null;

  const slug = normalizeSlug(block.blockName);
  const entry = await getBlockEntry(slug);

  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div
          key={index}
          style={{ padding: "1rem", border: "1px dashed #c33", color: "#c33" }}
        >
          Missing block: <code>{block.blockName}</code>
        </div>
      );
    }
    return null;
  }

  const load = blockImports[entry.slug];
  if (!load) return null;

  const mod = await load();
  const Component = mod.default;

  const props = shapeAcfProps(block.attrs?.data ?? {});

  return <Component key={index} {...props} />;
};

export const BlockRenderer = async ({ blocks }: { blocks: BlocksRawInput }) => {
  const parsed = parseBlocks(blocks);
  const rendered = await Promise.all(parsed.map((b, i) => renderOne(b, i)));
  return <>{rendered}</>;
};
