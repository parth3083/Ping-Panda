import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
});

export async function DELETE(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const user = await getUser(request);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 });
    }
    const { name } = validation.data;
    await prisma.eventCategory.delete({
      where: { name_userId: { name, userId: user.id } },
    });
      return NextResponse.json({ message: "Event category deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
