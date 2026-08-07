# CLAUDE.md

Instructions for Claude Code when working in this repo. Sister to the PHP
theme's CLAUDE.md — the concepts and vocabulary match; the mechanics differ
because this is TypeScript/React, not PHP.

## Headless Block Development Standards

### Reusable Components

- Shared UI lives in `components/{PascalCase}/`.
- Every component: one `.tsx`, one `.module.scss`, both named PascalCase.
- Import directly — no render helper (unlike PHP's `component()`).

### ACF Block Conventions

- One folder per block under `blocks/{category}/{PascalCase}/`.
- `{PascalCase}.tsx` is the React component (default export).
- `{PascalCase}.module.scss` is scoped styles.
- `block.config.json` is metadata (title, description, keywords, requires).
- WP-side ACF block name is the kebab-case of the folder (`HeroPage` → `hero-page`).
- The renderer receives `acf/hero-page` from WPGraphQL, strips the `acf/`
  prefix, looks up `hero-page` in the manifest, and imports the component.

### Animation Approach

Prefer CSS transitions / view transitions where possible. For heavier
animation, `"use client"` in the specific component and import GSAP there.
List the dependency in `block.config.json`'s `requires` array — informational
for now, will drive dynamic loading later.

## Development Commands

### Initial Setup

```bash
npm install
cp .env.local.example .env.local  # then edit
npm run codegen                    # generate types from WPGraphQL schema
```

### Development

```bash
npm run dev                        # regenerates manifests via predev
npm run manifests:watch            # rebuild manifests on block/component changes
npm run codegen:watch              # regenerate types on query changes
```

### Production Build

```bash
npm run build                      # regenerates manifests + codegen, then next build
npm run start                      # serve the production build
```

## Architecture Overview

### App Router Structure

- `app/layout.tsx` — root layout. Fetches site settings, sets metadata.
- `app/page.tsx` — front page. Queries `nodeByUri` at "/".
- `app/[[...slug]]/page.tsx` — universal catch-all. Resolves any WP URI via
  `nodeByUri`, branches on `__typename` to pick rendering.
- `app/preview/route.ts` — draft preview handler. Validates the shared secret,
  enables draft mode, redirects to the target URI.

### Block Rendering Flow

1. Route handler calls `wpFetch(NODE_BY_URI_QUERY, { uri })`.
2. Response includes `blocksRaw` — a JSON string of parsed WordPress blocks.
3. `<BlockRenderer blocks={node.blocksRaw} />` (in `lib/blocks/renderer.tsx`)
   walks each block.
4. For each `acf/{slug}` block: look up entry in `blocks/manifest.json`,
   dynamic import the component, pass ACF-shaped props.
5. Non-ACF blocks (`core/*`) render nothing in production, show a dev warning.

### ACF Data Shaping

WPGraphQL returns ACF fields in a flat shape mirroring `post_meta`:
- Repeaters: `field_0_child`, `field_1_child`
- Groups: `field_child1`, `field_child2` (with `field` empty/null)
- Meta: `_field`

`lib/blocks/acf.ts` un-flattens all of this into normal object/array shapes.
Composed via `shapeAcfProps(raw)` = `cleanProps(collectGroups(collectRepeaters(raw)))`.

### GraphQL Layer

- `lib/wp/client.ts` — plain `fetch` to the WPGraphQL endpoint. Supports
  Next's data cache via the `revalidate` option; pass `false` or `0` for
  no-cache (drafts, editor sessions).
- `lib/wp/queries/*.ts` — one file per query, exported as `const QUERY = /* GraphQL */ \`…\``.
- `graphql-codegen` reads all query files and generates types into
  `lib/wp/generated.ts`. Run `npm run codegen` after schema changes.

### Manifest Registries

Mirrors the PHP theme's `DFREE_Block_Registry` / `DFREE_Component_Registry`
pattern. Scripts in `scripts/` walk the folder tree and write
`{blocks,components}/manifest.json`. Node's module cache means we don't need
transients — the manifest is read once per process.

### SCSS Architecture

- `styles/_variables.scss` — design tokens (colors, fonts, breakpoints, mixins).
- `styles/_fonts.scss` — `@font-face` declarations.
- `styles/_reset.scss` — minimal reset.
- `styles/globals.scss` — global styles imported once in `app/layout.tsx`.
- Block/component styles use SCSS Modules. Import shared tokens via
  `@use "styles/variables" as v;` (the includePath is set in `next.config.ts`).

## Block Folder Organization

See `docs/block-folder-structure.md`. Top-level: `layout/`, `hero/`,
`feature/`, `utility/`, `misc/`. Identical taxonomy to the PHP theme.

### Layout vs Feature

- `layout/` = structural + content-agnostic (reusable pattern)
- `feature/` = storytelling + opinionated (designed message)

## Block SCSS Standards

- Import shared tokens: `@use "styles/variables" as v;`
- Wrap in a top-level class matching the block name; nested selectors are
  auto-scoped by CSS Modules.
- Prefer `clamp()` for fluid type. Use `v.breakpoint()` / `v.breakpoint-min()`
  mixins for media queries.

## ACF Field Naming (WP side)

Match the JS block's expected props. The renderer passes shaped ACF data as
props, so if your block expects `headline`, the ACF field slug should be `headline`.
Group and repeater field names become the object/array keys.

## WordPress-Side Requirements

This repo is frontend-only. The WordPress install must have:

- WPGraphQL + WPGraphQL for ACF + WP GraphQL Content Blocks + ACF Pro
- Each block registered via `acf_register_block_type()` in a mu-plugin
- Menu locations registered via `register_nav_menus()`

The companion `dfree-wp-headless-mu-plugin` repo (TBD) will handle the WP-side
registrations. Twenty Twenty-Five (or any theme) remains the active theme —
it never renders in headless mode.

## Do Not

- Do not use Pages Router patterns (`getStaticProps`, `getServerSideProps`, `pages/`).
- Do not add Apollo Client — RSC + `wpFetch` covers everything.
- Do not add Faust.js — this boilerplate exists precisely to avoid it.
- Do not fetch WP media by REST from the client. Query for full media objects
  via WPGraphQL as part of the block query.
- Do not edit `blocks/manifest.json` or `components/manifest.json` by hand —
  they are auto-generated.
- Do not put `block.preview.jpg` or `block.icon.svg` in block folders here —
  those belong in the WP-side mu-plugin.
