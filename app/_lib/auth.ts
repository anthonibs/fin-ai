import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const requireAuth = async (): Promise<string> => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return userId;
};

export const redirectIfAuthenticated = async (): Promise<void> => {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }
};
