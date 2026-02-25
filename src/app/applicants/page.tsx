'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import Badge, { StageBadge, AwaitingBadge } from '@/components/ui/Badge';
import Button, { IconButton } from '@/components/ui/Button';
import { MiniPipeline } from '@/components/ui/Pipeline';

interface Applicant {
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
}

const STATUSES = ['applied', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];
const SOURCES = ['linkedin', 'indeed', 'referral', 'company-website', 'recruiter', 'other'];

const ICONS = {
  filter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  upload: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  more: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  edit: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export default function CandidatesPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/applicants')
      .then((r) => r.json())
      .then((data) => setApplicants(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        applicant.name.toLowerCase().includes(searchLower) ||
        applicant.email.toLowerCase().includes(searchLower) ||
        applicant.position?.toLowerCase().includes(searchLower) ||
        applicant.currentCompany?.toLowerCase().includes(searchLower) ||
        applicant.location?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || applicant.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [applicants, searchTerm, statusFilter, sourceFilter]);

  const paginatedApplicants = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredApplicants.slice(start, start + rowsPerPage);
  }, [filteredApplicants, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    const res = await fetch(`/api/applicants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setApplicants((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedApplicants.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSalary = (amount?: number) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const activeFilters = [
    statusFilter !== 'all' && { key: 'status', label: `Status: ${statusFilter}`, clear: () => setStatusFilter('all') },
    sourceFilter !== 'all' && { key: 'source', label: `Source: ${sourceFilter}`, clear: () => setSourceFilter('all') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applicants.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [applicants]);

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
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading candidates...</p>
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
              Candidates
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {filteredApplicants.length} candidates {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' ? 'matching filters' : 'total'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/applicants/new-from-resume">
              <Button variant="secondary" icon={ICONS.upload}>
                Upload Resume
              </Button>
            </Link>
            <Button icon={ICONS.plus}>Add Candidate</Button>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
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
        {['all', ...STATUSES].map((status) => {
          const isActive = statusFilter === status;
          const count = status === 'all' ? applicants.length : statusCounts[status] || 0;

          return (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
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
              {status === 'all' ? 'All' : status}
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

      {/* Filters Card */}
      <Card style={{ marginBottom: '1rem' }} padding="sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              flex: '1',
              minWidth: '300px',
            }}
          >
            <span style={{ color: '#94a3b8' }}>{ICONS.search}</span>
            <input
              type="text"
              placeholder="Search by name, email, company, position..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Source Filter */}
          <div style={{ position: 'relative' }}>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                appearance: 'none',
                padding: '0.5rem 2rem 0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Sources</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
              {ICONS.chevronDown}
            </span>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.5rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#1d4ed8',
                  }}
                >
                  {filter.label}
                  <button
                    onClick={filter.clear}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', padding: 0, display: 'flex' }}
                  >
                    {ICONS.x}
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSourceFilter('all');
                  setSearchTerm('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Table Card */}
      <Card padding="none">
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: '#eff6ff',
              borderBottom: '1px solid #bfdbfe',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1d4ed8' }}>
              {selectedIds.length} selected
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="ghost" size="sm" icon={ICONS.mail}>
                Send Email
              </Button>
              <Button variant="ghost" size="sm" icon={ICONS.trash}>
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
                <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedApplicants.length && paginatedApplicants.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </th>
                {['Candidate', 'Position', 'Stage', 'Source', 'Applied', 'Actions'].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.map((applicant) => {
                const isSelected = selectedIds.includes(applicant.id);
                const needsAction = ['applied', 'interviewing'].includes(applicant.status);

                return (
                  <tr
                    key={applicant.id}
                    style={{
                      backgroundColor: isSelected ? '#f0f9ff' : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(applicant.id, e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <Link
                        href={`/applicants/${applicant.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, hsl(${(applicant.id * 60) % 360}, 70%, 60%) 0%, hsl(${(applicant.id * 60 + 30) % 360}, 70%, 50%) 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            flexShrink: 0,
                          }}
                        >
                          {applicant.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.875rem', margin: 0 }}>
                            {applicant.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{applicant.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.875rem', margin: 0 }}>
                          {applicant.currentTitle || applicant.position || '—'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                          {applicant.currentCompany || '—'} {applicant.location && `· ${applicant.location}`}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StageBadge stage={applicant.status} />
                        {needsAction && <AwaitingBadge />}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <Badge variant="default" size="sm">
                        {applicant.source?.replace('-', ' ') || '—'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      {formatDate(applicant.createdAt)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <Link href={`/applicants/${applicant.id}`}>
                          <IconButton icon={ICONS.edit} tooltip="View / Edit" size="sm" />
                        </Link>
                        <IconButton icon={ICONS.mail} tooltip="Send Email" size="sm" />
                        <IconButton
                          icon={ICONS.trash}
                          tooltip="Delete"
                          size="sm"
                          onClick={() => handleDelete(applicant.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedApplicants.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No candidates found</p>
                      <p style={{ fontSize: '0.875rem' }}>
                        {searchTerm || activeFilters.length > 0 ? (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                              setSourceFilter('all');
                            }}
                            style={{ color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Clear filters
                          </button>
                        ) : (
                          <Link href="/applicants/new-from-resume" style={{ color: '#0284c7' }}>
                            Upload a resume to add your first candidate
                          </Link>
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredApplicants.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  fontSize: '0.8125rem',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredApplicants.length)} of{' '}
                {filteredApplicants.length}
              </span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.375rem 0.625rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    fontSize: '0.8125rem',
                    color: currentPage === 1 ? '#cbd5e1' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.375rem 0.625rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    fontSize: '0.8125rem',
                    color: currentPage === totalPages ? '#cbd5e1' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
