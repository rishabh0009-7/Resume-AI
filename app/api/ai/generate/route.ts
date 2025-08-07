// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { aiService } from '@/lib/ai-services'
import { prisma } from '@/lib/prisma'
import { ensureUserExists } from '@/lib/user-sync'

export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in database
    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    requestBody = await request.json()
    const { 
      type, 
      content, 
      jobDescription = '', 
      resumeId, 
      context = 'resume',
      experience = [],
      skills = [],
      sectionType = 'section'
    } = requestBody

    let generatedContent = ''
    let metadata = {}

    console.log('AI Generation Request:', { type, content: content?.substring(0, 100) })

    switch (type) {
      case 'enhance_section':
        generatedContent = await aiService.enhanceResumeSection(
          sectionType,
          content,
          jobDescription
        )
        metadata = { sectionType, originalContent: content }
        break

      case 'generate_summary':
        generatedContent = await aiService.generateSummary(
          experience,
          skills,
          jobDescription
        )
        metadata = { experience, skills }
        break

      case 'suggest_skills':
        generatedContent = await aiService.suggestSkills(
          jobDescription,
          Array.isArray(content) ? content : (content ? content.split(',').map((s: string) => s.trim()) : [])
        )
        metadata = { currentSkills: content }
        break

      case 'optimize_ats':
        generatedContent = await aiService.optimizeForAts(
          content,
          jobDescription
        )
        metadata = { originalContent: content }
        break

      case 'generate_job_specific':
        generatedContent = await aiService.generateJobSpecificContent(
          content,
          jobDescription,
          sectionType
        )
        metadata = { sectionType, originalContent: content }
        break

      case 'generate_content':
        generatedContent = await aiService.generateResumeContent(
          content,
          context
        )
        metadata = { context, originalContent: content }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    console.log('AI Generated Content:', generatedContent?.substring(0, 100))

    // Log AI generation history
    try {
      await prisma.aIGenerationHistory.create({
        data: {
          prompt: JSON.stringify({ type, content, jobDescription }),
          response: generatedContent,
          model: 'gemini-pro',
          status: 'SUCCESS',
          userId: user.id,
          resumeId: resumeId || null,
        },
      })
    } catch (error) {
      console.error('Error logging AI history:', error)
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
      const user = await ensureUserExists()
      if (user) {
        await prisma.aIGenerationHistory.create({
          data: {
            prompt: JSON.stringify(requestBody),
            response: '',
            model: 'gemini-pro',
            status: 'FAILED',
            userId: user.id,
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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('resumeId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const whereClause: any = {
      userId: user.id,
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