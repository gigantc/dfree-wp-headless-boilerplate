# Changelog

All notable changes to `dfree-wp-headless-boilerplate` are recorded here.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: SemVer.

When a change belongs upstream (see the **Backport Rule** in `CLAUDE.md`),
commit it here first with a version bump and a line in this file, then apply
it to the derivative site.

---

## [Unreleased]

### Changed

- All `function` declarations converted to arrow functions across engine
  (`lib/`, `app/`), scripts (`scripts/`), and starter blocks/components. Sets
  arrow-form as the default code style for future sites.

---

## [1.0.0] — 2026-08-07

Initial scaffold.

### Added

- Next 16.3.0 App Router + TypeScript + Turbopack.
- WPGraphQL data layer: plain `fetch`-based client (`lib/wp/client.ts`) with
  Next data-cache support, starter queries (`nodeByUri`, `siteSettings`, `menu`).
- `graphql-codegen` config for typed queries.
- Block engine (`lib/blocks/`): RSC `BlockRenderer`, manifest registry,
  auto-generated static imports map, ACF repeater/group flatteners.
- Block folder taxonomy (`layout`, `hero`, `feature`, `utility`, `misc`)
  mirroring the sister PHP theme.
- Manifest generators (`scripts/`) for blocks and components.
- SCSS Modules with shared design tokens in `styles/`.
- Universal catch-all route (`app/[[...slug]]/page.tsx`) — handles every WP
  URI including `/` via `nodeByUri`.
- Draft preview handler (`app/preview/route.ts`).
- Example `HeroPage` block and `Button` component.
- README, CLAUDE.md, and folder-structure docs.
- Requires `register-blocks-for-acf` ≥ 1.1.0 on the WordPress side.
