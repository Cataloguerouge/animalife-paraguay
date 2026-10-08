import type {DeliveryProvider,PaymentProvider,PaymentStatus,DeliveryStatus} from "@animalife/shared";

export const mockPaymentProvider: PaymentProvider={
 async createPayment({orderId}){return {id:`mock_${orderId}`,url:"/checkout?payment=mock"};},
 async getPaymentStatus(_id):Promise<PaymentStatus>{return "PENDING";},
 async cancelPayment(_id){},
 async refundPayment(_id){},
 async handleWebhook(_payload){}
};

export const mockDeliveryProvider: DeliveryProvider={
 async calculateRate({department,city}){return {amount: department.toLowerCase()==="central"&&city.toLowerCase()==="asunción"?25000:45000,eta:"1–3 días hábiles"};},
 async createShipment({orderId}){return {trackingNumber:`MOCK-${orderId.slice(0,8)}`};},
 async trackShipment(_tracking):Promise<{status:DeliveryStatus}>{return {status:"PENDING"};},
 async cancelShipment(_tracking){}
};
