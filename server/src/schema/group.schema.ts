import { z } from "zod";

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

export const createGroupMembers = z.object({
  body: z.object({
    groupMembers: z.array(
      z.object({
        groupId: z.string({
          required_error: "Group's id id is required",
        }),
        memberId: z.string({
          required_error: "Group's member id is required",
        }),
        addedBy: z.string({
          required_error: "Added by user id is required",
        }),
      })
    ),
  }),
});

export const getDataByUserId = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
});

export const getDataByIdSchema = z.object({
  query: z.object({
    groupId: z
      .string({
        required_error: "Group id is required!",
      })
      .optional(),
    groupIdForMembers: z
      .string({
        required_error: "Group id is required!",
      })
      .optional(),
  }),
});

export type CreateGroup = z.infer<typeof createGroup>["body"];
export type CreateGroupMembers = z.infer<typeof createGroupMembers>["body"];
export type GetDataByUserId = z.infer<typeof getDataByUserId>["params"];
export type GetDataByIdType = z.infer<typeof getDataByIdSchema>["query"];
