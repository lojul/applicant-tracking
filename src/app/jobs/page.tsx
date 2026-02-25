'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Job = {
  id: number;
  title: string;
  department: string | null;
  description: string | null;
  requirements: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string | null;
  isRemote: boolean | null;
  employmentType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  open: { color: '#10b981', label: 'Open' },
  closed: { color: '#ef4444', label: 'Closed' },
  'on-hold': { color: '#f59e0b', label: 'On Hold' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const loadJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
    };

    try {
      if (editingJob) {
        await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setShowForm(false);
      setEditingJob(null);
      resetForm();
      loadJobs();
    } catch (err) {
      console.error('Error saving job:', err);
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

    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      loadJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
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
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Job Listings
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              href="/"
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                setEditingJob(null);
                resetForm();
                setShowForm(true);
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              + Add New Job
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Job Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Min Salary ($)
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Max Salary ($)
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Employment Type
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isRemote}
                        onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: '500' }}>Remote Position</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                      }}
                    >
                      {editingJob ? 'Update Job' : 'Create Job'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingJob(null);
                        resetForm();
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              {searchTerm || statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs posted yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                        {job.title}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: STATUS_CONFIG[job.status]?.color + '20',
                        color: STATUS_CONFIG[job.status]?.color || '#6b7280',
                      }}>
                        {STATUS_CONFIG[job.status]?.label || job.status}
                      </span>
                      {job.isRemote && (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: '#3b82f620',
                          color: '#3b82f6',
                        }}>
                          Remote
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '1.5rem',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}>
                      {job.department && <span>📁 {job.department}</span>}
                      {job.location && <span>📍 {job.location}</span>}
                      <span>💼 {job.employmentType || 'Full-time'}</span>
                      <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>

                    {job.description && (
                      <p style={{
                        color: '#4b5563',
                        marginBottom: '0.75rem',
                        lineHeight: '1.5',
                      }}>
                        {job.description.length > 200
                          ? job.description.substring(0, 200) + '...'
                          : job.description}
                      </p>
                    )}

                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button
                      onClick={() => handleEdit(job)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
