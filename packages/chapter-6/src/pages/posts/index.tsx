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

const Page = ({ posts, tags }: { posts: Post[]; tags: { id: number; name: string }[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>(tags.map((tag) => tag.name));

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleNewTagSubmit = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag !== "" && !tagList.includes(trimmedTag)) {
      setTagList(tagList.concat(trimmedTag));
      setNewTag("");
    } else {
      console.warn("タグは空白か、既に存在している可能性があります。");
    }
  };

  console.log(selectedTag);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.some((tag) => tag.name.includes(selectedTag)))
    : posts;

  const tagButtons: JSX.Element[] = [];

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const tagName = typeof tag === "string" ? tag : tag.name;
    tagButtons.push(
      <button key={tagName} onClick={() => handleTagSelect(tagName)}>
        {tagName}
      </button>
    );
  }

  const postList: JSX.Element[] = [];
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


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await prisma.tag.findMany();

    const posts = await prisma.post.findMany({
      include: {
        tags: true,
      },
    });

    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags, // オブジェクトから文字列への変換
    }));

    // 取得したタグデータをpropsに含めてクライアントに渡す
    return { props: { posts: transformedPosts, tags } };
  } catch (error) {
    console.error("データベースから記事を取得できませんでした。", error);
    return { props: { posts: [], tags: [] } }; // エラー時のデフォルト値
  }
};

export default Page;
