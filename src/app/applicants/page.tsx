'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Applicant = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  position?: string;
  notes?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  currentCompany?: string;
  currentTitle?: string;
  location?: string;
  source?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
};

const STATUSES = ['applied', 'interviewing', 'offered', 'rejected', 'hired'];
const SOURCES = ['linkedin', 'indeed', 'referral', 'company-website', 'recruiter', 'other'];

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'applied',
    position: '',
    notes: '',
    yearsOfExperience: '',
    expectedSalary: '',
    currentCompany: '',
    currentTitle: '',
    location: '',
    source: '',
    referredBy: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
  });

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await fetch('/api/applicants');
      const data = await res.json();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
      expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/applicants/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await fetchApplicants();
          resetForm();
        }
      } else {
        const res = await fetch('/api/applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await fetchApplicants();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving applicant:', error);
    }
  };

  const handleEdit = (applicant: Applicant) => {
    setEditingId(applicant.id);
    setFormData({
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone || '',
      status: applicant.status,
      position: applicant.position || '',
      notes: applicant.notes || '',
      yearsOfExperience: applicant.yearsOfExperience?.toString() || '',
      expectedSalary: applicant.expectedSalary?.toString() || '',
      currentCompany: applicant.currentCompany || '',
      currentTitle: applicant.currentTitle || '',
      location: applicant.location || '',
      source: applicant.source || '',
      referredBy: '',
      linkedinUrl: applicant.linkedinUrl || '',
      portfolioUrl: '',
      resumeUrl: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this applicant?')) return;

    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchApplicants();
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'applied',
      position: '',
      notes: '',
      yearsOfExperience: '',
      expectedSalary: '',
      currentCompany: '',
      currentTitle: '',
      location: '',
      source: '',
      referredBy: '',
      linkedinUrl: '',
      portfolioUrl: '',
      resumeUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: '#3b82f6',
      interviewing: '#f59e0b',
      offered: '#10b981',
      rejected: '#ef4444',
      hired: '#8b5cf6',
    };
    return colors[status] || '#6b7280';
  };

  const formatSalary = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      applicant.name.toLowerCase().includes(searchLower) ||
      applicant.email.toLowerCase().includes(searchLower) ||
      (applicant.position?.toLowerCase().includes(searchLower) ?? false) ||
      (applicant.currentCompany?.toLowerCase().includes(searchLower) ?? false) ||
      (applicant.location?.toLowerCase().includes(searchLower) ?? false);

    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || applicant.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
            Applicant Tracking System
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              href="/"
              style={{
                backgroundColor: '#8b5cf6',
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
              onClick={() => setShowForm(true)}
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
              + Add Applicant
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by name, email, position, company, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ minWidth: '150px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: '150px' }}>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Sources</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSourceFilter('all');
              }}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#6b7280',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div style={{
          marginBottom: '1rem',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}>
          Showing {filteredApplicants.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {editingId ? 'Edit Applicant' : 'Add New Applicant'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Basic Info */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                      Basic Information
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  {/* Current Employment */}
                  <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                      Current Employment
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Company</label>
                    <input
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Title</label>
                    <input
                      type="text"
                      value={formData.currentTitle}
                      onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Salary (USD)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  {/* Application Details */}
                  <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                      Application Details
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    >
                      <option value="">Select source...</option>
                      {SOURCES.map((source) => (
                        <option key={source} value={source}>
                          {source.charAt(0).toUpperCase() + source.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Referred By</label>
                    <input
                      type="text"
                      value={formData.referredBy}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                      placeholder="Name of referrer"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  {/* Links */}
                  <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                      Links
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Portfolio URL</label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Resume URL</label>
                    <input
                      type="url"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
                    />
                  </div>

                  {/* Notes */}
                  <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {applicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem' }}>No applicants yet. Add your first applicant to get started!</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem' }}>No applicants match your search criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSourceFilter('all'); }}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Position</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Company</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Experience</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Salary</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Source</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <Link
                        href={`/applicants/${applicant.id}`}
                        style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                      >
                        {applicant.name}
                      </Link>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{applicant.email}</p>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{applicant.position || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {applicant.currentCompany || '-'}
                      {applicant.location && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{applicant.location}</p>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {applicant.yearsOfExperience ? `${applicant.yearsOfExperience} yrs` : '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {formatSalary(applicant.expectedSalary)}
                    </td>
                    <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>
                      {applicant.source?.replace('-', ' ') || '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(applicant.status) + '20',
                        color: getStatusColor(applicant.status),
                      }}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        <Link
                          href={`/applicants/${applicant.id}`}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEdit(applicant)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(applicant.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
