/**
 * Universal catch-all route.
 *
 * WordPress serves many URI shapes (pages, posts, CPTs, archives, taxonomies).
 * We ask WPGraphQL for `nodeByUri` and branch on the returned `__typename` to
 * pick a template. This replaces Faust's `[...wordpressNode]` and its whole
 * template-router machinery — about 30 lines instead of a framework.
 */

import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp/client";
import { NODE_BY_URI_QUERY } from "@/lib/wp/queries/nodeByUri";
import { BlockRenderer } from "@/lib/blocks/renderer";

type NodeResponse = {
  nodeByUri: {
    __typename: string;
    title?: string | null;
    blocksRaw?: string | null;
    slug?: string | null;
  } | null;
};

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const uri = slug?.length ? `/${slug.join("/")}/` : "/";

  let data: NodeResponse;
  try {
    data = await wpFetch<NodeResponse>(NODE_BY_URI_QUERY, { variables: { uri } });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
          <h1>dfree-wp-headless-boilerplate</h1>
          <p>
            Could not reach WordPress. Configure <code>.env.local</code> with your
            WPGraphQL endpoint (see <code>.env.local.example</code>).
          </p>
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>{String(err)}</pre>
        </main>
      );
    }
    notFound();
  }

  const node = data.nodeByUri;
  if (!node) notFound();

  // Route by content type. Extend this as you add CPTs.
  switch (node.__typename) {
    case "Page":
    case "Post":
      return (
        <main>
          {node.title ? <h1>{node.title}</h1> : null}
          <BlockRenderer blocks={node.blocksRaw} />
        </main>
      );
    default:
      // Unknown type — render generic body until a template exists.
      return (
        <main>
          {node.title ? <h1>{node.title}</h1> : null}
          <BlockRenderer blocks={node.blocksRaw} />
        </main>
      );
  }
}
