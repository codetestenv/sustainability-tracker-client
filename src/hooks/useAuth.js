import { useSelector } from 'react-redux';
import { selectAuth, selectRole, selectCompanyId, selectDepartmentId, selectFullName } from '../features/auth/authSlice';

export const useAuth = () => {
  return useSelector(selectAuth);
};

export const useRole = () => useSelector(selectRole);
export const useCompanyId = () => useSelector(selectCompanyId);
export const useDepartmentId = () => useSelector(selectDepartmentId);
export const useFullName = () => useSelector(selectFullName);

export const useHasRole = (...roles) => {
  const role = useSelector(selectRole);
  return roles.includes(role);
};
