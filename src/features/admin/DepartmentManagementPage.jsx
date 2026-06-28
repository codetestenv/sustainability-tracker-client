import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import {
  COMPANIES,
  DEPARTMENTS,
  DEPARTMENTS_BY_COMPANY,
  DEPARTMENT_BY_ID,
  DEPARTMENT_DEACTIVATE,
} from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input, { Select } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyId: z.string().min(1, 'Company is required'),
});

const DepartmentManagementPage = () => {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { page, setPage, totalPages, paginated, totalItems, pageSize } = usePagination(departments);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    axiosClient.get(COMPANIES).then((r) => setCompanies(r.data || [])).catch(() => {});
  }, []);

  const loadDepts = useCallback(async (companyId) => {
    if (!companyId) { setDepartments([]); return; }
    setLoading(true);
    try {
      const res = await axiosClient.get(DEPARTMENTS_BY_COMPANY(companyId));
      setDepartments(res.data || []);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDepts(selectedCompany); }, [selectedCompany, loadDepts]);

  const openCreate = () => {
    setEditing(null);
    reset({ companyId: selectedCompany });
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    reset({ name: dept.name, companyId: String(dept.companyId) });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await axiosClient.put(DEPARTMENT_BY_ID(editing.id), data);
        toast.success('Department updated');
      } else {
        await axiosClient.post(DEPARTMENTS, data);
        toast.success('Department created');
      }
      setModalOpen(false);
      loadDepts(selectedCompany);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await axiosClient.put(DEPARTMENT_DEACTIVATE(deactivateTarget.id));
      toast.success('Department deactivated');
      setDeactivateTarget(null);
      loadDepts(selectedCompany);
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Filter by company to view departments</p>
        </div>
        <Button variant="primary" icon="+" onClick={openCreate} disabled={!selectedCompany}>
          Add Department
        </Button>
      </div>

      {/* Company filter */}
      <div className="card-sm max-w-sm">
        <Select
          label="Filter by Company"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">All companies</option>
          {companies.map((co) => (
            <option key={co.id} value={co.id}>{co.name}</option>
          ))}
        </Select>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <EmptyState
                          icon="🏗️"
                          title="No departments found"
                          description={selectedCompany ? 'No departments for this company yet.' : 'Select a company to view departments.'}
                        />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((dept) => (
                      <tr key={dept.id}>
                        <td className="font-medium text-gray-900">{dept.name}</td>
                        <td className="text-gray-500">
                          {companies.find((c) => c.id === dept.companyId)?.name || dept.companyName || '—'}
                        </td>
                        <td><StatusBadge status={dept.status || 'ACTIVE'} /></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button className="btn btn-sm btn-outline" onClick={() => openEdit(dept)}>Edit</button>
                            {dept.status !== 'INACTIVE' && (
                              <button className="btn btn-sm btn-danger" onClick={() => setDeactivateTarget(dept)}>
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
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Department' : 'Add Department'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editing ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Department Name" required error={errors.name?.message} {...register('name')} />
          <Select label="Company" required error={errors.companyId?.message} {...register('companyId')}>
            <option value="">Select company</option>
            {companies.map((co) => <option key={co.id} value={co.id}>{co.name}</option>)}
          </Select>
        </div>
      </Modal>

      <Modal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate Department"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeactivate}>Deactivate</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Deactivate <span className="font-semibold">{deactivateTarget?.name}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage;
