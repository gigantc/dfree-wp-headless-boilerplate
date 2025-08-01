import { useState } from "react";

import Head from "next/head";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";
import NavMenu from "@/containers/NavMenu/NavMenu";

import { PAGE_QUERY } from "../queries/PageQuery";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";

import BlockRenderer from "@/components/BlockRenderer/BlockRenderer";



const FrontPage = (props) => {

  //////////////////////////////////////
  // STATE
  const [navOpen, setNavOpen] = useState(false);
  

  //////////////////////////////////////
  // DATA
  const siteDataQuery = useQuery(SITE_DATA_QUERY) || {};
  const siteData = siteDataQuery?.data?.generalSettings || {};
  const { title: siteTitle, description: siteDescription } = siteData;
  // Extract the first page.content from __FAUST_QUERIES__
  //we need this for blocks
  let blocksRaw = null;
  const queries = props.__FAUST_QUERIES__ || {};
  for (const key in queries) {
    if (queries[key]?.page?.content) {
      content = queries[key].page.content;
    }
    if (queries[key]?.page?.blocksRaw) {
      blocksRaw = queries[key].page.blocksRaw;
    }
  }


  //////////////////////////////////////
  // RENDER
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Header 
        siteTitle={siteTitle}
        setNavOpen={setNavOpen}
        open={navOpen}
      />

      <NavMenu 
        open={navOpen} 
        setOpen={setNavOpen}
      />

      <main>
        <BlockRenderer blocks={typeof blocksRaw === "string" ? JSON.parse(blocksRaw) : blocksRaw} />
      </main>

      <Footer />
    </>
  );
};


//////////////////////////////////////
// PROPS AND QUERIES

//just returns props
const getStaticProps = async (context) =>
  getNextStaticProps(context, {
    Page: FrontPage,
    revalidate: 60,
  });

//run em
FrontPage.queries = [
  {
    query: PAGE_QUERY,
    variables: props => ({ databaseId: props?.databaseId })
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];




//////////////////////////////////////
// EXPORT
export { getStaticProps };
export default FrontPage;