-- Sample job listings for the applicant tracking system
INSERT INTO jobs (title, department, description, requirements, salary_min, salary_max, location, is_remote, employment_type, status, created_at, updated_at)
VALUES
(
  'Senior Full Stack Engineer',
  'Engineering',
  'We are looking for an experienced Full Stack Engineer to join our growing engineering team. You will be responsible for building and maintaining our web applications, working with modern technologies like React, Node.js, and PostgreSQL.',
  'Requirements:
- 5+ years of experience in full stack development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with PostgreSQL or similar relational databases
- Familiarity with cloud platforms (AWS, GCP, or Azure)
- Excellent problem-solving and communication skills
- Bachelor''s degree in Computer Science or equivalent experience',
  120000,
  180000,
  'San Francisco, CA',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Product Manager',
  'Product',
  'Join our product team to help shape the future of our platform. You will work closely with engineering, design, and stakeholders to define product strategy and deliver exceptional user experiences.',
  'Requirements:
- 3+ years of product management experience
- Strong analytical and problem-solving skills
- Experience with Agile/Scrum methodologies
- Excellent communication and stakeholder management
- Data-driven decision making
- Bachelor''s degree required, MBA preferred',
  110000,
  150000,
  'New York, NY',
  false,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'UX/UI Designer',
  'Design',
  'We are seeking a talented UX/UI Designer to create beautiful and intuitive user experiences. You will collaborate with product managers and engineers to design user-centered solutions.',
  'Requirements:
- 3+ years of UX/UI design experience
- Proficiency in Figma, Sketch, or similar design tools
- Strong portfolio demonstrating design process and outcomes
- Understanding of user research and usability testing
- Knowledge of design systems and component libraries
- Excellent communication and collaboration skills',
  90000,
  130000,
  'Austin, TX',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'DevOps Engineer',
  'Engineering',
  'Looking for a DevOps Engineer to manage our infrastructure and CI/CD pipelines. You will ensure our systems are reliable, scalable, and secure.',
  'Requirements:
- 4+ years of DevOps/Infrastructure experience
- Strong knowledge of Docker, Kubernetes, and containerization
- Experience with AWS, GCP, or Azure
- Proficiency in Infrastructure as Code (Terraform, CloudFormation)
- Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)
- Strong scripting skills (Python, Bash, or similar)',
  130000,
  170000,
  'Seattle, WA',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Data Analyst',
  'Data & Analytics',
  'Join our data team to help transform data into actionable insights. You will work with stakeholders across the organization to support data-driven decision making.',
  'Requirements:
- 2+ years of data analysis experience
- Strong SQL skills and experience with data visualization tools (Tableau, Looker, Power BI)
- Proficiency in Python or R for data analysis
- Understanding of statistical methods and A/B testing
- Strong communication skills to present findings to non-technical audiences
- Bachelor''s degree in a quantitative field',
  80000,
  110000,
  'Remote',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Frontend Developer',
  'Engineering',
  'We need a passionate Frontend Developer to build responsive and performant user interfaces. You will work with React and modern frontend technologies.',
  'Requirements:
- 3+ years of frontend development experience
- Expert knowledge of React, JavaScript/TypeScript, HTML, and CSS
- Experience with state management (Redux, MobX, or similar)
- Understanding of responsive design and cross-browser compatibility
- Familiarity with testing frameworks (Jest, React Testing Library)
- Strong attention to detail and user experience',
  100000,
  140000,
  'Boston, MA',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Marketing Coordinator',
  'Marketing',
  'Support our marketing team in executing campaigns, managing social media, and coordinating events. This is a great opportunity for someone looking to grow their marketing career.',
  'Requirements:
- 1-2 years of marketing experience
- Strong writing and communication skills
- Familiarity with social media platforms and marketing tools
- Basic understanding of digital marketing and SEO
- Highly organized with strong attention to detail
- Bachelor''s degree in Marketing, Communications, or related field',
  55000,
  75000,
  'Chicago, IL',
  false,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Customer Success Manager',
  'Customer Success',
  'Help our customers achieve their goals by providing exceptional support and guidance. You will build strong relationships and ensure customer satisfaction.',
  'Requirements:
- 2+ years of customer success or account management experience
- Excellent communication and interpersonal skills
- Problem-solving mindset and proactive approach
- Experience with CRM tools (Salesforce, HubSpot, etc.)
- Ability to manage multiple accounts simultaneously
- Bachelor''s degree preferred',
  70000,
  95000,
  'Remote',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'QA Engineer',
  'Engineering',
  'Join our quality assurance team to ensure our products meet the highest standards. You will design and execute test plans, identify bugs, and work closely with developers.',
  'Requirements:
- 3+ years of QA/testing experience
- Experience with automated testing tools (Selenium, Cypress, etc.)
- Strong understanding of testing methodologies and best practices
- Familiarity with API testing and performance testing
- Excellent analytical and debugging skills
- Knowledge of Agile development processes',
  85000,
  115000,
  'Denver, CO',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Software Engineering Intern',
  'Engineering',
  'Summer internship program for students passionate about software development. Work on real projects alongside experienced engineers and learn cutting-edge technologies.',
  'Requirements:
- Currently pursuing a degree in Computer Science or related field
- Strong programming fundamentals in at least one language
- Enthusiasm for learning and problem-solving
- Good communication and teamwork skills
- Previous internship or project experience is a plus
- Available for 12-week summer program',
  25,
  35,
  'San Francisco, CA',
  false,
  'internship',
  'open',
  NOW(),
  NOW()
),
(
  'Senior Backend Engineer',
  'Engineering',
  'Looking for an experienced backend engineer to build scalable and reliable APIs and services. You will architect solutions and mentor junior engineers.',
  'Requirements:
- 6+ years of backend development experience
- Expert knowledge of Node.js, Python, or Java
- Strong database design skills (PostgreSQL, MongoDB, etc.)
- Experience with microservices architecture
- Knowledge of message queues and event-driven systems
- Leadership and mentoring experience',
  140000,
  190000,
  'New York, NY',
  true,
  'full-time',
  'open',
  NOW(),
  NOW()
),
(
  'Technical Writer',
  'Documentation',
  'Create comprehensive technical documentation for our products and APIs. Help developers and users understand and effectively use our platform.',
  'Requirements:
- 2+ years of technical writing experience
- Strong writing and editing skills
- Ability to understand and explain complex technical concepts
- Familiarity with documentation tools (Markdown, GitBook, etc.)
- Basic understanding of software development
- Bachelor''s degree in English, Technical Communication, or related field',
  70000,
  95000,
  'Remote',
  true,
  'full-time',
  'on-hold',
  NOW(),
  NOW()
);
