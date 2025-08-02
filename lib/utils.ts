import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SectionType } from "@prisma/client";
import { ResumeFormData, SectionContent } from "@/src/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Calculate years of experience
export function calculateYearsOfExperience(experiences: any[]): number {
  if (!experiences?.length) return 0;

  let totalMonths = 0;
  
  experiences.forEach(exp => {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = exp.isCurrentRole ? new Date() : new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    }
  });

  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
}

// Generate resume filename
export function generateResumeFilename(title: string, format: string = 'pdf'): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitized}_${timestamp}.${format}`;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Get section display name
export function getSectionDisplayName(type: SectionType): string {
  const names: Record<SectionType, string> = {
    [SectionType.PERSONAL_INFO]: 'Personal Information',
    [SectionType.SUMMARY]: 'Professional Summary',
    [SectionType.EXPERIENCE]: 'Work Experience',
    [SectionType.EDUCATION]: 'Education',
    [SectionType.SKILLS]: 'Skills',
    [SectionType.PROJECTS]: 'Projects',
    [SectionType.CERTIFICATIONS]: 'Certifications',
    [SectionType.LANGUAGES]: 'Languages',
    [SectionType.VOLUNTEER]: 'Volunteer Experience',
    [SectionType.AWARDS]: 'Awards & Honors',
    [SectionType.REFERENCES]: 'References',
    [SectionType.CUSTOM]: 'Custom Section',
  };
  
  return names[type] || type;
}

// Get section icon
export function getSectionIcon(type: SectionType): string {
  const icons: Record<SectionType, string> = {
    [SectionType.PERSONAL_INFO]: '👤',
    [SectionType.SUMMARY]: '📝',
    [SectionType.EXPERIENCE]: '💼',
    [SectionType.EDUCATION]: '🎓',
    [SectionType.SKILLS]: '⚡',
    [SectionType.PROJECTS]: '🚀',
    [SectionType.CERTIFICATIONS]: '🏆',
    [SectionType.LANGUAGES]: '🌐',
    [SectionType.VOLUNTEER]: '🤝',
    [SectionType.AWARDS]: '🏅',
    [SectionType.REFERENCES]: '📞',
    [SectionType.CUSTOM]: '📋',
  };
  
  return icons[type] || '📄';
}

// Validate resume form data
export function validateResumeData(data: ResumeFormData): string[] {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Resume title is required');
  }
  
  // Validate personal info if present
  if (data.sections[SectionType.PERSONAL_INFO]) {
    const personalInfo = data.sections[SectionType.PERSONAL_INFO].content as any;
    
    if (!personalInfo.fullName?.trim()) {
      errors.push('Full name is required');
    }
    
    if (!personalInfo.email?.trim() || !isValidEmail(personalInfo.email)) {
      errors.push('Valid email is required');
    }
    
    if (personalInfo.phone && !isValidPhone(personalInfo.phone)) {
      errors.push('Valid phone number is required');
    }
    
    if (personalInfo.website && !isValidUrl(personalInfo.website)) {
      errors.push('Valid website URL is required');
    }
  }
  
  return errors;
}

// Sort sections by order
export function sortSectionsByOrder(sections: any[]): any[] {
  return sections.sort((a, b) => a.order - b.order);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get contrasting text color
export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Convert string to slug
export function stringToSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get default section order
export function getDefaultSectionOrder(): Record<SectionType, number> {
  return {
    [SectionType.PERSONAL_INFO]: 1,
    [SectionType.SUMMARY]: 2,
    [SectionType.EXPERIENCE]: 3,
    [SectionType.EDUCATION]: 4,
    [SectionType.SKILLS]: 5,
    [SectionType.PROJECTS]: 6,
    [SectionType.CERTIFICATIONS]: 7,
    [SectionType.LANGUAGES]: 8,
    [SectionType.VOLUNTEER]: 9,
    [SectionType.AWARDS]: 10,
    [SectionType.REFERENCES]: 11,
    [SectionType.CUSTOM]: 12,
  };
}

// Check if section is required
export function isRequiredSection(type: SectionType): boolean {
  const requiredSections = [
    SectionType.PERSONAL_INFO,
    SectionType.EXPERIENCE,
  ];
  return requiredSections.includes(type);
}

// Get placeholder content for sections
export function getPlaceholderContent(type: SectionType): SectionContent {
  switch (type) {
    case SectionType.PERSONAL_INFO:
      return {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
      };
      
    case SectionType.SUMMARY:
      return {
        summary: '',
      };
      
    case SectionType.EXPERIENCE:
      return [];
      
    case SectionType.EDUCATION:
      return [];
      
    case SectionType.SKILLS:
      return {
        technical: [],
        soft: [],
        languages: [],
      };
      
    case SectionType.PROJECTS:
      return [];
      
    case SectionType.CERTIFICATIONS:
      return [];
      
    case SectionType.LANGUAGES:
      return [];
      
    case SectionType.VOLUNTEER:
      return [];
      
    case SectionType.AWARDS:
      return [];
      
    case SectionType.REFERENCES:
      return [];
      
    default:
      return {};
  }
}

// Local storage helpers
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default {
  cn,
  formatDate,
  calculateYearsOfExperience,
  generateResumeFilename,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  getSectionDisplayName,
  getSectionIcon,
  validateResumeData,
  sortSectionsByOrder,
  generateId,
  debounce,
  throttle,
  deepClone,
  formatFileSize,
  getContrastColor,
  truncateText,
  stringToSlug,
  getDefaultSectionOrder,
  isRequiredSection,
  getPlaceholderContent,
  storage,
};