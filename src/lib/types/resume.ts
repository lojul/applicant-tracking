export interface ExtractedEducation {
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  graduationYear: number | null;
  gpa: string | null;
}

export interface ExtractedWorkExperience {
  company: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  location: string | null;
}

export interface ExtractedSkill {
  name: string;
  category: 'programming' | 'framework' | 'tool' | 'soft-skill' | 'other';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  yearsUsed: number | null;
}

export interface ExtractedResumeData {
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  currentCompany: string | null;
  currentTitle: string | null;
  yearsOfExperience: number | null;
  education: ExtractedEducation[];
  workExperience: ExtractedWorkExperience[];
  skills: ExtractedSkill[];
}

export interface ResumeFormState {
  step: 'upload' | 'processing' | 'review';
  resumeUrl: string | null;
  extractedData: ExtractedResumeData | null;
  error: string | null;
}
