import '@/base/globals.scss';
import Cursor from '@components/Cursor/Cursor';
import { FaustProvider } from '@faustwp/core';
import '../../faust.config';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FaustProvider pageProps={pageProps}>
      <Cursor />
      <Component {...pageProps} />
    </FaustProvider>
  );
};

export default MyApp;