// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  ALIPAY = 'ALIPAY',
  WECHAT = 'WECHAT',
  UNKNOWN = 'UNKNOWN'
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

// Interfaces
export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  period: string; // e.g., '每月', '永久'
  features: { name: string; included: boolean }[];
  isRecommended?: boolean;
  color?: string;
}

export interface UserSubscription {
  planId: PlanType;
  validUntil: string; // ISO Date string
  status: 'ACTIVE' | 'EXPIRED';
}

export interface Order {
  id: string;
  tenantName: string;
  productName: string;
  amount: number;
  createdAt: string; // ISO Date string
  paidAt?: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}