import { z } from "zod";

export const createPostInputSchema = z.object({
  title: z.string(),
  content: z.string().max(128), // 128文字以内の制約を追加
});

export const updatePostInputSchema = z.object({
  title: z.string(),
  content: z.string().max(128), // 128文字以内の制約を追加
});

export type CreatePostInputSchemaType = z.infer<typeof createPostInputSchema>;
export type UpdatePostInputSchemaType = z.infer<typeof updatePostInputSchema>;
