import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        resumes: {
          include: {
            template: true,
            sections: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ resumes: user.resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, templateId } = body;

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await auth();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.user?.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.user?.firstName || "",
          lastName: clerkUser.user?.lastName || "",
          avatar: clerkUser.user?.imageUrl || "",
        },
      });
    }

    // Create resume
    const resume = await prisma.resume.create({
      data: {
        title,
        description,
        userId: user.id,
        templateId: templateId || null,
      },
      include: {
        template: true,
        sections: true,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
