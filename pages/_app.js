import "../faust.config";
import React from "react";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import Cursor from "@/components/Cursor/Cursor";
import "@/styles/base.scss";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <FaustProvider pageProps={pageProps}>
      <Cursor />
      <Component {...pageProps} key={router.asPath} />
    </FaustProvider>
  );
}
