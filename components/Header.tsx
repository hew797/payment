import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  title: string;
  user: User;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden mr-3"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            12
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white font-semibold shadow-sm">
            {user.name.substring(0, 2)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;