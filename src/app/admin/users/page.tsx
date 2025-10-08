// app/admin/users/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users'); 
    if (res.ok) {
      setUsers(await res.json());
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Are you sure you want to change user ${userId}'s role to ${newRole}?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, new_role: newRole }),
    });

    if (res.ok) {
      alert('Role updated!');
      fetchUsers(); // Refresh the list
    } else {
      const error = await res.json();
      alert(`Error updating role: ${error.error}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 font-semibold text-blue-600">{user.role}</td>
                <td className="px-6 py-4 space-x-2">
                  {user.role === 'user' ? (
                    <button onClick={() => handleRoleChange(user.id, 'admin')} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Make Admin</button>
                  ) : (
                    <button onClick={() => handleRoleChange(user.id, 'user')} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Revoke Admin</button>
                  )}
                  {/* Additional actions like 'Ban' or 'Reset Password' can be added here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}