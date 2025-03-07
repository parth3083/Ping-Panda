import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import AccountSettings from "./AccountSettings";

async function Page() {
  const auth = await currentUser();
  if (!auth) {
    redirect("/sign-in");
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { externalId: auth.id },
  });
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <DashboardPage title="Account Settings">
      <AccountSettings discordId={user.discordId ?? ""} />
    </DashboardPage>
  );
}

export default Page;
