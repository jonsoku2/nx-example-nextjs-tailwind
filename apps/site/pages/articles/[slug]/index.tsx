import { readdirSync } from 'fs';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import { join } from 'path';
import { ParsedUrlQuery } from 'querystring';
import {
  getParsedFileContentBySlug,
  renderMarkdown,
} from '@nx-example-3/markdown';
import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import { CustomLink } from '@nx-example-3/shared/mdx-elements';

export interface ArticleProps extends ParsedUrlQuery {
  slug: string;
}

const mdxElements: Record<string, any> = {
  Youtube: dynamic(async () => {
    return await import('@nx-example-3/shared/mdx-elements/youtube/youtube');
  }),
  a: CustomLink,
};

const POSTS_PATH = join(process.cwd(), process.env.articleMarkdownPath);

export function Article({
  frontMatter,
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="m-6">
      <article className="prose prose-lg">
        <h1>{frontMatter.title}</h1>
        <div>by {frontMatter.author.name}</div>
      </article>
      <hr />
      <MDXRemote {...html} components={mdxElements} />
    </div>
  );
}
export const getStaticProps = async ({ params }: { params: ArticleProps }) => {
  // 1. parse the content of our markdown and separate it into frontmatter and content
  const articleMarkdownContent = getParsedFileContentBySlug(
    params.slug,
    POSTS_PATH
  );

  // 2. convert markdown content => HTML
  const renderHTML = await renderMarkdown(articleMarkdownContent.content);

  return {
    props: {
      frontMatter: articleMarkdownContent.frontMatter,
      html: renderHTML,
    },
  };
};

export const getStaticPaths: GetStaticPaths<ArticleProps> = async () => {
  const paths = readdirSync(POSTS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default Article;
