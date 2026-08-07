export const SITE_SETTINGS_QUERY = /* GraphQL */ `
  query SiteSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;
