import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth";
import { startOfMonth } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const user = await getUser(request);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }
    const categories = await prisma.eventCategory.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          prisma.event
            .findMany({
              where: {
                EventCategory: { id: category.id },
                createdAt: { gte: firstDayOfMonth },
              },
              select: {
                fields: true,
              },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldNames = new Set<string>();
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldNames.add(fieldName);
                });
              });
              return fieldNames.size;
            }),
          prisma.event.count({
            where: {
              EventCategory: { id: category.id },
              createdAt: { gte: firstDayOfMonth },
            },
          }),
          prisma.event.findFirst({
            where: {
              EventCategory: { id: category.id },
            },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);
        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt,
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
