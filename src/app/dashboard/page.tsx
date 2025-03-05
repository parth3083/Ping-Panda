import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

import React from "react";
import DashboardPageContent from "./DashboardPageContent";

async function page() {
  const prisma = new PrismaClient();
  const auth = await currentUser();

  if (!auth) {
    redirect("/sign-in");
  }
  const user = await prisma.user.findUnique({
    where: { externalId: auth.id },
  });
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <DashboardPage title="Dashboard">
      <DashboardPageContent/>
    </DashboardPage>
  );
}

export default page;
