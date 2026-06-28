import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../api/axiosClient';
import { DASHBOARD_COMPANY, AUDITS_PENDING } from '../../api/endpoints';
import { ROLES } from '../../utils/constants';

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, companyId } = useAuth();
  const [pendingCounts, setPendingCounts] = useState({
    approvals: 0,
    reports: 0,
    audits: 0,
  });

  const loadPendingCounts = useCallback(async () => {
    try {
      if (role === ROLES.SUSTAINABILITY_MANAGER || role === ROLES.DEPT_MANAGER) {
        if (companyId) {
          const res = await axiosClient.get(DASHBOARD_COMPANY(companyId));
          setPendingCounts({
            approvals: res.data?.pendingApprovals || 0,
            reports: res.data?.pendingReports || 0,
            audits: 0,
          });
        }
      } else if (role === ROLES.AUDITOR) {
        const res = await axiosClient.get(AUDITS_PENDING);
        setPendingCounts({
          approvals: 0,
          reports: 0,
          audits: res.data?.length || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch pending counts in sidebar shell:', err);
    }
  }, [role, companyId]);

  useEffect(() => {
    loadPendingCounts();
    // Poll every 30 seconds for live badge updates
    const interval = setInterval(loadPendingCounts, 30000);
    return () => clearInterval(interval);
  }, [loadPendingCounts]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCounts={pendingCounts}
      />

      {/* Main content - offset by sidebar width on large screens */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet context={{ refreshPendingCounts: loadPendingCounts }} />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
