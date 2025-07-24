import Head from "next/head";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";

import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";


const FrontPage = (props) => {


  //////////////////////////////////////
  // DATA
  const siteDataQuery = useQuery(SITE_DATA_QUERY) || {};
  const siteData = siteDataQuery?.data?.generalSettings || {};
  const { title: siteTitle, description: siteDescription } = siteData;


  //////////////////////////////////////
  // RENDER
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Header siteTitle={siteTitle} />

      <main className="container">
        <p>hello. This is a FRONT PAGE template.</p>
      </main>

      <Footer />
    </>
  );
};


//////////////////////////////////////
// STATIC PROPS & QUERIES
const getStaticProps = async (context) =>
  getNextStaticProps(context, {
    Page: FrontPage,
    revalidate: 60,
  });

FrontPage.queries = [
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];


//////////////////////////////////////
// EXPORT
export { getStaticProps };
export default FrontPage;