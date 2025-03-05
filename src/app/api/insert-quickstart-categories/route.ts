import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    const prisma = new PrismaClient();
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }
    const categories = await prisma.eventCategory.createMany({
      data: [
        { name: "Bug", emoji: "🐞", color: 0xff6b6b },
        { name: "Sale", emoji: "💰", color: 0xffeb3b },
        { name: "Question", emoji: "🤔", color: 0x6c5ce7 },
      ].map((category) => {
        return {
          ...category,
          userId: user.id,
        };
      }),
    });
    return NextResponse.json({ success: true, count: categories.count });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
