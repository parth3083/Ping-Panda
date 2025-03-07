import { getUser } from "@/lib/auth";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { PrismaClient } from "@prisma/client";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  page: z.number(),
  limit: z.number().max(50),
  timeRange: z.enum(["today", "week", "month"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    const prisma = new PrismaClient();
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.message },
        { status: 400 }
      );
    }
    const { name, page, limit, timeRange } = validation.data;
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "today":
        startDate = startOfDay(now);
        break;
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 0 });
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
    }

    const [events, eventsCount, uniqueFieldsNames] = await Promise.all([
      prisma.event.findMany({
        where: {
          EventCategory: { name, userId: user?.id },
          createdAt: { gte: startDate },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.event.count({
        where: {
          EventCategory: { name, userId: user?.id },
          createdAt: { gte: startDate },
        },
      }),
      prisma.event
        .findMany({
          where: {
            EventCategory: { name, userId: user?.id },
            createdAt: { gte: startDate },
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
    ]);

    return NextResponse.json({ events, eventsCount, uniqueFieldsNames });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Interbal Server Error",
        error,
      },
      { status: 500 }
    );
  }
}
