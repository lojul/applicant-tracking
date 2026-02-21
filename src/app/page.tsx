'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Applicant = {
  id: number;
  name: string;
  email: string;
  status: string;
  position?: string;
  createdAt: string;
};

type Stats = {
  total: number;
  byStatus: Record<string, number>;
  recent: Applicant[];
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  applied: { color: '#3b82f6', label: 'Applied' },
  interviewing: { color: '#f59e0b', label: 'Interviewing' },
  offered: { color: '#10b981', label: 'Offered' },
  rejected: { color: '#ef4444', label: 'Rejected' },
  hired: { color: '#8b5cf6', label: 'Hired' },
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(stats.byStatus), 1);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
            Dashboard
          </h1>
          <Link
            href="/applicants"
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
            View All Applicants
          </Link>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Total Applicants
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              {stats.total}
            </p>
          </div>

          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div key={status} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${config.color}`,
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {config.label}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: config.color }}>
                {stats.byStatus[status] || 0}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Pipeline Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
              Pipeline Overview
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const count = stats.byStatus[status] || 0;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const barWidth = (count / maxCount) * 100;

                return (
                  <div key={status}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                    }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>
                        {config.label}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      height: '24px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        backgroundColor: config.color,
                        height: '100%',
                        width: `${barWidth}%`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applicants */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
              Recent Applicants
            </h2>
            {stats.recent.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                No applicants yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recent.map(applicant => (
                  <Link
                    key={applicant.id}
                    href={`/applicants/${applicant.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  >
                    <div>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>
                        {applicant.name}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {applicant.position || 'No position'} - {new Date(applicant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: STATUS_CONFIG[applicant.status]?.color + '20',
                      color: STATUS_CONFIG[applicant.status]?.color || '#6b7280',
                    }}>
                      {STATUS_CONFIG[applicant.status]?.label || applicant.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginTop: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            Hiring Funnel
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '200px',
            gap: '1rem',
            padding: '0 1rem',
          }}>
            {['applied', 'interviewing', 'offered', 'hired'].map((status, index) => {
              const count = stats.byStatus[status] || 0;
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const config = STATUS_CONFIG[status];

              return (
                <div key={status} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontWeight: 'bold', color: config.color }}>
                    {count}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '80px',
                    backgroundColor: config.color,
                    height: `${Math.max(height, 5)}%`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                  }} />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'center',
                  }}>
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
