import { getWordPressProps, WordPressTemplate } from "@faustwp/core";

export default function Page(props) {
  // Try to get content from all likely places:
  const html =
    props?.data?.page?.content ||
    props?.data?.post?.content ||
    props?.data?.node?.content ||
    "";

  return (
    <>
      <WordPressTemplate {...props} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}