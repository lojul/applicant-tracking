-- Sample Data for Enhanced Applicant Tracking System

-- =====================================================
-- 1. INSERT JOBS
-- =====================================================
INSERT INTO jobs (title, department, description, requirements, salary_min, salary_max, location, is_remote, employment_type, status) VALUES
('Senior Software Engineer', 'Engineering',
 'We are looking for a Senior Software Engineer to join our platform team. You will be responsible for designing and implementing scalable backend services.',
 '- 5+ years of experience in software development
- Proficiency in Python, Java, or Go
- Experience with distributed systems
- Strong problem-solving skills
- BS/MS in Computer Science or related field',
 150000, 200000, 'San Francisco, CA', TRUE, 'full-time', 'open'),

('Product Manager', 'Product',
 'Join our product team to drive the roadmap for our core platform. You will work closely with engineering, design, and stakeholders to deliver exceptional products.',
 '- 5+ years of product management experience
- Experience with B2B SaaS products
- Strong analytical skills
- Excellent communication abilities
- MBA preferred',
 140000, 180000, 'New York, NY', TRUE, 'full-time', 'open'),

('UX Designer', 'Design',
 'We are seeking a talented UX Designer to create intuitive and beautiful user experiences for our platform.',
 '- 3+ years of UX design experience
- Proficiency in Figma and design systems
- Strong portfolio demonstrating user-centered design
- Experience conducting user research',
 120000, 160000, 'Remote', TRUE, 'full-time', 'open'),

('DevOps Engineer', 'Engineering',
 'Looking for a DevOps Engineer to build and maintain our cloud infrastructure and CI/CD pipelines.',
 '- 4+ years of DevOps experience
- AWS or GCP certification
- Kubernetes and Docker expertise
- Infrastructure as Code (Terraform/Pulumi)
- Strong scripting skills',
 140000, 185000, 'Austin, TX', TRUE, 'full-time', 'open'),

('Data Scientist', 'Data',
 'Join our data science team to build ML models that power our recommendation engine and analytics platform.',
 '- PhD or MS in Machine Learning, Statistics, or related field
- Experience with Python and ML frameworks (PyTorch, TensorFlow)
- Strong statistical analysis skills
- Experience deploying ML models to production',
 160000, 220000, 'San Francisco, CA', FALSE, 'full-time', 'open'),

('Frontend Developer', 'Engineering',
 'We need a Frontend Developer to build responsive and performant web applications using React.',
 '- 3+ years of frontend development experience
- Expert in React and TypeScript
- Experience with modern CSS and design systems
- Understanding of accessibility standards',
 110000, 150000, 'Remote', TRUE, 'full-time', 'open'),

('Marketing Manager', 'Marketing',
 'Lead our B2B marketing initiatives and drive demand generation campaigns.',
 '- 5+ years of B2B marketing experience
- Experience with marketing automation tools
- Strong analytical and creative skills
- Track record of successful campaigns',
 100000, 140000, 'New York, NY', FALSE, 'full-time', 'open'),

('QA Engineer', 'Engineering',
 'Ensure the quality of our software through comprehensive testing strategies and automation.',
 '- 3+ years of QA experience
- Strong automation testing skills (Selenium, Cypress)
- Experience with CI/CD integration
- Knowledge of API testing',
 95000, 130000, 'Remote', TRUE, 'full-time', 'open'),

('Sales Engineer', 'Sales',
 'Bridge the gap between our sales team and technical prospects by providing demos and technical guidance.',
 '- 3+ years of sales engineering experience
- Strong technical background
- Excellent presentation skills
- Experience with enterprise sales cycles',
 120000, 180000, 'Chicago, IL', FALSE, 'full-time', 'open'),

('Engineering Intern', 'Engineering',
 'Summer internship opportunity for students to work on real projects with our engineering team.',
 '- Currently pursuing BS/MS in Computer Science
- Strong programming fundamentals
- Eagerness to learn
- Available for 12-week program',
 60000, 80000, 'San Francisco, CA', FALSE, 'internship', 'open');

