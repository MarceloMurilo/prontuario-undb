/**
 * DashboardLayout
 * Layout principal com header e sidebar
 */

import { useState } from 'react';
import { Header } from '../organisms/header';
import { Sidebar } from '../organisms/sidebar';

export function DashboardLayout({
  children,
  userName,
  userAvatar,
  sidebarItems = [],
  currentPath = '',
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={currentPath}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          userName={userName}
          userAvatar={userAvatar}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
