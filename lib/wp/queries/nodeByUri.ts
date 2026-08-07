/**
 * Universal node resolver.
 *
 * WordPress serves many URI shapes (pages, posts, custom post types, archives,
 * taxonomies). `nodeByUri` returns whichever node matches — we branch on
 * `__typename` in the catch-all route to pick a template.
 */
export const NODE_BY_URI_QUERY = /* GraphQL */ `
  query NodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      id
      ... on ContentNode {
        databaseId
        uri
        slug
        contentTypeName: __typename
      }
      ... on NodeWithTitle {
        title
      }
      ... on Page {
        blocksRaw: content
      }
      ... on Post {
        blocksRaw: content
        excerpt
        date
      }
    }
  }
`;
