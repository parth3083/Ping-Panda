import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import CategoryPageContent from "./CategoryPageContent";

interface pageParams {
  params: {
    name: string | string[] | undefined;
  };
}

async function Page({ params }: pageParams) {
  if (typeof params.name !== "string") notFound();
  const auth = await currentUser();
  if (!auth) {
    return notFound();
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return notFound();
  }

  const category = await prisma.eventCategory.findUnique({
    where: {
      name_userId: {
        name: params.name,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

    
    const hasCategory = category._count.events>0
    return (<DashboardPage title={`${category.emoji} ${category.name} events`}>
        <CategoryPageContent hasEvents={hasCategory} category={category}></CategoryPageContent>

    </DashboardPage>)
       
        
}

export default Page;
