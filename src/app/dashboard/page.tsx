import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import DashboardPageContent from "./DashboardPageContent";
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckOutSession } from "@/lib/stripe";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import { PrismaClient } from "@prisma/client";

// Following the pattern from your working code
const Page = async ({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>> 
}) => {
  const resolvedSearchParams = await searchParams;
  const auth = await currentUser();
  const prisma = new PrismaClient();

  if (!auth) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    redirect("/sign-in");
  }

  if (resolvedSearchParams.intent === "upgrade") {
    try {
      const session = await createCheckOutSession({
        userEmail: user.email,
        userId: user.id,
      });

      if (session?.url) {
        redirect(session.url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }

  const success = resolvedSearchParams.success;

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
};

export default Page;