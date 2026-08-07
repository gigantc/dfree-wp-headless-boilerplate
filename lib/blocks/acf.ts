/**
 * ACF data shaping helpers.
 *
 * WPGraphQL's blocksRaw returns ACF field data in a flattened shape that mirrors
 * WordPress post_meta: repeaters become `field_0_child`, groups become `field_child`,
 * and internal ACF meta keys are prefixed with `_`. These helpers reverse all of
 * that into the object/array shapes you actually want to consume in a block.
 *
 * Ported from the legacy pages-router BlockRenderer with light cleanup.
 */

export type AcfData = Record<string, unknown>;

/**
 * Un-flatten ACF repeater fields.
 *
 * Detects keys where `data[key]` is a numeric count AND child keys exist in the
 * form `key_0_child`, `key_1_child`, etc. Builds an array of objects and stores
 * it back under `key`. Leaves the flattened source keys in place — `cleanProps`
 * strips them at the end of the pipeline.
 */
export function collectRepeaters(data: AcfData): AcfData {
  const out: AcfData = { ...data };

  for (const key of Object.keys(data)) {
    const hasChildren = Object.keys(data).some((k) => k.startsWith(`${key}_0_`));
    const value = data[key];
    const looksNumeric =
      typeof value === "number" ||
      (typeof value === "string" && /^\d+$/.test(value));

    if (hasChildren && looksNumeric && `_${key}` in data) {
      const count = Number(value);
      const items: AcfData[] = [];

      for (let i = 0; i < count; i++) {
        const item: AcfData = {};
        for (const k of Object.keys(data)) {
          const match = k.match(new RegExp(`^${key}_${i}_(.+)$`));
          if (match) item[match[1]] = data[k];
        }
        items.push(item);
      }

      out[key] = items;
    }
  }

  return out;
}

/**
 * Un-flatten ACF group fields.
 *
 * Groups are represented as an empty string / null at `key`, with children at
 * `key_child1`, `key_child2`, etc. Collect the children into a nested object.
 */
export function collectGroups(data: AcfData): AcfData {
  const out: AcfData = { ...data };

  for (const groupKey of Object.keys(data)) {
    const val = data[groupKey];
    const isEmpty = val === "" || val == null;

    if (isEmpty && typeof groupKey === "string") {
      const groupObj: AcfData = {};

      for (const childKey of Object.keys(data)) {
        if (childKey.startsWith(`${groupKey}_`)) {
          const field = childKey.slice(groupKey.length + 1);
          groupObj[field] = data[childKey];
        }
      }

      if (Object.keys(groupObj).length) {
        out[groupKey] = groupObj;
        for (const field of Object.keys(groupObj)) {
          delete out[`${groupKey}_${field}`];
        }
      }
    }
  }

  return out;
}

/**
 * Strip ACF meta keys (`_field`) and leftover flattened repeater keys (`field_0_child`).
 * Run last, after repeaters and groups have been collected.
 */
export function cleanProps(props: AcfData): AcfData {
  const cleaned: AcfData = {};

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("_")) continue;
    if (/_\d+_/.test(key)) continue;
    cleaned[key] = value;
  }

  return cleaned;
}

/**
 * Full ACF shaping pipeline: repeaters → groups → strip meta.
 * This is what a block renderer typically wants.
 */
export function shapeAcfProps(raw: AcfData): AcfData {
  return cleanProps(collectGroups(collectRepeaters(raw)));
}
