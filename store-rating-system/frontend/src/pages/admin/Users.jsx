import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import SearchBar from '../../components/SearchBar.jsx';
import SortableHeader from '../../components/SortableHeader.jsx';
import Pagination from '../../components/Pagination.jsx';
import Loader from '../../components/Loader.jsx';
import { EmptyState, ErrorState } from '../../components/EmptyState.jsx';

const ROLE_COLORS = {
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  USER: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  OWNER: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminService
      .listUsers({ search, role: roleFilter || undefined, sortBy, sortOrder, page, limit: 10 })
      .then((res) => {
        setUsers(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [search, roleFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/admin/users/add" className="btn-primary">
          + Add User
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, email, address..." />
        <select
          className="input sm:w-48"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="OWNER">Store Owner</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} />
        ) : users.length === 0 ? (
          <EmptyState message="No users found." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeader label="Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Role" field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="max-w-xs truncate">{u.address || '—'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                  </td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="text-primary-600 hover:underline text-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Users;
