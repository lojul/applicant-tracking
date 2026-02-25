#!/bin/bash

echo "🌱 Starting to seed applicants..."
echo ""

# Array of sample applicants
declare -a applicants=(
  '{"name":"Sarah Johnson","email":"sarah.johnson@email.com","phone":"+1 (555) 123-4567","position":"Senior Software Engineer","status":"interviewing","notes":"Strong background in React and Node.js. Previous experience at Google. Completed technical assessment with excellent results."}'
  '{"name":"Michael Chen","email":"michael.chen@email.com","phone":"+1 (555) 234-5678","position":"Product Manager","status":"offered","notes":"10+ years of product management experience. Led successful product launches at Microsoft. Strong communication skills."}'
  '{"name":"Emily Rodriguez","email":"emily.rodriguez@email.com","phone":"+1 (555) 345-6789","position":"UX Designer","status":"hired","notes":"Exceptional portfolio. Experience with Figma and Adobe Creative Suite. Started on March 1st."}'
  '{"name":"James Williams","email":"james.williams@email.com","phone":"+1 (555) 456-7890","position":"DevOps Engineer","status":"applied","notes":"AWS and Kubernetes certifications. Strong automation skills. Awaiting initial screening."}'
  '{"name":"Aisha Patel","email":"aisha.patel@email.com","phone":"+1 (555) 567-8901","position":"Data Scientist","status":"interviewing","notes":"PhD in Machine Learning. Published research papers. Currently in second round of interviews."}'
  '{"name":"David Kim","email":"david.kim@email.com","phone":"","position":"Frontend Developer","status":"rejected","notes":"Good technical skills but looking for more experience with TypeScript and modern frameworks."}'
  '{"name":"Maria Garcia","email":"maria.garcia@email.com","phone":"+1 (555) 678-9012","position":"Marketing Manager","status":"applied","notes":"B2B SaaS marketing experience. Strong track record of lead generation campaigns."}'
  '{"name":"Robert Taylor","email":"robert.taylor@email.com","phone":"+1 (555) 789-0123","position":"Senior Software Engineer","status":"interviewing","notes":"Backend specialist with Java and Python. Great system design skills. Scheduled for final interview next week."}'
  '{"name":"Lisa Anderson","email":"lisa.anderson@email.com","phone":"","position":"QA Engineer","status":"applied","notes":"Automation testing expert. Selenium and Cypress experience. Resume looks promising."}'
  '{"name":"Thomas Brown","email":"thomas.brown@email.com","phone":"+1 (555) 890-1234","position":"Sales Engineer","status":"offered","notes":"Technical background with strong presentation skills. Waiting for candidate response on offer."}'
)

# Create each applicant
for applicant in "${applicants[@]}"; do
  name=$(echo $applicant | grep -o '"name":"[^"]*"' | cut -d'"' -f4)

  response=$(vercel curl -X POST https://applicant-tracking-dt3e6tjws-lojuls-projects.vercel.app/api/applicants \
    -H "Content-Type: application/json" \
    -d "$applicant" 2>&1)

  if [ $? -eq 0 ]; then
    echo "✅ Created: $name"
  else
    echo "❌ Failed to create: $name"
  fi
done

echo ""
echo "✨ Seeding complete!"
