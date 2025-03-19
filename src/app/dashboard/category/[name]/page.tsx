import DashboardPage from "@/components/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { CategoryPageContent } from "./CategoryPageContent";

const Page = async ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = await params;

  const auth = await currentUser();

  if (!auth) {
    return notFound();
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) return notFound();

  const category = await prisma.eventCategory.findUnique({
    where: {
      name_userId: {
        name,
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

  if (!category) return notFound();

  const hasEvents = category._count.events > 0;

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent hasEvents={hasEvents} category={category} />
    </DashboardPage>
  );
};

export default Page;
