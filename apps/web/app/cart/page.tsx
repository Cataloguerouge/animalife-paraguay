"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import type {Product} from "@animalife/shared";
import {formatPYG} from "@animalife/shared";

export default function Cart(){
 const [qty,setQty]=useState<Record<string,number>>({});
 const [products,setProducts]=useState<Product[]>([]);
 useEffect(()=>{try{setQty(JSON.parse(localStorage.getItem("animalife-cart")||"{}"))}catch{}},[]);
 useEffect(()=>{const ids=Object.keys(qty);if(!ids.length){setProducts([]);return} fetch(`/api/products?ids=${ids.join(",")}`).then(r=>r.json()).then(d=>setProducts(d.products??[])).catch(()=>setProducts([]))},[qty]);
 const items=useMemo(()=>Object.entries(qty).map(([id,q])=>({p:products.find(x=>x.id===id),q})).filter(x=>x.p&&x.q>0),[qty,products]);
 const subtotal=items.reduce((s,{p,q})=>s+(p?.salePrice??p?.price??0)*q,0);
 function remove(id:string){const next={...qty};delete next[id];setQty(next);localStorage.setItem("animalife-cart",JSON.stringify(next));}
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><nav className="header-actions"><Link href="/catalog">Seguir comprando</Link><Link href="/account">Mi cuenta</Link></nav></div></header><div className="container checkout-page"><span className="eyebrow">CARRITO</span><h1>Tu carrito</h1>{!items.length?<div className="empty"><h2>Tu carrito está vacío</h2><p>Explora nuestro catálogo y agrega productos disponibles.</p><Link className="button primary" href="/catalog">Ir al catálogo</Link></div>:<div className="cart-layout"><section>{items.map(({p,q})=><div className="cart-item" key={p!.id}><div className="mini-art">{p!.animal==="BOVINOS"?"🐄":p!.animal==="EQUINOS"?"🐎":p!.animal==="CAMPO"?"🌾":"🐕"}</div><div><b>{p!.name}</b><p>{p!.packageSize}</p></div><span>{q} × {formatPYG(p!.salePrice??p!.price)}</span><button className="link-button" onClick={()=>remove(p!.id)}>Eliminar</button></div>)}</section><aside className="summary"><h2>Resumen</h2><div><span>Subtotal</span><b>{formatPYG(subtotal)}</b></div><div><span>Envío</span><span>Se calcula en checkout</span></div><hr/><div><b>Total antes de envío</b><strong>{formatPYG(subtotal)}</strong></div><Link className="button primary wide" href="/checkout">Continuar al checkout</Link></aside></div>}</div></main>
}
