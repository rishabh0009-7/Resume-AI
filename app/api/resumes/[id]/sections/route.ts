import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get resume sections
    const sections = await prisma.resumeSection.findMany({
      where: {
        resumeId: params.id,
        resume: {
          userId: user.id, // Use user.id instead of nested clerkId query
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, content, order } = body;

    // Get user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: user.id, // Use user.id instead of nested clerkId query
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Create section
    const section = await prisma.resumeSection.create({
      data: {
        type,
        title,
        content,
        order: order || 0,
        resumeId: params.id,
      },
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sections } = body;

    // Get user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: user.id, // Use user.id instead of nested clerkId query
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Update all sections
    const updatedSections = await Promise.all(
      sections.map((section: any) =>
        prisma.resumeSection.update({
          where: { id: section.id },
          data: {
            title: section.title,
            content: section.content,
            order: section.order,
          },
        })
      )
    );

    return NextResponse.json({ sections: updatedSections });
  } catch (error) {
    console.error("Error updating sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}