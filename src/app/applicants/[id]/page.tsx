'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Job = {
  id: number;
  title: string;
  department?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  employmentType?: string;
};

type Education = {
  id: number;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  gpa?: string;
};

type WorkExperience = {
  id: number;
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  location?: string;
};

type Interview = {
  id: number;
  interviewerName?: string;
  interviewType?: string;
  scheduledAt?: string;
  status?: string;
  feedback?: string;
  rating?: number;
  recommendation?: string;
};

type Document = {
  id: number;
  name: string;
  type?: string;
  url: string;
  uploadedAt: string;
};

type Skill = {
  id: number;
  skillName: string;
  category?: string;
  proficiencyLevel?: string;
  yearsUsed?: number;
};

type Applicant = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  position?: string;
  notes?: string;
  jobId?: number;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  currentCompany?: string;
  currentTitle?: string;
  location?: string;
  source?: string;
  referredBy?: string;
  availableStartDate?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  education: Education[];
  workExperience: WorkExperience[];
  interviews: Interview[];
  documents: Document[];
  skills: Skill[];
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  applied: { color: '#3b82f6', label: 'Applied' },
  interviewing: { color: '#f59e0b', label: 'Interviewing' },
  offered: { color: '#10b981', label: 'Offered' },
  rejected: { color: '#ef4444', label: 'Rejected' },
  hired: { color: '#8b5cf6', label: 'Hired' },
};

const INTERVIEW_STATUS_COLORS: Record<string, string> = {
  scheduled: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
  'no-show': '#6b7280',
};

const PROFICIENCY_COLORS: Record<string, string> = {
  beginner: '#94a3b8',
  intermediate: '#3b82f6',
  advanced: '#8b5cf6',
  expert: '#10b981',
};

