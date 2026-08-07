export const MENU_QUERY = /* GraphQL */ `
  query MenuByLocation($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        label
        uri
        path
        parentId
        cssClasses
      }
    }
  }
`;
