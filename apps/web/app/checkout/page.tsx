"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import type {Product} from "@animalife/shared";
import {formatPYG} from "@animalife/shared";

export default function Checkout(){
 const [cart,setCart]=useState<Record<string,number>>({});
 const [products,setProducts]=useState<Product[]>([]);
 const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
 const [department,setDepartment]=useState("Central"); const [city,setCity]=useState("Asunción"); const [address,setAddress]=useState("");
 const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [order,setOrder]=useState<{id:string;total:number;delivery:number;eta:string;paymentUrl?:string}|null>(null);
 useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem("animalife-cart")||"{}"))}catch{}},[]);
 useEffect(()=>{const ids=Object.keys(cart);if(!ids.length){setProducts([]);return} fetch(`/api/products?ids=${ids.join(",")}`).then(r=>r.json()).then(d=>setProducts(d.products??[])).catch(()=>setProducts([]))},[cart]);
 const items=useMemo(()=>Object.entries(cart).map(([productId,quantity])=>({productId,quantity,p:products.find(x=>x.id===productId)})).filter(x=>x.p&&x.quantity>0&&x.p.verified&&x.p.stock>=x.quantity),[cart,products]);
 const total=items.reduce((s,x)=>s+(x.p?.salePrice??x.p?.price??0)*x.quantity,0);
 async function submit(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError("");
  try{
   const r=await fetch("/api/orders",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,phone,shippingAddress:{department,city,address},items:items.map(x=>({productId:x.productId,quantity:x.quantity}))})});
   const data=await r.json(); if(!r.ok)throw new Error(data.error||"No se pudo crear el pedido");
   setOrder({id:data.orderId,total:Number(data.totalPyg),delivery:Number(data.deliveryPyg),eta:data.deliveryEta,paymentUrl:data.paymentUrl});
   localStorage.removeItem("animalife-cart");setCart({});
  }catch(e){setError(e instanceof Error?e.message:"Error inesperado")}finally{setBusy(false)}
 }
 if(order)return <main><div className="container checkout-page"><div className="confirmation"><div className="success">✓</div><span className="eyebrow">PEDIDO RECIBIDO</span><h1>Gracias por tu compra</h1><p>Pedido <b>{order.id}</b> creado. Envío estimado: {order.eta}.</p><p>Total: <b>{formatPYG(order.total)}</b> · Envío: <b>{formatPYG(order.delivery)}</b></p><p className="notice">El pago está en estado pendiente. El gateway real se conectará al mismo adaptador cuando el proveedor paraguayo sea configurado.</p><Link className="button primary" href="/">Volver al inicio</Link></div></div></main>;
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><Link href="/cart">← Carrito</Link></div></header><div className="container checkout-page"><span className="eyebrow">CHECKOUT</span><h1>Finalizar compra</h1><div className="checkout-layout"><form className="form-card" onSubmit={submit}><h2>Datos de contacto</h2><div className="form-grid"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="correo@ejemplo.com"/></label><label>Teléfono / WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} required placeholder="+595 ..."/></label><label>Departamento<input value={department} onChange={e=>setDepartment(e.target.value)} required/></label><label>Ciudad<input value={city} onChange={e=>setCity(e.target.value)} required/></label><label>Dirección<input value={address} onChange={e=>setAddress(e.target.value)} required/></label></div><h2>Entrega</h2><div className="choice"><input type="radio" defaultChecked name="delivery"/> Envío estándar <span>Tarifa calculada por el adaptador</span></div><h2>Pago</h2><div className="choice"><input type="radio" defaultChecked name="pay"/> Proveedor de pago autorizado</div><p className="notice">No se almacenan datos de tarjetas en Animalife. El proveedor de pago recibe el control del pago.</p>{error&&<p className="notice">{error}</p>}<button className="button primary wide" disabled={busy||!items.length}>{busy?"Creando pedido…":"Confirmar pedido"}</button></form><aside className="summary"><h2>Tu pedido</h2>{items.map(x=><div key={x.productId}><span>{x.p!.name} × {x.quantity}</span><b>{formatPYG((x.p!.salePrice??x.p!.price)*x.quantity)}</b></div>)}<hr/><div><b>Subtotal</b><strong>{formatPYG(total)}</strong></div><div><span>Envío</span><span>Se calcula al confirmar</span></div></aside></div></div></main>
}
