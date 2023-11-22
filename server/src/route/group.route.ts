import { Router } from "express";
import requiredAccessToken from "../middleware/requiredAccessToken";
import revalidateAccessToken from "../middleware/revalidateAccessToken";
import {
  createGroupHandler,
  createGroupMembersHandler,
  getGroupByIdHandler,
  getGroupsByUserIdHandler,
} from "../controller/group.controller";
import validateResource from "../middleware/validateResource";
import {
  createGroup,
  createGroupMembers,
  getDataByIdSchema,
  getDataByUserId,
} from "../schema/group.schema";

export default function (route: Router) {
  route.get(
    "/api/groups/:userId",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getDataByUserId),
    getGroupsByUserIdHandler
  );
  route.get(
    "/api/groups/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(getDataByIdSchema),
    getGroupByIdHandler
  );
  route.post(
    "/api/groups/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(createGroup),
    createGroupHandler
  );
  route.post(
    "/api/group_members/",
    revalidateAccessToken,
    requiredAccessToken,
    validateResource(createGroupMembers),
    createGroupMembersHandler
  );
}
