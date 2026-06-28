import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const { ADMIN, SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE, AUDITOR } = ROLES;

const navSections = [
  {
    label: 'Admin',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: '📊', roles: [ADMIN] },
      { to: '/admin/companies', label: 'Companies', icon: '🏢', roles: [ADMIN] },
      { to: '/admin/departments', label: 'Departments', icon: '🏗️', roles: [ADMIN] },
      { to: '/admin/users', label: 'Users', icon: '👤', roles: [ADMIN] },
    ],
  },
  {
    label: 'Overview',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: '📈',
        roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER],
      },
    ],
  },
  {
    label: 'Data Entry',
    items: [
      { to: '/data/emissions', label: 'Emissions', icon: '💨', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
      { to: '/data/energy', label: 'Energy', icon: '⚡', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
      { to: '/data/water', label: 'Water', icon: '💧', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
      { to: '/data/waste', label: 'Waste', icon: '♻️', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
      { to: '/data/social', label: 'Social', icon: '👥', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
      { to: '/data/governance', label: 'Governance', icon: '🏛️', roles: [SUSTAINABILITY_MANAGER, DEPT_MANAGER, EMPLOYEE] },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/approvals', label: 'Approvals', icon: '✅', roles: [DEPT_MANAGER, SUSTAINABILITY_MANAGER], badge: 'approvals' },
      { to: '/reports', label: 'Reports', icon: '📋', roles: [SUSTAINABILITY_MANAGER], badge: 'reports' },
      { to: '/scores', label: 'Score History', icon: '🏆', roles: [SUSTAINABILITY_MANAGER] },
    ],
  },
  {
    label: 'Audit',
    items: [
      { to: '/audits', label: 'Audits', icon: '🔍', roles: [AUDITOR], badge: 'audits' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose, pendingCounts = {} }) => {
  const { role, fullName, email } = useAuth();

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col
          bg-gradient-to-b from-primary-900 to-primary-800 text-white
          shadow-sidebar transition-transform duration-300 ease-in-out
          w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: '256px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700/50">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">
            🌿
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">EcoTrack</div>
            <div className="text-xs text-primary-200">Sustainability</div>
          </div>
          <button
            className="ml-auto lg:hidden p-1 rounded hover:bg-white/10"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {visibleSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-primary-300 text-xs font-semibold uppercase tracking-widest px-3 mb-1">
                {section.label}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5
                    transition-all duration-150 group
                    ${isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-primary-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && pendingCounts[item.badge] > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse-dot">
                      {pendingCounts[item.badge]}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-primary-700/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
              {fullName?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{fullName}</p>
              <p className="text-xs text-primary-300 truncate">{email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
