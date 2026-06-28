import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axiosClient from '../../api/axiosClient';
import { AUDITS_PENDING, AUDIT_REVIEW, AUDITS_HISTORY, REPORT_DOWNLOAD } from '../../api/endpoints';
import { AUDIT_ACTIONS } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const schema = z.object({
  action: z.string().min(1, 'Review action is required'),
  comments: z.string().min(5, 'Comments must be at least 5 characters'),
  flaggedItems: z.string().optional(),
}).refine((data) => {
  if (data.action === 'FLAGGED' && (!data.flaggedItems || data.flaggedItems.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Flagged items description is required when action is FLAGGED",
  path: ["flaggedItems"],
});

const AuditPage = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
  const [pendingAudits, setPendingAudits] = useState([]);
  const [auditHistory, setAuditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewingReport, setReviewingReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Form setup
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedAction = watch('action');

  const loadPending = useCallback(async () => {
    try {
      const res = await axiosClient.get(AUDITS_PENDING);
      setPendingAudits(res.data || []);
    } catch {
      throw new Error('Failed to load pending audits');
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await axiosClient.get(AUDITS_HISTORY);
      setAuditHistory(res.data || []);
    } catch {
      throw new Error('Failed to load audit history');
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'pending') {
        await loadPending();
      } else {
        await loadHistory();
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching audit records.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadPending, loadHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pagination for tables
  const pendingPage = usePagination(pendingAudits);
  const historyPage = usePagination(auditHistory);

  const openReviewModal = (report) => {
    setReviewingReport(report);
    reset({
      action: '',
      comments: '',
      flaggedItems: '',
    });
  };

  const onSubmitReview = async (data) => {
    if (!reviewingReport) return;
    setSubmitting(true);
    try {
      await axiosClient.put(AUDIT_REVIEW(reviewingReport.id), {
        action: data.action,
        comments: data.comments,
        flaggedItems: data.action === 'FLAGGED' ? data.flaggedItems : undefined,
      });
      toast.success('Audit review submitted successfully');
      setReviewingReport(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (reportId, title, format, type) => {
    setDownloadingId(reportId);
    try {
      const response = await axiosClient.get(REPORT_DOWNLOAD(reportId), {
        responseType: 'blob',
      });
      const extension = format === 'EXCEL' ? 'xlsx' : 'pdf';
      const filename = `${title.replace(/\s+/g, '_')}_${type}.${extension}`;
      saveAs(response.data, filename);
      toast.success('Report download started');
    } catch {
      toast.error('Failed to download report file');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && !reviewingReport) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Audits</h1>
          <p className="page-subtitle">Verify ESG report accuracy and flag non-compliance issues</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'pending'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Audits ({pendingAudits.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'history'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Audit History ({auditHistory.length})
        </button>
      </div>

      {activeTab === 'pending' ? (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Report Title</th>
                  <th>Type</th>
                  <th>Coverage Period</th>
                  <th>Generated On</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPage.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon="🔍"
                        title="No pending audits"
                        description="All generated reports have been reviewed and verified."
                      />
                    </td>
                  </tr>
                ) : (
                  pendingPage.paginated.map((report) => (
                    <tr key={report.id}>
                      <td className="font-medium text-gray-900">{report.companyName || 'Corporate'}</td>
                      <td>{report.title}</td>
                      <td className="text-xs font-semibold text-gray-500">{report.reportType}</td>
                      <td className="text-xs text-gray-600">
                        {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
                      </td>
                      <td className="text-xs text-gray-500">{formatDateTime(report.createdAt)}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report.id, report.title, report.fileFormat, report.reportType)}
                            loading={downloadingId === report.id}
                          >
                            Download
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openReviewModal(report)}
                          >
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pendingPage.totalPages > 1 && (
            <Pagination
              page={pendingPage.page}
              totalPages={pendingPage.totalPages}
              onPageChange={pendingPage.setPage}
              totalItems={pendingPage.totalItems}
              pageSize={pendingPage.pageSize}
            />
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Company</th>
                  <th>Audited By</th>
                  <th>Action taken</th>
                  <th>Comments / Details</th>
                  <th>Audit Date</th>
                </tr>
              </thead>
              <tbody>
                {historyPage.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon="📚"
                        title="Audit history empty"
                        description="Your past compliance reviews will appear here."
                      />
                    </td>
                  </tr>
                ) : (
                  historyPage.paginated.map((audit) => (
                    <tr key={audit.id}>
                      <td className="font-medium text-gray-900">{audit.reportTitle || audit.report?.title || 'Report'}</td>
                      <td className="text-xs text-gray-500">{audit.companyName || 'Corporate'}</td>
                      <td>{audit.reviewerName || audit.reviewer?.fullName || 'Auditor'}</td>
                      <td>
                        <StatusBadge status={audit.action} />
                      </td>
                      <td className="text-xs text-gray-600 max-w-xs truncate" title={audit.comments}>
                        {audit.comments}
                        {audit.flaggedItems && (
                          <div className="text-red-600 font-semibold mt-0.5">
                            Flagged: {audit.flaggedItems}
                          </div>
                        )}
                      </td>
                      <td className="text-xs text-gray-500">{formatDateTime(audit.reviewedAt || audit.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {historyPage.totalPages > 1 && (
            <Pagination
              page={historyPage.page}
              totalPages={historyPage.totalPages}
              onPageChange={historyPage.setPage}
              totalItems={historyPage.totalItems}
              pageSize={historyPage.pageSize}
            />
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewingReport}
        onClose={() => setReviewingReport(null)}
        title="Submit Audit Review"
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewingReport(null)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit(onSubmitReview)}>
              Submit Review
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-sm space-y-1">
            <div><span className="text-gray-500">Report:</span> <span className="font-semibold">{reviewingReport?.title}</span></div>
            <div><span className="text-gray-500">Type:</span> <span className="font-semibold">{reviewingReport?.reportType}</span></div>
            <div><span className="text-gray-500">Coverage:</span> <span className="font-semibold">{formatDate(reviewingReport?.periodStart)} – {formatDate(reviewingReport?.periodEnd)}</span></div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex justify-center gap-1"
                onClick={() => handleDownload(reviewingReport.id, reviewingReport.title, reviewingReport.fileFormat, reviewingReport.reportType)}
                loading={downloadingId === reviewingReport?.id}
              >
                📥 Download & Read Report
              </Button>
            </div>
          </div>

          <Select
            label="Audit Verdict"
            required
            error={errors.action?.message}
            {...register('action')}
          >
            <option value="">Choose an action</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>{a.replace('_', ' ')}</option>
            ))}
          </Select>

          {selectedAction === 'FLAGGED' && (
            <div>
              <label className="form-label font-semibold text-red-600">Flagged Items *</label>
              <textarea
                className={`form-input border-red-200 focus:border-red-500 focus:ring-red-100 min-h-[80px] ${
                  errors.flaggedItems ? 'border-red-500' : ''
                }`}
                placeholder="List specific discrepancies or inaccuracies noticed in the data..."
                {...register('flaggedItems')}
              />
              {errors.flaggedItems && (
                <p className="text-xs text-red-600 mt-1">{errors.flaggedItems.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="form-label">Review Comments *</label>
            <textarea
              className={`form-input min-h-[100px] ${errors.comments ? 'border-red-500' : ''}`}
              placeholder="Provide context, request adjustments, or summarize validation results..."
              {...register('comments')}
            />
            {errors.comments && (
              <p className="text-xs text-red-600 mt-1">{errors.comments.message}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuditPage;
