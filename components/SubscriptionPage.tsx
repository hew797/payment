import React, { useState, useEffect } from 'react';
import { PLANS, MOCK_USER } from '../constants';
import { Check, X } from 'lucide-react';
import { Plan, UserSubscription, PlanType } from '../types';
import { storageService } from '../services/storageService';
import { paymentService } from '../services/paymentService';
import PaymentModal from './PaymentModal';

interface SubscriptionPageProps {
    onSubscribeSuccess?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSubscribeSuccess }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Payment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [targetPlan, setTargetPlan] = useState<Plan | null>(null);

  useEffect(() => {
    // Load initial data
    const sub = storageService.getSubscription();
    setSubscription(sub);
  }, []);

  const getCurrentPlan = () => {
    return PLANS.find(p => p.id === subscription?.planId) || PLANS[0];
  };

  const handleSelectPlan = async (plan: Plan) => {
    // Do not create order for Free plan in this demo logic, or simulate instant switch
    if (plan.id === PlanType.FREE) {
        alert("不能降级到体验版，请联系客服。");
        return;
    }

    setLoading(true);
    try {
        const orderId = await paymentService.createSubscriptionOrder(plan, MOCK_USER.name);
        const orders = storageService.getOrders();
        const order = orders.find(o => o.id === orderId);
        
        setPendingOrder(order);
        setTargetPlan(plan);
        setIsModalOpen(true);
    } catch (e) {
        console.error(e);
        alert("创建订单失败");
    } finally {
        setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
      // Refresh subscription data
      const sub = storageService.getSubscription();
      setSubscription(sub);
      if (onSubscribeSuccess) onSubscribeSuccess();
  };

  if (!subscription) return <div>Loading...</div>;

  const currentPlan = getCurrentPlan();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">订阅管理</h2>
      </div>

      {/* Current Subscription Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium mb-4">当前订阅</h3>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{currentPlan.name}</h1>
              {subscription.status === 'ACTIVE' ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  生效中
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                  已过期
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              有效期至：<span className="text-gray-900 font-medium">{subscription.validUntil}</span>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
             <span className="text-2xl font-bold text-blue-600">
                ¥{currentPlan.price}
             </span>
             <span className="text-gray-500 text-sm ml-1">/{currentPlan.period}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => handleSelectPlan(currentPlan)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            立即续费
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors shadow-sm">
            升级套餐
          </button>
          <button className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-md hover:bg-gray-500 transition-colors shadow-sm">
            选择套餐
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">订阅套餐</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === subscription.planId;
            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg flex flex-col
                  ${isCurrent ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}
                  ${plan.isRecommended ? 'border-t-4 border-t-blue-500' : ''}
                `}
              >
                {plan.isRecommended && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-2">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                            推荐
                        </span>
                    </div>
                )}

                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 text-center">{plan.name}</h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold text-blue-600">¥{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.period.replace('每月', '月')}</span>
                  </div>
                   <div className="mt-2 text-center text-sm text-gray-400">
                        {plan.id === PlanType.FREE ? '永久免费' : '每月'}
                   </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 shrink-0 mr-2" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                    {isCurrent ? (
                         <button 
                           disabled
                           className="w-full py-2.5 bg-gray-100 text-gray-500 font-bold rounded-lg cursor-not-allowed"
                         >
                            当前套餐
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleSelectPlan(plan)}
                            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-sm"
                        >
                            选择套餐
                        </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        order={pendingOrder}
        planName={targetPlan?.name}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default SubscriptionPage;