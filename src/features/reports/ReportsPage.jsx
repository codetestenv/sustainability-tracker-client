import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axiosClient from '../../api/axiosClient';
import { REPORTS, REPORTS_BY_COMPANY, REPORT_DOWNLOAD } from '../../api/endpoints';
import { useCompanyId } from '../../hooks/useAuth';
import { REPORT_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Input, { Select } from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  reportType: z.string().min(1, 'Report type is required'),
  fileFormat: z.enum(['PDF', 'EXCEL']),
  periodStart: z.string().min(1, 'Period start date is required'),
  periodEnd: z.string().min(1, 'Period end date is required'),
}).refine((data) => new Date(data.periodStart) <= new Date(data.periodEnd), {
  message: "Period end date cannot be before start date",
  path: ["periodEnd"],
});

const ReportsPage = () => {
  const companyId = useCompanyId();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(reports);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fileFormat: 'PDF',
    }
  });

  const loadReports = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(REPORTS_BY_COMPANY(companyId));
      setReports(res.data || []);
    } catch {
      setError('Failed to load reports history.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const onSubmit = async (data) => {
    setGenerating(true);
    try {
      const payload = {
        ...data,
        companyId,
      };
      await axiosClient.post(REPORTS, payload);
      toast.success('Report generated successfully!');
      reset({
        title: '',
        reportType: '',
        fileFormat: 'PDF',
        periodStart: '',
        periodEnd: '',
      });
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report) => {
    setDownloadingId(report.id);
    try {
      const response = await axiosClient.get(REPORT_DOWNLOAD(report.id), {
        responseType: 'blob',
      });
      const extension = report.fileFormat === 'EXCEL' ? 'xlsx' : 'pdf';
      const filename = `${report.title.replace(/\s+/g, '_')}_${report.reportType}.${extension}`;
      saveAs(response.data, filename);
      toast.success('Download started');
    } catch {
      toast.error('Failed to download report file');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={loadReports} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Generate Report Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Report Title"
              placeholder="e.g. Q2 Sustainability Summary"
              required
              error={errors.title?.message}
              {...register('title')}
            />

            <Select
              label="Report Type"
              required
              error={errors.reportType?.message}
              {...register('reportType')}
            >
              <option value="">Select report type</option>
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Period Start"
                type="date"
                required
                error={errors.periodStart?.message}
                {...register('periodStart')}
              />
              <Input
                label="Period End"
                type="date"
                required
                error={errors.periodEnd?.message}
                {...register('periodEnd')}
              />
            </div>

            <div>
              <span className="form-label">File Format</span>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    value="PDF"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    {...register('fileFormat')}
                  />
                  PDF Document
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    value="EXCEL"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    {...register('fileFormat')}
                  />
                  Excel Spreadsheet
                </label>
              </div>
              {errors.fileFormat && (
                <p className="text-xs text-red-600 mt-1">{errors.fileFormat.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={generating}
            >
              Generate Report
            </Button>
          </form>
        </div>
      </div>

      {/* Reports History List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reports History</h1>
            <p className="page-subtitle">{totalItems} reports compiled</p>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Coverage Period</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon="📄"
                        title="No reports generated"
                        description="Configure parameters on the left to compile your first ESG report."
                      />
                    </td>
                  </tr>
                ) : (
                  paginated.map((rep) => (
                    <tr key={rep.id}>
                      <td className="font-medium text-gray-900">{rep.title}</td>
                      <td className="text-xs font-semibold text-gray-500">{rep.reportType}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          rep.fileFormat === 'PDF'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {rep.fileFormat}
                        </span>
                      </td>
                      <td className="text-xs text-gray-600">
                        {formatDate(rep.periodStart)} – {formatDate(rep.periodEnd)}
                      </td>
                      <td>
                        <StatusBadge status={rep.status || 'COMPLETED'} />
                      </td>
                      <td className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(rep)}
                          loading={downloadingId === rep.id}
                          disabled={rep.status === 'FAILED' || rep.status === 'GENERATING'}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
      </div>
    </div>
  );
};

export default ReportsPage;
