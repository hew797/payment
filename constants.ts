import { Plan, PlanType, OrderStatus, PaymentMethod } from './types';

// ==========================================
// CONFIGURATION (模拟配置文件)
// ==========================================
export const APP_CONFIG = {
  appName: "SaaS Admin Pro",
  currencySymbol: "¥",
  apiBaseUrl: "https://api.example.com", // Placeholder
  localStorageKeys: {
    ORDERS: "saas_app_orders_db",
    SUBSCRIPTION: "saas_app_subscription_db"
  }
};

export const PAYMENT_CONFIG = {
  alipay: {
    appId: "2021000000000000", // Replace with real config
    gatewayUrl: "https://openapi.alipay.com/gateway.do",
    publicKey: "-----BEGIN PUBLIC KEY...-----",
    privateKey: "-----BEGIN PRIVATE KEY...-----"
  },
  wechat: {
    appId: "wx1234567890abcdef", // Replace with real config
    mchId: "1234567890",
    apiKey: "abcdef1234567890abcdef1234567890"
  }
};

// ==========================================
// MOCK DATA
// ==========================================

export const MOCK_USER = {
  name: "租户管理员",
  email: "admin@example.com",
  role: "管理员",
  avatarUrl: "https://picsum.photos/100/100" // Random avatar
};

export const PLANS: Plan[] = [
  {
    id: PlanType.FREE,
    name: "体验版",
    price: 0,
    period: "永久免费",
    features: [
      { name: "最多5个用户", included: true },
      { name: "100条短信/月", included: true },
      { name: "10份简历解析", included: true },
      { name: "基础AI功能", included: true },
      { name: "高级报表", included: false },
      { name: "定制化开发", included: false },
    ]
  },
  {
    id: PlanType.BASIC,
    name: "基础版",
    price: 299,
    period: "每月",
    features: [
      { name: "最多10个用户", included: true },
      { name: "1,000条短信/月", included: true },
      { name: "50份简历解析", included: true },
      { name: "基础AI功能", included: true },
      { name: "基础报表", included: true },
      { name: "定制化开发", included: false },
    ]
  },
  {
    id: PlanType.PRO,
    name: "专业版",
    price: 999,
    period: "每月",
    isRecommended: true,
    features: [
      { name: "最多50个用户", included: true },
      { name: "5,000条短信/月", included: true },
      { name: "200份简历解析", included: true },
      { name: "完整AI功能", included: true },
      { name: "高级报表", included: true },
      { name: "定制化开发", included: false },
    ]
  },
  {
    id: PlanType.ENTERPRISE,
    name: "企业版",
    price: 2999,
    period: "每月",
    features: [
      { name: "无限用户", included: true },
      { name: "20,000条短信/月", included: true },
      { name: "1,000份简历解析", included: true },
      { name: "完整AI功能", included: true },
      { name: "高级报表", included: true },
      { name: "定制化开发", included: true },
    ]
  }
];

// Initial mock orders if local storage is empty
export const INITIAL_ORDERS_MOCK = [
  {
    id: "ORD-20230815-001",
    tenantName: "ABC科技有限公司",
    productName: "HR管理系统企业版",
    amount: 25000,
    createdAt: "2023-08-15 10:23:45",
    paidAt: "2023-08-15 10:25:12",
    status: OrderStatus.PAID,
    paymentMethod: PaymentMethod.ALIPAY
  },
  {
    id: "ORD-20230814-003",
    tenantName: "XYZ贸易有限公司",
    productName: "HR管理系统专业版",
    amount: 12000,
    createdAt: "2023-08-14 14:35:12",
    paidAt: "2023-08-14 14:36:45",
    status: OrderStatus.PAID,
    paymentMethod: PaymentMethod.WECHAT
  },
  {
    id: "ORD-20230814-002",
    tenantName: "创新软件开发",
    productName: "HR管理系统基础版",
    amount: 5000,
    createdAt: "2023-08-14 11:45:33",
    status: OrderStatus.PENDING,
    paymentMethod: undefined
  },
  {
    id: "ORD-20230813-001",
    tenantName: "数据智能分析",
    productName: "HR管理系统专业版",
    amount: 12000,
    createdAt: "2023-08-13 09:15:27",
    paidAt: "2023-08-13 09:20:05",
    status: OrderStatus.PAID,
    paymentMethod: PaymentMethod.ALIPAY
  },
  {
    id: "ORD-20230812-002",
    tenantName: "云端解决方案",
    productName: "财务管理系统",
    amount: 15000,
    createdAt: "2023-08-12 16:42:18",
    paidAt: "2023-08-12 16:45:22",
    status: OrderStatus.PAID,
    paymentMethod: PaymentMethod.WECHAT
  }
];