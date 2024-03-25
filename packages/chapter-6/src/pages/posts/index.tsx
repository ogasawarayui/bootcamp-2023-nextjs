import { gssp } from "@/lib/next/gssp";
import { Post, prisma } from "@/prisma";
import Link from "next/link";
import { useState } from "react";

type Props = {
  posts: Post[];
};

const Page = ({ posts }: Props) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div>
      <h1>記事一覧</h1>
      <div>
        <span>タグでフィルタリング：</span>
        <button onClick={() => handleTagSelect("Tech")}>Tech</button>
        <button onClick={() => handleTagSelect("Programming")}>Programming</button>
        {/* 必要に応じて他のタグボタンを追加 */}
      </div>
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps = gssp<Props>(async () => {
  const posts = await prisma.post.findMany();
  return { props: { posts } };
});

export default Page;
