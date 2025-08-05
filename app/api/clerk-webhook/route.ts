import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Only handle user.created events
  if (body.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = body.data;
    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0]?.email_address || "",
          firstName: first_name,
          lastName: last_name,
        },
      });
    } catch (error) {
      console.error("Error creating user from Clerk webhook:", error);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}