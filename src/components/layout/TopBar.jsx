import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';

const routeTitles = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/companies': 'Company Management',
  '/admin/departments': 'Department Management',
  '/admin/users': 'User Management',
  '/dashboard': 'Company Dashboard',
  '/data/emissions': 'Emissions Data',
  '/data/energy': 'Energy Data',
  '/data/water': 'Water Data',
  '/data/waste': 'Waste Data',
  '/data/social': 'Social Data',
  '/data/governance': 'Governance Data',
  '/approvals': 'Approvals',
  '/reports': 'ESG Reports',
  '/scores': 'Score History',
  '/audits': 'Audits',
};

const TopBar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { fullName, role } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);

  const title = routeTitles[pathname] || 'Dashboard';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const roleBadge = {
    ADMIN: 'bg-purple-100 text-purple-700',
    SUSTAINABILITY_MANAGER: 'bg-green-100 text-green-700',
    DEPT_MANAGER: 'bg-blue-100 text-blue-700',
    EMPLOYEE: 'bg-gray-100 text-gray-600',
    AUDITOR: 'bg-orange-100 text-orange-700',
  }[role] || 'bg-gray-100 text-gray-600';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden btn-icon text-gray-500"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className={`hidden sm:inline-flex badge ${roleBadge}`}>
          {role?.replace(/_/g, ' ')}
        </span>

        <div className="relative">
          <button
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-800 text-white flex items-center justify-center text-sm font-bold">
              {fullName?.[0] || '?'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">{fullName}</span>
            <span className="text-gray-400 text-xs">▾</span>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1 z-20 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-medium text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  onClick={handleLogout}
                >
                  🚪 Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