-- =====================================================
-- 2. INSERT SKILLS
-- =====================================================
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'programming'),
('TypeScript', 'programming'),
('Python', 'programming'),
('Java', 'programming'),
('Go', 'programming'),
('Rust', 'programming'),
('C++', 'programming'),
('Ruby', 'programming'),
('PHP', 'programming'),
('Swift', 'programming'),
-- Frameworks
('React', 'framework'),
('Next.js', 'framework'),
('Node.js', 'framework'),
('Django', 'framework'),
('Spring Boot', 'framework'),
('Vue.js', 'framework'),
('Angular', 'framework'),
('Express.js', 'framework'),
('FastAPI', 'framework'),
('Flask', 'framework'),
-- Databases
('PostgreSQL', 'database'),
('MySQL', 'database'),
('MongoDB', 'database'),
('Redis', 'database'),
('Elasticsearch', 'database'),
-- Cloud & DevOps
('AWS', 'cloud'),
('Google Cloud', 'cloud'),
('Azure', 'cloud'),
('Docker', 'devops'),
('Kubernetes', 'devops'),
('Terraform', 'devops'),
('Jenkins', 'devops'),
('GitHub Actions', 'devops'),
-- Tools
('Git', 'tool'),
('Figma', 'tool'),
('Jira', 'tool'),
('Slack', 'tool'),
-- Soft Skills
('Leadership', 'soft-skill'),
('Communication', 'soft-skill'),
('Problem Solving', 'soft-skill'),
('Team Collaboration', 'soft-skill'),
('Project Management', 'soft-skill');

-- =====================================================
-- 3. UPDATE EXISTING APPLICANTS WITH NEW FIELDS
-- =====================================================
-- Note: These updates assume applicant IDs 1-10 exist from previous seeding

UPDATE applicants SET
    job_id = 1,
    resume_url = 'https://storage.example.com/resumes/sarah-johnson.pdf',
    linkedin_url = 'https://linkedin.com/in/sarah-johnson',
    portfolio_url = 'https://github.com/sarahjohnson',
    years_of_experience = 8,
    expected_salary = 180000,
    current_company = 'Google',
    current_title = 'Software Engineer III',
    location = 'San Francisco, CA',
    source = 'linkedin',
    available_start_date = '2024-04-01'
WHERE email = 'sarah.johnson@email.com';

UPDATE applicants SET
    job_id = 2,
    resume_url = 'https://storage.example.com/resumes/michael-chen.pdf',
    linkedin_url = 'https://linkedin.com/in/michael-chen-pm',
    years_of_experience = 12,
    expected_salary = 175000,
    current_company = 'Microsoft',
    current_title = 'Senior Product Manager',
    location = 'Seattle, WA',
    source = 'referral',
    referred_by = 'John Smith (VP of Product)',
    available_start_date = '2024-03-15'
WHERE email = 'michael.chen@email.com';

UPDATE applicants SET
    job_id = 3,
    resume_url = 'https://storage.example.com/resumes/emily-rodriguez.pdf',
    linkedin_url = 'https://linkedin.com/in/emily-rodriguez-ux',
    portfolio_url = 'https://emilyrodriguezdesign.com',
    years_of_experience = 5,
    expected_salary = 145000,
    current_company = 'Airbnb',
    current_title = 'UX Designer',
    location = 'San Francisco, CA',
    source = 'company-website',
    available_start_date = '2024-03-01'
WHERE email = 'emily.rodriguez@email.com';

UPDATE applicants SET
    job_id = 4,
    resume_url = 'https://storage.example.com/resumes/james-williams.pdf',
    linkedin_url = 'https://linkedin.com/in/james-williams-devops',
    years_of_experience = 6,
    expected_salary = 165000,
    current_company = 'Netflix',
    current_title = 'Site Reliability Engineer',
    location = 'Los Gatos, CA',
    source = 'indeed',
    available_start_date = '2024-04-15'
