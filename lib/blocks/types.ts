/**
 * Shared types for the block engine.
 * The manifest schema mirrors the PHP theme's blocks/manifest.json shape.
 */

export type BlockManifestEntry = {
  slug: string;
  path: string; // repo-relative, e.g. "hero/HeroPage/HeroPage.tsx"
  component: string; // PascalCase, e.g. "HeroPage"
  category: string; // top-level folder, e.g. "hero"
  title: string;
  description: string;
  keywords: string[];
  requires: string[]; // client-side libs the block needs (e.g. ["gsap"])
};

export type BlocksManifest = {
  generated: string;
  blocks: Record<string, BlockManifestEntry>;
};

/**
 * The shape of a single entry in a WPGraphQL `blocksRaw` response, after
 * JSON.parse. Matches WordPress's `parse_blocks()` output.
 */
export type RawBlock = {
  blockName: string | null;
  attrs?: {
    data?: Record<string, unknown>;
    [key: string]: unknown;
  };
  innerBlocks?: RawBlock[];
  innerHTML?: string;
};
