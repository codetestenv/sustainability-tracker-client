import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosClient from '../../api/axiosClient';
import { SCORES_HISTORY } from '../../api/endpoints';
import { useCompanyId } from '../../hooks/useAuth';
import { getGrade, formatScore } from '../../utils/formatters';
import { GRADE_COLORS } from '../../utils/constants';
import GradeBadge from '../../components/ui/GradeBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ESGLineChart from '../../components/charts/ESGLineChart';

const GradeDistributionPieChart = ({ data = [] }) => {
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={95}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={GRADE_COLORS[entry.name.replace('Grade ', '')] || '#9E9E9E'} />
          ))}
        </Pie>
        <RechartsTooltip
          formatter={(v, name) => [`${v} periods`, name]}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const ScoreHistoryPage = () => {
  const companyId = useCompanyId();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(history);

  const loadHistory = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(SCORES_HISTORY(companyId));
      setHistory(res.data || []);
    } catch {
      setError('Failed to load score history.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={loadHistory} />;

  // Compute Grade Distribution for the pie chart
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  history.forEach((h) => {
    const s = h.totalScore || h.total || 0;
    const grade = getGrade(s);
    if (counts[grade] !== undefined) {
      counts[grade]++;
    }
  });

  const pieData = ['A', 'B', 'C', 'D', 'F']
    .map((g) => ({
      name: `Grade ${g}`,
      value: counts[g],
    }))
    .filter((entry) => entry.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historical ESG Scores</h1>
          <p className="page-subtitle">Historical review of corporate ESG grades and performance scores</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📈"
            title="No historical score records found"
            description="Historical scores will be generated automatically after data submissions are approved."
          />
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">ESG Score Trend</h3>
              <ESGLineChart data={history} />
            </div>
            <div className="card lg:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4">Grade Distribution</h3>
              <GradeDistributionPieChart data={pieData} />
            </div>
          </div>

          {/* Table Card */}
          <div className="card p-0 overflow-hidden">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reporting Period</th>
                    <th>Environment</th>
                    <th>Social</th>
                    <th>Governance</th>
                    <th>Total Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((h, i) => {
                    const env = h.environmentScore || h.environment || 0;
                    const soc = h.socialScore || h.social || 0;
                    const gov = h.governanceScore || h.governance || 0;
                    const tot = h.totalScore || h.total || 0;
                    return (
                      <tr key={h.id || i}>
                        <td className="font-medium text-gray-900">{h.period}</td>
                        <td className="text-green-700 font-semibold">{formatScore(env)}</td>
                        <td className="text-blue-700 font-semibold">{formatScore(soc)}</td>
                        <td className="text-purple-700 font-semibold">{formatScore(gov)}</td>
                        <td className="text-gray-900 font-bold bg-gray-50/50">{formatScore(tot)}</td>
                        <td>
                          <GradeBadge grade={getGrade(tot)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                pageSize={pageSize}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreHistoryPage;
