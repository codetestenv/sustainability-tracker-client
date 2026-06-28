import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { USERS_LIST, USERS_REGISTER, COMPANIES, DEPARTMENTS_BY_COMPANY } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input, { Select } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
  companyId: z.string().min(1, 'Company is required'),
  departmentId: z.string().optional(),
});

const ROLE_LABELS = {
  ADMIN: 'Admin',
  SUSTAINABILITY_MANAGER: 'Sustainability Manager',
  DEPT_MANAGER: 'Department Manager',
  EMPLOYEE: 'Employee',
  AUDITOR: 'Auditor',
};

const ROLE_BADGE = {
  ADMIN: 'badge-purple',
  SUSTAINABILITY_MANAGER: 'badge-green',
  DEPT_MANAGER: 'badge-blue',
  EMPLOYEE: 'badge-gray',
  AUDITOR: 'badge-orange',
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(users);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const watchedCompanyId = watch('companyId');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, companiesRes] = await Promise.all([
        axiosClient.get(USERS_LIST).catch(() => ({ data: [] })),
        axiosClient.get(COMPANIES),
      ]);
      setUsers(usersRes.data || []);
      setCompanies(companiesRes.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (watchedCompanyId) {
      axiosClient.get(DEPARTMENTS_BY_COMPANY(watchedCompanyId))
        .then((r) => setDepartments(r.data || []))
        .catch(() => setDepartments([]));
    } else {
      setDepartments([]);
    }
  }, [watchedCompanyId]);

  const openCreate = () => {
    reset({});
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosClient.post(USERS_REGISTER, {
        ...data,
        companyId: Number(data.companyId),
        departmentId: data.departmentId ? Number(data.departmentId) : undefined,
      });
      toast.success('User registered successfully');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{totalItems} users registered</p>
        </div>
        <Button variant="primary" icon="+" onClick={openCreate}>Register User</Button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon="👤" title="No users yet" description="Register the first user to get started." />
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-gray-900">{user.fullName}</td>
                    <td className="text-gray-500 text-xs">{user.email}</td>
                    <td>
                      <span className={`badge ${ROLE_BADGE[user.role] || 'badge-gray'}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="text-gray-500">{user.companyName || user.companyId}</td>
                    <td className="text-gray-500">{user.departmentName || user.departmentId || '—'}</td>
                    <td><StatusBadge status={user.status || 'ACTIVE'} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New User"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit(onSubmit)}>
              Register User
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" required error={errors.fullName?.message} {...register('fullName')} className="sm:col-span-2" />
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <Input label="Temporary Password" type="password" required error={errors.password?.message} {...register('password')} />
          <Select label="Role" required error={errors.role?.message} {...register('role')}>
            <option value="">Select role</option>
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>
          <Select label="Company" required error={errors.companyId?.message} {...register('companyId')}>
            <option value="">Select company</option>
            {companies.map((co) => <option key={co.id} value={co.id}>{co.name}</option>)}
          </Select>
          <Select label="Department" error={errors.departmentId?.message} {...register('departmentId')} className="sm:col-span-2">
            <option value="">Select department (optional)</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
