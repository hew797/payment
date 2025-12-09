import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { PaymentMethod, Order, Plan } from '../types';
import { paymentService } from '../services/paymentService';
import { PAYMENT_CONFIG } from '../constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null; // The created order
  planName?: string;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, planName, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.WECHAT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await paymentService.processPayment(order.id, selectedMethod);
      if (result.success) {
        onPaymentSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Payment system error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  支付订单
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    您正在购买 <strong className="text-gray-900">{planName || order.productName}</strong>.
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ¥{order.amount.toLocaleString()}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">选择支付方式</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedMethod(PaymentMethod.WECHAT)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                        selectedMethod === PaymentMethod.WECHAT
                          ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500'
                          : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-green-600 mb-1">
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,14c-4,0-7.2-2.7-7.2-6s3.2-6,7.2-6c3.9,0,7.1,2.6,7.2,5.9c0,0.1,0,0.1,0,0.1c0,0.1,0,0.2,0,0.3 c-0.1,3.2-3.3,5.7-7.2,5.7H8.5z M6.1,6.5C5.7,6.5,5.4,6.8,5.4,7.2s0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7S6.5,6.5,6.1,6.5z M10.8,6.5 c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7S11.2,6.5,10.8,6.5z M16.5,6.5c-0.1,0-0.2,0-0.3,0.1 c1.6,1,2.7,2.5,2.7,4.3c0,0.2,0,0.4,0,0.6c2.8-0.3,4.9-2.2,4.9-4.5c0-2.5-2.6-4.5-5.8-4.5C17.4,2.5,16.9,2.5,16.5,6.5z M19.4,5.4 c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5S19.7,5.4,19.4,5.4z M22.1,5.4c-0.3,0-0.5,0.2-0.5,0.5 s0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5S22.4,5.4,22.1,5.4z"/></svg>
                      </div>
                      <span className="font-medium text-sm">微信支付</span>
                    </button>

                    <button
                      onClick={() => setSelectedMethod(PaymentMethod.ALIPAY)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                        selectedMethod === PaymentMethod.ALIPAY
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-blue-600 mb-1">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.8,9.7l-4.6,0c0.3-0.9,0.5-1.9,0.7-2.9h4c0.5,0,0.9-0.4,0.9-0.9c0-0.5-0.4-0.9-0.9-0.9h-5.4V3.5 c0-0.5-0.4-0.9-0.9-0.9c-0.5,0-0.9,0.4-0.9,0.9V5H5.4C4.9,5,4.5,5.4,4.5,5.9c0,0.5,0.4,0.9,0.9,0.9h9.1c-0.2,0.9-0.5,1.7-0.8,2.5 H5.4C4.9,9.3,4.5,9.7,4.5,10.2c0,0.5,0.4,0.9,0.9,0.9h7.7c-0.8,1.6-2,3-3.6,4.1c-0.9-0.6-1.7-1.4-2.4-2.2c-0.3-0.4-0.9-0.4-1.3-0.1 c-0.4,0.3-0.4,0.9-0.1,1.3c0.8,1,1.8,1.9,2.8,2.7c-2,1-4.3,1.6-6.6,1.7C1.5,18.7,1,19.2,1,19.7c0,0.5,0.4,0.9,0.9,0.9 c2.7-0.1,5.3-0.9,7.7-2.1c2.8,1.4,6,2.1,9.2,2.1c0.5,0,0.9-0.4,0.9-0.9c0-0.5-0.4-0.9-0.9-0.9c-2.8,0-5.5-0.6-8-1.8 c1.7-1.1,3.1-2.6,4-4.3l4,0c0.5,0,0.9-0.4,0.9-0.9C19.7,10.1,19.3,9.7,18.8,9.7z"/></svg>
                      </div>
                      <span className="font-medium text-sm">支付宝</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-500 text-center">
                    模拟支付环境: 配置ID {selectedMethod === PaymentMethod.WECHAT ? PAYMENT_CONFIG.wechat.appId : PAYMENT_CONFIG.alipay.appId}
                </div>
                
                {error && (
                  <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={isProcessing}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed items-center"
              onClick={handlePay}
            >
              {isProcessing && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
              {isProcessing ? '处理中...' : '确认支付'}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
              disabled={isProcessing}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;