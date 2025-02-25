export interface ParsedResume {
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
}

export interface ResumeCardProps {
  resume: ParsedResume;
}
