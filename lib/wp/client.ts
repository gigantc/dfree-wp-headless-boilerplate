/**
 * WPGraphQL client.
 *
 * Server-side fetch to WordPress's GraphQL endpoint. Designed for use inside
 * React Server Components — one call per component, cached by Next's data cache.
 *
 * Usage:
 *   const data = await wpFetch(PAGE_BY_URI_QUERY, { uri: "/about" });
 *
 * The `revalidate` option controls Next's ISR-style cache. Pass `0` to disable
 * caching (draft previews, editor sessions), or an integer seconds value.
 */

const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

export type WpFetchOptions = {
  variables?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
  authToken?: string;
};

export async function wpFetch<T = unknown>(
  query: string,
  options: WpFetchOptions = {}
): Promise<T> {
  if (!endpoint) {
    throw new Error(
      "WORDPRESS_GRAPHQL_ENDPOINT is not set. Copy .env.local.example to .env.local."
    );
  }

  const { variables, revalidate = 60, tags, authToken } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (json.errors?.length) {
    throw new Error(`WPGraphQL errors: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  return json.data as T;
}
