'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import Card, { KPICard } from '@/components/ui/Card';
import Badge, { StageBadge, AwaitingBadge } from '@/components/ui/Badge';
import Button, { IconButton } from '@/components/ui/Button';
import Pipeline from '@/components/ui/Pipeline';

const MOBILE_BREAKPOINT = 768;

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  status: string;
  createdAt: string;
}

interface Applicant {
  id: number;
  name: string;
  status: string;
  position?: string;
  currentCompany?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  recentApplicants: Applicant[];
}

const ICONS = {
  briefcase: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  upload: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  users: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  check: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ])
      .then(([jobsData, statsData]) => {
        setJobs(jobsData);
        setStats(statsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const newApplicants = stats?.recentApplicants?.length || 0;
  const interviewsThisWeek = stats?.byStatus?.interviewing || 0;
  const hiredThisMonth = stats?.byStatus?.hired || 0;

  const pipelineData = [
    { name: 'Applied', count: stats?.byStatus?.applied || 0 },
    { name: 'Screening', count: stats?.byStatus?.screening || 0 },
    { name: 'Interviewing', count: stats?.byStatus?.interviewing || 0 },
    { name: 'Offered', count: stats?.byStatus?.offered || 0 },
    { name: 'Hired', count: stats?.byStatus?.hired || 0 },
  ];

  // Mock tasks data
  const tasks = [
    { id: 1, type: 'review', title: 'Review Sarah Johnson', subtitle: 'Senior Software Engineer', urgent: true },
    { id: 2, type: 'interview', title: 'Schedule interview', subtitle: 'Michael Chen - Product Manager', urgent: true },
    { id: 3, type: 'feedback', title: 'Submit feedback', subtitle: 'Emily Rodriguez - UX Designer', urgent: false },
    { id: 4, type: 'offer', title: 'Approve offer letter', subtitle: 'James Williams - DevOps', urgent: true },
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'review':
        return '📋';
      case 'interview':
        return '📅';
      case 'feedback':
        return '💬';
      case 'offer':
        return '📝';
      default:
        return '📌';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading dashboard...</p>
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
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '1rem' : '0',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '0.25rem'
            }}>
              {isMobile ? 'Dashboard' : 'Good morning, John 👋'}
            </h1>
            {!isMobile && (
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Here&apos;s what&apos;s happening with your recruiting pipeline today.
              </p>
            )}
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
          }}>
            <Link href="/applicants/new-from-resume" style={{ flex: isMobile ? 1 : 'none' }}>
              <Button
                variant="secondary"
                icon={ICONS.upload}
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                {isMobile ? 'Upload' : 'Upload Resume'}
              </Button>
            </Link>
            <Link href="/jobs" style={{ flex: isMobile ? 1 : 'none' }}>
              <Button
                icon={ICONS.plus}
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                {isMobile ? 'New Job' : 'Post New Job'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <KPICard
          title={isMobile ? 'Jobs' : 'Open Jobs'}
          value={openJobs}
          change={{ value: 12, trend: 'up' }}
          icon={ICONS.briefcase}
          color="blue"
          compact={isMobile}
        />
        <KPICard
          title={isMobile ? 'Applicants' : 'New Applicants'}
          value={newApplicants}
          change={{ value: 8, trend: 'up' }}
          icon={ICONS.users}
          color="green"
          compact={isMobile}
        />
        <KPICard
          title={isMobile ? 'Interviews' : 'Interviews This Week'}
          value={interviewsThisWeek}
          change={{ value: 3, trend: 'down' }}
          icon={ICONS.calendar}
          color="amber"
          compact={isMobile}
        />
        <KPICard
          title={isMobile ? 'Hired' : 'Hired This Month'}
          value={hiredThisMonth}
          change={{ value: 25, trend: 'up' }}
          icon={ICONS.check}
          color="purple"
          compact={isMobile}
        />
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pipeline Overview */}
          <Card style={isMobile ? { padding: '1rem' } : undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '0.75rem' : '1.25rem' }}>
              <h2 style={{ fontSize: isMobile ? '0.875rem' : '1rem', fontWeight: '600', color: '#0f172a' }}>
                {isMobile ? 'Pipeline' : 'Hiring Pipeline'}
              </h2>
              <Link href="/applicants" style={{ fontSize: isMobile ? '0.75rem' : '0.8125rem', color: '#0284c7', textDecoration: 'none', fontWeight: '500' }}>
                {isMobile ? 'View all →' : 'View all candidates →'}
              </Link>
            </div>
            <Pipeline stages={pipelineData} showFunnel={!isMobile} />
          </Card>

          {/* Job Requisitions */}
          <Card padding="none">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: isMobile ? '0.875rem' : '1rem', fontWeight: '600', color: '#0f172a' }}>
                {isMobile ? 'Jobs' : 'Job Requisitions'}
              </h2>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" icon={ICONS.arrow} iconPosition="right">
                  {isMobile ? 'All' : 'View all'}
                </Button>
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    {(isMobile ? ['Job', 'Status'] : ['Job Title', 'Department', 'Location', 'Status', 'Age']).map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, isMobile ? 3 : 5).map((job) => (
                    <tr
                      key={job.id}
                      style={{ transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: isMobile ? '0.625rem 0.75rem' : '0.875rem 1rem' }}>
                        <Link
                          href={`/jobs/${job.id}`}
                          style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '500', fontSize: isMobile ? '0.8125rem' : '0.875rem' }}
                        >
                          {job.title}
                        </Link>
                        {isMobile && job.department && (
                          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '0.125rem 0 0' }}>
                            {job.department}
                          </p>
                        )}
                      </td>
                      {!isMobile && (
                        <>
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                            {job.department || '—'}
                          </td>
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                            {job.location || '—'}
                          </td>
                        </>
                      )}
                      <td style={{ padding: isMobile ? '0.625rem 0.75rem' : '0.875rem 1rem' }}>
                        <Badge variant={job.status === 'open' ? 'success' : 'default'} dot size={isMobile ? 'sm' : 'md'}>
                          {job.status}
                        </Badge>
                      </td>
                      {!isMobile && (
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                          {formatDate(job.createdAt)}
                        </td>
                      )}
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={isMobile ? 2 : 5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No jobs posted yet.{' '}
                        <Link href="/jobs" style={{ color: '#0284c7' }}>
                          Create your first job
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Applicants */}
          <Card padding="none">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: isMobile ? '0.875rem' : '1rem', fontWeight: '600', color: '#0f172a' }}>
                {isMobile ? 'Applicants' : 'Recent Applicants'}
              </h2>
              <Link href="/applicants">
                <Button variant="ghost" size="sm" icon={ICONS.arrow} iconPosition="right">
                  {isMobile ? 'All' : 'View all'}
                </Button>
              </Link>
            </div>

            <div>
              {stats?.recentApplicants?.slice(0, isMobile ? 3 : 5).map((applicant, index) => (
                <Link
                  key={applicant.id}
                  href={`/applicants/${applicant.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                    textDecoration: 'none',
                    borderBottom: index < (isMobile ? 2 : 4) ? '1px solid #f1f5f9' : 'none',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: isMobile ? '32px' : '40px',
                        height: isMobile ? '32px' : '40px',
                        borderRadius: isMobile ? '8px' : '10px',
                        background: `linear-gradient(135deg, hsl(${(applicant.id * 60) % 360}, 70%, 60%) 0%, hsl(${(applicant.id * 60 + 30) % 360}, 70%, 50%) 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: isMobile ? '0.6875rem' : '0.875rem',
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
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontWeight: '500',
                        color: '#0f172a',
                        fontSize: isMobile ? '0.8125rem' : '0.875rem',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {applicant.name}
                      </p>
                      {!isMobile && (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                          {applicant.position || applicant.currentCompany || 'Candidate'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem', flexShrink: 0 }}>
                    <StageBadge stage={applicant.status} compact={isMobile} />
                    {!isMobile && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(applicant.createdAt)}</span>
                    )}
                  </div>
                </Link>
              ))}
              {(!stats?.recentApplicants || stats.recentApplicants.length === 0) && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No applicants yet.{' '}
                  <Link href="/applicants/new-from-resume" style={{ color: '#0284c7' }}>
                    Upload a resume
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Tasks (hidden on mobile) */}
        <div className="tasks-sidebar">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>My Tasks</h2>
              <Badge variant="warning" size="sm">
                {tasks.filter((t) => t.urgent).length} urgent
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: task.urgent ? '#fffbeb' : '#f8fafc',
                    border: `1px solid ${task.urgent ? '#fde68a' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = task.urgent ? '#fbbf24' : '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = task.urgent ? '#fde68a' : '#e2e8f0';
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{getTaskIcon(task.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.8125rem', margin: 0 }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0' }}>{task.subtitle}</p>
                  </div>
                  {task.urgent && <AwaitingBadge />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <Button variant="ghost" fullWidth size="sm">
                View all tasks
              </Button>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
              Pipeline Summary
            </h3>
            <Pipeline stages={pipelineData} />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
