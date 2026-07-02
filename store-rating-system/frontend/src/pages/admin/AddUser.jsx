import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]/~`;']).{8,16}$/;

const AddUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { role: 'USER' } });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await adminService.createUser(data);
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to create user';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            placeholder="20-60 characters"
            {...register('name', {
              required: 'Required',
              minLength: { value: 20, message: 'Min 20 characters' },
              maxLength: { value: 60, message: 'Max 60 characters' },
            })}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Address</label>
          <textarea
            rows={2}
            className="input"
            {...register('address', { maxLength: { value: 400, message: 'Max 400 characters' } })}
          />
          {errors.address && <p className="error-text">{errors.address.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="8-16 chars, upper, lower, number, special"
            {...register('password', {
              required: 'Required',
              pattern: { value: PASSWORD_REGEX, message: 'Must meet complexity requirements' },
            })}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label">Role</label>
          <select className="input" {...register('role')}>
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/users')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
