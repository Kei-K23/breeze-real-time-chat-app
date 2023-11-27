import { verify } from "jsonwebtoken";
import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Dashboard`,
  description: "This is dashboard and workspace for user",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const refreshCookie = cookies().get("breeze_csrf");
  const NEXT_ROOT_URL = process.env.NEXT_ROOT_URL;
  if (refreshCookie?.name === "breeze_csrf") {
    if (refreshCookie.value) {
      const decoded = verify(
        refreshCookie?.value as string,
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET as string
      );

      if (!decoded) {
        return redirect(NEXT_ROOT_URL as string);
      }
    }
  }

  return <main className="h-full">{children}</main>;
};

export default DashboardLayout;
