import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AiService } from "@/lib/ai-services";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, jobDescription, resumeId, context } = body;

    let generatedContent = "";

    switch (type) {
      case "enhance_section":
        generatedContent = await AiService.enhanceResumeSection(
          context || "section",
          content,
          jobDescription
        );
        break;

      case "generate_summary":
        const { experience, skills } = body;
        generatedContent = await aiService.generateSummary(
          experience || [],
          skills || [],
          jobDescription
        );
        break;

      case "suggest_skills":
        generatedContent = await aiService.suggestSkills(
          jobDescription,
          content ? content.split(",") : []
        );
        break;

      case "optimize_ats":
        generatedContent = await aiService.optimizeForATS(
          content,
          jobDescription
        );
        break;

      default:
        generatedContent = await aiService.generateResumeContent(
          content,
          context
        );
    }

    // Log AI generation history
    if (resumeId) {
      await prisma.aIGenerationHistory.create({
        data: {
          prompt: content,
          response: generatedContent,
          model: "gemini-pro",
          status: "SUCCESS",
          userId: userId,
          resumeId: resumeId,
        },
      });
    }

    return NextResponse.json({
      content: generatedContent,
      type,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
