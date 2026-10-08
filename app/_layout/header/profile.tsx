"use client";

import { getShortName } from "@/app/_components/_utils/get-short-name";
import { UserButton, useUser } from "@clerk/nextjs";

type User = {
  publicMetadata?: {
    subscriptionPlan?: string;
  };
};

function hasSubscriptionPlan(user: User | null | undefined) {
  switch (user?.publicMetadata?.subscriptionPlan) {
    case "free":
      return "Plano Gratuito";
    case "premium":
      return "Plano Premium";
    default:
      return "Plano Gratuito";
  }
}

const Profile = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-3">
      <UserButton />

      <div className="flex w-full max-w-40 flex-col overflow-hidden">
        <p className="text-sm font-bold">{getShortName(user?.fullName)}</p>
        <p className="text-muted-foreground text-xs">{hasSubscriptionPlan(user)}</p>
      </div>
    </div>
  );
};

export default Profile;
