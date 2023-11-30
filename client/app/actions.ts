"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { UserType } from "./(dashboard)/_components/RightSideBar";
import { NotificationType } from "./(dashboard)/_components/AddMemberDialog";
import { cookies } from "next/headers";

export async function createGroupAction({
  values,
  currentUserId,
  cookie,
}: {
  values: {
    groupName: string;
    groupDescription?: string;
  };
  currentUserId: string;
  cookie: string;
  selectedUsers: UserType[];
}) {
  try {
    const resGroupDate = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/groups/`,
      {
        method: "POST",
        body: JSON.stringify({
          groupName: values.groupName,
          groupDescription: values.groupDescription,
          ownerId: [currentUserId],
        }),
        headers: {
          Cookie: `breeze_csrf=${cookie}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: 0,
        },
      }
    );

    const groupData = await resGroupDate.json();

    await createGroupMemberAction({
      cookie,
      values: [
        {
          addedBy: currentUserId,
          memberId: currentUserId,
          groupId: groupData.data._id,
          status: "Accept",
        },
      ],
    });

    revalidatePath("/");
    return groupData.data;
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e.message);
  }
}

export async function createGroupMemberAction({
  values,
  cookie,
}: {
  cookie: string;
  values: {
    groupId: string;
    addedBy: string;
    memberId: string;
    status?: "Pending" | "Accept";
  }[];
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/group_members/`,
      {
        method: "POST",
        body: JSON.stringify({
          groupMembers: values,
        }),
        headers: {
          Cookie: `breeze_csrf=${cookie}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: 0,
        },
      }
    );
    const data = await res.json();

    revalidatePath("/");
    revalidateTag("group_member");

    return data.data;
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e);
  }
}

export async function editGroupMemberAction({
  groupMemberId,
  values,
}: {
  groupMemberId: string;
  values: {
    groupId?: string;
    memberId?: string;
    addedBy?: string;
    joinedAt?: Date;
    status?: string | "Pending" | "Accept";
  };
}) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/groups/${groupMemberId}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: 0,
        },
      }
    );
    revalidatePath("/");
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e);
  }
}

export async function removeNOfUserAction({
  userId,
  payload,
}: {
  userId: string;
  payload: NotificationType;
}) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/rmN/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  } catch (e: any) {
    revalidatePath("/");
    throw new Error(e);
  }
}

export async function createRefreshTokenCookie(value: string) {
  cookies().set("breeze_csrf", value, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 5.184e9,
  });
}
