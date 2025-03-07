import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  discordId: z.string().max(30),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    const body = await request.json();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.message },
        { status: 400 }
      );
    }
    const { discordId } = validation.data;
    const prisma = new PrismaClient();
    await prisma.user.update({
      where: { id: user.id },
      data: { discordId },
    });

    return NextResponse.json({ success: true });
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
