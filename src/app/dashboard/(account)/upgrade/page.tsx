import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import UpgradePageContent from "./UpgradePageContent";


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
    return <DashboardPage title="Pro Membership">
        <UpgradePageContent plan={ user.plan} />
    </DashboardPage>
}

export default Page;
