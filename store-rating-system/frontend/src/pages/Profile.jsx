import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="card space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
          <span className="inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {user?.role}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
          <p className="font-medium">{user?.address || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
