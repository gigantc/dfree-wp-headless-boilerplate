import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * GraphQL Codegen config.
 *
 * Introspects the WPGraphQL schema and generates TypeScript types for every
 * query/fragment used in the app. Run via `npm run codegen` (or `codegen:watch`).
 *
 * Requires WORDPRESS_GRAPHQL_ENDPOINT in .env.local.
 */
const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

const config: CodegenConfig = {
  overwrite: true,
  schema: endpoint,
  documents: ["lib/wp/queries/**/*.ts", "blocks/**/*.tsx", "app/**/*.tsx"],
  generates: {
    "lib/wp/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: false,
        skipTypename: false,
      },
    },
  },
};

export default config;
