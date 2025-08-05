import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class AiService {
    private model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    async generateResumeContent(content: string, context: string = "resume"): Promise<string> {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("GEMINI_API_KEY is not configured");
            }

            const prompt = `Generate professional ${context} content based on the following information: ${content}. 
            Make it compelling, specific, and achievement-oriented. Use action verbs and quantify results where possible.`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            if (!text || text.trim().length === 0) {
                throw new Error("AI returned empty response");
            }
            
            return text;
        } catch (error) {
            console.error("AI generation error:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to generate content: ${error.message}`);
            }
            throw new Error("Failed to generate content");
        }
    }

    async enhanceResumeSection(sectionType: string, content: string, jobDescription: string): Promise<string> {
        try {
            const prompt = `Enhance this ${sectionType} section for a resume to better match the job description. 
            Job Description: ${jobDescription}
            
            Current ${sectionType} content: ${content}
            
            Please improve the content to:
            1. Use relevant keywords from the job description
            2. Make achievements more specific and quantifiable
            3. Use strong action verbs
            4. Align with the job requirements
            
            Return only the enhanced content without explanations.`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI enhancement error:", error);
            throw new Error("Failed to enhance content");
        }
    }

    async generateSummary(experience: any[], skills: string[], jobDescription: string): Promise<string> {
        try {
            const experienceText = experience.map(exp => 
                `${exp.title} at ${exp.company}: ${exp.description}`
            ).join('\n');
            const skillsText = skills.join(', ');

            const prompt = `Create a compelling professional summary for a resume based on:
            
            Experience: ${experienceText}
            Skills: ${skillsText}
            Target Job: ${jobDescription}
            
            The summary should:
            1. Be 3-4 sentences long
            2. Highlight key achievements and skills
            3. Match the job requirements
            4. Use professional language
            5. Include relevant keywords from the job description
            
            Return only the summary without explanations.`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI summary generation error:", error);
            throw new Error("Failed to generate summary");
        }
    }

    async suggestSkills(jobDescription: string, currentSkills: string[] = []): Promise<string> {
        try {
            const prompt = `Analyze this job description and suggest relevant skills for the candidate:
            
            Job Description: ${jobDescription}
            Current Skills: ${currentSkills.join(', ')}
            
            Please suggest:
            1. Technical skills mentioned in the job description
            2. Soft skills that would be valuable
            3. Industry-specific skills
            4. Any missing skills that would make the candidate more competitive
            
            Return a comma-separated list of skills, prioritizing the most important ones first.`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI skill suggestion error:", error);
            throw new Error("Failed to suggest skills");
        }
    }

    async optimizeForAts(content: string, jobDescription: string): Promise<string> {
        try {
            const prompt = `Optimize this resume content for Applicant Tracking Systems (ATS) based on the job description:
            
            Job Description: ${jobDescription}
            Resume Content: ${content}
            
            Please:
            1. Include relevant keywords from the job description
            2. Use standard section headings
            3. Ensure proper formatting
            4. Remove any graphics or special characters
            5. Use clear, professional language
            6. Quantify achievements where possible
            
            Return the optimized content.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI ATS optimization error:", error);
            throw new Error("Failed to optimize for ATS");
        }
    }

    async generateJobSpecificContent(content: string, jobDescription: string, sectionType: string): Promise<string> {
        try {
            const prompt = `Generate ${sectionType} content specifically tailored for this job:
            
            Job Description: ${jobDescription}
            Current Content: ${content}
            
            Please create content that:
            1. Directly addresses the job requirements
            2. Uses keywords from the job description
            3. Shows relevant experience and skills
            4. Demonstrates value to the employer
            5. Is specific and achievement-oriented
            
            Return only the generated content.`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI job-specific generation error:", error);
            throw new Error("Failed to generate job-specific content");
        }
    }
}

export const aiService = new AiService();