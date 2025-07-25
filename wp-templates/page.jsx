import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";


import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { getNextStaticProps } from "@faustwp/core";

const PAGE_QUERY = gql`
  query GetPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
    }
  }
`;

const Page = (props) => {
  const { loading: propsLoading, __SEED_NODE__ } = props;

  if (propsLoading) return <>Loading...</>;

  const { databaseId, asPreview } = __SEED_NODE__;

  const {
    data,
    loading = true,
    error,
  } = useQuery(PAGE_QUERY, {
    variables: { databaseId, asPreview },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const { data: siteDataRes } = useQuery(SITE_DATA_QUERY) || {};
  const { data: headerMenuRes } = useQuery(HEADER_MENU_QUERY) || {};

  if (loading && !data) return <div>Loading...</div>;
  if (error) return <p>Error! {error.message}</p>;
  if (!data?.page) return <p>No pages have been published</p>;

  const siteData = siteDataRes?.generalSettings || {};
  const menuItems = headerMenuRes?.primaryMenuItems?.nodes || [];
  const { title: siteTitle } = siteData;
  const { title, content } = data.page;

  return (
    <>
      <Head>
        <title>{`${title} - ${siteTitle}`}</title>
      </Head>
      <Header siteTitle={siteTitle} />
      <main className="container">
        <h1>{title}</h1>
        <pre>{JSON.stringify(props, null, 2)}</pre>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
      <Footer />
    </>
  );
};

Page.queries = [
  {
    query: PAGE_QUERY,
    variables: ({ databaseId }, ctx) => ({
      databaseId,
      asPreview: ctx?.asPreview,
    }),
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];

export default Page;