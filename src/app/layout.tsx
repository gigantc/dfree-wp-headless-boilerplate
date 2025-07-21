import './globals.scss';
import Cursor from '@components/Cursor/Cursor';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="We turn problems into playgrounds." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>DEV - R&R Partners</title>
      </head>
      <body>
        <Cursor />
        {children}
        </body>
    </html>
  );
};

export default RootLayout;
