-- Migration: Add enhanced schema for applicant tracking system
-- Run this against your PostgreSQL database

-- 1. Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    employment_type VARCHAR(50) DEFAULT 'full-time',
    status VARCHAR(50) DEFAULT 'open' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 2. Add new columns to applicants table
ALTER TABLE applicants
ADD COLUMN IF NOT EXISTS job_id INTEGER REFERENCES jobs(id),
ADD COLUMN IF NOT EXISTS resume_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS expected_salary INTEGER,
ADD COLUMN IF NOT EXISTS current_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS source VARCHAR(100),
ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS available_start_date DATE;

-- 3. Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100)
);

-- 4. Create applicant_skills junction table
CREATE TABLE IF NOT EXISTS applicant_skills (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50),
    years_used INTEGER
);

-- 5. Create education table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(255),
    graduation_year INTEGER,
    gpa VARCHAR(10)
);

-- 6. Create work_experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    location VARCHAR(255)
);

-- 7. Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id),
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    interview_type VARCHAR(50),
    scheduled_at TIMESTAMP,
    duration INTEGER,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled',
    feedback TEXT,
    rating INTEGER,
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 8. Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applicants_job_id ON applicants(job_id);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_source ON applicants(source);
CREATE INDEX IF NOT EXISTS idx_applicant_skills_applicant_id ON applicant_skills(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applicant_skills_skill_id ON applicant_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_education_applicant_id ON education(applicant_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_applicant_id ON work_experience(applicant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_applicant_id ON interviews(applicant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_documents_applicant_id ON documents(applicant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
