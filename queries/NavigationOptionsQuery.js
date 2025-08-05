import { gql } from "@apollo/client";

//get the navigation fields from ACF options
export const NAVIGATION_OPTIONS_QUERY = gql`
  query GetNavigationOptions {
       navigation {
        hamMenu {
          gravityFormNum
          subMenu {
            link {
              target
              title
              url
            }
          }
          socialLinks {
            svgIcon
            link {
              target
              title
              url
            }
          }
          mainNavLink {
            link {
              target
              title
              url
            }
          }
          contactLinks {
            heading
            link {
              target
              title
              url
            }
          }
        }
      }
  }
`;