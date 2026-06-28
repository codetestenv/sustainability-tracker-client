import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import { DASHBOARD_COMPANY, SCORES_HISTORY } from '../../api/endpoints';
import { useCompanyId } from '../../hooks/useAuth';
import { formatNumber, formatScore, getGrade } from '../../utils/formatters';
import { CO2_WARNING_THRESHOLD } from '../../utils/constants';
import GradeBadge from '../../components/ui/GradeBadge';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ESGGaugeChart from '../../components/charts/ESGGaugeChart';
import ESGLineChart from '../../components/charts/ESGLineChart';
import EmissionsBarChart from '../../components/charts/EmissionsBarChart';
import EnergyPieChart from '../../components/charts/EnergyPieChart';
import WasteDonutChart from '../../components/charts/WasteDonutChart';

const ScoreCard = ({ label, value, color, icon }) => (
  <div className="card-sm flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
    </div>
    <div className="text-3xl font-bold" style={{ color }}>
      {value !== null && value !== undefined ? formatScore(value) : '—'}
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, value || 0)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const MetricCard = ({ icon, label, value, unit, warning = false }) => (
  <div className={`card-sm ${warning ? 'border border-orange-200 bg-orange-50' : ''}`}>
    <div className="flex items-start justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      {warning && (
        <span className="text-orange-500 text-sm font-bold" title="High CO₂ levels">⚠️</span>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(value, 0)}</div>
    <div className="text-xs text-gray-500 mt-0.5">
      <span className="font-medium">{unit}</span>
      <br />
      <span>{label}</span>
    </div>
  </div>
);

const CompanyDashboardPage = () => {
  const companyId = useCompanyId();
  const [data, setData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, histRes] = await Promise.all([
        axiosClient.get(DASHBOARD_COMPANY(companyId)),
        axiosClient.get(SCORES_HISTORY(companyId)).catch(() => ({ data: [] })),
      ]);
      setData(dashRes.data);
      setScoreHistory(histRes.data || []);
    } catch (err) {
      setError(err.isNetworkError ? 'Cannot connect to server.' : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { if (companyId) load(); }, [companyId, load]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const score = data?.score || data?.latestScore || {};
  const metrics = data?.metrics || data?.currentMetrics || {};
  const grade = getGrade(score?.totalScore || score?.total || 0);
  const totalScore = score?.totalScore || score?.total || 0;
  const co2 = metrics?.co2Kg || metrics?.co2 || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Company Dashboard</h1>
          <p className="page-subtitle">ESG Performance Overview</p>
        </div>
        <div className="flex items-center gap-3">
          {data?.pendingApprovals > 0 && (
            <span className="badge badge-orange">
              ⏳ {data.pendingApprovals} pending approvals
            </span>
          )}
          {data?.pendingReports > 0 && (
            <span className="badge badge-blue">
              📋 {data.pendingReports} pending reports
            </span>
          )}
        </div>
      </div>

      {/* Top row: Gauge + Grade + Score cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gauge */}
        <div className="card flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">ESG Score</p>
          <ESGGaugeChart score={totalScore} />
          <div className="mt-3">
            <GradeBadge grade={grade} size="lg" showLabel />
          </div>
        </div>

        {/* E/S/G scores */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScoreCard
            label="Environment"
            value={score?.environmentScore || score?.environment}
            color="#2E7D32"
            icon="🌍"
          />
          <ScoreCard
            label="Social"
            value={score?.socialScore || score?.social}
            color="#1565C0"
            icon="🤝"
          />
          <ScoreCard
            label="Governance"
            value={score?.governanceScore || score?.governance}
            color="#6A1B9A"
            icon="⚖️"
          />
          {/* Metric cards */}
          <MetricCard
            icon="💨"
            label="CO₂ Emissions"
            value={co2}
            unit="kg"
            warning={co2 > CO2_WARNING_THRESHOLD}
          />
          <MetricCard
            icon="⚡"
            label="Energy Usage"
            value={metrics?.energyKwh || metrics?.energy || 0}
            unit="kWh"
          />
          <MetricCard
            icon="💧"
            label="Water Usage"
            value={metrics?.waterLiters || metrics?.water || 0}
            unit="liters"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">ESG Score Trend</h3>
          <ESGLineChart data={scoreHistory} />
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Emissions</h3>
          <EmissionsBarChart data={data?.monthlyEmissions || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Energy Sources</h3>
          <EnergyPieChart data={data?.energySources || []} />
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Waste Recycling Rate</h3>
          <WasteDonutChart
            recycled={data?.recyclingRate || data?.wasteRecycled || 65}
            nonRecycled={100 - (data?.recyclingRate || data?.wasteRecycled || 65)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;
