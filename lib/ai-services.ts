// lib/ai-services.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class AiService {
    private model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    private async generateContent(prompt: string): Promise<string> {
        try {
            console.log('Generating AI content with prompt:', prompt.substring(0, 100) + '...');
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            if (!text || text.trim().length === 0) {
                throw new Error("AI returned empty response");
            }
            
            console.log('AI generated content length:', text.length);
            return text.trim();
        } catch (error) {
            console.error("AI generation error:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to generate content: ${error.message}`);
            }
            throw new Error("Failed to generate content");
        }
    }

    async generateResumeContent(content: string, context: string = "resume"): Promise<string> {
        const prompt = `Generate professional ${context} content based on the following information: ${content}. 
        Make it compelling, specific, and achievement-oriented. Use action verbs and quantify results where possible.
        Keep it concise and professional.`;
        
        return await this.generateContent(prompt);
    }

    async enhanceResumeSection(sectionType: string, content: string, jobDescription: string): Promise<string> {
        const prompt = `Enhance this ${sectionType} section for a resume to better match the job requirements. 
        Job Description: ${jobDescription || 'General professional position'}
        
        Current ${sectionType} content: ${content}
        
        Please improve the content to:
        1. Use relevant keywords from the job description
        2. Make achievements more specific and quantifiable  
        3. Use strong action verbs (achieved, implemented, optimized, etc.)
        4. Align with the job requirements
        5. Keep it concise and impactful
        
        Return only the enhanced content without explanations or formatting.`;
        
        return await this.generateContent(prompt);
    }

    async generateSummary(experience: any[], skills: string[], jobDescription: string): Promise<string> {
        const experienceText = experience
            .filter(exp => exp.title && exp.company)
            .map(exp => `${exp.title} at ${exp.company}: ${exp.description || 'Professional experience'}`)
            .join('\n') || 'Professional with diverse experience';
            
        const skillsText = skills.filter(skill => skill.trim()).join(', ') || 'Various professional skills';

        const prompt = `Create a compelling professional summary for a resume based on:
        
        Experience: ${experienceText}
        Skills: ${skillsText}
        Target Job: ${jobDescription || 'Professional position'}
        
        The summary should:
        1. Be 3-4 sentences long
        2. Highlight key achievements and skills
        3. Match the job requirements where applicable
        4. Use professional language
        5. Include relevant keywords
        6. Start with years of experience if evident
        
        Return only the summary without explanations.`;
        
        return await this.generateContent(prompt);
    }

    async suggestSkills(jobDescription: string, currentSkills: string[] = []): Promise<string> {
        const currentSkillsText = currentSkills.filter(skill => skill.trim()).join(', ');
        
        const prompt = `Analyze this job description and suggest relevant skills for the candidate:
        
        Job Description: ${jobDescription || 'General professional position'}
        Current Skills: ${currentSkillsText || 'None listed'}
        
        Please suggest:
        1. Technical skills mentioned in the job description
        2. Soft skills that would be valuable
        3. Industry-specific skills
        4. Any missing skills that would make the candidate more competitive
        5. Modern, in-demand skills for the field
        
        Return a comma-separated list of 8-12 skills, prioritizing the most important ones first.
        Do not include skills already listed in current skills.`;
        
        return await this.generateContent(prompt);
    }

    async optimizeForAts(content: string, jobDescription: string): Promise<string> {
        const prompt = `Optimize this resume content for Applicant Tracking Systems (ATS) based on the job description:
        
        Job Description: ${jobDescription || 'General professional position'}
        Resume Content: ${content}
        
        Please:
        1. Include relevant keywords from the job description
        2. Use standard section headings and formatting
        3. Ensure proper keyword density without stuffing
        4. Remove any graphics or special characters
        5. Use clear, professional language
        6. Quantify achievements where possible
        7. Use industry-standard terminology
        
        Return the optimized content that will pass ATS scanning.`;

        return await this.generateContent(prompt);
    }

    async generateJobSpecificContent(content: string, jobDescription: string, sectionType: string): Promise<string> {
        const prompt = `Generate ${sectionType} content specifically tailored for this job:
        
        Job Description: ${jobDescription || 'General professional position'}
        Current Content: ${content}
        
        Please create content that:
        1. Directly addresses the job requirements
        2. Uses keywords from the job description
        3. Shows relevant experience and skills
        4. Demonstrates clear value to the employer
        5. Is specific and achievement-oriented
        6. Uses industry-appropriate language
        
        Return only the generated content without explanations.`;
        
        return await this.generateContent(prompt);
    }

    // New method for generating experience bullet points
    async generateExperienceBullets(jobTitle: string, company: string, skills: string[]): Promise<string> {
        const prompt = `Generate 3-4 professional bullet points for a ${jobTitle} position at ${company}.
        
        Relevant skills: ${skills.join(', ')}
        
        Each bullet point should:
        1. Start with a strong action verb
        2. Include quantifiable achievements when possible
        3. Be specific and results-oriented
        4. Be 1-2 lines long
        5. Show impact and value delivered
        
        Return only the bullet points, one per line, without numbers or bullet symbols.`;
        
        return await this.generateContent(prompt);
    }
}

export const aiService = new AiService();