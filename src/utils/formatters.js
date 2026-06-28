import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy HH:mm');
  } catch {
    return dateStr;
  }
};

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '—';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const formatScore = (score) => {
  if (score === null || score === undefined) return '—';
  return Number(score).toFixed(1);
};

export const getGrade = (score) => {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
};

export const truncate = (str, max = 40) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

export const formatPeriod = (start, end) => {
  if (!start && !end) return '—';
  const s = start ? formatDate(start) : '';
  const e = end ? formatDate(end) : '';
  return `${s} – ${e}`;
};
