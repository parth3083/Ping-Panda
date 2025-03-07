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
  try {
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
    let requestData: unknown;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData);

    const category = user.EventCategories.find(
      (cat) => cat.name === validationResult.category
    );
    if (!category) {
      return NextResponse.json(
        {
          message: `You do not have the category named "${validationResult.category}"`,
        },
        { status: 404 }
      );
    }

    const eventData = {
      title: `${category.emoji || "🔔"} ${
        category.name.charAt(0).toUpperCase() + category.name.slice(1)
      }`,
      description:
        validationResult.description ||
        `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(
        ([key, value]) => {
          return {
            name: key,
            value: String(value),
            inline: true,
          };
        }
      ),
    };

    const event = await prisma.event.create({
      data: {
        name: category.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.fields || {},
        eventCategoryId: category.id,
      },
    });
    try {
      await discord.sendEmbed((await dmChannel).id, eventData);
      await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          deliveryStatus: "COMPLETED",
        },
      });

      await prisma.quota.upsert({
        where: { userId: user.id, month: currentMonth, year: currentYear },
        update: {
          count: { increment: 1 },
        },
        create: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        },
      });
    } catch (error) {
      await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          deliveryStatus: "FAILED",
        },
      });
      console.log(error);
      return NextResponse.json(
        {
          message: "Error in processing the event",
          eventId: event.id,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "Event created successfully",
      eventId: event.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 422 });
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
