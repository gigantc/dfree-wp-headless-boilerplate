import Head from "next/head";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";

import { gql } from "@apollo/client";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";



//////////////////////////////////////
// COMPONENT
const FrontPage = (props) => {


  //////////////////////////////////////
  // DATA
  const siteDataQuery = useQuery(SITE_DATA_QUERY) || {};
  const siteData = siteDataQuery?.data?.generalSettings || {};
  const { title: siteTitle, description: siteDescription } = siteData;
  const { page } = props?.data || {};
  console.log('full props:', props.data);


  //////////////////////////////////////
  // RENDER
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Header siteTitle={siteTitle} />

      <main className="container">
        <p>blocks below</p>
        <div dangerouslySetInnerHTML={{ __html: page?.content }} />
      </main>

      <Footer />
    </>
  );
};


//////////////////////////////////////
// PROPS AND QUERIES
const getStaticProps = async (context) =>
  getNextStaticProps(context, {
    Page: FrontPage,
    revalidate: 60,
  });

//get blocks on the page
const FRONT_PAGE_QUERY = gql`
  query GetFrontPage($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      title
      content
    }
  }
`;

FrontPage.queries = [
  { 
    query: FRONT_PAGE_QUERY,
    variables: (props) => {
  console.log('props in variables:', props);
  return {
    databaseId: props?.__SEED_NODE__?.databaseId || 6, // Replace 1 with your front page's databaseId if you know it!
  };
}
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];




//////////////////////////////////////
// EXPORT
export { getStaticProps };
export default FrontPage;