import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Profile from './pages/Profile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import AddUser from './pages/admin/AddUser.jsx';
import Stores from './pages/admin/Stores.jsx';
import AddStore from './pages/admin/AddStore.jsx';
import UserDetails from './pages/admin/UserDetails.jsx';

import UserDashboard from './pages/user/UserDashboard.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';

import { useAuth } from './hooks/useAuth';

const roleHome = {
  ADMIN: '/admin/dashboard',
  USER: '/user/dashboard',
  OWNER: '/owner/dashboard',
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role] || '/login'} replace />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Private routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Admin only */}
          <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/stores" element={<Stores />} />
            <Route path="/admin/stores/add" element={<AddStore />} />
          </Route>

          {/* Normal user only */}
          <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Store owner only */}
          <Route element={<RoleProtectedRoute allowedRoles={['OWNER']} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
