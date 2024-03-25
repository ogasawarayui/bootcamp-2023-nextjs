import { apiHandler } from "@/lib/next/apiRoutes";
import { updatePostInputSchema } from "@/lib/zod";
import { Post, prisma } from "@/prisma";
import { succeed } from "@/services/client/apiRoutes";
import type { ApiHandler } from "@/type";
import { z } from "zod";

export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
export type UpdatePostResponse = Post;

const handlePut = apiHandler<UpdatePostResponse>(async (req, res) => {
  const data = updatePostInputSchema.parse(req.body);
  const { id } = z.object({ id: z.number() }).parse(req.query); // IDの型を適切に指定
  const result = await prisma.post.update({ data, where: { id } });
  res.status(201).json(succeed(result));
});

const handler: ApiHandler = (req, res) => {
  switch (req.method) {
    case "PUT":
      return handlePut(req, res);
    default:
      res.status(405).end();
      return;
  }
};

export default handler;