WHERE email = 'james.williams@email.com';

UPDATE applicants SET
    job_id = 5,
    resume_url = 'https://storage.example.com/resumes/aisha-patel.pdf',
    linkedin_url = 'https://linkedin.com/in/aisha-patel-ml',
    portfolio_url = 'https://github.com/aishapatel',
    years_of_experience = 4,
    expected_salary = 200000,
    current_company = 'Stanford University',
    current_title = 'Research Scientist',
    location = 'Palo Alto, CA',
    source = 'recruiter',
    available_start_date = '2024-05-01'
WHERE email = 'aisha.patel@email.com';

UPDATE applicants SET
    job_id = 6,
    resume_url = 'https://storage.example.com/resumes/david-kim.pdf',
    linkedin_url = 'https://linkedin.com/in/david-kim-dev',
    portfolio_url = 'https://davidkim.dev',
    years_of_experience = 2,
    expected_salary = 120000,
    current_company = 'Startup XYZ',
    current_title = 'Junior Developer',
    location = 'Austin, TX',
    source = 'linkedin',
    available_start_date = '2024-03-01'
WHERE email = 'david.kim@email.com';

UPDATE applicants SET
    job_id = 7,
    resume_url = 'https://storage.example.com/resumes/maria-garcia.pdf',
    linkedin_url = 'https://linkedin.com/in/maria-garcia-marketing',
    years_of_experience = 7,
    expected_salary = 130000,
    current_company = 'HubSpot',
    current_title = 'Marketing Manager',
    location = 'Boston, MA',
    source = 'linkedin',
    available_start_date = '2024-04-01'
WHERE email = 'maria.garcia@email.com';

UPDATE applicants SET
    job_id = 1,
    resume_url = 'https://storage.example.com/resumes/robert-taylor.pdf',
    linkedin_url = 'https://linkedin.com/in/robert-taylor-backend',
    portfolio_url = 'https://github.com/roberttaylor',
    years_of_experience = 10,
    expected_salary = 190000,
    current_company = 'Amazon',
    current_title = 'Senior Software Development Engineer',
    location = 'Seattle, WA',
    source = 'referral',
    referred_by = 'Sarah Johnson',
    available_start_date = '2024-04-01'
WHERE email = 'robert.taylor@email.com';

UPDATE applicants SET
    job_id = 8,
    resume_url = 'https://storage.example.com/resumes/lisa-anderson.pdf',
    linkedin_url = 'https://linkedin.com/in/lisa-anderson-qa',
    years_of_experience = 5,
    expected_salary = 115000,
    current_company = 'Salesforce',
    current_title = 'QA Engineer II',
    location = 'San Francisco, CA',
    source = 'company-website',
    available_start_date = '2024-03-15'
WHERE email = 'lisa.anderson@email.com';

UPDATE applicants SET
    job_id = 9,
    resume_url = 'https://storage.example.com/resumes/thomas-brown.pdf',
    linkedin_url = 'https://linkedin.com/in/thomas-brown-se',
    years_of_experience = 6,
    expected_salary = 160000,
    current_company = 'Datadog',
    current_title = 'Solutions Engineer',
    location = 'Chicago, IL',
    source = 'linkedin',
    available_start_date = '2024-03-01'
WHERE email = 'thomas.brown@email.com';

-- =====================================================
-- 4. INSERT EDUCATION RECORDS
-- =====================================================
-- Sarah Johnson
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Stanford University', 'Master''s', 'Computer Science', 2016, '3.9'
FROM applicants WHERE email = 'sarah.johnson@email.com';

INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'UC Berkeley', 'Bachelor''s', 'Computer Science', 2014, '3.7'
FROM applicants WHERE email = 'sarah.johnson@email.com';

