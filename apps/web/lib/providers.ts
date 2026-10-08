import type {DeliveryProvider,PaymentProvider,PaymentStatus,DeliveryStatus} from "@animalife/shared";
import {createHash} from "node:crypto";

export const mockPaymentProvider: PaymentProvider={
 async createPayment({orderId}){return {id:`mock_${orderId}`,url:`/checkout?payment=mock&order=${orderId}`};},
 async getPaymentStatus(_id):Promise<PaymentStatus>{return "PENDING";},
 async cancelPayment(_id){},
 async refundPayment(_id){},
 async handleWebhook(_payload){}
};

export const pagoparPaymentProvider: PaymentProvider={
 async createPayment({orderId,amount,metadata}){
   const publicKey=process.env.PAGOPAR_PUBLIC_KEY;const privateKey=process.env.PAGOPAR_PRIVATE_KEY;
   if(!publicKey||!privateKey) throw new Error("Pagopar credentials are not configured");
   const base=process.env.PAGOPAR_API_BASE||"https://api.pagopar.com";
   const m=metadata??{};const items=Array.isArray(m.items)?m.items as any[]:[];
   const token=createHash("sha1").update(privateKey+orderId+String(Number(amount))).digest("hex");
   const body={
     token,public_key:publicKey,monto_total:Number(amount),tipo_pedido:"VENTA-COMERCIO",
     comprador:{ruc:String(m.ruc||""),email:String(m.email||""),ciudad:1,nombre:String(m.name||""),telefono:String(m.phone||""),direccion:String(m.address||""),documento:String(m.document||""),coordenadas:"",razon_social:"",tipo_documento:"CI",direccion_referencia:"",
     },
     compras_items:items.map(x=>({ciudad:"1",nombre:String(x.name||"Producto"),cantidad:Number(x.quantity||1),categoria:"909",public_key:publicKey,url_imagen:String(x.image||""),descripcion:String(x.description||x.name||"Producto"),id_producto:String(x.id||""),precio_total:Number(x.total||0),vendedor_telefono:"",vendedor_direccion:"",vendedor_direccion_referencia:"",vendedor_direccion_coordenadas:""})),
     fecha_maxima_pago:new Date(Date.now()+48*60*60*1000).toISOString().replace("T"," ").replace("Z","").slice(0,19),
     id_pedido_comercio:orderId,descripcion_resumen:"Animalife Agroveterinaria",forma_pago:9
   };
   const response=await fetch(base+"/api/comercios/2.0/iniciar-transaccion",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   const data:any=await response.json();const hash=data?.resultado?.[0]?.data;
   if(!response.ok||!data?.respuesta||!hash)throw new Error(data?.resultado||"Pagopar no pudo crear la transacción");
   return {id:String(hash),url:`https://www.pagopar.com/pagos/${hash}`};
 },
 async getPaymentStatus(id){const publicKey=process.env.PAGOPAR_PUBLIC_KEY;const privateKey=process.env.PAGOPAR_PRIVATE_KEY;if(!publicKey||!privateKey)return "PENDING";const token=createHash("sha1").update(privateKey+"CONSULTA").digest("hex");const response=await fetch((process.env.PAGOPAR_API_BASE||"https://api.pagopar.com")+"/api/pedidos/1.1/traer",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({hash_pedido:id,token,token_publico:publicKey})});const data:any=await response.json();const row=data?.resultado?.[0];if(row?.cancelado)return "FAILED";return row?.pagado?"PAID":"PENDING";},
 async cancelPayment(_id){},
 async refundPayment(id){const publicKey=process.env.PAGOPAR_PUBLIC_KEY;const privateKey=process.env.PAGOPAR_PRIVATE_KEY;if(!publicKey||!privateKey)throw new Error("Pagopar credentials are not configured");const token=createHash("sha1").update(privateKey+"PEDIDO-REVERSAR").digest("hex");await fetch((process.env.PAGOPAR_API_BASE||"https://api.pagopar.com")+"/api/pedidos/1.1/reversar",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({hash_pedido:id,token,token_publico:publicKey})});},
 async handleWebhook(_payload){}
};

export const activePaymentProvider:PaymentProvider=
 process.env.PAGOPAR_PUBLIC_KEY&&process.env.PAGOPAR_PRIVATE_KEY?pagoparPaymentProvider:mockPaymentProvider;

export const mockDeliveryProvider:DeliveryProvider={
 async calculateRate({department,city}){return {amount: department.toLowerCase()==="central"&&city.toLowerCase()==="asunción"?25000:45000,eta:"1–3 días hábiles"};},
 async createShipment({orderId}){return {trackingNumber:`MOCK-${orderId.slice(0,8)}`};},
 async trackShipment(_tracking):Promise<{status:DeliveryStatus}>{return {status:"PENDING"};},
 async cancelShipment(_tracking){}
};
