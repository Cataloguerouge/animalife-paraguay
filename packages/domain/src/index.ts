export type ProductCategory="dogs"|"cats"|"birds"|"farm"|"accessories";
export type Product={id:string;slug:string;name:string;category:ProductCategory;description:string;priceGs:number;compareAtPriceGs?:number;image:string;badge?:string;stock:number};
export type CartItem={product:Product;quantity:number};
export type Customer={id:string;name:string;email:string;phone?:string};
export type OrderStatus="pending"|"paid"|"processing"|"shipped"|"delivered";
export type Order={id:string;customerId:string;items:CartItem[];totalGs:number;status:OrderStatus;createdAt:string;shippingLabel:string};

export const formatGs=(v:number)=>new Intl.NumberFormat("es-PY").format(v)+" Gs";
export const cartTotal=(items:CartItem[])=>items.reduce((s,i)=>s+i.product.priceGs*i.quantity,0);

export const demoProducts:Product[]=[
{id:"p1",slug:"alimento-premium-cachorro",name:"Alimento Premium para Cachorros",category:"dogs",description:"Receta completa y equilibrada para cachorros, pensada para crecimiento y energía diaria.",priceGs:165000,compareAtPriceGs:185000,image:"https://images.unsplash.com/photo-1589924691106-073b2d7c4c0f?auto=format&fit=crop&w=900&q=80",badge:"Más vendido",stock:18},
{id:"p2",slug:"alimento-adulto-perros",name:"Alimento Premium Adulto",category:"dogs",description:"Nutrición diaria de calidad para perros adultos. Ideal para mantener peso, músculo y vitalidad.",priceGs:195000,image:"https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=900&q=80",stock:24},
{id:"p3",slug:"arena-gatos-premium",name:"Arena para Gatos Premium",category:"cats",description:"Arena aglomerante de alto rendimiento con control de olores.",priceGs:75000,image:"https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",badge:"Nuevo",stock:32},
{id:"p4",slug:"snack-natural-perro",name:"Snack Natural para Perro",category:"dogs",description:"Premio natural para entrenamiento y momentos especiales.",priceGs:42000,image:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",stock:40},
{id:"p5",slug:"juguete-cuerda-resistente",name:"Juguete de Cuerda Resistente",category:"accessories",description:"Cuerda duradera para juegos de tirar y fortalecer el vínculo.",priceGs:55000,image:"https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=900&q=80",stock:15},
{id:"p6",slug:"alimento-gatos-sterilized",name:"Alimento Gatos Sterilized",category:"cats",description:"Alimento completo para gatos esterilizados con balance de nutrientes.",priceGs:145000,image:"https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",stock:20},
{id:"p7",slug:"mezcla-premium-aves",name:"Mezcla Premium para Aves",category:"birds",description:"Mezcla seleccionada para aves domésticas.",priceGs:38000,image:"https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=900&q=80",stock:12},
{id:"p8",slug:"suplemento-granja",name:"Suplemento Animalife Granja",category:"farm",description:"Complemento nutricional para animales de granja.",priceGs:89000,image:"https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=900&q=80",stock:10}
];

export interface PaymentProvider{id:string;name:string;createPayment(input:{orderId:string;amountGs:number}):Promise<{providerPaymentId:string;status:"pending"|"paid"}>}
export interface DeliveryProvider{id:string;name:string;quote(input:{city:string;weightKg:number}):Promise<{priceGs:number;etaDays:number}>;createShipment(input:{orderId:string;address:string}):Promise<{trackingId:string}>}
export const mockPaymentProvider:PaymentProvider={id:"mock-paraguay",name:"Mock Paraguay Payment",async createPayment({orderId}){return{providerPaymentId:"mock-"+orderId,status:"pending"}}};
export const mockDeliveryProvider:DeliveryProvider={id:"mock-delivery",name:"Mock Delivery Paraguay",async quote(){return{priceGs:25000,etaDays:1}},async createShipment({orderId}){return{trackingId:"AIR-"+orderId.toUpperCase()}}};