-- Michael Chen
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Harvard Business School', 'MBA', 'Business Administration', 2015, '3.8'
FROM applicants WHERE email = 'michael.chen@email.com';

INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'MIT', 'Bachelor''s', 'Economics', 2011, '3.6'
FROM applicants WHERE email = 'michael.chen@email.com';

-- Emily Rodriguez
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Rhode Island School of Design', 'Bachelor''s', 'Industrial Design', 2018, '3.8'
FROM applicants WHERE email = 'emily.rodriguez@email.com';

-- James Williams
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Georgia Tech', 'Master''s', 'Computer Science', 2018, '3.7'
FROM applicants WHERE email = 'james.williams@email.com';

INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'University of Texas at Austin', 'Bachelor''s', 'Computer Engineering', 2016, '3.5'
FROM applicants WHERE email = 'james.williams@email.com';

-- Aisha Patel
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Stanford University', 'PhD', 'Machine Learning', 2022, '4.0'
FROM applicants WHERE email = 'aisha.patel@email.com';

INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'IIT Delhi', 'Bachelor''s', 'Computer Science', 2017, '3.9'
FROM applicants WHERE email = 'aisha.patel@email.com';

-- David Kim
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'University of Texas at Austin', 'Bachelor''s', 'Computer Science', 2021, '3.4'
FROM applicants WHERE email = 'david.kim@email.com';

-- Maria Garcia
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Northwestern University', 'Master''s', 'Marketing', 2016, '3.7'
FROM applicants WHERE email = 'maria.garcia@email.com';

-- Robert Taylor
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'Carnegie Mellon University', 'Master''s', 'Software Engineering', 2014, '3.8'
FROM applicants WHERE email = 'robert.taylor@email.com';

-- Lisa Anderson
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'San Jose State University', 'Bachelor''s', 'Software Engineering', 2018, '3.5'
FROM applicants WHERE email = 'lisa.anderson@email.com';

-- Thomas Brown
INSERT INTO education (applicant_id, institution, degree, field_of_study, graduation_year, gpa)
SELECT id, 'University of Illinois', 'Bachelor''s', 'Electrical Engineering', 2017, '3.6'
FROM applicants WHERE email = 'thomas.brown@email.com';

-- =====================================================
-- 5. INSERT WORK EXPERIENCE RECORDS
-- =====================================================
-- Sarah Johnson
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Google', 'Software Engineer III', '2020-06-01', NULL, TRUE,
'Lead development of microservices architecture. Mentored junior engineers. Improved system performance by 40%.', 'Mountain View, CA'
FROM applicants WHERE email = 'sarah.johnson@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Facebook', 'Software Engineer', '2016-08-01', '2020-05-31', FALSE,
'Built React components for News Feed. Collaborated with design team on new features.', 'Menlo Park, CA'
FROM applicants WHERE email = 'sarah.johnson@email.com';

-- Michael Chen
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Microsoft', 'Senior Product Manager', '2019-03-01', NULL, TRUE,
'Led Azure product roadmap. Managed team of 8 engineers. Launched 3 major features.', 'Seattle, WA'
FROM applicants WHERE email = 'michael.chen@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Stripe', 'Product Manager', '2016-01-01', '2019-02-28', FALSE,
'Managed payments API products. Grew revenue by 200%.', 'San Francisco, CA'
FROM applicants WHERE email = 'michael.chen@email.com';

-- Emily Rodriguez
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Airbnb', 'UX Designer', '2021-01-01', NULL, TRUE,
'Redesigned booking flow increasing conversions by 25%. Led design system initiatives.', 'San Francisco, CA'
FROM applicants WHERE email = 'emily.rodriguez@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Uber', 'Junior UX Designer', '2018-06-01', '2020-12-31', FALSE,
'Created mobile designs for driver app. Conducted user research studies.', 'San Francisco, CA'
FROM applicants WHERE email = 'emily.rodriguez@email.com';

