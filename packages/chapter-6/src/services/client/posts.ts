import {
  CreatePostInputSchemaType,
  UpdatePostInputSchemaType,
} from "@/lib/zod";
import { Post } from "@/prisma";
import {
  handleFetchReject,
  handleFetchResolve,
} from "@/services/client/apiRoutes";
import { Result } from "@/type";

export const createPost = (
  input: CreatePostInputSchemaType
): Promise<Result<Post>> => {
  return fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then((res) => handleFetchResolve<Post>(res))
    .catch(handleFetchReject);
};

export const updatePost = (
  input: UpdatePostInputSchemaType,
  id: number
): Promise<Result<Post>> => {
  return fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then((res) => handleFetchResolve<Post>(res))
    .catch(handleFetchReject);
};

// 全件取得
export const getAllPosts = (): Promise<Result<Post[]>> => {
  return fetch("/api/posts")
    .then((res) => handleFetchResolve<Post[]>(res))
    .catch(handleFetchReject);
};

// IDが一致するレコードを取得
export const getPostById = (id: number): Promise<Result<Post>> => {
  return fetch(`/api/posts/${id}`)
    .then((res) => handleFetchResolve<Post>(res))
    .catch(handleFetchReject);
};
