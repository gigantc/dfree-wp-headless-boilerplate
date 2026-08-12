# CLAUDE.md

Instructions for Claude Code working in this codebase. Read this first.

---

## Which repo are you in?

This file ships with the **`dfree-wp-headless-boilerplate`** template. A repo
containing this file is one of two things:

**A) The boilerplate itself** — `dfree-wp-headless-boilerplate`.
   - Located at `/Users/danf/Sites/dev/dfree-wp-headless-boilerplate`.
   - Origin: `github.com/gigantc/dfree-wp-headless-boilerplate`.
   - Changes here become defaults for every future site.

**B) A site scaffolded from the boilerplate** (via GitHub's "Use this template").
   - Has no shared git history with the boilerplate.
   - The boilerplate lives at the path above and is the upstream source of
     truth for shared architecture.

**Check `origin` in `git remote -v` to know which you're in.**

---

## The Backport Rule (critical when in a site)

When working in a **site** (case B above) and you find a bug or improvement
that belongs to the boilerplate — a `BlockRenderer` fix, a new helper in
`lib/`, a manifest generator improvement, a general convention — **stop, apply
the change in the boilerplate first, then bring it into the site.**

The workflow:

1. Fix the boilerplate: `cd /Users/danf/Sites/dev/dfree-wp-headless-boilerplate`
2. Commit + push there. Bump `package.json` version if the change is meaningful.
   Add a line to `CHANGELOG.md`.
3. Return to the site. Apply the same change (copy/paste is fine — the two
   repos have no shared history to merge from).
4. In the site's commit message, note the boilerplate version it corresponds to.

**Why:** if we only fix things in the site, the boilerplate rots and the next
project inherits the old bugs. Boilerplate improvements only compound if they
get committed at the source.

**Exceptions:** truly site-specific fixes (branding, one-off blocks, project-
particular queries) stay in the site. If unsure, ask: "would the next project
also want this?" Yes → boilerplate first. No → site only.

---

## Site-specific info (fill in per-project)

When starting a new site from the template, edit this section:

- **Site name:** _(fill in)_
- **WordPress install:** _(local path or URL — e.g. `~/Local/{site}/app/public`)_
- **WPGraphQL endpoint:** _(same host, `/graphql`)_
- **Brand tokens location:** `styles/_variables.scss` — replace boilerplate defaults with brand colors, fonts
- **Deployed URL:** _(fill in when live)_
- **Notable deviations from boilerplate:** _(list anything site-specific that
  differs from standard boilerplate behavior)_

### Current State (update at end of each session)

Ephemeral session-handoff notes. Overwrite freely — this is not a log, just
"where am I right now?" so the next session (or future-Claude) can pick up
without re-deriving context. Keep it short — bullet list, one or two lines
each. If it grows past ~15 lines, promote to a separate `HANDOFF.md`.

- **Last worked on:** _(what was the focus of the last session)_
- **In progress:** _(anything mid-flight — half-wired block, incomplete query, style not yet applied)_
- **Next up:** _(the immediate next task)_
- **Open questions / decisions pending:** _(things you'd want to ask yourself in a week)_
- **Boilerplate version:** _(the boilerplate `package.json` version this site was scaffolded from or last synced with)_

Delete this whole "Site-specific info" section (both blocks) in the
boilerplate repo itself — it only applies to derivative sites.

---

## Quickstart for a new site

1. Click **Use this template** on
   [`dfree-wp-headless-boilerplate`](https://github.com/gigantc/dfree-wp-headless-boilerplate).
2. Clone the new repo locally.
3. `npm install`
4. `cp .env.local.example .env.local`, set `WORDPRESS_GRAPHQL_ENDPOINT` and
   `NEXT_PUBLIC_WORDPRESS_URL` to the WP install for this site.
5. Ensure the WP install has the required plugins (see **WordPress-Side
   Requirements** below).
6. In wp-admin, register the blocks you'll build; add matching ACF field groups.
7. `npm run codegen` to generate types from the WPGraphQL schema.
8. `npm run dev` and start building.
9. Fill in the **Site-specific info** section above.

---

## Headless Block Development Standards

### Reusable Components

- Shared UI lives in `components/{PascalCase}/`.
- Every component: one `.tsx`, one `.module.scss`, both named PascalCase.
- Import directly — no render helper (unlike the sister PHP theme's `component()`).

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

---

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

---

## Architecture Overview

### App Router Structure

- `app/layout.tsx` — root layout. Fetches site settings, sets metadata.
- `app/[[...slug]]/page.tsx` — **universal catch-all**. Handles every WP URI
  including `/`. Resolves via `nodeByUri`, branches on `__typename` to render.
  There is intentionally no `app/page.tsx` — the optional catch-all covers it.
- `app/preview/route.ts` — draft preview handler. Validates the shared secret,
  enables draft mode, redirects to the target URI.

### Block Rendering Flow

1. Route handler calls `wpFetch(NODE_BY_URI_QUERY, { uri })`.
2. Response includes `blocksRaw` — a JSON string of parsed WordPress blocks
   (provided by the `register-blocks-for-acf` WP plugin).
3. `<BlockRenderer blocks={node.blocksRaw} />` (in `lib/blocks/renderer.tsx`)
   walks each block.
4. For each block: look up entry in `blocks/manifest.json`, resolve to a
   pre-declared import from the auto-generated `lib/blocks/imports.ts`, pass
   ACF-shaped props.
5. Blocks not in the manifest render nothing in production, show a dev warning.

### The Static Imports Map

`lib/blocks/imports.ts` is **auto-generated** by
`scripts/generate-blocks-manifest.ts`. It's a static object mapping each block
slug to an `import()` call. This exists (rather than a template-literal dynamic
import) so Turbopack doesn't glob-scan every file under `blocks/` on every
build. **Never edit by hand.**

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
  `lib/wp/generated.ts`. Run `npm run codegen` after WP schema changes.

### Manifest Registries

Mirrors the sister PHP theme's `DFREE_Block_Registry` /
`DFREE_Component_Registry` pattern. Scripts in `scripts/` walk the folder tree
and write `{blocks,components}/manifest.json` plus `lib/blocks/imports.ts`.
Node's module cache means we don't need transients — the manifest is read once
per process.

### SCSS Architecture

- `styles/_variables.scss` — design tokens (colors, fonts, breakpoints, mixins).
- `styles/_fonts.scss` — `@font-face` declarations.
- `styles/_reset.scss` — minimal reset.
- `styles/globals.scss` — global styles imported once in `app/layout.tsx`.
- Block/component styles use SCSS Modules. Import shared tokens via
  `@use "styles/variables" as v;` (the loadPaths are set in `next.config.ts`).

---

## Block Folder Organization

See `docs/block-folder-structure.md`. Top-level: `layout/`, `hero/`,
`feature/`, `utility/`, `misc/`. Identical taxonomy to the sister PHP theme.

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

---

## WordPress-Side Requirements

This repo is frontend-only. The WordPress install must have:

- **WPGraphQL** + **ACF** (Pro or free)
- **[`register-blocks-for-acf`](https://github.com/gigantc/register-blocks-for-acf)** ≥ 1.1.0 — the sister WP-side plugin. Provides:
  - Admin UI for defining ACF blocks (a `acf_block_template` CPT), one per block
  - `blocksRaw: JSON` and `acfFields: JSON` fields on the WPGraphQL
    `ContentNode` interface (so Page, Post, and any CPT all expose them)
  - Dynamic block category registration and inserter restriction
- Optionally: WPGraphQL for ACF if you need typed ACF access outside of blocks
  (options pages, taxonomies)
- Optionally: WPGraphQL Smart Cache for object caching + purge-on-save
- Menu locations registered via `register_nav_menus()` in a per-site mu-plugin
  (site-specific; not part of this boilerplate)

Twenty Twenty-Five (or any theme) remains the active theme — it never renders
in headless mode.

**Naming contract:** a block registered in wp-admin with slug `hero-page`
must have a corresponding folder `blocks/{category}/HeroPage/` in this repo.
The kebab-case slug maps to the PascalCase folder name via the manifest
generator.

**Homepage:** WordPress must have Settings → Reading → "Your homepage displays"
set to **A static page** for `/` to resolve to a real node. Otherwise
`nodeByUri("/")` returns a bare `ContentType` with no blocks.

---

## Do Not

- Do not use Pages Router patterns (`getStaticProps`, `getServerSideProps`, `pages/`).
- Do not add Apollo Client — RSC + `wpFetch` covers everything.
- Do not add Faust.js — this boilerplate exists precisely to avoid it.
- Do not create `app/page.tsx` — the optional catch-all `[[...slug]]` handles `/`.
- Do not fetch WP media by REST from the client. Query for full media objects
  via WPGraphQL as part of the block query.
- Do not edit `blocks/manifest.json`, `components/manifest.json`, or
  `lib/blocks/imports.ts` by hand — all three are auto-generated.
- Do not put `block.preview.jpg` or `block.icon.svg` in block folders here —
  those belong in the WP-side plugin (`register-blocks-for-acf`).
- Do not put `.md` files under `blocks/` or `components/` — Turbopack scans
  those trees and will fail on unknown module types. Docs go in `docs/`.
