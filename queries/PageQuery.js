import { gql } from "@apollo/client";

//get blocksRaw and title of a page
export const PAGE_QUERY = gql`
  query PageByDatabaseId($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      title
      blocksRaw
    }
  }
`;