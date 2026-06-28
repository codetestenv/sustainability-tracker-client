import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WASTE } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input, { Select } from '../../components/ui/Input';

const schema = z.object({
  wasteKg: z.coerce.number().positive('Must be positive'),
  wasteType: z.string().min(1, 'Type is required'),
  recycledKg: z.coerce.number().min(0).optional(),
  disposalMethod: z.string().min(1, 'Method is required'),
  date: z.string().min(1, 'Date is required'),
});

const WASTE_TYPES = ['ORGANIC', 'PLASTIC', 'METAL', 'PAPER', 'ELECTRONIC', 'HAZARDOUS', 'MIXED'];
const DISPOSAL_METHODS = ['RECYCLING', 'LANDFILL', 'INCINERATION', 'COMPOSTING', 'DONATION'];

const WastePage = () => {
  const form = useForm({ resolver: zodResolver(schema) });

  const formFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Total Waste (kg)" type="number" step="0.01" placeholder="0.00" required error={form.formState.errors.wasteKg?.message} {...form.register('wasteKg')} />
      <Input label="Recycled (kg)" type="number" step="0.01" placeholder="0.00" error={form.formState.errors.recycledKg?.message} {...form.register('recycledKg')} />
      <Select label="Waste Type" required error={form.formState.errors.wasteType?.message} {...form.register('wasteType')}>
        <option value="">Select type</option>
        {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Select label="Disposal Method" required error={form.formState.errors.disposalMethod?.message} {...form.register('disposalMethod')}>
        <option value="">Select method</option>
        {DISPOSAL_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
      </Select>
      <Input label="Date" type="date" required error={form.formState.errors.date?.message} {...form.register('date')} className="sm:col-span-2" />
    </div>
  );

  return (
    <DataSubmissionTemplate
      title="Waste"
      icon="♻️"
      formFields={formFields}
      endpoints={WASTE}
      columns={['wasteKg', 'recycledKg', 'wasteType', 'disposalMethod']}
      columnLabels={{ wasteKg: 'Total (kg)', recycledKg: 'Recycled (kg)', wasteType: 'Type', disposalMethod: 'Method' }}
      register={form.register}
      handleSubmit={form.handleSubmit}
      reset={form.reset}
      formState={form.formState}
    />
  );
};

export default WastePage;
