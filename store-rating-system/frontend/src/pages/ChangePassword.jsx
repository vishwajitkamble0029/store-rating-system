import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]/~`;']).{8,16}$/;

const ChangePassword = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input type="password" className="input" {...register('oldPassword', { required: 'Required' })} />
          {errors.oldPassword && <p className="error-text">{errors.oldPassword.message}</p>}
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            placeholder="8-16 chars, upper, lower, number, special"
            {...register('newPassword', {
              required: 'Required',
              pattern: { value: PASSWORD_REGEX, message: 'Must include uppercase, lowercase, number & special character' },
            })}
          />
          {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input"
            {...register('confirmPassword', {
              required: 'Required',
              validate: (val) => val === watch('newPassword') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
