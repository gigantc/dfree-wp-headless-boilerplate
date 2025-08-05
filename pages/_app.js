import "../faust.config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";

import Cursor from "@/components/Cursor/Cursor";
import Loader from "@/components/Loader/Loader";
import "@/styles/base.scss";



const AppShell2600 = ({ Component, pageProps }) => {

  const router = useRouter();

  //////////////////////////////////////
  // STATE
  const [loading, setLoading] = useState(true);


  //////////////////////////////////////
  // LOADER
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
  //use for the first load of the page (home page)
  useEffect(() => {
    setLoading(false); 
  }, []);


  //////////////////////////////////////
  // CONSOLE TAG
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "%cBuilt with ❤️ by dFree.\n%cPowered by AppShell 2600 👾👾👾\n%cInsert coin to continue...",
        "color: #FF2300; font-family: monospace; font-size: 16px;",  // red/orange
        "color: #00DEB5; font-family: monospace; font-size: 12px;",  // teal
        "color: #C2FF00; font-family: monospace; font-size: 12px;"   // yellow-green
      );
    }
  }, []);


  //////////////////////////////////////
  // RENDER
  return (
    <FaustProvider pageProps={pageProps}>
      <Cursor />
      {loading ? <Loader /> : <Component {...pageProps} key={router.asPath} />}
    </FaustProvider>
  );
};


export default AppShell2600;