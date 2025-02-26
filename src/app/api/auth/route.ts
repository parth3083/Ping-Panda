import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const auth = await currentUser();
    if (!auth) {
      return NextResponse.json({ isSynced: false }, { status: 401 });
    }
    const user = await prisma.user.findFirst({
      where: { externalId: auth.id },
    });
    if (!user) {
      await prisma.user.create({
        data: {
          quotaLimit: 100,
          plan: "FREE",
          email: auth.emailAddresses[0].emailAddress,
          externalId: auth.id,
        },
      });

      return NextResponse.json({ isSynced: true }, { status: 200 });
    }
    return NextResponse.json({ isSynced: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ isSynced: false }, { status: 500 });
  }
}
