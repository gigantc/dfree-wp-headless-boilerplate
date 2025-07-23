import { gql } from "@apollo/client";
import Head from "next/head";
import Header from "../containers/Header/Header";
import Footer from "../containers/Footer/Footer";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useFaustQuery } from "@faustwp/core";

const POST_QUERY = gql`
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      author {
        node {
          name
        }
      }
    }
  }
`;

const Single = (props) => {
  if (props.loading) return <>Loading...</>;

  const contentQuery = useFaustQuery(POST_QUERY) || {};
  const siteDataQuery = useFaustQuery(SITE_DATA_QUERY) || {};
  const headerMenuDataQuery = useFaustQuery(HEADER_MENU_QUERY) || {};

  const siteData = siteDataQuery?.generalSettings || {};
  const menuItems = headerMenuDataQuery?.primaryMenuItems?.nodes || { nodes: [] };
  const { title: siteTitle, description: siteDescription } = siteData;
  const { title, content, date, author } = contentQuery?.post || {};

  return (
    <>
      <Head>
        <title>{`${title} - ${siteTitle}`}</title>
      </Head>

      <Header siteTitle={siteTitle} />

      <main className="container">
        <div>
          <h1>{title}</h1>
          <p>{date}</p>
          <p>{author?.node?.name}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>

      <Footer />
    </>
  );
};

Single.queries = [
  {
    query: POST_QUERY,
    variables: ({ databaseId }, ctx) => ({
      databaseId,
      asPreview: ctx?.asPreview,
    }),
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];

export default Single;