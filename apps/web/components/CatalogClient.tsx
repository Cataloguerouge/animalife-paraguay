"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {Product} from "@animalife/shared";
import {formatPYG} from "@animalife/shared";
import type {CatalogCategory} from "../lib/catalog-server";

function productEmoji(p:Product) {
  return p.animal==="BOVINOS"?"🐄":p.animal==="EQUINOS"?"🐎":p.animal==="CAMPO"?"🌾":p.animal==="GATOS"?"🐈":"🐕";
}
function Art({product}:{product:Product}) {
  return <div className="product-art">
    {product.image ? <img src={product.image} alt="" /> : <div className="product-placeholder" aria-hidden>{productEmoji(product)}</div>}
  </div>;
}

export default function CatalogClient({products,categories,initialCategory="Todos"}:{products:Product[];categories:CatalogCategory[];initialCategory?:string}) {
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState(initialCategory || "Todos");
  const filtered=useMemo(()=>products
    .filter(p=>(category==="Todos"||p.category===category))
    .filter(p=>`${p.name} ${p.brand??""}`.toLowerCase().includes(query.toLowerCase())),[products,query,category]);

  return <main>
    <header className="site-header"><div className="header-top container">
      <Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link>
      <div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos..."/><button>Buscar</button></div>
      <nav className="header-actions"><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito</Link></nav>
    </div><nav className="category-nav"><div className="container nav-inner">
      {categories.map(c=><Link href={`/catalog?category=${encodeURIComponent(c.name)}`} key={c.slug}>{c.name}</Link>)}
    </div></nav></header>

    <div className="container catalog-layout">
      <aside className="filters"><b>Filtrar productos</b><label>Categoría</label>
        <button className={category==="Todos"?"active":""} onClick={()=>setCategory("Todos")}>Todos</button>
        {categories.filter(c=>c.name!=="Ofertas").map(c=><button className={category===c.name?"active":""} onClick={()=>setCategory(c.name)} key={c.slug}>{c.name}</button>)}
      </aside>
      <section className="catalog-main"><div className="catalog-title"><div><span className="eyebrow">CATÁLOGO</span><h1>{category==="Todos"?"Todos los productos":category}</h1><p>{filtered.length} productos</p></div>
        <select aria-label="Ordenar"><option>Relevancia</option><option>Precio: menor a mayor</option></select>
      </div>
      {!filtered.length ? <div className="empty"><h2>No hay productos disponibles todavía</h2><p>Estamos preparando el catálogo de Animalife Paraguay.</p></div> :
      <div className="product-grid">{filtered.map(p=><Link href={`/product/${p.slug}`} className="product-card" key={p.id}><Art product={p}/><div className="product-info">
        <span className="tag">{p.verified && p.stock>0 ? "Disponible" : "Por verificar"}</span>
        <h3>{p.name}</h3><small>{p.brand??p.category} · {p.packageSize??"Presentación por confirmar"}</small>
        <strong>{p.price>0?formatPYG(p.salePrice ?? p.price):"Precio a confirmar"}</strong>
      </div></Link>)}</div>}
      </section>
    </div>
  </main>;
}
