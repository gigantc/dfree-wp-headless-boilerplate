/**
 * Draft preview handler.
 *
 * The WP-side mu-plugin builds preview links pointing here with:
 *   /preview?secret=…&id=…&uri=…
 *
 * We verify the secret, enable Next's draft mode (which bypasses the data cache
 * so the request re-fetches with credentials), then redirect the editor to the
 * target URI. Actual draft-token exchange happens in wpFetch when draftMode is
 * active — read cookies() there and forward as Authorization if you wire up
 * WPGraphQL headless-login or a similar auth plugin.
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const uri = searchParams.get("uri") ?? "/";

  if (!process.env.WORDPRESS_PREVIEW_SECRET || secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response("Invalid preview token", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  redirect(uri);
};
