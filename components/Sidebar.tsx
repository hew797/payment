import React from 'react';
import { CreditCard, ShoppingCart, LayoutDashboard, Settings, Users, BarChart3, Menu } from 'lucide-react';

interface SidebarProps {
  activeTab: 'subscription' | 'orders';
  setActiveTab: (tab: 'subscription' | 'orders') => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard size={20} />, disabled: true },
    { id: 'orders', label: '订单管理', icon: <ShoppingCart size={20} />, disabled: false },
    { id: 'subscription', label: '订阅管理', icon: <CreditCard size={20} />, disabled: false },
    { id: 'users', label: '用户管理', icon: <Users size={20} />, disabled: true },
    { id: 'reports', label: '统计报表', icon: <BarChart3 size={20} />, disabled: true },
    { id: 'settings', label: '系统设置', icon: <Settings size={20} />, disabled: true },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800 border-b border-slate-700">
          <span className="text-xl font-bold tracking-wider">SaaS Admin</span>
          <button onClick={toggleSidebar} className="lg:hidden">
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id as any)}
              disabled={item.disabled}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
             <div>
                <p className="text-sm font-medium">SaaS Version 2.4.0</p>
                <p className="text-xs text-slate-500">Latest Build</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;