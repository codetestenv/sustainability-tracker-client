import { createSlice } from '@reduxjs/toolkit';

const stored = (() => {
  try {
    return {
      token: localStorage.getItem('accessToken'),
      email: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName'),
      role: localStorage.getItem('role'),
      companyId: localStorage.getItem('companyId'),
      departmentId: localStorage.getItem('departmentId'),
      isFirstLogin: localStorage.getItem('isFirstLogin') === 'true',
    };
  } catch {
    return {};
  }
})();

const initialState = {
  token: stored.token || null,
  email: stored.email || null,
  fullName: stored.fullName || null,
  role: stored.role || null,
  companyId: stored.companyId ? Number(stored.companyId) : null,
  departmentId: stored.departmentId ? Number(stored.departmentId) : null,
  isFirstLogin: stored.isFirstLogin || false,
  isAuthenticated: !!stored.token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, email, fullName, role, companyId, departmentId, isFirstLogin } =
        action.payload;
      state.token = accessToken;
      state.email = email;
      state.fullName = fullName;
      state.role = role;
      state.companyId = companyId;
      state.departmentId = departmentId;
      state.isFirstLogin = isFirstLogin;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('email', email);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('role', role);
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('departmentId', departmentId);
      localStorage.setItem('isFirstLogin', isFirstLogin);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.fullName = null;
      state.role = null;
      state.companyId = null;
      state.departmentId = null;
      state.isFirstLogin = false;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    clearFirstLogin: (state) => {
      state.isFirstLogin = false;
      localStorage.setItem('isFirstLogin', 'false');
    },
  },
});

export const { setCredentials, logout, clearFirstLogin } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectRole = (state) => state.auth.role;
export const selectCompanyId = (state) => state.auth.companyId;
export const selectDepartmentId = (state) => state.auth.departmentId;
export const selectIsFirstLogin = (state) => state.auth.isFirstLogin;
export const selectFullName = (state) => state.auth.fullName;
