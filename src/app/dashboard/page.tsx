import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

import React from "react";
import DashboardPageContent from "./DashboardPageContent";
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

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
    <DashboardPage
      cta={
        <CreateEventCategoryModal>
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Add Category
          </Button>
        </CreateEventCategoryModal>
      }
      title="Dashboard"
    >
      <DashboardPageContent />
    </DashboardPage>
  );
}

export default page;
