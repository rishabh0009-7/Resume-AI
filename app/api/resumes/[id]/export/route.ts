import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generatePDFBuffer, generateDOCXBuffer } from "@/lib/export-utils";

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

    // Get user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get resume with sections
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: user.id, // Use user.id instead of nested query
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
    let buffer: Buffer;
    let filename = `${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.${format}`;
    let contentType = '';

    if (format === "pdf") {
      buffer = await generatePDFBuffer(resume);
      contentType = 'application/pdf';
    } else if (format === "docx") {
      buffer = await generateDOCXBuffer(resume);
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (format === "txt") {
      const content = generateTXTContent(resume);
      buffer = Buffer.from(content, 'utf-8');
      contentType = 'text/plain';
    } else {
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
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
      if (info.firstName && info.lastName) {
        content += `${info.firstName} ${info.lastName}\n`;
      }
      if (info.email && info.phone) {
        content += `${info.email} | ${info.phone}\n`;
      }
      if (info.location) {
        content += `${info.location}\n`;
      }
      if (info.linkedin) content += `LinkedIn: ${info.linkedin}\n`;
      if (info.website) content += `Website: ${info.website}\n`;
    } else if (section.type === "SUMMARY") {
      if (section.content.text) {
        content += `${section.content.text}\n`;
      }
    } else if (section.type === "EXPERIENCE") {
      if (section.content.items && Array.isArray(section.content.items)) {
        section.content.items.forEach((item: any) => {
          content += `${item.title || 'Position'} at ${item.company || 'Company'}\n`;
          content += `${item.startDate || 'Start'} - ${item.endDate || "Present"}\n`;
          content += `${item.description || ''}\n\n`;
        });
      }
    } else if (section.type === "EDUCATION") {
      if (section.content.items && Array.isArray(section.content.items)) {
        section.content.items.forEach((item: any) => {
          content += `${item.degree || 'Degree'} in ${item.field || 'Field'}\n`;
          content += `${item.institution || 'Institution'}, ${item.graduationYear || 'Year'}\n`;
          if (item.gpa) content += `GPA: ${item.gpa}\n`;
          content += "\n";
        });
      }
    } else if (section.type === "SKILLS") {
      if (section.content.categories && Array.isArray(section.content.categories)) {
        section.content.categories.forEach((category: any) => {
          if (category.skills && Array.isArray(category.skills)) {
            content += `${category.name || 'Skills'}: ${category.skills.join(", ")}\n`;
          }
        });
      }
    }
    
    content += "\n";
  });

  return content;
}

function generateDOCXContent(resume: any): string {
  // For now, return the same content as PDF
  // In a real implementation, you'd use docx library to generate proper DOCX
  return generatePDFContent(resume);
}

function generateTXTContent(resume: any): string {
  // Return the same content as PDF for text format
  return generatePDFContent(resume);
}