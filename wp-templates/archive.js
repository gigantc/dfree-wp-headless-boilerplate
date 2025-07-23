import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Header from "../containers/Header/Header";
import Footer from "../containers/Footer/Footer";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { POST_LIST_FRAGMENT } from "../fragments/PostListFragment";
import { getNextStaticProps } from "@faustwp/core";
import { useState } from "react";

const BATCH_SIZE = 5;

const ARCHIVE_QUERY = gql`
  ${POST_LIST_FRAGMENT}
  query GetArchive($uri: String!, $first: Int!, $after: String) {
    nodeByUri(uri: $uri) {
      archiveType: __typename
      ... on Category {
        name
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...PostListFragment
          }
        }
      }
      ... on Tag {
        name
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...PostListFragment
          }
        }
      }
    }
  }
`;

const LoadMoreButton = ({ onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <button type="button" onClick={handleLoadMore} disabled={loading}>
      {loading ? "Loading..." : "Load more"}
    </button>
  );
};

const Archive = (props) => {
  const { __SEED_NODE__ } = props;
  const currentUri = __SEED_NODE__.uri;

  const {
    data,
    loading = true,
    error,
    fetchMore,
  } = useQuery(ARCHIVE_QUERY, {
    variables: { first: BATCH_SIZE, after: null, uri: currentUri },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const { data: siteDataRes } = useQuery(SITE_DATA_QUERY) || {};
  const { data: headerMenuDataRes } = useQuery(HEADER_MENU_QUERY) || {};

  if (loading && !data)
    return (
      <div className="container-main flex justify-center py-20">Loading...</div>
    );

  if (error) return <p>Error! {error.message}</p>;

  const siteData = siteDataRes?.generalSettings || {};
  const menuItems = headerMenuDataRes?.primaryMenuItems?.nodes || [];
  const { title: siteTitle } = siteData;

  const nodeByUri = data?.nodeByUri;
  const { archiveType, name, posts } = nodeByUri || {};

  if (!posts?.nodes?.length) {
    return <p>No posts have been published</p>;
  }

  const loadMorePosts = async () => {
    await fetchMore({
      variables: {
        first: BATCH_SIZE,
        after: posts.pageInfo.endCursor,
        uri: currentUri,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          nodeByUri: {
            ...fetchMoreResult.nodeByUri,
            posts: {
              ...fetchMoreResult.nodeByUri.posts,
              nodes: [
                ...prevResult.nodeByUri.posts.nodes,
                ...fetchMoreResult.nodeByUri.posts.nodes,
              ],
            },
          },
        };
      },
    });
  };

  return (
    <>
      <Head>
        <title>{`${archiveType}: ${name} - ${siteTitle}`}</title>
      </Head>
      <Header siteTitle={siteTitle} />
      <main className="container">
        <div title={`Archive for ${archiveType}: ${name}`} />
        <div>
          {posts?.nodes.length > 0 ? (
            posts.nodes.map((post) => (
              <div key={post.id}>{post.title}</div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
          {posts.pageInfo.hasNextPage && (
            <LoadMoreButton onClick={loadMorePosts} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

Archive.queries = [
  {
    query: ARCHIVE_QUERY,
    variables: ({ uri }) => ({
      uri,
      first: BATCH_SIZE,
      after: null,
    }),
  },
  { query: SITE_DATA_QUERY },
  { query: HEADER_MENU_QUERY },
];

export const getStaticProps = async (context) =>
  getNextStaticProps(context, {
    Page: Archive,
    revalidate: 60,
  });

export default Archive;