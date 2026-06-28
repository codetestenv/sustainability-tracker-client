// Auth
export const AUTH_LOGIN = '/auth/login';
export const AUTH_CHANGE_PASSWORD = '/users/change-password';

// Users
export const USERS_REGISTER = '/users/register';
export const USERS_LIST = '/users';

// Companies
export const COMPANIES = '/companies';
export const COMPANY_BY_ID = (id) => `/companies/${id}`;
export const COMPANY_DEACTIVATE = (id) => `/companies/${id}/deactivate`;

// Departments
export const DEPARTMENTS_BY_COMPANY = (companyId) => `/departments/company/${companyId}`;
export const DEPARTMENTS = '/departments';
export const DEPARTMENT_BY_ID = (id) => `/departments/${id}`;
export const DEPARTMENT_DEACTIVATE = (id) => `/departments/${id}/deactivate`;

// Data endpoints factory
const dataEndpoints = (resource) => ({
  list: (companyId) => `/${resource}/company/${companyId}`,
  summary: (companyId) => `/${resource}/company/${companyId}/summary`,
  create: () => `/${resource}`,
  submit: (id) => `/${resource}/${id}/submit`,
  approve: (id) => `/${resource}/${id}/approve`,
  reject: (id) => `/${resource}/${id}/reject`,
  update: (id) => `/${resource}/${id}`,
  byDept: (deptId) => `/${resource}/department/${deptId}`,
  pending: () => `/${resource}/pending`,
});

export const EMISSIONS = dataEndpoints('emissions');
export const ENERGY = dataEndpoints('energies');
export const WATER = dataEndpoints('water');
export const WASTE = dataEndpoints('waste');
export const SOCIAL = dataEndpoints('social');
export const GOVERNANCE = dataEndpoints('governance');

// Scores
export const SCORES_LATEST = (companyId) => `/scores/latest/${companyId}`;
export const SCORES_HISTORY = (companyId) => `/scores/history/${companyId}`;

// Reports
export const REPORTS = '/reports';
export const REPORTS_BY_COMPANY = (companyId) => `/reports/company/${companyId}`;
export const REPORT_DOWNLOAD = (id) => `/reports/${id}/download`;

// Audits
export const AUDITS_PENDING = '/audits/pending';
export const AUDIT_REVIEW = (reportId) => `/audits/reports/${reportId}/review`;
export const AUDITS_HISTORY = '/audits/history';

// Dashboard
export const DASHBOARD_COMPANY = (companyId) => `/dashboard/company/${companyId}`;
export const DASHBOARD_ADMIN = '/dashboard/admin';
