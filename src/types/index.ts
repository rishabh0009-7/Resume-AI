import { Resume, ResumeSection, ResumeTemplate, SectionType } from '@prisma/client';

// Extended Resume with relations
export interface ResumeWithSections extends Resume {
  sections: ResumeSection[];
  template?: ResumeTemplate | null;
}

// Personal Information Section
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

// Professional Summary Section
export interface ProfessionalSummary {
  summary: string;
}

// Work Experience Item
export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  description: string[];
  achievements?: string[];
}

// Education Item
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
}

// Skill Category
export interface SkillCategory {
  category: string;
  skills: string[];
}

// Skills Section
export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
  categories?: SkillCategory[];
}

// Project Item
export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
  highlights: string[];
}

// Certification Item
export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  dateEarned: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

// Language Item
export interface Language {
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

// Award Item
export interface Award {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

// Volunteer Experience Item
export interface VolunteerExperience {
  id?: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Reference Item
export interface Reference {
  id?: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

// Section Content Types
export type SectionContent = 
  | PersonalInfo
  | ProfessionalSummary
  | WorkExperience[]
  | Education[]
  | Skills
  | Project[]
  | Certification[]
  | Language[]
  | Award[]
  | VolunteerExperience[]
  | Reference[]
  | any; // For custom sections

// Resume Form Data
export interface ResumeFormData {
  title: string;
  description?: string;
  templateId?: string;
  sections: {
    [key in SectionType]?: {
      title: string;
      content: SectionContent;
      isActive: boolean;
      order: number;
    };
  };
}

// AI Generation Request
export interface AIGenerationRequest {
  prompt: string;
  context?: string;
  sectionType?: SectionType;
  previousContent?: any;
}

// AI Generation Response
export interface AIGenerationResponse {
  success: boolean;
  content?: any;
  error?: string;
  tokensUsed?: number;
}

// Template Structure
export interface TemplateStructure {
  sections: {
    type: SectionType;
    title: string;
    required: boolean;
    order: number;
    config?: any;
  }[];
  layout: 'single-column' | 'two-column' | 'three-column';
  theme: 'modern' | 'classic' | 'creative' | 'minimal';
}

// Template Styling
export interface TemplateStyling {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: {
      heading: string;
      subheading: string;
      body: string;
      small: string;
    };
  };
  spacing: {
    section: string;
    item: string;
    line: string;
  };
  borders: {
    width: string;
    style: string;
    color: string;
  };
}

// Resume Export Options
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html';
  quality?: 'low' | 'medium' | 'high';
  includePhoto?: boolean;
  pageSize?: 'a4' | 'letter';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form State
export interface FormState {
  isLoading: boolean;
  hasChanges: boolean;
  currentSection: SectionType | null;
  validationErrors: Record<string, string>;
}

// Preview State
export interface PreviewState {
  zoom: number;
  mode: 'desktop' | 'mobile';
  showGrid: boolean;
  highlightSection?: SectionType;
}

// User Subscription
export interface UserSubscription {
  plan: 'free' | 'pro' | 'premium';
  resumeLimit: number;
  resumesUsed: number;
  hasAIAccess: boolean;
  hasPremiumTemplates: boolean;
  expiresAt?: Date;
}