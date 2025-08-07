// app/api/resumes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/user-sync";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureUserExists();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ resumes });
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
    const { title, description, templateId, sections = [] } = body;

    const user = await ensureUserExists();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create resume with sections
    const resume = await prisma.resume.create({
      data: {
        title,
        description,
        templateId,
        userId: user.id,
        sections: {
          create: sections.map((section: any, index: number) => ({
            type: section.type,
            title: section.title,
            content: section.content,
            order: index,
          }))
        }
      },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        template: true,
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