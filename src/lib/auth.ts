import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(request: NextRequest) {
try {
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      const apiKey = authHeader.split(" ")[1];
      const user = await prisma.user.findUnique({
        where: { apiKey },
      });
      if (user) {
        return { ...user, provider: "api_key" };
      }
    }
    else {
        const auth = await currentUser();
        if (!auth) {
            throw new Error("Not authenticated");
        }
        const user = await prisma.user.findUnique({
            where:{externalId:auth.id}
        })
        if (!user) {
            throw new Error("Not authenticated");
      }
      return user;
    }
   
} catch (error) {
    console.error("Authentication Error:", error);
    return null;
}
}
