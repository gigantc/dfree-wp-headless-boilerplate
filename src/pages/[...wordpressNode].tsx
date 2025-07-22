import { getWordPressProps, WordPressTemplate } from '@faustwp/core';
import '../../faust.config';

const WordpressNode = (props: any) => {
  return <WordPressTemplate {...props} />;
};

export function getStaticProps(ctx: any) {
  return getWordPressProps({ ctx });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default WordpressNode;