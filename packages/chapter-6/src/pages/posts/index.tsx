import { gssp } from "@/lib/next/gssp";
import { prisma } from "@/prisma";
import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";

type Props = {
  posts: {
    id: number;
    title: string;
    tags: { id: number; name: string; }[]; // 'tags'の型を変更
  }[];
};

type Post = {
  id: number;
  title: string;
  tags: { id: number; name: string; }[]; // 同様に変更
};

const Page = ({ posts }: Props) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>(["Tech", "Programming", "Science", "Art"]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleNewTagSubmit = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag !== "" && !tags.includes(trimmedTag)) {
      setTags(tags.concat(trimmedTag));
      setNewTag("");
    } else {
      console.warn("タグは空白か、既に存在している可能性があります。");
    }
  };
  console.log(selectedTag)
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.map((tag) => tag.name.includes(selectedTag)))
    : posts;

  const tagButtons = [];
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    tagButtons.push(
      <button key={tag} onClick={() => handleTagSelect(tag)}>
        {tag}
      </button>
    );
  }

  const postList = [];
  for (let i = 0; i < filteredPosts.length; i++) {
    const post = filteredPosts[i];
    postList.push(
      <li key={post.id}>
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    );
  }

  return (
    <div>
      <h1>記事一覧</h1>
      <div>
        <span>タグでフィルタリング：</span>
        {tagButtons}
      </div>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="新規タグを入力"
        />
        <button onClick={handleNewTagSubmit}>追加</button>
      </div>
      <ul>{postList}</ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        tags: true,
      },
    });

    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((tag) => tag.name), // オブジェクトから文字列への変換
    }));

    return { props: { posts: transformedPosts } }; // propsに変換されたデータを渡す
  } catch (error) {
    console.error("データベースから記事を取得できませんでした。", error);
    return { props: { posts: [] } }; // エラー時に空のリスト
  }
};

export default Page;
