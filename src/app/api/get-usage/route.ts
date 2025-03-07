import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { addMonths, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { FREE_QUOTA, PRO_QUOTA } from "../../../../config";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    const prisma = new PrismaClient();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const currentDate = startOfMonth(new Date());
    const quota = await prisma.quota.findFirst({
      where: {
        userId: user.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      },
    });

    const eventCount = quota?.count ?? 0;

    const categoryCopunt = await prisma.eventCategory.count({
      where: { userId: user.id },
    });

    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;
    const resetDate = addMonths(currentDate, 1);
    return NextResponse.json({
      categoriesUsed: categoryCopunt,
      categoryLimit: limits.maxEventCategories,
      eventsUsed: eventCount,
      eventLimit: limits.maxEventsPerMonth,
      resetDate,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error,
      },
      { status: 500 }
    );
  }
}