-- James Williams
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Netflix', 'Site Reliability Engineer', '2020-08-01', NULL, TRUE,
'Maintained 99.99% uptime. Built monitoring dashboards. Automated deployment pipelines.', 'Los Gatos, CA'
FROM applicants WHERE email = 'james.williams@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Twitter', 'DevOps Engineer', '2018-07-01', '2020-07-31', FALSE,
'Managed Kubernetes clusters. Implemented CI/CD pipelines.', 'San Francisco, CA'
FROM applicants WHERE email = 'james.williams@email.com';

-- Aisha Patel
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Stanford University', 'Research Scientist', '2022-06-01', NULL, TRUE,
'Published 5 papers in top ML conferences. Developed novel NLP models.', 'Stanford, CA'
FROM applicants WHERE email = 'aisha.patel@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'OpenAI', 'Research Intern', '2021-06-01', '2021-09-30', FALSE,
'Worked on language model fine-tuning. Contributed to research publications.', 'San Francisco, CA'
FROM applicants WHERE email = 'aisha.patel@email.com';

-- David Kim
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Startup XYZ', 'Junior Developer', '2021-07-01', NULL, TRUE,
'Built React frontend for SaaS platform. Implemented REST APIs.', 'Austin, TX'
FROM applicants WHERE email = 'david.kim@email.com';

-- Maria Garcia
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'HubSpot', 'Marketing Manager', '2020-04-01', NULL, TRUE,
'Led demand generation campaigns. Managed $2M annual budget. Increased MQLs by 150%.', 'Boston, MA'
FROM applicants WHERE email = 'maria.garcia@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Salesforce', 'Marketing Specialist', '2017-06-01', '2020-03-31', FALSE,
'Executed email marketing campaigns. Managed social media presence.', 'San Francisco, CA'
FROM applicants WHERE email = 'maria.garcia@email.com';

-- Robert Taylor
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Amazon', 'Senior Software Development Engineer', '2018-01-01', NULL, TRUE,
'Architected distributed systems for AWS. Led team of 6 engineers. Designed scalable solutions.', 'Seattle, WA'
FROM applicants WHERE email = 'robert.taylor@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'LinkedIn', 'Software Engineer', '2014-08-01', '2017-12-31', FALSE,
'Built backend services for messaging platform. Optimized database queries.', 'Sunnyvale, CA'
FROM applicants WHERE email = 'robert.taylor@email.com';

-- Lisa Anderson
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Salesforce', 'QA Engineer II', '2020-02-01', NULL, TRUE,
'Automated 80% of regression tests. Built Selenium test frameworks.', 'San Francisco, CA'
FROM applicants WHERE email = 'lisa.anderson@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Oracle', 'QA Analyst', '2018-08-01', '2020-01-31', FALSE,
'Manual and automated testing for enterprise software.', 'Redwood City, CA'
FROM applicants WHERE email = 'lisa.anderson@email.com';

-- Thomas Brown
INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Datadog', 'Solutions Engineer', '2021-03-01', NULL, TRUE,
'Delivered technical demos to enterprise prospects. Achieved 120% of quota.', 'Chicago, IL'
FROM applicants WHERE email = 'thomas.brown@email.com';

INSERT INTO work_experience (applicant_id, company, title, start_date, end_date, is_current, description, location)
SELECT id, 'Splunk', 'Sales Engineer', '2018-06-01', '2021-02-28', FALSE,
'Provided pre-sales technical support. Conducted product training.', 'Chicago, IL'
FROM applicants WHERE email = 'thomas.brown@email.com';

-- =====================================================
-- 6. INSERT APPLICANT SKILLS
-- =====================================================
-- Sarah Johnson - Senior Software Engineer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 6 FROM applicants a, skills s
WHERE a.email = 'sarah.johnson@email.com' AND s.name = 'JavaScript';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 5 FROM applicants a, skills s
WHERE a.email = 'sarah.johnson@email.com' AND s.name = 'React';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'sarah.johnson@email.com' AND s.name = 'Node.js';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 3 FROM applicants a, skills s
WHERE a.email = 'sarah.johnson@email.com' AND s.name = 'Python';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'sarah.johnson@email.com' AND s.name = 'PostgreSQL';

