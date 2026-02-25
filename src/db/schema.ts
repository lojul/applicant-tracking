import { pgTable, serial, text, timestamp, varchar, integer, boolean, date } from "drizzle-orm/pg-core";

// Jobs/Positions table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }),
  description: text("description"),
  requirements: text("requirements"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  location: varchar("location", { length: 255 }),
  isRemote: boolean("is_remote").default(false),
  employmentType: varchar("employment_type", { length: 50 }).default("full-time"), // full-time, part-time, contract, internship
  status: varchar("status", { length: 50 }).default("open").notNull(), // open, closed, on-hold
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

// Applicants table (enhanced)
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  status: varchar("status", { length: 50 }).default("applied").notNull(),
  position: varchar("position", { length: 255 }),
  notes: text("notes"),
  // New fields
  jobId: integer("job_id").references(() => jobs.id),
  resumeUrl: varchar("resume_url", { length: 500 }),
  photoUrl: varchar("photo_url", { length: 500 }), // Extracted photo from resume
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  portfolioUrl: varchar("portfolio_url", { length: 500 }),
  yearsOfExperience: integer("years_of_experience"),
  expectedSalary: integer("expected_salary"),
  currentCompany: varchar("current_company", { length: 255 }),
  currentTitle: varchar("current_title", { length: 255 }),
  location: varchar("location", { length: 255 }),
  source: varchar("source", { length: 100 }), // linkedin, indeed, referral, company-website, recruiter, etc.
  referredBy: varchar("referred_by", { length: 255 }),
  availableStartDate: date("available_start_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;

// Skills reference table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }), // programming, framework, tool, soft-skill, etc.
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

// Applicant skills (many-to-many)
export const applicantSkills = pgTable("applicant_skills", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => applicants.id).notNull(),
  skillId: integer("skill_id").references(() => skills.id).notNull(),
  proficiencyLevel: varchar("proficiency_level", { length: 50 }), // beginner, intermediate, advanced, expert
  yearsUsed: integer("years_used"),
});

export type ApplicantSkill = typeof applicantSkills.$inferSelect;
export type NewApplicantSkill = typeof applicantSkills.$inferInsert;

// Education history
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => applicants.id).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 100 }), // Bachelor's, Master's, PhD, etc.
  fieldOfStudy: varchar("field_of_study", { length: 255 }),
  graduationYear: integer("graduation_year"),
  gpa: varchar("gpa", { length: 10 }),
});

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

// Work experience history
export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => applicants.id).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"), // null if current position
  isCurrent: boolean("is_current").default(false),
  description: text("description"),
  location: varchar("location", { length: 255 }),
});

export type WorkExperience = typeof workExperience.$inferSelect;
export type NewWorkExperience = typeof workExperience.$inferInsert;

// Interview scheduling and feedback
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => applicants.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id),
  interviewerName: varchar("interviewer_name", { length: 255 }),
  interviewerEmail: varchar("interviewer_email", { length: 255 }),
  interviewType: varchar("interview_type", { length: 50 }), // phone-screen, technical, behavioral, culture-fit, final
  scheduledAt: timestamp("scheduled_at"),
  duration: integer("duration"), // in minutes
  location: varchar("location", { length: 255 }), // room name, video link, etc.
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, completed, cancelled, no-show
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 scale
  recommendation: varchar("recommendation", { length: 50 }), // strong-yes, yes, neutral, no, strong-no
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;

// Documents/Attachments
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => applicants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }), // resume, cover-letter, portfolio, certificate, other
  url: varchar("url", { length: 500 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
