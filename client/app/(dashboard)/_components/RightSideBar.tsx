"use client";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { useSocket } from "@/provider/socket-provider";
import { User2Icon, UserCircle2, UserPlus2, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NotificationType } from "./AddMemberDialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type FriendDataType = {
  friendId: string;
  status: "Pending" | "Friended";
  email: string;
  picture: string;
  name: string;
};

export type FetchUsersDataType = {
  success: true;
  data: Partial<
    Array<{
      _id: string;
      name: string;
      providerName: string;
      __v: number;
      createdAt: Date;
      email: string;
      picture: string;
      notification: NotificationType[];
      friends: FriendDataType[];
      updatedAt: Date;
    }>
  >;
  error: string;
};

export type UserType = {
  _id: string;
  name: string;
  providerName: string;
  __v: number;
  createdAt: Date;
  email: string;
  picture: string;
  updatedAt: Date;
  notification: NotificationType[];
  friends: FriendDataType[];
};
interface RightSideBarProps {
  usersData: Partial<FetchUsersDataType>;
  currentUser: UserType;
}
const RightSideBar = ({ usersData, currentUser }: RightSideBarProps) => {
  const [onlineUser, setOnlineUser] = useState<Array<string>>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit("client_connect", currentUser._id);

    socket.on("system_active_users", (users: Array<string>) => {
      setOnlineUser(users);
    });

    return () => {
      socket.off("system_active_users");
    };
  }, [socket]);

  return (
    <div className="h-[800px] w-[15%] ">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <Users /> <span>Friends</span>
        </h2>
        <ScrollArea className="max-h-[350px] px-1">
          <div className=" p-2 grid grid-cols-2 gap-2">
            {currentUser && currentUser.friends.length > 0 ? (
              currentUser.friends.map((user) => (
                <div
                  className="my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={user?.friendId}
                >
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <div className="relative">
                      {user?.picture ? (
                        <Image
                          src={user?.picture as string}
                          alt={user?.name as string}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircle2 className={cn("w-10 h-10 ")} />
                      )}
                      {onlineUser.length &&
                      onlineUser.includes(user?.friendId as string) ? (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                                )}
                              ></div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                                )}
                              ></div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <h3>{user?.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h2 className="text-center">No friends yet!</h2>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight flex items-center gap-2">
          <User2Icon /> <span>Users</span>
        </h2>
        <ScrollArea className="h-[350px] px-1">
          <div className=" p-2">
            {usersData.data ? (
              usersData.data &&
              usersData.data.map((user) => (
                <div
                  className="my-3 cursor-pointer py-2 px-4 border dark:border-slate-700 border-neutral-300 rounded-md hover:shadow-md hover:shadow-neutral-300 dark:hover:shadow-slate-700"
                  key={user?._id}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      {user?.picture ? (
                        <Image
                          src={user?.picture as string}
                          alt={user?.name as string}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircle2 className={cn("w-10 h-10 ")} />
                      )}
                      {onlineUser.length &&
                      onlineUser.includes(user?._id as string) ? (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-green-500"
                                )}
                              ></div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute -top-0 -right-0 w-3 h-3  rounded-full bg-red-500"
                                )}
                              ></div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    <h3>{user?.name}</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    {currentUser && currentUser.friends.length > 0 ? (
                      currentUser.friends.map((friend) => {
                        if (friend.friendId !== user?._id) {
                          return (
                            <Button
                              key={friend.friendId}
                              size={"sm"}
                              className="flex gap-1"
                            >
                              {" "}
                              <UserPlus2 /> Add Friend
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Button size={"sm"} className="flex gap-1 bg-sky-500">
                        {" "}
                        <UserPlus2 /> Add Friend
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h2 className="text-center">No user yet!</h2>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RightSideBar;