export default function ApplicantDetail() {
  const params = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetch(`/api/applicants/${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Applicant not found');
          return res.json();
        })
        .then(data => {
          setApplicant(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this applicant?')) return;

    try {
      const res = await fetch(`/api/applicants/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/applicants');
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>
            {error || 'Applicant not found'}
          </p>
          <Link
            href="/applicants"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
            }}
          >
            Back to Applicants
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[applicant.status] || { color: '#6b7280', label: applicant.status };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/applicants"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            &larr; Back to Applicants
          </Link>
        </div>

        {/* Header Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {applicant.name}
                </h1>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: statusConfig.color + '20',
                  color: statusConfig.color,
                }}>
                  {statusConfig.label}
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                {applicant.currentTitle || applicant.position || 'No position specified'}
                {applicant.currentCompany && ` at ${applicant.currentCompany}`}
              </p>
              {applicant.location && (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  {applicant.location}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {applicant.linkedinUrl && (
                <a
                  href={applicant.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0077b5',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  LinkedIn
                </a>
              )}
              {applicant.portfolioUrl && (
                <a
                  href={applicant.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  Portfolio
                </a>
              )}
              {applicant.resumeUrl && (
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  Resume
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            borderTop: '1px solid #e5e7eb',
          }}>
            <div style={{ backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Experience</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>
                {applicant.yearsOfExperience ? `${applicant.yearsOfExperience} years` : 'N/A'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Expected Salary</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>
                {formatSalary(applicant.expectedSalary)}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Source</p>
              <p style={{ fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
                {applicant.source || 'N/A'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Available</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>
                {applicant.availableStartDate ? formatDate(applicant.availableStartDate) : 'Immediately'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            overflowX: 'auto',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem',
                }}>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</h3>
                    <a href={`mailto:${applicant.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {applicant.email}
                    </a>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Phone</h3>
                    <p style={{ color: '#1f2937' }}>
                      {applicant.phone ? (
                        <a href={`tel:${applicant.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                          {applicant.phone}
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Not provided</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Applied On</h3>
                    <p style={{ color: '#1f2937' }}>{formatDate(applicant.createdAt)}</p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Last Updated</h3>
                    <p style={{ color: '#1f2937' }}>{formatDate(applicant.updatedAt)}</p>
                  </div>
                  {applicant.referredBy && (
                    <div>
                      <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Referred By</h3>
                      <p style={{ color: '#1f2937' }}>{applicant.referredBy}</p>
                    </div>
                  )}
                </div>

                {/* Applied Job */}
                {applicant.job && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Applied Position
                    </h3>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      padding: '1rem',
                    }}>
                      <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {applicant.job.title}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {applicant.job.department && `${applicant.job.department} • `}
                        {applicant.job.location}
                        {applicant.job.isRemote && ' (Remote)'}
                      </p>
                      {(applicant.job.salaryMin || applicant.job.salaryMax) && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          Salary: {formatSalary(applicant.job.salaryMin)} - {formatSalary(applicant.job.salaryMax)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {applicant.notes && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Notes
                    </h3>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      padding: '1rem',
                      color: '#374151',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {applicant.notes}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div>
                {/* Work Experience */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    Work Experience
                  </h3>
                  {applicant.workExperience.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No work experience recorded</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {applicant.workExperience.map(exp => (
                        <div key={exp.id} style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          padding: '1rem',
                          borderLeft: exp.isCurrent ? '3px solid #10b981' : '3px solid #e5e7eb',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ fontWeight: '500', color: '#1f2937' }}>{exp.title}</p>
                              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                {exp.company}
                                {exp.location && ` • ${exp.location}`}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                                {' - '}
                                {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              </p>
                              {exp.isCurrent && (
                                <span style={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#10b98120',
                                  color: '#10b981',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '9999px',
                                }}>
                                  Current
                                </span>
                              )}
                            </div>
                          </div>
                          {exp.description && (
                            <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    Education
                  </h3>
                  {applicant.education.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No education recorded</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {applicant.education.map(edu => (
                        <div key={edu.id} style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          padding: '1rem',
                        }}>
                          <p style={{ fontWeight: '500', color: '#1f2937' }}>
                            {edu.degree} in {edu.fieldOfStudy}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {edu.institution}
                            {edu.graduationYear && ` • Class of ${edu.graduationYear}`}
                          </p>
                          {edu.gpa && (
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                {applicant.skills.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>No skills recorded</p>
                ) : (
                  <div>
                    {/* Group skills by category */}
                    {Object.entries(
                      applicant.skills.reduce((acc, skill) => {
                        const category = skill.category || 'Other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill);
                        return acc;
                      }, {} as Record<string, Skill[]>)
                    ).map(([category, categorySkills]) => (
                      <div key={category} style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          textTransform: 'capitalize',
                          marginBottom: '0.75rem',
                        }}>
                          {category}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {categorySkills.map(skill => (
                            <div key={skill.id} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '6px',
                              borderLeft: `3px solid ${PROFICIENCY_COLORS[skill.proficiencyLevel || 'intermediate'] || '#6b7280'}`,
                            }}>
                              <span style={{ fontWeight: '500', color: '#1f2937' }}>{skill.skillName}</span>
                              {skill.proficiencyLevel && (
                                <span style={{
                                  fontSize: '0.75rem',
                                  color: PROFICIENCY_COLORS[skill.proficiencyLevel] || '#6b7280',
                                  textTransform: 'capitalize',
                                }}>
                                  {skill.proficiencyLevel}
                                </span>
                              )}
                              {skill.yearsUsed && (
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                  {skill.yearsUsed}y
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interviews Tab */}
            {activeTab === 'interviews' && (
              <div>
                {applicant.interviews.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>No interviews scheduled</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applicant.interviews.map(interview => (
                      <div key={interview.id} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        padding: '1rem',
                        borderLeft: `3px solid ${INTERVIEW_STATUS_COLORS[interview.status || 'scheduled'] || '#6b7280'}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <p style={{ fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>
                              {interview.interviewType?.replace('-', ' ') || 'Interview'}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {interview.interviewerName && `with ${interview.interviewerName}`}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: (INTERVIEW_STATUS_COLORS[interview.status || 'scheduled'] || '#6b7280') + '20',
                              color: INTERVIEW_STATUS_COLORS[interview.status || 'scheduled'] || '#6b7280',
                              textTransform: 'capitalize',
                            }}>
                              {interview.status}
                            </span>
                            {interview.scheduledAt && (
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                {new Date(interview.scheduledAt).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                        {interview.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rating:</span>
                            <div style={{ display: 'flex', gap: '0.125rem' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} style={{ color: star <= interview.rating! ? '#f59e0b' : '#e5e7eb' }}>
                                  ★
                                </span>
                              ))}
                            </div>
                            {interview.recommendation && (
                              <span style={{
                                marginLeft: '0.5rem',
                                fontSize: '0.75rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: interview.recommendation.includes('yes') ? '#10b98120' : '#ef444420',
                                color: interview.recommendation.includes('yes') ? '#10b981' : '#ef4444',
                                textTransform: 'capitalize',
                              }}>
                                {interview.recommendation.replace('-', ' ')}
                              </span>
                            )}
                          </div>
                        )}
                        {interview.feedback && (
                          <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>
                            {interview.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                {applicant.documents.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>No documents uploaded</p>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem',
                  }}>
                    {applicant.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          padding: '1rem',
                          textDecoration: 'none',
                          border: '1px solid #e5e7eb',
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                      >
                        <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {doc.name}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>
                          {doc.type?.replace('-', ' ') || 'Document'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                          Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}>
            <Link
              href={`/applicants?edit=${applicant.id}`}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Edit Applicant
            </Link>
            <button
              onClick={handleDelete}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
