import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { DASHBOARD_ADMIN } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatNumber } from '../../utils/formatters';

const StatCard = ({ icon, label, value, sub, color = 'primary' }) => {
  const colorMap = {
    primary: 'from-primary-800 to-primary-700',
    blue: 'from-secondary-800 to-secondary-700',
    orange: 'from-orange-600 to-orange-500',
    purple: 'from-purple-700 to-purple-600',
  };

  return (
    <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${colorMap[color]} shadow-card`}>
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-90">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-0.5 truncate">{sub}</div>}
    </div>
  );
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(DASHBOARD_ADMIN);
      setData(res.data);
    } catch (err) {
      setError(err.isNetworkError ? 'Cannot connect to server.' : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System-wide overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon="🏢"
          label="Total Companies"
          value={formatNumber(data?.totalCompanies ?? 0, 0)}
          color="primary"
        />
        <StatCard
          icon="👥"
          label="Total Users"
          value={formatNumber(data?.totalUsers ?? 0, 0)}
          color="blue"
        />
        <StatCard
          icon="🏆"
          label="Best Performing"
          value={data?.bestCompany?.name || '—'}
          sub={`Score: ${data?.bestCompany?.score ?? '—'}`}
          color="primary"
        />
        <StatCard
          icon="⚠️"
          label="Needs Attention"
          value={data?.worstCompany?.name || '—'}
          sub={`Score: ${data?.worstCompany?.score ?? '—'}`}
          color="orange"
        />
      </div>

      {/* Additional system stats */}
      {data?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(data.stats).map(([key, val]) => (
            <div key={key} className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl">
                📊
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{val}</p>
                <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state if no stats */}
      {!data?.stats && (
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">System Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Companies', value: data?.activeCompanies ?? 0, icon: '🏢' },
              { label: 'Pending Approvals', value: data?.pendingApprovals ?? 0, icon: '⏳' },
              { label: 'Reports Generated', value: data?.totalReports ?? 0, icon: '📋' },
              { label: 'Audit Reviews', value: data?.totalAudits ?? 0, icon: '🔍' },
            ].map((item) => (
              <div key={item.label} className="card-sm text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xl font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
