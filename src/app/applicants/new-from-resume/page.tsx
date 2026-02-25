'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { ExtractedResumeData, ExtractedEducation, ExtractedWorkExperience, ExtractedSkill } from '@/lib/types/resume';

type Step = 'upload' | 'processing' | 'review';

const SKILL_CATEGORIES = ['programming', 'framework', 'tool', 'soft-skill', 'other'] as const;
const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

export default function NewFromResumePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'education' | 'experience' | 'skills'>('basic');
  const [saving, setSaving] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setStep('processing');

    try {
      // Step 1: Upload PDF
      setProcessingStatus('Uploading resume...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const { url } = await uploadRes.json();
      setResumeUrl(url);

      // Step 2: Extract text from PDF
      setProcessingStatus('Extracting text from PDF...');
      const parseRes = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!parseRes.ok) {
        const data = await parseRes.json();
        throw new Error(data.error || 'Failed to parse PDF');
      }

      const { text } = await parseRes.json();

      // Step 3: AI extraction
      setProcessingStatus('AI analyzing resume...');
      const extractRes = await fetch('/api/resume/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!extractRes.ok) {
        const data = await extractRes.json();
        throw new Error(data.error || 'Failed to extract data');
      }

      const extracted: ExtractedResumeData = await extractRes.json();
      setExtractedData(extracted);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('upload');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processFile(file);
    } else {
      setError('Please upload a PDF file');
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const updateBasicField = (field: keyof ExtractedResumeData, value: string | number | null) => {
    if (!extractedData) return;
    setExtractedData({ ...extractedData, [field]: value });
  };

  const updateEducation = (index: number, field: keyof ExtractedEducation, value: string | number | null) => {
    if (!extractedData) return;
    const newEducation = [...extractedData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setExtractedData({ ...extractedData, education: newEducation });
  };

  const addEducation = () => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      education: [...extractedData.education, {
        institution: '',
        degree: null,
        fieldOfStudy: null,
        graduationYear: null,
        gpa: null,
      }],
    });
  };

  const removeEducation = (index: number) => {
    if (!extractedData) return;
    const newEducation = extractedData.education.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, education: newEducation });
  };

  const updateWorkExperience = (index: number, field: keyof ExtractedWorkExperience, value: string | boolean | null) => {
    if (!extractedData) return;
    const newExperience = [...extractedData.workExperience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExtractedData({ ...extractedData, workExperience: newExperience });
  };

  const addWorkExperience = () => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      workExperience: [...extractedData.workExperience, {
        company: '',
        title: '',
        startDate: null,
        endDate: null,
        isCurrent: false,
        description: null,
        location: null,
      }],
    });
  };

  const removeWorkExperience = (index: number) => {
    if (!extractedData) return;
    const newExperience = extractedData.workExperience.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, workExperience: newExperience });
  };

  const updateSkill = (index: number, field: keyof ExtractedSkill, value: string | number | null) => {
    if (!extractedData) return;
    const newSkills = [...extractedData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value } as ExtractedSkill;
    setExtractedData({ ...extractedData, skills: newSkills });
  };

  const addSkill = () => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      skills: [...extractedData.skills, {
        name: '',
        category: 'other',
        proficiencyLevel: null,
        yearsUsed: null,
      }],
    });
  };

  const removeSkill = (index: number) => {
    if (!extractedData) return;
    const newSkills = extractedData.skills.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, skills: newSkills });
  };

  const handleSave = async () => {
    if (!extractedData) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: extractedData.name,
        email: extractedData.email || '',
        phone: extractedData.phone,
        location: extractedData.location,
        linkedinUrl: extractedData.linkedinUrl,
        portfolioUrl: extractedData.portfolioUrl,
        currentCompany: extractedData.currentCompany,
        currentTitle: extractedData.currentTitle,
        yearsOfExperience: extractedData.yearsOfExperience,
        resumeUrl: resumeUrl,
        source: 'company-website',
        status: 'applied',
        education: extractedData.education.filter(e => e.institution),
        workExperience: extractedData.workExperience.filter(e => e.company && e.title),
        skills: extractedData.skills.filter(s => s.name),
      };

      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save applicant');
      }

      const applicant = await res.json();
      router.push(`/applicants/${applicant.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save applicant');
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500' as const,
    color: '#374151',
  };

  const cardStyle = {
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link
              href="/applicants"
              style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              ← Back to Candidates
            </Link>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
            Upload Resume
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Upload a PDF resume and we&apos;ll automatically extract candidate information using AI
          </p>
        </div>

        <Card padding="none" style={{ overflow: 'hidden' }}>

          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}>
            {['upload', 'processing', 'review'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: step === 'review' || (step === 'processing' && i === 1) ? '#3b82f6' : '#e5e7eb',
                  }} />
                )}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      step === s ? '#3b82f6' :
                      (step === 'processing' && s === 'upload') || (step === 'review') ? '#10b981' : '#e5e7eb',
                    color:
                      step === s || (step === 'processing' && s === 'upload') || (step === 'review') ? 'white' : '#6b7280',
                    fontWeight: '600',
                  }}>
                    {(step === 'processing' && s === 'upload') || (step === 'review' && s !== 'review') ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: step === s ? '#3b82f6' : '#6b7280',
                    textTransform: 'capitalize',
                  }}>
                    {s}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              margin: '1rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          {/* Step Content */}
          <div style={{ padding: '2rem' }}>
            {/* Upload Step */}
            {step === 'upload' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '3rem',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#eff6ff' : 'white',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div style={{ marginBottom: '1rem' }}>
                  <svg
                    style={{ width: '48px', height: '48px', margin: '0 auto', color: '#9ca3af' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Drag and drop your PDF resume here
                </p>
                <p style={{ color: '#6b7280' }}>
                  or <span style={{ color: '#3b82f6', fontWeight: '500' }}>click to browse</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>
                  PDF files only, max 10MB
                </p>
              </div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  animation: 'spin 1s linear infinite',
                }} />
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151' }}>
                  {processingStatus}
                </p>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                  This may take a few seconds
                </p>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && extractedData && (
              <div>
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '1.5rem',
                }}>
                  {[
                    { id: 'basic', label: 'Basic Info' },
                    { id: 'education', label: `Education (${extractedData.education.length})` },
                    { id: 'experience', label: `Experience (${extractedData.workExperience.length})` },
                    { id: 'skills', label: `Skills (${extractedData.skills.length})` },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                        borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Name *</label>
                      <input
                        type="text"
                        value={extractedData.name}
                        onChange={(e) => updateBasicField('name', e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        value={extractedData.email || ''}
                        onChange={(e) => updateBasicField('email', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input
                        type="tel"
                        value={extractedData.phone || ''}
                        onChange={(e) => updateBasicField('phone', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input
                        type="text"
                        value={extractedData.location || ''}
                        onChange={(e) => updateBasicField('location', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Experience</label>
                      <input
                        type="number"
                        min="0"
                        value={extractedData.yearsOfExperience || ''}
                        onChange={(e) => updateBasicField('yearsOfExperience', e.target.value ? parseInt(e.target.value) : null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Current Company</label>
                      <input
                        type="text"
                        value={extractedData.currentCompany || ''}
                        onChange={(e) => updateBasicField('currentCompany', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Current Title</label>
                      <input
                        type="text"
                        value={extractedData.currentTitle || ''}
                        onChange={(e) => updateBasicField('currentTitle', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>LinkedIn URL</label>
                      <input
                        type="url"
                        value={extractedData.linkedinUrl || ''}
                        onChange={(e) => updateBasicField('linkedinUrl', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Portfolio URL</label>
                      <input
                        type="url"
                        value={extractedData.portfolioUrl || ''}
                        onChange={(e) => updateBasicField('portfolioUrl', e.target.value || null)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div>
                    {extractedData.education.map((edu, index) => (
                      <div key={index} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', color: '#374151' }}>Education {index + 1}</h4>
                          <button
                            onClick={() => removeEducation(index)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Institution *</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Degree</label>
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value || null)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Field of Study</label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy || ''}
                              onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value || null)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Graduation Year</label>
                            <input
                              type="number"
                              min="1950"
                              max="2030"
                              value={edu.graduationYear || ''}
                              onChange={(e) => updateEducation(index, 'graduationYear', e.target.value ? parseInt(e.target.value) : null)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>GPA</label>
                            <input
                              type="text"
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(index, 'gpa', e.target.value || null)}
                              style={inputStyle}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addEducation}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      + Add Education
                    </button>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div>
                    {extractedData.workExperience.map((exp, index) => (
                      <div key={index} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', color: '#374151' }}>Experience {index + 1}</h4>
                          <button
                            onClick={() => removeWorkExperience(index)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={labelStyle}>Company *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Title *</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Start Date</label>
                            <input
                              type="date"
                              value={exp.startDate || ''}
                              onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value || null)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>End Date</label>
                            <input
                              type="date"
                              value={exp.endDate || ''}
                              onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value || null)}
                              style={inputStyle}
                              disabled={exp.isCurrent}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Location</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => updateWorkExperience(index, 'location', e.target.value || null)}
                              style={inputStyle}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={exp.isCurrent}
                                onChange={(e) => updateWorkExperience(index, 'isCurrent', e.target.checked)}
                                style={{ width: '1rem', height: '1rem' }}
                              />
                              Current Position
                            </label>
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                              value={exp.description || ''}
                              onChange={(e) => updateWorkExperience(index, 'description', e.target.value || null)}
                              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addWorkExperience}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      + Add Experience
                    </button>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      {extractedData.skills.map((skill, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                        }}>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                            placeholder="Skill name"
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              width: '120px',
                              fontSize: '0.875rem',
                            }}
                          />
                          <select
                            value={skill.category}
                            onChange={(e) => updateSkill(index, 'category', e.target.value)}
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                            }}
                          >
                            {SKILL_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <select
                            value={skill.proficiencyLevel || ''}
                            onChange={(e) => updateSkill(index, 'proficiencyLevel', e.target.value || null)}
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                            }}
                          >
                            <option value="">Level</option>
                            {PROFICIENCY_LEVELS.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeSkill(index)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              fontSize: '1rem',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addSkill}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      + Add Skill
                    </button>
                  </div>
                )}

                {/* Save Button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e5e7eb',
                }}>
                  <button
                    onClick={() => {
                      setStep('upload');
                      setExtractedData(null);
                      setResumeUrl(null);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !extractedData.name}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Applicant'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
