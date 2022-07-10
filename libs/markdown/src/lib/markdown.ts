import { readFileSync } from 'fs';
import * as matter from 'gray-matter';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

export function getParsedFileContentBySlug(
  fileName: string,
  postsPath: string
) {
  const postFilePath = join(postsPath, `${fileName}.md`);
  const fileContent = readFileSync(postFilePath);

  const { data, content } = matter(fileContent);
  return {
    frontMatter: data,
    content,
  };
}

export function renderMarkdown(markdownContent: string) {
  return serialize(markdownContent || '');
}
