import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

import React from "react";
import DashboardPageContent from "./DashboardPageContent";
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckOutSession } from "@/lib/stripe";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function page({ searchParams }: PageProps) {
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

  // ✅ Correct way to extract search params in a server component
  const params = new URLSearchParams(searchParams as any);
  const intent = params.get("intent");
  const success = params.get("success");

  if (intent === "upgrade") {
    const session = await createCheckOutSession({
      userEmail: user.email,
      userId: user.id,
    });
    if (session.url) {
      redirect(session.url);
    }
  }

  return (
    <>
      {success && <PaymentSuccessModal />}
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="size-4 mr-2" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
}

export default page;