-- Michael Chen - Product Manager
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 10 FROM applicants a, skills s
WHERE a.email = 'michael.chen@email.com' AND s.name = 'Project Management';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 12 FROM applicants a, skills s
WHERE a.email = 'michael.chen@email.com' AND s.name = 'Communication';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 8 FROM applicants a, skills s
WHERE a.email = 'michael.chen@email.com' AND s.name = 'Leadership';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'intermediate', 5 FROM applicants a, skills s
WHERE a.email = 'michael.chen@email.com' AND s.name = 'Jira';

-- Emily Rodriguez - UX Designer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 5 FROM applicants a, skills s
WHERE a.email = 'emily.rodriguez@email.com' AND s.name = 'Figma';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 3 FROM applicants a, skills s
WHERE a.email = 'emily.rodriguez@email.com' AND s.name = 'JavaScript';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 5 FROM applicants a, skills s
WHERE a.email = 'emily.rodriguez@email.com' AND s.name = 'Communication';

-- James Williams - DevOps Engineer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 5 FROM applicants a, skills s
WHERE a.email = 'james.williams@email.com' AND s.name = 'AWS';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 4 FROM applicants a, skills s
WHERE a.email = 'james.williams@email.com' AND s.name = 'Kubernetes';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 5 FROM applicants a, skills s
WHERE a.email = 'james.williams@email.com' AND s.name = 'Docker';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 3 FROM applicants a, skills s
WHERE a.email = 'james.williams@email.com' AND s.name = 'Terraform';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'james.williams@email.com' AND s.name = 'Python';

-- Aisha Patel - Data Scientist
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 6 FROM applicants a, skills s
WHERE a.email = 'aisha.patel@email.com' AND s.name = 'Python';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 4 FROM applicants a, skills s
WHERE a.email = 'aisha.patel@email.com' AND s.name = 'Problem Solving';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 3 FROM applicants a, skills s
WHERE a.email = 'aisha.patel@email.com' AND s.name = 'PostgreSQL';

-- David Kim - Frontend Developer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'intermediate', 2 FROM applicants a, skills s
WHERE a.email = 'david.kim@email.com' AND s.name = 'JavaScript';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'intermediate', 2 FROM applicants a, skills s
WHERE a.email = 'david.kim@email.com' AND s.name = 'React';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'beginner', 1 FROM applicants a, skills s
WHERE a.email = 'david.kim@email.com' AND s.name = 'TypeScript';

-- Robert Taylor - Senior Software Engineer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 8 FROM applicants a, skills s
WHERE a.email = 'robert.taylor@email.com' AND s.name = 'Java';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 6 FROM applicants a, skills s
WHERE a.email = 'robert.taylor@email.com' AND s.name = 'Python';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'robert.taylor@email.com' AND s.name = 'AWS';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 5 FROM applicants a, skills s
WHERE a.email = 'robert.taylor@email.com' AND s.name = 'PostgreSQL';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 10 FROM applicants a, skills s
WHERE a.email = 'robert.taylor@email.com' AND s.name = 'Problem Solving';

-- Lisa Anderson - QA Engineer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'lisa.anderson@email.com' AND s.name = 'Python';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 3 FROM applicants a, skills s
WHERE a.email = 'lisa.anderson@email.com' AND s.name = 'JavaScript';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 5 FROM applicants a, skills s
WHERE a.email = 'lisa.anderson@email.com' AND s.name = 'Git';

-- Thomas Brown - Sales Engineer
INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'expert', 6 FROM applicants a, skills s
WHERE a.email = 'thomas.brown@email.com' AND s.name = 'Communication';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'advanced', 4 FROM applicants a, skills s
WHERE a.email = 'thomas.brown@email.com' AND s.name = 'AWS';

