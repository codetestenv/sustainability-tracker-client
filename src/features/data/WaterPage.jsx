import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WATER } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input, { Select } from '../../components/ui/Input';

const schema = z.object({
  waterLiters: z.coerce.number().positive('Must be positive'),
  waterSource: z.string().min(1, 'Source is required'),
  recycledPercent: z.coerce.number().min(0).max(100).optional(),
  date: z.string().min(1, 'Date is required'),
});

const WATER_SOURCES = ['MUNICIPAL', 'WELL', 'RIVER', 'RAINWATER', 'RECYCLED', 'OTHER'];

const WaterPage = () => {
  const form = useForm({ resolver: zodResolver(schema) });

  const formFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Water Used (liters)" type="number" step="0.01" placeholder="0.00" required error={form.formState.errors.waterLiters?.message} {...form.register('waterLiters')} />
      <Select label="Water Source" required error={form.formState.errors.waterSource?.message} {...form.register('waterSource')}>
        <option value="">Select source</option>
        {WATER_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
      </Select>
      <Input label="Recycled %" type="number" min="0" max="100" placeholder="0–100" error={form.formState.errors.recycledPercent?.message} {...form.register('recycledPercent')} />
      <Input label="Date" type="date" required error={form.formState.errors.date?.message} {...form.register('date')} />
    </div>
  );

  return (
    <DataSubmissionTemplate
      title="Water"
      icon="💧"
      formFields={formFields}
      endpoints={WATER}
      columns={['waterLiters', 'waterSource', 'recycledPercent']}
      columnLabels={{ waterLiters: 'Water (L)', waterSource: 'Source', recycledPercent: 'Recycled %' }}
      register={form.register}
      handleSubmit={form.handleSubmit}
      reset={form.reset}
      formState={form.formState}
    />
  );
};

export default WaterPage;
