import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { useCompanyId, useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';

/**
 * Shared template for all 6 data submission pages.
 * @param {object} props
 * @param {string} props.title - Page title
 * @param {string} props.icon - Emoji icon
 * @param {React.ReactNode} props.formFields - Form field JSX (using react-hook-form register)
 * @param {object} props.endpoints - { list, create, submit, approve, reject }
 * @param {string[]} props.columns - column keys to display in table
 * @param {object} props.columnLabels - { key: 'Label' }
 * @param {function} props.handleSubmit - from react-hook-form
 * @param {function} props.reset - from react-hook-form
 */
const DataSubmissionTemplate = ({
  title,
  icon,
  formFields,
  endpoints,
  columns = [],
  columnLabels = {},
  handleSubmit,
  reset,
}) => {
  const companyId = useCompanyId();
  const { role } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reasonModal, setReasonModal] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const canApprove = [ROLES.DEPT_MANAGER, ROLES.SUSTAINABILITY_MANAGER].includes(role);
  const isEmployee = role === ROLES.EMPLOYEE;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = endpoints.list(companyId);
      const params = {};
      if (filterStart) params.startDate = filterStart;
      if (filterEnd) params.endDate = filterEnd;
      const res = await axiosClient.get(url, { params });
      setRecords(res.data || []);
    } catch {
      toast.error(`Failed to load ${title.toLowerCase()} data`);
    } finally {
      setLoading(false);
    }
  }, [companyId, filterStart, filterEnd, endpoints, title]);

  useEffect(() => { if (companyId) load(); }, [load, companyId]);

  const onSubmitForm = async (data) => {
    setSubmitting(true);
    try {
      await axiosClient.post(endpoints.create(), { ...data, companyId });
      toast.success('Record saved as draft');
      reset();
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForApproval = async (record) => {
    try {
      await axiosClient.put(endpoints.submit(record.id));
      toast.success('Submitted for approval');
      load();
    } catch {
      toast.error('Failed to submit');
    }
  };

  const handleApprove = async (record) => {
    try {
      await axiosClient.put(endpoints.approve(record.id));
      toast.success('Approved successfully');
      load();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try {
      await axiosClient.put(endpoints.reject(rejectModal.id), { reason: rejectReason });
      toast.success('Rejected with reason');
      setRejectModal(null);
      setRejectReason('');
      load();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(records);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{icon} {title}</h1>
          <p className="page-subtitle">{totalItems} records</p>
        </div>
        <Button variant="primary" icon="+" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Record'}
        </Button>
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-4">Submit New Data</h3>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {formFields}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => { reset(); setShowForm(false); }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={submitting}>
                Save as Draft
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card-sm flex flex-wrap items-end gap-4">
        <div>
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-input"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-input"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={load}>Apply Filter</Button>
        {(filterStart || filterEnd) && (
          <Button variant="ghost" onClick={() => { setFilterStart(''); setFilterEnd(''); }}>
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col}>{columnLabels[col] || col}</th>
                    ))}
                    <th>Recorded Date</th>
                    <th>Approved At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 3}>
                        <EmptyState icon={icon} title={`No ${title.toLowerCase()} records`} description="Start by adding a new record above." />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((record) => (
                      <tr key={record.id}>
                        {columns.map((col) => (
                          <td key={col} className="font-medium">
                            {record[col] !== undefined ? String(record[col]) : '—'}
                          </td>
                        ))}
                        {/* Recorded Date */}
                        <td className="text-gray-500 text-sm">
                          {formatDate(record.recordedAt || record.createdAt)}
                        </td>
                        {/* Approved At */}
                        <td className="text-gray-500 text-sm">
                          {formatDate(record.approvedAt)}
                        </td>
                        <td><StatusBadge status={record.status} /></td>
                        <td>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* DRAFT actions */}
                            {record.status === 'DRAFT' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSubmitForApproval(record)}
                              >
                                Submit
                              </Button>
                            )}

                            {/* PENDING/SUBMITTED actions for managers */}
                            {(record.status === 'PENDING' || record.status === 'SUBMITTED') && canApprove && (
                              <>
                                <Button variant="success" size="sm" onClick={() => handleApprove(record)}>
                                  Approve
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => setRejectModal(record)}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {(record.status === 'PENDING' || record.status === 'SUBMITTED') && !canApprove && (
                              <span className="text-xs text-gray-400 italic">Awaiting approval</span>
                            )}

                            {/* REJECTED */}
                            {record.status === 'REJECTED' && (
                              <>
                                <button
                                  className="text-xs text-red-600 hover:underline"
                                  onClick={() => setReasonModal(record)}
                                >
                                  View reason
                                </button>
                                {isEmployee && (
                                  <Button variant="outline" size="sm" onClick={() => handleSubmitForApproval(record)}>
                                    Resubmit
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
          </>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); }}
        title="Reject Record"
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
          placeholder="Please provide a reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
        />
      </Modal>

      {/* View Reason Modal */}
      <Modal
        isOpen={!!reasonModal}
        onClose={() => setReasonModal(null)}
        title="Rejection Reason"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{reasonModal?.rejectionReason || reasonModal?.reason || 'No reason provided.'}</p>
        </div>
      </Modal>
    </div>
  );
};

export default DataSubmissionTemplate;