INSERT INTO applicant_skills (applicant_id, skill_id, proficiency_level, years_used)
SELECT a.id, s.id, 'intermediate', 3 FROM applicants a, skills s
WHERE a.email = 'thomas.brown@email.com' AND s.name = 'Python';

-- =====================================================
-- 7. INSERT INTERVIEWS
-- =====================================================
-- Sarah Johnson - interviewing
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 1, 'Alex Thompson', 'alex.thompson@company.com', 'phone-screen', '2024-02-15 10:00:00', 30, 'Zoom', 'completed',
'Strong communication skills. Good understanding of distributed systems. Recommended to proceed.', 4, 'yes'
FROM applicants a WHERE a.email = 'sarah.johnson@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 1, 'Jennifer Lee', 'jennifer.lee@company.com', 'technical', '2024-02-20 14:00:00', 60, 'Zoom', 'completed',
'Excellent system design skills. Solved complex algorithm problem efficiently. Very impressive technical depth.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'sarah.johnson@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 1, 'Mark Wilson', 'mark.wilson@company.com', 'behavioral', '2024-02-25 11:00:00', 45, 'Conference Room A', 'scheduled',
NULL, NULL, NULL
FROM applicants a WHERE a.email = 'sarah.johnson@email.com';

-- Michael Chen - offered
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 2, 'Sarah Miller', 'sarah.miller@company.com', 'phone-screen', '2024-02-10 09:00:00', 30, 'Phone', 'completed',
'Great background in product management. Clear communication style.', 4, 'yes'
FROM applicants a WHERE a.email = 'michael.chen@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 2, 'David Chen', 'david.chen@company.com', 'behavioral', '2024-02-14 15:00:00', 60, 'Zoom', 'completed',
'Demonstrated strong leadership. Good examples of cross-functional collaboration.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'michael.chen@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 2, 'CEO Panel', 'hiring@company.com', 'final', '2024-02-18 10:00:00', 90, 'HQ Office', 'completed',
'Perfect culture fit. Strong strategic thinking. Extending offer.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'michael.chen@email.com';

-- Aisha Patel - interviewing
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 5, 'Dr. James Liu', 'james.liu@company.com', 'phone-screen', '2024-02-12 13:00:00', 30, 'Zoom', 'completed',
'Impressive research background. Published in top venues. Strong theoretical foundation.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'aisha.patel@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 5, 'ML Team', 'ml-hiring@company.com', 'technical', '2024-02-22 10:00:00', 120, 'Conference Room B', 'scheduled',
NULL, NULL, NULL
FROM applicants a WHERE a.email = 'aisha.patel@email.com';

-- Robert Taylor - interviewing
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 1, 'Alex Thompson', 'alex.thompson@company.com', 'phone-screen', '2024-02-16 11:00:00', 30, 'Phone', 'completed',
'Very experienced. Strong system design background from Amazon.', 4, 'yes'
FROM applicants a WHERE a.email = 'robert.taylor@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 1, 'Engineering Team', 'eng-hiring@company.com', 'technical', '2024-02-28 14:00:00', 90, 'Zoom', 'scheduled',
NULL, NULL, NULL
FROM applicants a WHERE a.email = 'robert.taylor@email.com';

-- Thomas Brown - offered
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 9, 'VP Sales', 'vp.sales@company.com', 'phone-screen', '2024-02-08 10:00:00', 30, 'Phone', 'completed',
'Strong presentation skills. Good technical depth.', 4, 'yes'
FROM applicants a WHERE a.email = 'thomas.brown@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 9, 'Sales Team', 'sales-hiring@company.com', 'technical', '2024-02-12 14:00:00', 60, 'Zoom', 'completed',
'Demo was excellent. Handled technical questions well.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'thomas.brown@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 9, 'CRO', 'cro@company.com', 'final', '2024-02-16 11:00:00', 45, 'HQ Office', 'completed',
'Great fit for the team. Making offer.', 5, 'strong-yes'
FROM applicants a WHERE a.email = 'thomas.brown@email.com';

