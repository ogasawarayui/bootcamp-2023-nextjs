import { gssp } from "@/lib/next/gssp";
import { Post, prisma, Tag } from "@/prisma";
import Link from "next/link";
import { Key } from "react";
import { z } from "zod";

type Props = {
  post: Post & {
    tags: Tag[];
    allTags: Tag[];
  };
};

const Page = ({ post }: Props) => {
  const handleNewTagSubmit = async () => {
    const newTagName = "";
    //const newTagName = document.getElementById("newTagInput").value;

    if (newTagName.trim() !== '') {
      try {
        // タグをDBに登録
        const newTag = await prisma.tag.create({
          data: {
            name: newTagName,
          },
        });
        // タグを投稿に関連付ける
        await prisma.post.update({
          where: { id: post.id },
          data: {
            tags: {
              connect: { id: newTag.id },
            },
          },
        });
        // 更新された情報を再取得するなどの処理を行う
      } catch (error) {
        console.error('Error creating new tag:', error);
      }
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div>
        {post.tags.map((tag: Tag & { id: Key }) => (
          <span key={tag.id}>{tag.name}</span>
        ))}
      </div>
      <hr />
      <Link href={`/posts/${post.id}/edit`}>Edit</Link>
      <hr />
      <Link href="/posts">Back to Posts</Link>
      <div>
        <input type="text" id="newTagInput" />
        <button onClick={handleNewTagSubmit}>Add Tag</button>
      </div>
      <div>
        <h2>All Tags</h2>
        <ul>
          {post.allTags.map((tag: Tag & { id: Key }) => (
            <li key={tag.id}>{tag.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps = gssp<Props>(async ({ query }) => {
  const { id } = z.object({ id: z.coerce.number() }).parse(query);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });
  const allTags = await prisma.tag.findMany(); // 全てのタグを取得
  if (!post) return { notFound: true };
  return { props: { post:{...post,allTags:allTags} } };
});

export default Page;
