import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { aiService } from '@/lib/ai-services'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    requestBody = await request.json()
    const { 
      type, 
      content, 
      jobDescription, 
      resumeId, 
      context,
      experience,
      skills,
      sectionType 
    } = requestBody

    let generatedContent = ''
    let metadata = {}

    switch (type) {
      case 'enhance_section':
        generatedContent = await aiService.enhanceResumeSection(
          sectionType || 'section',
          content,
          jobDescription
        )
        metadata = { sectionType, originalContent: content }
        break

      case 'generate_summary':
        generatedContent = await aiService.generateSummary(
          experience || [],
          skills || [],
          jobDescription
        )
        metadata = { experience, skills }
        break

      case 'suggest_skills':
        generatedContent = await aiService.suggestSkills(
          jobDescription,
          content ? content.split(',') : []
        )
        metadata = { currentSkills: content }
        break

      case 'optimize_ats':
        generatedContent = await aiService.optimizeForATS(
          content,
          jobDescription
        )
        metadata = { originalContent: content }
        break

      case 'generate_job_specific':
        generatedContent = await aiService.generateJobSpecificContent(
          content,
          jobDescription,
          sectionType || 'section'
        )
        metadata = { sectionType, originalContent: content }
        break

      case 'generate_content':
        generatedContent = await aiService.generateResumeContent(
          content,
          context || 'resume'
        )
        metadata = { context, originalContent: content }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    // Log AI generation history
    if (userId) {
      try {
        await prisma.aIGenerationHistory.create({
          data: {
            prompt: content,
            response: generatedContent,
            model: 'gemini-pro',
            status: 'SUCCESS',
            userId: userId,
            resumeId: resumeId || null,
          },
        })
      } catch (error) {
        console.error('Error logging AI history:', error)
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      content: generatedContent,
      type,
      metadata,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI generation error:', error)
    
    // Log failed generation
    try {
      const { userId } = await auth()
      if (userId) {
        await prisma.aIGenerationHistory.create({
          data: {
            prompt: requestBody?.content || '',
            response: '',
            model: 'gemini-pro',
            status: 'FAILED',
            userId: userId,
            resumeId: requestBody?.resumeId || null,
          },
        })
      }
    } catch (logError) {
      console.error('Error logging failed AI generation:', logError)
    }

    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Get AI generation history for a user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('resumeId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const whereClause: any = {
      userId: userId,
    }

    if (resumeId) {
      whereClause.resumeId = resumeId
    }

    const history = await prisma.aIGenerationHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching AI history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}