// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';

// NOTE: The security check is handled in middleware.ts. This page assumes access is granted.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
        <h1 className="text-xl font-bold border-b pb-2 mb-4">Aegis Admin</h1>
        <nav>
          <Link href="/admin">
            <p className="block py-2 px-3 rounded hover:bg-gray-700">Dashboard</p>
          </Link>
          <Link href="/admin/ranking">
            <p className="block py-2 px-3 rounded hover:bg-gray-700">Manage Rankings</p>
          </Link>
          <Link href="/admin/announcements">
            <p className="block py-2 px-3 rounded hover:bg-gray-700">Manage News</p>
          </Link>
          <Link href="/admin/wanted">
            <p className="block py-2 px-3 rounded hover:bg-gray-700">Moderate Wanted</p>
          </Link>
          <Link href="/admin/users">
            <p className="block py-2 px-3 rounded hover:bg-gray-700">User Management</p>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}