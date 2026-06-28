import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ENERGY } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input, { Select } from '../../components/ui/Input';

const schema = z.object({
  energyKwh: z.coerce.number().positive('Must be positive'),
  energySource: z.string().min(1, 'Source is required'),
  renewablePercent: z.coerce.number().min(0).max(100).optional(),
  date: z.string().min(1, 'Date is required'),
});

const SOURCES = ['SOLAR', 'WIND', 'HYDRO', 'BIOMASS', 'GRID', 'DIESEL', 'NATURAL_GAS', 'OTHER'];

const EnergyPage = () => {
  const form = useForm({ resolver: zodResolver(schema) });

  const formFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Energy Consumed (kWh)" type="number" step="0.01" placeholder="0.00" required error={form.formState.errors.energyKwh?.message} {...form.register('energyKwh')} />
      <Select label="Energy Source" required error={form.formState.errors.energySource?.message} {...form.register('energySource')}>
        <option value="">Select source</option>
        {SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
      </Select>
      <Input label="Renewable %" type="number" min="0" max="100" placeholder="0–100" error={form.formState.errors.renewablePercent?.message} {...form.register('renewablePercent')} />
      <Input label="Date" type="date" required error={form.formState.errors.date?.message} {...form.register('date')} />
    </div>
  );

  return (
    <DataSubmissionTemplate
      title="Energy"
      icon="⚡"
      formFields={formFields}
      endpoints={ENERGY}
      columns={['energyKwh', 'energySource', 'renewablePercent']}
      columnLabels={{ energyKwh: 'Energy (kWh)', energySource: 'Source', renewablePercent: 'Renewable %' }}
      register={form.register}
      handleSubmit={form.handleSubmit}
      reset={form.reset}
      formState={form.formState}
    />
  );
};

export default EnergyPage;