-- David Kim - rejected (had interviews)
INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 6, 'Frontend Lead', 'frontend.lead@company.com', 'phone-screen', '2024-02-05 10:00:00', 30, 'Zoom', 'completed',
'Good communication. Some gaps in TypeScript knowledge.', 3, 'neutral'
FROM applicants a WHERE a.email = 'david.kim@email.com';

INSERT INTO interviews (applicant_id, job_id, interviewer_name, interviewer_email, interview_type, scheduled_at, duration, location, status, feedback, rating, recommendation)
SELECT a.id, 6, 'Senior Engineer', 'senior.eng@company.com', 'technical', '2024-02-08 14:00:00', 60, 'Zoom', 'completed',
'Struggled with complex React patterns. Needs more experience with modern frameworks.', 2, 'no'
FROM applicants a WHERE a.email = 'david.kim@email.com';

-- =====================================================
-- 8. INSERT DOCUMENTS
-- =====================================================
INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Sarah Johnson Resume.pdf', 'resume', 'https://storage.example.com/resumes/sarah-johnson.pdf'
FROM applicants WHERE email = 'sarah.johnson@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Sarah Johnson Cover Letter.pdf', 'cover-letter', 'https://storage.example.com/cover-letters/sarah-johnson.pdf'
FROM applicants WHERE email = 'sarah.johnson@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Michael Chen Resume.pdf', 'resume', 'https://storage.example.com/resumes/michael-chen.pdf'
FROM applicants WHERE email = 'michael.chen@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Emily Rodriguez Resume.pdf', 'resume', 'https://storage.example.com/resumes/emily-rodriguez.pdf'
FROM applicants WHERE email = 'emily.rodriguez@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Emily Rodriguez Portfolio.pdf', 'portfolio', 'https://storage.example.com/portfolios/emily-rodriguez.pdf'
FROM applicants WHERE email = 'emily.rodriguez@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'James Williams Resume.pdf', 'resume', 'https://storage.example.com/resumes/james-williams.pdf'
FROM applicants WHERE email = 'james.williams@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'AWS Certification.pdf', 'certificate', 'https://storage.example.com/certs/james-williams-aws.pdf'
FROM applicants WHERE email = 'james.williams@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Kubernetes Certification.pdf', 'certificate', 'https://storage.example.com/certs/james-williams-k8s.pdf'
FROM applicants WHERE email = 'james.williams@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Aisha Patel Resume.pdf', 'resume', 'https://storage.example.com/resumes/aisha-patel.pdf'
FROM applicants WHERE email = 'aisha.patel@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Research Publications.pdf', 'portfolio', 'https://storage.example.com/portfolios/aisha-patel-publications.pdf'
FROM applicants WHERE email = 'aisha.patel@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'David Kim Resume.pdf', 'resume', 'https://storage.example.com/resumes/david-kim.pdf'
FROM applicants WHERE email = 'david.kim@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Maria Garcia Resume.pdf', 'resume', 'https://storage.example.com/resumes/maria-garcia.pdf'
FROM applicants WHERE email = 'maria.garcia@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Robert Taylor Resume.pdf', 'resume', 'https://storage.example.com/resumes/robert-taylor.pdf'
FROM applicants WHERE email = 'robert.taylor@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Lisa Anderson Resume.pdf', 'resume', 'https://storage.example.com/resumes/lisa-anderson.pdf'
FROM applicants WHERE email = 'lisa.anderson@email.com';

INSERT INTO documents (applicant_id, name, type, url)
SELECT id, 'Thomas Brown Resume.pdf', 'resume', 'https://storage.example.com/resumes/thomas-brown.pdf'
FROM applicants WHERE email = 'thomas.brown@email.com';
