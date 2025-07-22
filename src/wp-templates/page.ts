import { Page as PageType } from '@faustwp/data';

const Page = ({ title, content }: PageType) => {
  return (
    <main>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content ?? '' }} />
    </main>
  );
};

export default Page;