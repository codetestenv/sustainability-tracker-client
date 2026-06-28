export const ROLES = {
  ADMIN: 'ADMIN',
  SUSTAINABILITY_MANAGER: 'SUSTAINABILITY_MANAGER',
  DEPT_MANAGER: 'DEPT_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  AUDITOR: 'AUDITOR',
};

export const ROLE_REDIRECTS = {
  ADMIN: '/admin/dashboard',
  SUSTAINABILITY_MANAGER: '/dashboard',
  DEPT_MANAGER: '/dashboard',
  EMPLOYEE: '/data/emissions',
  AUDITOR: '/audits',
};

export const GRADE_COLORS = {
  A: '#2E7D32',
  B: '#66BB6A',
  C: '#FDD835',
  D: '#FF7043',
  F: '#D32F2F',
};

export const GRADE_BG = {
  A: '#E8F5E9',
  B: '#F1F8E9',
  C: '#FFFDE7',
  D: '#FBE9E7',
  F: '#FFEBEE',
};

export const STATUS_COLORS = {
  DRAFT: { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0' },
  PENDING: { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  SUBMITTED: { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  APPROVED: { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  REJECTED: { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' },
  FLAGGED: { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
};

export const DATA_TYPES = [
  { key: 'emissions', label: 'Emissions', unit: 'kg CO₂', path: '/data/emissions', icon: '💨' },
  { key: 'energy', label: 'Energy', unit: 'kWh', path: '/data/energy', icon: '⚡' },
  { key: 'water', label: 'Water', unit: 'liters', path: '/data/water', icon: '💧' },
  { key: 'waste', label: 'Waste', unit: 'kg', path: '/data/waste', icon: '♻️' },
  { key: 'social', label: 'Social', unit: '', path: '/data/social', icon: '👥' },
  { key: 'governance', label: 'Governance', unit: '', path: '/data/governance', icon: '🏛️' },
];

export const REPORT_TYPES = [
  'FULL_ESG', 'ENVIRONMENT', 'SOCIAL', 'GOVERNANCE', 'MONTHLY', 'ANNUAL',
];

export const AUDIT_ACTIONS = ['VERIFIED', 'FLAGGED', 'REJECTED', 'REQUESTED_INFO'];

export const COMPANY_SIZES = ['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'];

export const API_BASE = 'https://sustainability-tracker-production.up.railway.app';

export const CO2_WARNING_THRESHOLD = 10000;

export const ESG_CHART_COLORS = {
  environment: '#2E7D32',
  social: '#1565C0',
  governance: '#6A1B9A',
  total: '#37474F',
};
