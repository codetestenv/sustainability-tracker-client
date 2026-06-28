import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';

// Auth
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const ChangePasswordPage = lazy(() => import('../features/auth/ChangePasswordPage'));

// Admin
const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage'));
const CompanyManagementPage = lazy(() => import('../features/admin/CompanyManagementPage'));
const DepartmentManagementPage = lazy(() => import('../features/admin/DepartmentManagementPage'));
const UserManagementPage = lazy(() => import('../features/admin/UserManagementPage'));

// Dashboard
const CompanyDashboardPage = lazy(() => import('../features/dashboard/CompanyDashboardPage'));

// Data
const EmissionsPage = lazy(() => import('../features/data/EmissionsPage'));
const EnergyPage = lazy(() => import('../features/data/EnergyPage'));
const WaterPage = lazy(() => import('../features/data/WaterPage'));
const WastePage = lazy(() => import('../features/data/WastePage'));
const SocialPage = lazy(() => import('../features/data/SocialPage'));
const GovernancePage = lazy(() => import('../features/data/GovernancePage'));

// Workflow
const ApprovalsPage = lazy(() => import('../features/approvals/ApprovalsPage'));
const ReportsPage = lazy(() => import('../features/reports/ReportsPage'));
const AuditPage = lazy(() => import('../features/audits/AuditPage'));
const ScoreHistoryPage = lazy(() => import('../features/scores/ScoreHistoryPage'));

// Error pages
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const { ADMIN, SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE, AUDITOR } = ROLES;
const DATA_ROLES = [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE];

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

const AppRouter = () => {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Protected routes inside AppShell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* Admin */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/companies"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <CompanyManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/departments"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <DepartmentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Company Dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={[SUSTAINABILITY_MANAGER, DEPT_MANAGER]}>
                <CompanyDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Data submissions */}
          <Route path="data/emissions" element={<ProtectedRoute allowedRoles={DATA_ROLES}><EmissionsPage /></ProtectedRoute>} />
          <Route path="data/energy" element={<ProtectedRoute allowedRoles={DATA_ROLES}><EnergyPage /></ProtectedRoute>} />
          <Route path="data/water" element={<ProtectedRoute allowedRoles={DATA_ROLES}><WaterPage /></ProtectedRoute>} />
          <Route path="data/waste" element={<ProtectedRoute allowedRoles={DATA_ROLES}><WastePage /></ProtectedRoute>} />
          <Route path="data/social" element={<ProtectedRoute allowedRoles={DATA_ROLES}><SocialPage /></ProtectedRoute>} />
          <Route path="data/governance" element={<ProtectedRoute allowedRoles={DATA_ROLES}><GovernancePage /></ProtectedRoute>} />

          {/* Approvals */}
          <Route
            path="approvals"
            element={
              <ProtectedRoute allowedRoles={[DEPT_MANAGER, SUSTAINABILITY_MANAGER]}>
                <ApprovalsPage />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={[SUSTAINABILITY_MANAGER]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Score History */}
          <Route
            path="scores"
            element={
              <ProtectedRoute allowedRoles={[SUSTAINABILITY_MANAGER]}>
                <ScoreHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Audits */}
          <Route
            path="audits"
            element={
              <ProtectedRoute allowedRoles={[AUDITOR]}>
                <AuditPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route index element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SuspenseWrapper>
  );
};

export default AppRouter;
