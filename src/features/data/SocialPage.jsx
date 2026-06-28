import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SOCIAL } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input from '../../components/ui/Input';

const schema = z.object({
  totalEmployees: z.coerce.number().int().positive('Must be positive'),
  femaleEmployees: z.coerce.number().int().min(0).optional(),
  trainingHours: z.coerce.number().min(0).optional(),
  communityInvestment: z.coerce.number().min(0).optional(),
  date: z.string().min(1, 'Date is required'),
});

const SocialPage = () => {
  const form = useForm({ resolver: zodResolver(schema) });

  const formFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Total Employees" type="number" required error={form.formState.errors.totalEmployees?.message} {...form.register('totalEmployees')} />
      <Input label="Female Employees" type="number" error={form.formState.errors.femaleEmployees?.message} {...form.register('femaleEmployees')} />
      <Input label="Training Hours" type="number" step="0.5" placeholder="0" error={form.formState.errors.trainingHours?.message} {...form.register('trainingHours')} />
      <Input label="Community Investment ($)" type="number" step="0.01" placeholder="0.00" error={form.formState.errors.communityInvestment?.message} {...form.register('communityInvestment')} />
      <Input label="Reporting Period Date" type="date" required error={form.formState.errors.date?.message} {...form.register('date')} className="sm:col-span-2" />
    </div>
  );

  return (
    <DataSubmissionTemplate
      title="Social"
      icon="👥"
      formFields={formFields}
      endpoints={SOCIAL}
      columns={['totalEmployees', 'femaleEmployees', 'trainingHours']}
      columnLabels={{ totalEmployees: 'Employees', femaleEmployees: 'Female', trainingHours: 'Training Hrs' }}
      register={form.register}
      handleSubmit={form.handleSubmit}
      reset={form.reset}
      formState={form.formState}
    />
  );
};

export default SocialPage;
