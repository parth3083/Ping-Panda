import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FREE_QUOTA, PRO_QUOTA } from "../../../../../config";
import { DiscordClient } from "@/lib/discord-client";

const REQUEST_VALIDATOR = z
  .object({
    category: CATEGORY_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(
      "Invalid auth header format. Expected 'Bearer <api-key>'",
      {
        status: 401,
      }
    );
  }
  const apiKey = authHeader.split(" ")[1];
  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      {
        maessage: "Invalid api key",
      },
      { status: 401 }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      apiKey,
    },
    include: {
      EventCategories: true,
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        maessage: "Invalid api key",
      },
      { status: 401 }
    );
  }
  if (!user.discordId) {
    return NextResponse.json(
      {
        message: "Please add your discord id to your account settings",
      },
      { status: 403 }
    );
  }
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const quota = await prisma.quota.findUnique({
    where: {
      userId: user.id,
      month: currentMonth,
      year: currentYear,
    },
  });

  const quotaLimit =
    user.plan === "FREE"
      ? FREE_QUOTA.maxEventsPerMonth
      : PRO_QUOTA.maxEventsPerMonth;

  if (quota && quota.count >= quotaLimit) {
    return NextResponse.json(
      {
        message:
          "Monthly quota limit reached. Please upgrade your plan to continue creating events",
      },
      { status: 429 }
    );
  }

  const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
  const dmChannel = discord.createDM(user.discordId);
  await discord.sendEmbed((await dmChannel).id, {
    title: "New event created",
  });

}
