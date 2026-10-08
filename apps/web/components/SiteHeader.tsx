"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
const cats=[["Perros","🐕"],["Gatos","🐈"],["Bovinos","🐄"],["Equinos","🐎"],["Campo","🌿"],["Ofertas","%"]];
export default function SiteHeader(){
 const [count,setCount]=useState(0);const [query,setQuery]=useState("");
 useEffect(()=>{try{const c=JSON.parse(localStorage.getItem("animalife-cart")||"{}") as Record<string,number>;setCount(Object.values(c).reduce((a:number,b:number)=>a+Number(b),0))}catch{}},[]);
 return <header className="site-header premium-header">
   <div className="header-main container">
     <Link href="/" className="logo"><span className="logo-mark">A</span><span><b>ANIMALIFE</b><small>AGROVETERINARIA</small></span></Link>
     <form className="search-bar" onSubmit={e=>{e.preventDefault();location.href="/catalog?q="+encodeURIComponent(query)}}>
       <span className="search-label">BUSCAR</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Busca productos, marcas o categorías" aria-label="Buscar productos"/><button aria-label="Buscar">⌕</button>
     </form>
     <nav className="header-tools"><Link href="/account" className="tool"><span className="tool-icon">♙</span><small>Mi cuenta</small></Link><Link href="/cart" className="tool cart-tool"><span className="tool-icon">🛒<i>{count}</i></span><small>Carrito</small></Link></nav>
   </div>
   <nav className="category-nav"><div className="container category-inner">{cats.map(([name,icon])=><Link key={name} href={"/catalog?category="+encodeURIComponent(name)} className={name==="Ofertas"?"sale-cat":""}><span>{icon}</span>{name}</Link>)}</div></nav>
 </header>;
}