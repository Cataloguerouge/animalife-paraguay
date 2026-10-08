export type Currency = "PYG";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  animal: "PERROS" | "GATOS" | "BOVINOS" | "EQUINOS" | "CAMPO" | "OTROS";
  description: string;
  packageSize?: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string;
  verified: boolean;
  regulated: boolean;
  requiresPrescription: boolean;
  featured: boolean;
  active: boolean;
};

export type CartItem = { productId: string; quantity: number };

export type OrderStatus =
  | "CREATED" | "PAYMENT_PENDING" | "PAID" | "PROCESSING"
  | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";
export type DeliveryStatus = "PENDING" | "READY" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface PaymentProvider {
  createPayment(input: { orderId: string; amount: number; currency: Currency; returnUrl: string }): Promise<{ id: string; url?: string }>;
  getPaymentStatus(id: string): Promise<PaymentStatus>;
  cancelPayment(id: string): Promise<void>;
  refundPayment(id: string): Promise<void>;
  handleWebhook(payload: unknown): Promise<void>;
}

export interface DeliveryProvider {
  calculateRate(input: { department: string; city: string; weightKg: number }): Promise<{ amount: number; eta: string }>;
  createShipment(input: { orderId: string; address: Record<string,string> }): Promise<{ trackingNumber: string }>;
  trackShipment(trackingNumber: string): Promise<{ status: DeliveryStatus }>;
  cancelShipment(trackingNumber: string): Promise<void>;
}

export const formatPYG = (value: number) =>
  `Gs. ${new Intl.NumberFormat("es-PY").format(value)}`;
