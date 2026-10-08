"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {products,categories} from "../../lib/catalog";
import {formatPYG} from "@animalife/shared";
function Art({type}:{type:string}){return <div className={`product-art ${type}`}><span>{type==="bovinos"?"🐄":type==="horse"?"🐎":type==="field"?"🌾":"🐕"}</span></div>}
export default function Catalog(){
 const [query,setQuery]=useState(""); const [category,setCategory]=useState("Todos");
 const filtered=useMemo(()=>products.filter(p=>(category==="Todos"||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[query,category]);
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos..."/><button>Buscar</button></div><nav className="header-actions"><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito</Link></nav></div><nav className="category-nav"><div className="container nav-inner">{categories.map(c=><Link href={`/catalog?category=${c.name}`} key={c.name}>{c.name}</Link>)}</div></nav></header>
 <div className="container catalog-layout"><aside className="filters"><b>Filtrar productos</b><label>Categoría</label><button className={category==="Todos"?"active":""} onClick={()=>setCategory("Todos")}>Todos</button>{categories.slice(0,5).map(c=><button className={category===c.name?"active":""} onClick={()=>setCategory(c.name)} key={c.name}>{c.name}</button>)}</aside>
 <section className="catalog-main"><div className="catalog-title"><div><span className="eyebrow">CATÁLOGO</span><h1>{category==="Todos"?"Todos los productos":category}</h1><p>{filtered.length} productos</p></div><select aria-label="Ordenar"><option>Relevancia</option><option>Precio: menor a mayor</option></select></div><div className="product-grid">{filtered.map(p=><Link href={`/product/${p.slug}`} className="product-card" key={p.id}><Art type={p.image}/><div className="product-info"><span className="tag">{p.verified?"Disponible":"Por verificar"}</span><h3>{p.name}</h3><small>{p.brand??p.category} · {p.packageSize??"Presentación por confirmar"}</small><strong>{p.price?formatPYG(p.price):"Precio a confirmar"}</strong></div></Link>)}</div></section></div></main>
}
