import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Clock, CheckCircle2, DollarSign, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order, OrderStatus, DashboardStats } from '../types';
import { storageService } from '../services/storageService';
import { paymentService } from '../services/paymentService';
import PaymentModal from './PaymentModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

interface OrderPageProps {
  // refresh trigger
}

const OrderPage: React.FC<OrderPageProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalOrders: 0, todayOrders: 0, pendingOrders: 0, totalRevenue: 0 });
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Payment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Simple Chart Data (Derived from orders)
  const chartData = [
    { name: 'Jan', val: 4000 },
    { name: 'Feb', val: 3000 },
    { name: 'Mar', val: 5000 },
    { name: 'Apr', val: 8000 },
    { name: 'May', val: 6000 },
    { name: 'Jun', val: 9000 },
    { name: 'Jul', val: 12000 },
  ];

  const loadData = () => {
    const allOrders = storageService.getOrders();
    setOrders(allOrders);

    // Calculate Stats
    const todayStr = new Date().toISOString().split('T')[0]; // simple YYYY-MM-DD check
    const todayCount = allOrders.filter(o => o.createdAt.startsWith(todayStr.replace(/-/g, '-'))).length; // Rough check matching format
    const pendingCount = allOrders.filter(o => o.status === OrderStatus.PENDING).length;
    const revenue = allOrders.filter(o => o.status === OrderStatus.PAID).reduce((acc, curr) => acc + curr.amount, 0);

    setStats({
      totalOrders: allOrders.length,
      todayOrders: todayCount,
      pendingOrders: pendingCount,
      totalRevenue: revenue
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let res = orders;

    // 1. Filter by Tab
    if (activeTab !== 'ALL') {
      res = res.filter(o => o.status === activeTab);
    }

    // 2. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.tenantName.toLowerCase().includes(q) || 
        o.productName.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(res);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePaymentClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
      loadData(); // Reload orders from storage
  };

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case OrderStatus.PAID:
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">已完成</span>;
      case OrderStatus.PENDING:
        return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">待支付</span>;
      case OrderStatus.CANCELLED:
        return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">已取消</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">订单管理</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm">
           <Download size={16} />
           导出订单
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">总订单数</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">平台历史订单总数</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingCart size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">今日订单</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayOrders}</p>
                <p className="text-xs text-gray-400 mt-1">今日新增订单数量</p>
            </div>
             <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle2 size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">待处理订单</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                <p className="text-xs text-gray-400 mt-1">待支付或待处理的订单</p>
            </div>
             <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Clock size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between overflow-hidden relative">
            <div className="z-10 relative">
                <p className="text-gray-500 text-sm font-medium">总收入</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">¥{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">平台历史订单总收入</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg z-10 relative">
                <DollarSign size={24} />
            </div>
            {/* Subtle Chart Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="val" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map((tab) => {
            const labelMap: any = { ALL: '全部订单', PENDING: '待处理', PAID: '已完成', CANCELLED: '已取消' };
            return (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === tab 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {labelMap[tab]}
                </button>
            )
        })}
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-bold text-gray-800 text-lg">订单列表</h3>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索订单..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">订单号</th>
                <th className="px-6 py-4">租户名称</th>
                <th className="px-6 py-4">商品名称</th>
                <th className="px-6 py-4">金额</th>
                <th className="px-6 py-4">下单时间</th>
                <th className="px-6 py-4">支付时间</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.tenantName}</td>
                    <td className="px-6 py-4 text-gray-900">{order.productName}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">¥{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{order.createdAt}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{order.paidAt || '-'}</td>
                    <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded text-xs transition-colors">
                                详情
                            </button>
                            {order.status === OrderStatus.PENDING && (
                                <button 
                                    onClick={() => handlePaymentClick(order)}
                                    className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-xs transition-colors shadow-sm"
                                >
                                    去支付
                                </button>
                            )}
                            {order.status === OrderStatus.PAID && (
                                 <button className="bg-blue-400 text-white hover:bg-blue-500 px-3 py-1 rounded text-xs transition-colors shadow-sm">
                                    发票
                                </button>
                            )}
                        </div>
                    </td>
                    </tr>
                ))
              ) : (
                  <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          暂无相关订单数据
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} className="mr-1"/> 上一页
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded border text-sm flex items-center justify-center transition-colors
                        ${currentPage === page 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 border-gray-300'
                        }`}
                >
                    {page}
                </button>
            ))}
             <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                下一页 <ChevronRight size={16} className="ml-1"/>
            </button>
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default OrderPage;