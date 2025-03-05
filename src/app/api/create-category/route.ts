import { getUser } from "@/lib/auth";
import { parseColor } from "@/lib/utils";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[a-fA-F0-9]{6}$/, "Color must be a valid hex color"),
  emoji: z.string().emoji("Invalid emoji").optional(),
});

export async function POST(request: NextRequest) {
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
    const { name, color, emoji } = validation.data;

    const createEventCategory = await prisma.eventCategory.create({
      data: {
        name,
        color: parseColor(color),
        emoji,
        userId: user.id,
      },
    });
    return NextResponse.json({ createEventCategory });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
