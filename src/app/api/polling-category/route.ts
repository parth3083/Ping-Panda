import { getUser } from "@/lib/auth";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: CATEGORY_NAME_VALIDATOR,
});

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }
    const { name } = validation.data;
    const prisma = new PrismaClient();

    const category = await prisma.eventCategory.findUnique({
      where: {
        name_userId: { name, userId: user.id },
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
      throw new Error(`Category ${name} not found`);
    }
    const hasEvents = category._count.events > 0;
    return NextResponse.json({ hasEvents }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
