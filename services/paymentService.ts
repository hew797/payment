import { PaymentMethod, OrderStatus, PlanType, Plan } from '../types';
import { storageService } from './storageService';

interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

class PaymentService {
  /**
   * Generates a new pending order for a subscription plan purchase/renewal
   */
  async createSubscriptionOrder(plan: Plan, tenantName: string): Promise<string> {
    // Generate a pseudo-random Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderId = `ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      id: orderId,
      tenantName: tenantName,
      productName: `SaaS系统 - ${plan.name}`,
      amount: plan.price,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      status: OrderStatus.PENDING,
    };

    // Save to local "database"
    storageService.addOrder(newOrder);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return orderId;
  }

  /**
   * Simulates processing a payment with Alipay or WeChat
   */
  async processPayment(orderId: string, method: PaymentMethod): Promise<PaymentResult> {
    console.log(`Processing payment for Order ${orderId} via ${method}...`);
    
    // Simulate API call delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success Simulation (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      // 1. Update Order Status
      storageService.updateOrderStatus(orderId, OrderStatus.PAID, method);

      // 2. If it was a subscription order, update the user's subscription
      const order = storageService.getOrders().find(o => o.id === orderId);
      if (order && order.productName.includes("SaaS系统")) {
        // Simple logic to find plan type from product name
        let planType = PlanType.BASIC;
        if (order.productName.includes("专业版")) planType = PlanType.PRO;
        if (order.productName.includes("企业版")) planType = PlanType.ENTERPRISE;
        if (order.productName.includes("体验版")) planType = PlanType.FREE;

        // Extend validity by 30 days
        const currentSub = storageService.getSubscription();
        const currentDate = new Date();
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
        
        storageService.saveSubscription({
            planId: planType,
            status: 'ACTIVE',
            validUntil: newDate.toISOString().split('T')[0]
        });
      }

      return {
        success: true,
        message: "支付成功",
        transactionId: `TXN-${Date.now()}`
      };
    } else {
      return {
        success: false,
        message: "支付超时或被拒绝，请重试"
      };
    }
  }
}

export const paymentService = new PaymentService();