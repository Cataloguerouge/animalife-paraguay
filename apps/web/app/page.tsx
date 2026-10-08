import Link from "next/link";
import {categories,products} from "../lib/catalog";
import {formatPYG} from "@animalife/shared";

function Art({type}:{type:string}){return <div className={`product-art ${type}`} aria-hidden="true"><span>{type==="bovinos"?"🐄":type==="horse"?"🐎":type==="field"?"🌾":"🐕"}</span></div>}

export default function Home(){
 const featured=products.filter(p=>p.featured);
 return <main>
  <header className="site-header">
   <div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><div className="search"><input placeholder="¿Qué estás buscando?" aria-label="Buscar"/><button>Buscar</button></div><nav className="header-actions"><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito <span className="cart-count">0</span></Link></nav></div>
   <nav className="category-nav"><div className="container nav-inner">{categories.map(c=><Link key={c.name} href={c.name==="Ofertas"?"/catalog?offer=1":`/catalog?category=${c.name}`}>{c.name}</Link>)}</div></nav>
  </header>
  <section className="hero"><div className="container hero-grid"><div><span className="eyebrow">ANIMALIFE PARAGUAY</span><h1>Todo para el bienestar animal y el campo</h1><p>Productos veterinarios, alimentos y soluciones para cuidar a tus animales con confianza.</p><div className="hero-buttons"><Link className="button primary" href="/catalog">Comprar ahora</Link><Link className="button secondary" href="/catalog">Ver catálogo</Link></div></div><div className="hero-art"><div className="hero-circle">🐕</div><div className="hero-circle small">🐄</div><div className="hero-label">Calidad · Confianza · Servicio</div></div></div></section>
  <section className="trust"><div className="container trust-grid"><div><b>🚚 Envíos</b><span>Entrega coordinada en Paraguay</span></div><div><b>✓ Compra segura</b><span>Pago protegido y confirmación</span></div><div><b>💬 Atención</b><span>Soporte por WhatsApp</span></div><div><b>★ Selección</b><span>Productos para cada necesidad</span></div></div></section>
  <section className="section container"><div className="section-heading"><div><span className="eyebrow">EXPLORA</span><h2>Compra por categoría</h2></div><Link href="/catalog">Ver todo →</Link></div><div className="category-grid">{categories.slice(0,5).map(c=><Link className="category-card" href={`/catalog?category=${c.name}`} key={c.name}><span>{c.icon}</span><b>{c.name}</b><small>Ver productos</small></Link>)}</div></section>
  <section className="section soft"><div className="container"><div className="section-heading"><div><span className="eyebrow">SELECCIÓN</span><h2>Productos destacados</h2></div><Link href="/catalog">Ver catálogo →</Link></div><div className="product-grid">{featured.map(p=><Link href={`/product/${p.slug}`} className="product-card" key={p.id}><Art type={p.image}/><div className="product-info"><span className="tag">{p.verified?"Disponible":"Por verificar"}</span><h3>{p.name}</h3><small>{p.brand??p.category} · {p.packageSize??"Presentación por confirmar"}</small><strong>{p.price?formatPYG(p.price):"Precio a confirmar"}</strong></div></Link>)}</div></div></section>
  <footer><div className="container footer-grid"><div><div className="brand">ANIMALIFE <small>AGROVETERINARIA</small></div><p>Soluciones para el bienestar animal y el campo.</p></div><div><b>Comprar</b><Link href="/catalog">Catálogo</Link><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito</Link></div><div><b>Ayuda</b><span>Envíos y entregas</span><span>Pagos</span><span>WhatsApp</span></div></div></footer>
 </main>
}
