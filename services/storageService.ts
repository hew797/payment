import { APP_CONFIG, INITIAL_ORDERS_MOCK, PLANS } from '../constants';
import { Order, OrderStatus, UserSubscription, PlanType } from '../types';

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class StorageService {
  // --- Orders ---

  getOrders(): Order[] {
    const data = localStorage.getItem(APP_CONFIG.localStorageKeys.ORDERS);
    if (!data) {
      // Initialize if empty
      this.saveOrders(INITIAL_ORDERS_MOCK as unknown as Order[]);
      return INITIAL_ORDERS_MOCK as unknown as Order[];
    }
    return JSON.parse(data);
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(APP_CONFIG.localStorageKeys.ORDERS, JSON.stringify(orders));
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    // Prepend new order
    const updatedOrders = [order, ...orders];
    this.saveOrders(updatedOrders);
  }

  updateOrderStatus(orderId: string, status: OrderStatus, paymentMethod?: any): void {
    const orders = this.getOrders();
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          paidAt: status === OrderStatus.PAID ? new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') : undefined,
          paymentMethod: paymentMethod || o.paymentMethod
        };
      }
      return o;
    });
    this.saveOrders(updatedOrders);
  }

  // --- Subscription ---

  getSubscription(): UserSubscription {
    const data = localStorage.getItem(APP_CONFIG.localStorageKeys.SUBSCRIPTION);
    if (!data) {
      const defaultSub: UserSubscription = {
        planId: PlanType.PRO,
        validUntil: "2023-11-30",
        status: 'ACTIVE'
      };
      this.saveSubscription(defaultSub);
      return defaultSub;
    }
    return JSON.parse(data);
  }

  saveSubscription(sub: UserSubscription): void {
    localStorage.setItem(APP_CONFIG.localStorageKeys.SUBSCRIPTION, JSON.stringify(sub));
  }
}

export const storageService = new StorageService();