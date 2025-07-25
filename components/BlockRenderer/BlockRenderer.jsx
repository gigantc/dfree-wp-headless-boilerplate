import React, { Suspense } from "react";

// Utility: Convert example 'acf/home-hero' => 'HomeHero'
const pascalCase = (slug) =>
  slug
    .replace(/^acf\//, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

// Core renderer
const BlockRenderer = ({ blocks }) => {
  if (!blocks) return null;

  return blocks.map((block, i) => {
    if (!block.blockName) return null;

    const ComponentName = pascalCase(block.blockName);

    const BlockComponent = React.lazy(() =>
      import(`@/blocks/${ComponentName}/${ComponentName}.jsx`).catch(() => ({
        default: () => <div>Missing block: {ComponentName}</div>
      }))
    );

    return (
      <Suspense fallback={<div>Loading...</div>} key={i}>
        <BlockComponent {...(block.attrs?.data || {})} />
      </Suspense>
    );
  });
};

export default BlockRenderer;