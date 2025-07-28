//////////////////////////////////////
// IMPORTS
import Head from "next/head";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";

import { PAGE_QUERY } from "../queries/PageQuery";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery } from "@apollo/client";

import BlockRenderer from "@/components/BlockRenderer/BlockRenderer";

//////////////////////////////////////
// COMPONENT
const Page = (props) => {
  //////////////////////////////////////
  // DATA
  const siteDataQuery = useQuery(SITE_DATA_QUERY) || {};
  const siteData = siteDataQuery?.data?.generalSettings || {};
  const { title: siteTitle, description: siteDescription } = siteData;

  // Extract the first page.content from __FAUST_QUERIES__ (for blocks)
  let blocksRaw = null;
  const queries = props.__FAUST_QUERIES__ || {};
  for (const key in queries) {
    if (queries[key]?.page?.blocksRaw) {
      blocksRaw = queries[key].page.blocksRaw;
      break;
    }
  }

  //////////////////////////////////////
  // RENDER
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Header siteTitle={siteTitle} />
      <main className="container">
        <BlockRenderer blocks={typeof blocksRaw === "string" ? JSON.parse(blocksRaw) : blocksRaw} />
      </main>
      <Footer />
    </>
  );
};

//////////////////////////////////////
// PROPS AND QUERIES
Page.queries = [
  {
    query: PAGE_QUERY,
    variables: props => ({ databaseId: props?.databaseId })
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];

//////////////////////////////////////
// EXPORT
export default Page;