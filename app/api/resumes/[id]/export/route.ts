import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { format = "pdf" } = await request.json();

    // Get resume with sections
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: {
          clerkId: userId,
        },
      },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Generate resume content based on format
    let content = "";
    let filename = `${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.${format}`;

    if (format === "pdf") {
      content = generatePDFContent(resume);
    } else if (format === "docx") {
      content = generateDOCXContent(resume);
    } else if (format === "txt") {
      content = generateTXTContent(resume);
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }

    // For now, return the content as text
    // In a real implementation, you'd use libraries like puppeteer for PDF generation
    return NextResponse.json({
      content,
      filename,
      format,
    });
  } catch (error) {
    console.error("Error exporting resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generatePDFContent(resume: any): string {
  let content = `${resume.title.toUpperCase()}\n`;
  content += "=".repeat(resume.title.length) + "\n\n";

  resume.sections.forEach((section: any) => {
    content += `${section.title.toUpperCase()}\n`;
    content += "-".repeat(section.title.length) + "\n";

    if (section.type === "PERSONAL_INFO") {
      const info = section.content;
      content += `${info.firstName} ${info.lastName}\n`;
      content += `${info.email} | ${info.phone}\n`;
      content += `${info.location}\n`;
      if (info.linkedin) content += `LinkedIn: ${info.linkedin}\n`;
      if (info.website) content += `Website: ${info.website}\n`;
    } else if (section.type === "SUMMARY") {
      content += `${section.content.text}\n`;
    } else if (section.type === "EXPERIENCE") {
      section.content.items.forEach((item: any) => {
        content += `${item.title} at ${item.company}\n`;
        content += `${item.startDate} - ${item.endDate || "Present"}\n`;
        content += `${item.description}\n\n`;
      });
    } else if (section.type === "EDUCATION") {
      section.content.items.forEach((item: any) => {
        content += `${item.degree} in ${item.field}\n`;
        content += `${item.institution}, ${item.graduationYear}\n`;
        if (item.gpa) content += `GPA: ${item.gpa}\n`;
        content += "\n";
      });
    } else if (section.type === "SKILLS") {
      section.content.categories.forEach((category: any) => {
        content += `${category.name}: ${category.skills.join(", ")}\n`;
      });
    }

    content += "\n";
  });

  return content;
}

function generateDOCXContent(resume: any): string {
  // Similar to PDF but with Word-specific formatting
  return generatePDFContent(resume);
}

function generateTXTContent(resume: any): string {
  // Plain text version
  return generatePDFContent(resume);
}
