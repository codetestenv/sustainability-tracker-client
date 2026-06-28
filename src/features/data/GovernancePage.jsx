import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GOVERNANCE } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input, { Select } from '../../components/ui/Input';

const schema = z.object({
  boardMeetings: z.coerce.number().int().min(0).optional(),
  independentDirectors: z.coerce.number().int().min(0).optional(),
  policyUpdates: z.coerce.number().int().min(0).optional(),
  complianceScore: z.coerce.number().min(0).max(100).optional(),
  auditType: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

const AUDIT_TYPES = ['INTERNAL', 'EXTERNAL', 'REGULATORY', 'THIRD_PARTY'];

const GovernancePage = () => {
  const form = useForm({ resolver: zodResolver(schema) });

  const formFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Board Meetings" type="number" min="0" placeholder="0" error={form.formState.errors.boardMeetings?.message} {...form.register('boardMeetings')} />
      <Input label="Independent Directors" type="number" min="0" placeholder="0" error={form.formState.errors.independentDirectors?.message} {...form.register('independentDirectors')} />
      <Input label="Policy Updates" type="number" min="0" placeholder="0" error={form.formState.errors.policyUpdates?.message} {...form.register('policyUpdates')} />
      <Input label="Compliance Score (0–100)" type="number" min="0" max="100" placeholder="0–100" error={form.formState.errors.complianceScore?.message} {...form.register('complianceScore')} />
      <Select label="Audit Type" {...form.register('auditType')}>
        <option value="">Select audit type</option>
        {AUDIT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
      </Select>
      <Input label="Date" type="date" required error={form.formState.errors.date?.message} {...form.register('date')} />
    </div>
  );

  return (
    <DataSubmissionTemplate
      title="Governance"
      icon="🏛️"
      formFields={formFields}
      endpoints={GOVERNANCE}
      columns={['boardMeetings', 'complianceScore', 'auditType']}
      columnLabels={{ boardMeetings: 'Board Meetings', complianceScore: 'Compliance %', auditType: 'Audit Type' }}
      register={form.register}
      handleSubmit={form.handleSubmit}
      reset={form.reset}
      formState={form.formState}
    />
  );
};

export default GovernancePage;
