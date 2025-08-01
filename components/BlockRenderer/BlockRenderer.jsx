import React, { Suspense } from "react";
import { useEffect, useState } from "react";
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;


//////////////////////////////////////
// UTILITY 
// Convert example 'acf/home-hero' => 'HomeHero'
// this will have to be a format used when creating blocks
const pascalCase = (slug) =>
  slug
    .replace(/^acf\//, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');


//////////////////////////////////////
// REPEATERS
// Converts flattened repeater fields (ACF's `_0_` structure) to array objects.
// Example: repeater_0_image, repeater_1_image => repeater: [{image: ...}, ...]
// just doing this to make our life easier when reading the data.
const collectRepeaters = (data) => {

  const out = { ...data };

  Object.keys(data).forEach((key) => {
    // Detect if this key represents a repeater by checking for children like repeater_0_something
    const hasRepeaterChildren = Object.keys(data).some(k => k.startsWith(`${key}_0_`));

    if (
      hasRepeaterChildren &&
      (typeof data[key] === "number" || (typeof data[key] === "string" && /^\d+$/.test(data[key]))) &&
      data.hasOwnProperty("_" + key)
    ){

      const count = Number(data[key]);
      const repeaterName = key;
      const items = [];

      for (let i = 0; i < count; i++){
        const item = {};
        Object.keys(data).forEach((k) => {
          const match = k.match(new RegExp(`^${repeaterName}_${i}_(.+)$`));

          if (match){
            item[match[1]] = data[k];
          }

        });
        items.push(item);
      }

      out[repeaterName] = items;
    }
  });

  return out;
};
// Strips out ACF meta keys and leftover repeater flattening.
const cleanProps = (props) => {

  const cleaned = {};

  Object.entries(props).forEach(([key, value]) => {
    // Internal ACF/meta fields
    if (key.startsWith('_')) return;
     // Flattened repeater keys
    if (/\_\d+\_/.test(key)) return;
    cleaned[key] = value;
  });

  return cleaned;
};


//////////////////////////////////////
// GROUPS
// collecting group data and adding it into it's own object
// by default this is flattened
const collectGroups = (data) => {

  const out = { ...data };

  Object.keys(data).forEach((groupKey) => {
    // Only process if key is an "empty" group field
    if ((data[groupKey] === "" || data[groupKey] == null) && typeof groupKey === "string"){

      const groupObj = {};

      Object.keys(data).forEach((childKey) => {

        if (childKey.startsWith(groupKey + "_")){
          const field = childKey.replace(groupKey + "_", "");
          groupObj[field] = data[childKey];
        }

      });

      if (Object.keys(groupObj).length){
        out[groupKey] = groupObj;
        Object.keys(groupObj).forEach((field) => {
          delete out[`${groupKey}_${field}`];
        });
      }

    }
  });
  return out;
};



//////////////////////////////////////
// FIELD HYDRATION!
// Helper to collect all unique image IDs, file IDs, etc.
// it should handle any (numbers or numeric strings) in block data
// should also handle arrays, objects, and single values.
// tested and working with ACF File, Image, Gallery
const findMediaIds = (blocks) => {

  const ids = [];
  const crawl = (val) => {
    if (Array.isArray(val)) val.forEach(crawl);
    else if (typeof val === "object" && val !== null) Object.values(val).forEach(crawl);
    else if (typeof val === "number" || (typeof val === "string" && /^\d+$/.test(val))) ids.push(val);
  };

  blocks.forEach(block => crawl(block.attrs?.data));

  return Array.from(new Set(ids));

};
// Recursively hydrate props, replacing media IDs with actual media objects
const hydrateMedia = (value, mediaMap) => {

  if (Array.isArray(value)) return value.map((item) => hydrateMedia(item, mediaMap));

  if (typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value))){
    // Hydrate if found, else keep as-is
    return mediaMap[value] || value;
  }

  if (typeof value === "object" && value !== null){
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, hydrateMedia(val, mediaMap)])
    );
  }

  return value;
};




//////////////////////////////////////
// CORE RENDERER
const BlockRenderer = ({ blocks }) => {
  const [imageMap, setImageMap] = useState({});

  // Fetch and cache all media IDs referenced in blocks
  useEffect(() => {

    const ids = findMediaIds(blocks);

    if (!ids.length) return;

    Promise.all(
      ids.map(id =>
        fetch(`${WP_URL}/wp-json/wp/v2/media/${id}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(images => {
      const map = {};
      images.forEach(img => {
        if (img && img.id) map[img.id] = img;
      });
      setImageMap(map);
    });

  }, [blocks]);

  if (!blocks) return null;

  return blocks.map((block, i) => {

    if (!block.blockName) return null;
    // Convert blockName to PascalCase to match filename
    const ComponentName = pascalCase(block.blockName);
    // Dynamically import the block component; fallback if missing
    const BlockComponent = React.lazy(() =>
      import(`@/blocks/${ComponentName}/${ComponentName}.jsx`).catch(() => ({
        default: () => <div>Missing block: {ComponentName}</div>
      }))
    );

    // Compose props:
    // 1. Unflatten repeaters
    // 2. Unflatten groups
    // 3. Hydrate media fields
    // 4. Remove meta/flattened keys
    // functions above handle this
    const hydratedProps = cleanProps(
      hydrateMedia(
        collectGroups(collectRepeaters(block.attrs?.data || {})),
        imageMap
      )
    );

    return (
      <Suspense fallback={<div>Loading...</div>} key={i}>
        <BlockComponent {...hydratedProps} />
      </Suspense>
    );
  });

};

export default BlockRenderer;