import type { Metadata } from "next";
import { wpFetch } from "@/lib/wp/client";
import { SITE_SETTINGS_QUERY } from "@/lib/wp/queries/siteSettings";
import "@/styles/globals.scss";

type SiteSettings = {
  generalSettings?: {
    title?: string | null;
    description?: string | null;
    url?: string | null;
  };
};

const getSiteSettings = async (): Promise<SiteSettings["generalSettings"] | null> => {
  try {
    const data = await wpFetch<SiteSettings>(SITE_SETTINGS_QUERY, { revalidate: 3600 });
    return data.generalSettings ?? null;
  } catch {
    return null;
  }
};

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.title ?? "dfree-wp-headless-boilerplate",
      template: `%s — ${settings?.title ?? "Site"}`,
    },
    description: settings?.description ?? undefined,
  };
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
