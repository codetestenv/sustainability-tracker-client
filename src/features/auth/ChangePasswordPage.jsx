import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { AUTH_CHANGE_PASSWORD } from '../../api/endpoints';
import { clearFirstLogin, logout } from './authSlice';
import { ROLE_REDIRECTS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role, fullName } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await axiosClient.put(AUTH_CHANGE_PASSWORD, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      dispatch(clearFirstLogin());
      toast.success('Password changed successfully!');
      navigate(ROLE_REDIRECTS[role] || '/dashboard');
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error('Current password is incorrect.');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900">Set Your Password</h1>
          <p className="text-gray-500 mt-1">
            Welcome, <span className="font-semibold text-primary-800">{fullName}</span>!
            <br />Please create a new password to continue.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <p className="text-sm text-amber-700">
              This is your first login. You must set a new password before you can access the system.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Current (temporary) password"
              type="password"
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              required
              {...register('currentPassword')}
            />
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              hint="Min 8 characters, 1 uppercase, 1 number"
              error={errors.newPassword?.message}
              required
              {...register('newPassword')}
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={isSubmitting}
            >
              Set new password
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              className="text-sm text-gray-400 hover:text-gray-600 underline"
              onClick={handleLogout}
            >
              Sign in as a different user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
