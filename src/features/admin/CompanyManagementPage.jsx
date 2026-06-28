import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { COMPANIES, COMPANY_BY_ID, COMPANY_DEACTIVATE } from '../../api/endpoints';
import { COMPANY_SIZES } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Input, { Select } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  size: z.string().min(1, 'Size is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
});

const CompanyManagementPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(companies);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(COMPANIES);
      setCompanies(res.data || []);
    } catch {
      setError('Failed to load companies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    reset({});
    setModalOpen(true);
  };

  const openEdit = (company) => {
    setEditing(company);
    reset(company);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await axiosClient.put(COMPANY_BY_ID(editing.id), data);
        toast.success('Company updated successfully');
      } else {
        await axiosClient.post(COMPANIES, data);
        toast.success('Company created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await axiosClient.put(COMPANY_DEACTIVATE(deactivateTarget.id));
      toast.success('Company deactivated');
      setDeactivateTarget(null);
      load();
    } catch {
      toast.error('Failed to deactivate company');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Management</h1>
          <p className="page-subtitle">{totalItems} companies registered</p>
        </div>
        <Button variant="primary" icon="+" onClick={openCreate}>Add Company</Button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Country</th>
                <th>City</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon="🏢" title="No companies yet" description="Create your first company to get started." />
                  </td>
                </tr>
              ) : (
                paginated.map((co) => (
                  <tr key={co.id}>
                    <td className="font-medium text-gray-900">{co.name}</td>
                    <td className="text-gray-500">{co.industry}</td>
                    <td>{co.country}</td>
                    <td>{co.city}</td>
                    <td><span className="badge badge-blue">{co.size}</span></td>
                    <td><StatusBadge status={co.status || 'ACTIVE'} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => openEdit(co)}
                        >
                          Edit
                        </button>
                        {co.status !== 'INACTIVE' && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setDeactivateTarget(co)}
                          >
                            Deactivate
                          </button>
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
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Company' : 'Add New Company'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editing ? 'Save Changes' : 'Create Company'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company Name" required error={errors.name?.message} {...register('name')} className="sm:col-span-2" />
          <Input label="Industry" required error={errors.industry?.message} {...register('industry')} />
          <Select label="Size" required error={errors.size?.message} {...register('size')}>
            <option value="">Select size</option>
            {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Input label="Country" required error={errors.country?.message} {...register('country')} />
          <Input label="City" required error={errors.city?.message} {...register('city')} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
        </div>
      </Modal>

      {/* Deactivate Confirm Modal */}
      <Modal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate Company"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeactivate}>Deactivate</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to deactivate{' '}
          <span className="font-semibold text-gray-900">{deactivateTarget?.name}</span>?
          This will disable all associated users and departments.
        </p>
      </Modal>
    </div>
  );
};

export default CompanyManagementPage;
