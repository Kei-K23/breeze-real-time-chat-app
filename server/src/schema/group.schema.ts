import { z } from "zod";

export const getGroupsByUserId = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
});

export const createGroup = z.object({
  body: z.object({
    groupName: z
      .string({
        required_error: "Group name is required",
      })
      .min(3, "Group name must be at least 3 character long"),
    groupDescription: z.string({}).optional(),
    ownerId: z.string({
      required_error: "Group owner id is required",
    }),
  }),
});

export type GetGroupsByUserId = z.infer<typeof getGroupsByUserId>["params"];
export type CreateGroup = z.infer<typeof createGroup>["body"];
