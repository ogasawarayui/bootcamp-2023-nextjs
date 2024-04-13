import { gssp } from "@/lib/next/gssp";
import { prisma } from "@/prisma";
import Link from "next/link";
import { useState } from "react";

type Props = {
  posts: Post[];
};

type Post = {
  id: number;
  title: string;
  tags: string[];
};

const Page = ({ posts }: Props) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['Tech', 'Programming', 'Science', 'Art']);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleNewTagSubmit = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div>
      <h1>記事一覧</h1>
      <div>
        <span>タグでフィルタリング：</span>
        {tags.map(tag => (
          <button key={tag} onClick={() => handleTagSelect(tag)}>{tag}</button>
        ))}
        <div>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="新規タグを入力"
          />
          <button onClick={handleNewTagSubmit}>追加</button>
        </div>
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

