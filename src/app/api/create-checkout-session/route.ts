import { getUser } from "@/lib/auth";
import { createCheckOutSession } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const session = await createCheckOutSession({
      userEmail: user.email,
      userId: user.id,
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
