'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button, { IconButton } from '@/components/ui/Button';

interface Job {
  id: number;
  title: string;
  department?: string;
  description?: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  isRemote?: boolean;
  employmentType?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ICONS = {
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  edit: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  users: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  mapPin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  briefcase: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    isRemote: false,
    employmentType: 'full-time',
    status: 'open',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
    };

    const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
    const method = editingJob ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchJobs();
      resetForm();
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department || '',
      description: job.description || '',
      requirements: job.requirements || '',
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      location: job.location || '',
      isRemote: job.isRemote || false,
      employmentType: job.employmentType || 'full-time',
      status: job.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryMin: '',
      salaryMax: '',
      location: '',
      isRemote: false,
      employmentType: 'full-time',
      status: 'open',
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return '—';
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `From ${formatter.format(min)}`;
    if (max) return `Up to ${formatter.format(max)}`;
    return '—';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.375rem',
    fontSize: '0.8125rem',
    fontWeight: '500' as const,
    color: '#374151',
  };

  if (loading) {
    return (
      <AppShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#0284c7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading jobs...</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
              Job Requisitions
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {jobs.filter((j) => j.status === 'open').length} open positions
            </p>
          </div>
          <Button icon={ICONS.plus} onClick={() => setShowForm(true)}>
            Create Job
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          padding: '0.25rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          width: 'fit-content',
        }}
      >
        {['all', 'open', 'on-hold', 'closed'].map((status) => {
          const isActive = statusFilter === status;
          const count = status === 'all' ? jobs.length : jobs.filter((j) => j.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {status === 'all' ? 'All Jobs' : status.replace('-', ' ')}
              <span
                style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '4px',
                  backgroundColor: isActive ? '#0284c7' : '#e2e8f0',
                  color: isActive ? 'white' : '#64748b',
                  fontSize: '0.6875rem',
                  fontWeight: '600',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <Card style={{ marginBottom: '1rem' }} padding="sm">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            maxWidth: '400px',
          }}
        >
          <span style={{ color: '#94a3b8' }}>{ICONS.search}</span>
          <input
            type="text"
            placeholder="Search jobs by title, department, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.875rem',
              color: '#0f172a',
              width: '100%',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.25rem' }}
            >
              {ICONS.x}
            </button>
          )}
        </div>
      </Card>

      {/* Jobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
        {filteredJobs.map((job) => (
          <Card key={job.id} hover>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <Link
                  href={`/jobs/${job.id}`}
                  style={{ textDecoration: 'none', color: '#0f172a', fontWeight: '600', fontSize: '1rem' }}
                >
                  {job.title}
                </Link>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {job.department || 'No department'}
                </p>
              </div>
              <Badge
                variant={job.status === 'open' ? 'success' : job.status === 'on-hold' ? 'warning' : 'default'}
                dot
              >
                {job.status}
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                <span style={{ color: '#94a3b8' }}>{ICONS.mapPin}</span>
                {job.location || 'Remote'} {job.isRemote && '(Remote OK)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                <span style={{ color: '#94a3b8' }}>{ICONS.briefcase}</span>
                {job.employmentType?.replace('-', ' ') || 'Full-time'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>{formatSalary(job.salaryMin, job.salaryMax)}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Posted {formatDate(job.createdAt)}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <IconButton icon={ICONS.users} tooltip="View Candidates" size="sm" />
                <IconButton icon={ICONS.edit} tooltip="Edit" size="sm" onClick={() => handleEdit(job)} />
                <IconButton icon={ICONS.trash} tooltip="Delete" size="sm" onClick={() => handleDelete(job.id)} />
              </div>
            </div>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <Card style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              {searchTerm ? 'No jobs match your search.' : 'No jobs posted yet.'}
            </p>
            <Button onClick={() => setShowForm(true)} icon={ICONS.plus}>
              Create your first job
            </Button>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <Card style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g., Engineering"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Min Salary (USD)</label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g., 100000"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Max Salary (USD)</label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g., 150000"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="open">Open</option>
                    <option value="on-hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Remote position
                  </label>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Describe the role and responsibilities..."
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    placeholder="List the required qualifications..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <Button variant="secondary" type="button" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingJob ? 'Save Changes' : 'Create Job'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
