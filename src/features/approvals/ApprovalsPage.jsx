import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { EMISSIONS, ENERGY, WATER, WASTE, SOCIAL, GOVERNANCE } from '../../api/endpoints';
import { useCompanyId } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { Textarea } from '../../components/ui/Input';

const TABS = [
  { key: 'emissions', label: 'Emissions', icon: '💨', endpoints: EMISSIONS },
  { key: 'energy', label: 'Energy', icon: '⚡', endpoints: ENERGY },
  { key: 'water', label: 'Water', icon: '💧', endpoints: WATER },
  { key: 'waste', label: 'Waste', icon: '♻️', endpoints: WASTE },
  { key: 'social', label: 'Social', icon: '👥', endpoints: SOCIAL },
  { key: 'governance', label: 'Governance', icon: '🏛️', endpoints: GOVERNANCE },
];

const ApprovalsPage = () => {
  const companyId = useCompanyId();
  const [activeTab, setActiveTab] = useState('emissions');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const currentTab = TABS.find((t) => t.key === activeTab);

  const load = useCallback(async () => {
    if (!currentTab) return;
    setLoading(true);
    try {
      const res = await axiosClient.get(currentTab.endpoints.list(companyId), {
        params: { status: 'PENDING' },
      });
      const all = res.data || [];
      setRecords(all.filter((r) => r.status === 'PENDING' || r.status === 'SUBMITTED'));
    } catch {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [companyId, currentTab]);

  useEffect(() => { if (companyId) load(); }, [load, companyId]);

  const handleApprove = async (record) => {
    try {
      await axiosClient.put(currentTab.endpoints.approve(record.id));
      toast.success('Approved');
      load();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try {
      await axiosClient.put(currentTab.endpoints.reject(rejectModal.id), { reason: rejectReason });
      toast.success('Rejected');
      setRejectModal(null);
      setRejectReason('');
      load();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const getRowSummary = (record) => {
    const { co2Amount, energyKwh, waterLiters, wasteKg, totalEmployees, complianceScore } = record;
    const val = co2Amount ?? energyKwh ?? waterLiters ?? wasteKg ?? totalEmployees ?? complianceScore;
    return val !== undefined ? `Value: ${val}` : '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Approvals</h1>
        <p className="page-subtitle">Review and approve submitted sustainability data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-primary-800 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : records.length === 0 ? (
          <EmptyState
            icon="✅"
            title="No pending approvals"
            description={`All ${currentTab?.label} data has been reviewed.`}
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Summary</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="text-gray-400 text-xs">#{record.id}</td>
                    <td className="font-medium text-gray-800">{getRowSummary(record)}</td>
                    <td className="text-gray-500">{record.submittedByName || '—'}</td>
                    <td className="text-gray-500 text-sm">{formatDate(record.submittedAt || record.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button variant="success" size="sm" onClick={() => handleApprove(record)}>
                          ✓ Approve
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectModal(record)}>
                          ✗ Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); }}
        title="Reject Submission"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim()}>
              Reject
            </Button>
          </>
        }
      >
        <Textarea
          label="Rejection reason"
          required
          placeholder="Explain why this submission is being rejected..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ApprovalsPage;
