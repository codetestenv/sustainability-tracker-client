import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { AUTH_LOGIN } from '../../api/endpoints';
import { setCredentials } from './authSlice';
import { ROLE_REDIRECTS } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await axiosClient.post(AUTH_LOGIN, data);
      dispatch(setCredentials(res.data));

      if (res.data.isFirstLogin) {
        navigate('/change-password');
      } else {
        const redirect = ROLE_REDIRECTS[res.data.role] || '/dashboard';
        navigate(redirect);
      }
      toast.success(`Welcome back, ${res.data.fullName}!`);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setApiError('Invalid email or password. Please try again.');
      } else if (err.isNetworkError) {
        setApiError('Cannot connect to server. Please check your connection.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6">🌿</div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Corporate Sustainability<br />Tracking System
          </h1>
          <p className="text-primary-200 text-lg max-w-md leading-relaxed">
            Monitor, measure, and improve your organization's environmental, social,
            and governance performance.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { icon: '🌍', label: 'Environment', desc: 'Track CO₂, energy, water' },
              { icon: '🤝', label: 'Social', desc: 'Workforce & community' },
              { icon: '⚖️', label: 'Governance', desc: 'Compliance & ethics' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs text-primary-200 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-3xl">🌿</span>
            <span className="text-xl font-bold text-primary-800">EcoTrack</span>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                required
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                required
                {...register('password')}
              />

              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="text-red-500">⚠</span>
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 py-3"
                loading={isSubmitting}
              >
                Sign in
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Corporate use only. Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
