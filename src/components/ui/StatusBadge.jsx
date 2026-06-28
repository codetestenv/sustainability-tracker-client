import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  FLAGGED: 'Flagged',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  VERIFIED: 'Verified',
  REQUESTED_INFO: 'Info Requested',
};

const STATUS_DOT = {
  DRAFT: 'bg-gray-400',
  PENDING: 'bg-blue-500',
  SUBMITTED: 'bg-blue-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  FLAGGED: 'bg-orange-500',
  ACTIVE: 'bg-green-500',
  INACTIVE: 'bg-gray-400',
  VERIFIED: 'bg-green-500',
  REQUESTED_INFO: 'bg-yellow-500',
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.DRAFT;
  const label = STATUS_LABELS[status] || status;
  const dot = STATUS_DOT[status] || 'bg-gray-400';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
