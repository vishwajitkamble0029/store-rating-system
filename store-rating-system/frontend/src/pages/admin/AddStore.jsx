import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';

const AddStore = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .listOwners()
      .then((res) => setOwners(res.data))
      .catch(() => toast.error('Failed to load store owners'));
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await adminService.createStore({ ...data, ownerId: data.ownerId || undefined });
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to create store';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add Store</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="label">Store Name</label>
          <input
            className="input"
            {...register('name', { required: 'Required', maxLength: { value: 60, message: 'Max 60 characters' } })}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Store Email</label>
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
          <label className="label">Assign Store Owner (optional)</label>
          <select className="input" {...register('ownerId')}>
            <option value="">— No owner assigned —</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Only users with the "Store Owner" role appear here.</p>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create Store'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/stores')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStore;
