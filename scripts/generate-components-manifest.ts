/**
 * Generate components/manifest.json by walking the components/ tree.
 *
 * Convention:
 *   components/{PascalCase}/{PascalCase}.tsx
 *
 * The manifest is not required for imports (React components import directly),
 * but it enables tooling: unused-component detection, dev warnings, and
 * possible future auto-loading for global scripts. Mirrors the PHP theme's
 * component registry.
 */

import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

type ComponentEntry = {
  slug: string;
  path: string;
  component: string;
  hasStyles: boolean;
};

const COMPONENTS_DIR = join(process.cwd(), "components");
const OUTPUT = join(COMPONENTS_DIR, "manifest.json");
const IGNORE = new Set(["node_modules", ".DS_Store"]);

const pascalToKebab = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const main = () => {
  if (!existsSync(COMPONENTS_DIR)) {
    console.warn("[components] No components/ directory found, skipping.");
    return;
  }

  const components: Record<string, ComponentEntry> = {};
  let count = 0;

  const entries = readdirSync(COMPONENTS_DIR)
    .filter((n) => !IGNORE.has(n) && !n.startsWith("."))
    .filter((n) => statSync(join(COMPONENTS_DIR, n)).isDirectory());

  for (const componentName of entries) {
    const full = join(COMPONENTS_DIR, componentName);
    const tsx = join(full, `${componentName}.tsx`);

    if (!existsSync(tsx)) {
      console.warn(`[components] Skipping ${componentName} — no ${componentName}.tsx`);
      continue;
    }

    const slug = pascalToKebab(componentName);
    const scss = join(full, `${componentName}.module.scss`);

    components[slug] = {
      slug,
      path: relative(COMPONENTS_DIR, tsx),
      component: componentName,
      hasStyles: existsSync(scss),
    };
    count++;
  }

  const manifest = {
    generated: new Date().toISOString(),
    components,
  };

  writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `[components] Wrote ${count} component${count === 1 ? "" : "s"} to ${relative(process.cwd(), OUTPUT)}`
  );
};

main();
