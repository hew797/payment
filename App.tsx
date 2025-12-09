import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SubscriptionPage from './components/SubscriptionPage';
import OrderPage from './components/OrderPage';
import { MOCK_USER } from './constants';

function App() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'orders'>('subscription');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Used to force refresh order data if a subscription is bought
  const [dataVersion, setDataVersion] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubscribeSuccess = () => {
      // Force refresh data in OrderPage if user navigates there later
      setDataVersion(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title={activeTab === 'subscription' ? '订阅管理' : '订单管理'} 
          user={MOCK_USER}
          onMenuClick={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'subscription' && (
              <SubscriptionPage onSubscribeSuccess={handleSubscribeSuccess} />
            )}
            {activeTab === 'orders' && (
              <OrderPage key={dataVersion} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;