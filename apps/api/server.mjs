import http from "node:http";
import { demoProducts, mockPaymentProvider, mockDeliveryProvider, cartTotal } from "@animalife/domain";
const orders=new Map();
const json=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json","access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type"});res.end(JSON.stringify(body));};
const read=async req=>{let s="";for await(const c of req)s+=c;return s?JSON.parse(s):{}};
const server=http.createServer(async(req,res)=>{
 if(req.method==="OPTIONS"){res.writeHead(204,{"access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type"});return res.end()}
 try{
  const u=new URL(req.url||"/","http://localhost");
  if(req.method==="GET"&&u.pathname==="/health")return json(res,200,{ok:true,service:"animalife-api",mode:"prototype"});
  if(req.method==="GET"&&u.pathname==="/api/products")return json(res,200,{products:demoProducts});
  if(req.method==="GET"&&u.pathname.startsWith("/api/products/")){const p=demoProducts.find(x=>x.slug===u.pathname.split("/").pop());return p?json(res,200,p):json(res,404,{error:"Producto no encontrado"})}
  if(req.method==="POST"&&u.pathname==="/api/shipping/quote"){const b=await read(req);const q=await mockDeliveryProvider.quote(b);return json(res,200,q)}
  if(req.method==="POST"&&u.pathname==="/api/orders"){const b=await read(req);const subtotal=cartTotal(b.items||[]);const ship=await mockDeliveryProvider.quote({department:b.department||"",city:b.city||"",method:b.deliveryMethod||"standard"});const id="AL-"+Date.now().toString().slice(-8);const order={id,customerId:b.customerId||"guest",items:b.items||[],subtotalGs:subtotal,shippingGs:ship.priceGs,totalGs:subtotal+ship.priceGs,status:"pending",paymentMethod:b.paymentMethod||"card",deliveryMethod:b.deliveryMethod||"standard",shippingLabel:(b.deliveryMethod==="express"?"Express":"Estándar")+" · "+ship.etaDays+" día(s)",createdAt:new Date().toISOString()};orders.set(id,order);const payment=await mockPaymentProvider.createPayment({orderId:id,amountGs:order.totalGs,method:order.paymentMethod});return json(res,201,{order,payment})}
  if(req.method==="GET"&&u.pathname.startsWith("/api/orders/")){const o=orders.get(u.pathname.split("/").pop());return o?json(res,200,o):json(res,404,{error:"Pedido no encontrado"})}
  if(req.method==="GET"&&u.pathname==="/api/admin/products")return json(res,200,{products:demoProducts});
  return json(res,404,{error:"Ruta no encontrada"});
 }catch(e){return json(res,400,{error:e instanceof Error?e.message:"Bad request"})}
});
const port=Number(process.env.PORT||10000);server.listen(port,()=>console.log("Animalife API listening on "+port));