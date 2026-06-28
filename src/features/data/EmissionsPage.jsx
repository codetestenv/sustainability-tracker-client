import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EMISSIONS } from '../../api/endpoints';
import DataSubmissionTemplate from './DataSubmissionTemplate';
import Input, { Select } from '../../components/ui/Input';
import { useSelector } from 'react-redux';
import { selectCompanyId, selectDepartmentId } from '../auth/authSlice';

const schema = z.object({
    departmentId: z.number().int().positive('Department ID is required'),
    co2Amount: z.coerce.number().nonnegative('CO₂ amount must be >= 0'),
    ch4Amount: z.coerce.number().nonnegative().default(0),
    n2oAmount: z.coerce.number().nonnegative().default(0),
    scope: z.enum(['SCOPE1', 'SCOPE2', 'SCOPE3'], {
        errorMap: () => ({ message: 'Scope is required' })
    }),
    recordedAt: z.string().min(1, 'Date is required'),
    notes: z.string().optional(),
});

const EMISSION_SCOPES = ['SCOPE1', 'SCOPE2', 'SCOPE3'];

const EmissionsPage = () => {
    const companyId = useSelector(selectCompanyId);
    const departmentId = useSelector(selectDepartmentId);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            companyId: companyId || 1,
            departmentId: departmentId || 1,
            ch4Amount: 0,
            n2oAmount: 0,
        }
    });

    // Force set values
    React.useEffect(() => {
        if (companyId) form.setValue('companyId', companyId, { shouldValidate: true });
        if (departmentId) form.setValue('departmentId', departmentId, { shouldValidate: true });
    }, [companyId, departmentId, form]);

    const formFields = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Force hidden fields */}
            <input type="hidden" {...form.register('companyId')} />
            <input type="hidden" {...form.register('departmentId')} />

            <Input
                label="CO₂ Amount (kg)"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                error={form.formState.errors.co2Amount?.message}
                {...form.register('co2Amount', { valueAsNumber: true })}
            />

            <Select
                label="Emission Scope"
                required
                error={form.formState.errors.scope?.message}
                {...form.register('scope')}
            >
                <option value="">Select scope</option>
                {EMISSION_SCOPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </Select>

            <Input
                label="Recorded Date"
                type="date"
                required
                error={form.formState.errors.recordedAt?.message}
                {...form.register('recordedAt')}
            />

            <Input
                label="CH₄ Amount (kg)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register('ch4Amount', { valueAsNumber: true })}
            />

            <Input
                label="N₂O Amount (kg)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register('n2oAmount', { valueAsNumber: true })}
            />

            <Input
                label="Notes"
                placeholder="Optional notes"
                className="sm:col-span-2"
                {...form.register('notes')}
            />
        </div>
    );

    return (
        <div>
            <DataSubmissionTemplate
                title="Emissions"
                icon="💨"
                formFields={formFields}
                endpoints={EMISSIONS}
                columns={['co2Amount', 'scope']}
                columnLabels={{
                    co2Amount: 'CO₂ (kg)',
                    scope: 'Scope',
                }}
                handleSubmit={form.handleSubmit}
                reset={form.reset}
            />
        </div>
    );
};

export default EmissionsPage;