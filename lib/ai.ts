import { GoogleGenerativeAI } from '@google/generative-ai';
import { SectionType } from '@prisma/client';
import { AIGenerationRequest, AIGenerationResponse } from '@/src/types'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// AI Prompts for different sections
const SECTION_PROMPTS = {
  [SectionType.SUMMARY]: {
    base: `Generate a professional summary for a resume based on the following information. 
    Make it compelling, concise (2-3 sentences), and tailored to the target role.
    Focus on key strengths, years of experience, and value proposition.
    Return only the summary text, no additional formatting.`,
  },
  [SectionType.EXPERIENCE]: {
    base: `Generate professional work experience bullet points based on the job description provided.
    Create 3-4 action-oriented bullet points that highlight achievements and impact.
    Use strong action verbs and quantify results where possible.
    Format as a JSON array of strings.`,
  },
  [SectionType.SKILLS]: {
    base: `Generate relevant skills based on the job description or career field provided.
    Categorize skills into: Technical Skills, Soft Skills, and Tools/Technologies.
    Return as JSON object with these categories as keys and arrays of skills as values.
    Include 5-8 skills per category that are most relevant.`,
  },
  [SectionType.PROJECTS]: {
    base: `Generate a professional project description based on the project information provided.
    Include: project overview, key technologies used, your role, and measurable outcomes.
    Make it concise but impactful, highlighting technical skills and problem-solving abilities.
    Return as plain text, 2-3 sentences maximum.`,
  },
  [SectionType.EDUCATION]: {
    base: `Generate relevant coursework and achievements based on the degree and field of study provided.
    Include 3-4 relevant courses and any academic achievements or honors.
    Return as JSON object with keys: "relevantCourses" (string array) and "honors" (string array).`,
  },
  [SectionType.CERTIFICATIONS]: {
    base: `Suggest relevant certifications for the career field or role provided.
    Focus on industry-recognized certifications that would add value.
    Return as JSON array of objects with keys: "name", "issuer", "relevance".`,
  },
  [SectionType.CUSTOM]: {
    base: `Generate content for a custom resume section based on the requirements provided.
    Make it professional, relevant, and well-structured.
    Return the content in the format requested or as plain text if no format specified.`,
  },
};

export class AIService {
  static async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const { prompt, context = '', sectionType, previousContent } = request;
      
      let systemPrompt = '';
      
      if (sectionType && SECTION_PROMPTS[sectionType]) {
        systemPrompt = SECTION_PROMPTS[sectionType].base;
      } else {
        systemPrompt = `Generate professional resume content based on the request. 
        Make it compelling, accurate, and tailored to the context provided.`;
      }

      const fullPrompt = `${systemPrompt}

Context: ${context}
Request: ${prompt}
${previousContent ? `Previous Content: ${JSON.stringify(previousContent)}` : ''}

Please provide high-quality, professional content that would impress hiring managers.`;

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Try to parse as JSON first, fallback to plain text
      let content;
      try {
        content = JSON.parse(text);
      } catch {
        content = text.trim();
      }

      return {
        success: true,
        content,
        tokensUsed: await this.estimateTokens(fullPrompt + text),
      };
    } catch (error) {
      console.error('AI Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content',
      };
    }
  }

  static async generateSummary(
    experience: string,
    skills: string[],
    targetRole?: string
  ): Promise<AIGenerationResponse> {
    const prompt = `
    Experience: ${experience}
    Key Skills: ${skills.join(', ')}
    ${targetRole ? `Target Role: ${targetRole}` : ''}
    `;

    return this.generateContent({
      prompt,
      sectionType: SectionType.SUMMARY,
    });
  }

  static async enhanceExperience(
    jobTitle: string,
    company: string,
    responsibilities: string[],
    achievements?: string[]
  ): Promise<AIGenerationResponse> {
    const prompt = `
    Job Title: ${jobTitle}
    Company: ${company}
    Responsibilities: ${responsibilities.join('; ')}
    ${achievements?.length ? `Achievements: ${achievements.join('; ')}` : ''}
    
    Enhance these into professional, impactful bullet points that demonstrate value and results.
    `;

    return this.generateContent({
      prompt,
      sectionType: SectionType.EXPERIENCE,
    });
  }

  static async suggestSkills(
    jobDescription: string,
    currentSkills?: string[]
  ): Promise<AIGenerationResponse> {
    const prompt = `
    Job Description or Field: ${jobDescription}
    ${currentSkills?.length ? `Current Skills: ${currentSkills.join(', ')}` : ''}
    
    Suggest additional relevant skills that would be valuable for this role.
    `;

    return this.generateContent({
      prompt,
      sectionType: SectionType.SKILLS,
    });
  }

  static async optimizeForATS(
    content: string,
    jobDescription: string
  ): Promise<AIGenerationResponse> {
    const prompt = `
    Original Content: ${content}
    Job Description: ${jobDescription}
    
    Optimize this content for ATS (Applicant Tracking Systems) by:
    1. Including relevant keywords from the job description
    2. Using standard formatting and terminology
    3. Maintaining professional language
    4. Ensuring keyword density is natural
    
    Return the optimized content maintaining the original structure.
    `;

    return this.generateContent({ prompt });
  }

  static async generateProjectDescription(
    projectName: string,
    technologies: string[],
    role: string,
    outcomes?: string
  ): Promise<AIGenerationResponse> {
    const prompt = `
    Project: ${projectName}
    Technologies: ${technologies.join(', ')}
    My Role: ${role}
    ${outcomes ? `Outcomes: ${outcomes}` : ''}
    
    Generate a compelling project description for a resume.
    `;

    return this.generateContent({
      prompt,
      sectionType: SectionType.PROJECTS,
    });
  }

  static async improveContent(
    originalContent: string,
    improvementType: 'clarity' | 'impact' | 'keywords' | 'length'
  ): Promise<AIGenerationResponse> {
    const prompts = {
      clarity: 'Make this content clearer and easier to understand while maintaining professionalism.',
      impact: 'Enhance this content to show more impact and value to employers.',
      keywords: 'Add relevant industry keywords to this content for better ATS optimization.',
      length: 'Optimize the length of this content - make it more concise while keeping key information.',
    };

    const prompt = `
    Original Content: ${originalContent}
    
    Improvement Request: ${prompts[improvementType]}
    `;

    return this.generateContent({ prompt, previousContent: originalContent });
  }

  // Helper method to estimate token usage
  private static async estimateTokens(text: string): Promise<number> {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Method to validate AI response format
  static validateResponse(content: any, expectedType: SectionType): boolean {
    switch (expectedType) {
      case SectionType.EXPERIENCE:
        return Array.isArray(content);
      case SectionType.SKILLS:
        return typeof content === 'object' && content !== null;
      case SectionType.SUMMARY:
        return typeof content === 'string';
      default:
        return true; // Allow any format for other types
    }
  }
}

// Utility function to create structured prompts
export function createPrompt(
  type: 'enhance' | 'generate' | 'optimize',
  section: SectionType,
  data: Record<string, any>
): string {
  const basePrompts = {
    enhance: `Enhance the following ${section.toLowerCase()} section for a professional resume:`,
    generate: `Generate a professional ${section.toLowerCase()} section for a resume based on:`,
    optimize: `Optimize the following ${section.toLowerCase()} section for ATS compatibility:`,
  };

  const dataString = Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n');

  return `${basePrompts[type]}\n\n${dataString}`;
}

export default AIService;