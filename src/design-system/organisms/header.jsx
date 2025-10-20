/**
 * Header Component
 * Cabeçalho da aplicação
 */

import { Menu, Bell, LogOut } from 'lucide-react';
import { Avatar } from '../atoms/avatar';

export function Header({
  userName,
  userAvatar,
  onMenuClick,
  onLogout,
  showNotifications = true,
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-blue-600">
            Prontuário UNDB
          </h1>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-4">
          {showNotifications && (
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <Avatar src={userAvatar} name={userName} size="sm" />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
