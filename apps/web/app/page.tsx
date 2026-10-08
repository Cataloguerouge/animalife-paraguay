import Link from "next/link";
import {formatPYG} from "@animalife/shared";
import {getCatalogCategories,getCatalogProducts} from "../lib/catalog-server";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const categoryImages:Record<string,string>={
  Perros:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1100&q=88",
  Gatos:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1100&q=88",
  Bovinos:"https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1100&q=88",
  Equinos:"https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1100&q=88",
  Campo:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=88"
};

const heroDog="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1300&q=90";
const heroCat="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=90";
const heroCow="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=700&q=90";
const heroHorse="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=700&q=90";

function ProductArt({product}:{product:any}){
  return <div className="product-art">
    {product.image?<img src={product.image} alt=""/>:<div className="product-placeholder">{product.animal==="BOVINOS"?"🐄":product.animal==="EQUINOS"?"🐎":product.animal==="CAMPO"?"🌿":product.animal==="GATOS"?"🐈":"🐕"}</div>}
  </div>
}

export default async function Home(){
  const [categories,products]=await Promise.all([getCatalogCategories(),getCatalogProducts()]);
  const featured=products.filter(p=>p.featured).slice(0,4);

  return <main>
    <SiteHeader/>

    <section className="hero-premium">
      <div className="container">
        <div className="hero-panel hero-luxury">
          <div className="hero-copy">
            <span className="eyebrow">ANIMALIFE AGROVETERINARIA · PARAGUAY</span>
            <div className="hero-kicker"><span></span> Cuidado que se nota</div>
            <h1>El bienestar animal, <em>elegido con criterio.</em></h1>
            <p>Una experiencia premium para encontrar alimentos, productos veterinarios y soluciones para tus animales y el campo.</p>
            <div className="hero-actions">
              <Link className="btn btn-lime" href="/catalog">Descubrir catálogo <b>→</b></Link>
              <Link className="hero-text-link" href="/catalog">Explorar categorías <span>↗</span></Link>
            </div>
            <div className="hero-signature">
              <div><span>01</span><b>Selección</b><small>Productos cuidadosamente elegidos</small></div>
              <div><span>02</span><b>Confianza</b><small>Compra clara y segura</small></div>
              <div><span>03</span><b>Atención</b><small>Estamos cerca cuando importa</small></div>
            </div>
          </div>

          <div className="hero-gallery">
            <div className="hero-main-photo">
              <img src={heroDog} alt="Perro disfrutando del exterior"/>
              <div className="hero-photo-caption"><span>PERROS</span><b>Compañeros de cada día</b></div>
            </div>
            <div className="hero-small-photo hero-cat-photo"><img src={heroCat} alt="Gato"/><span>GATOS</span></div>
            <div className="hero-small-photo hero-cow-photo"><img src={heroCow} alt="Bovino"/><span>BOVINOS</span></div>
            <div className="hero-small-photo hero-horse-photo"><img src={heroHorse} alt="Caballo"/><span>EQUINOS</span></div>
            <div className="hero-orb">AL<span>·</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="trust-strip premium-trust">
      <div className="container trust-grid">
        <div className="trust-item"><span className="trust-icon">✦</span><div><b>Selección Animalife</b><span>Calidad y criterio en cada categoría</span></div></div>
        <div className="trust-item"><span className="trust-icon">↗</span><div><b>Envíos a todo Paraguay</b><span>Entrega coordinada según tu zona</span></div></div>
        <div className="trust-item"><span className="trust-icon">♡</span><div><b>Atención cercana</b><span>Te ayudamos a encontrar lo adecuado</span></div></div>
        <div className="trust-item"><span className="trust-icon">✓</span><div><b>Compra con confianza</b><span>Información clara antes de comprar</span></div></div>
      </div>
    </section>

    <section className="section category-section">
      <div className="container">
        <div className="section-head premium-head">
          <div><span className="eyebrow">PARA CADA ANIMAL</span><h2>Encuentra lo que necesitas.</h2><p>Una selección pensada para hogares, profesionales y productores.</p></div>
          <Link href="/catalog">Ver todo <span>→</span></Link>
        </div>
        <div className="category-showcase premium-categories">
          {categories.filter(c=>c.name!=="Ofertas").slice(0,5).map(c=>
            <Link className="category-tile" style={{backgroundImage:`url(${categoryImages[c.name]||""})`}} href={"/catalog?category="+encodeURIComponent(c.name)} key={c.slug}>
              <div className="category-number">0{categories.filter(x=>x.name!=="Ofertas").slice(0,5).findIndex(x=>x.slug===c.slug)+1}</div>
              <div className="tile-copy"><b>{c.name}</b><small>Descubrir <span>↗</span></small></div>
            </Link>
          )}
        </div>
      </div>
    </section>

    <section className="section soft premium-products">
      <div className="container">
        <div className="section-head premium-head">
          <div><span className="eyebrow">SELECCIÓN ANIMALIFE</span><h2>Destacados.</h2><p>Productos disponibles y referencias seleccionadas para tu compra.</p></div>
          <Link href="/catalog">Ver catálogo <span>→</span></Link>
        </div>
        <div className="product-grid premium-product-grid">
          {featured.map(p=>
            <Link className="product-card" href={"/product/"+p.slug} key={p.id}>
              <div className="product-card-top"><span className="product-index">0{featured.indexOf(p)+1}</span><span className="tag">{p.verified&&p.stock>0?"Disponible":"Por verificar"}</span></div>
              <ProductArt product={p}/>
              <div className="product-info"><h3>{p.name}</h3><small>{p.brand??p.category} · {p.packageSize??"Presentación por confirmar"}</small><div className="product-price-row"><strong>{p.price>0?formatPYG(p.salePrice??p.price):"Precio a confirmar"}</strong><span>↗</span></div></div>
            </Link>
          )}
        </div>
      </div>
    </section>

    <section className="section story-section">
      <div className="container story-layout">
        <div className="story-image">
          <img src={heroCow} alt="Animal de producción en el campo"/>
          <div className="story-label">ANIMALIFE<br/><span>PARAGUAY</span></div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">UNA FORMA DIFERENTE DE COMPRAR</span>
          <h2>Del cuidado diario a las soluciones para el campo.</h2>
          <p>Animalife reúne en un solo lugar categorías para perros, gatos y animales de producción, con una experiencia sencilla, elegante y pensada para comprar con seguridad.</p>
          <div className="story-points"><div><b>01</b><span>Productos y categorías claros</span></div><div><b>02</b><span>Información antes de decidir</span></div><div><b>03</b><span>Atención y entrega coordinada</span></div></div>
          <Link className="btn btn-green" href="/catalog">Conocer Animalife <span>→</span></Link>
        </div>
      </div>
    </section>

    <section className="section premium-cta-section">
      <div className="container">
        <div className="premium-cta">
          <div><span className="eyebrow">ANIMALIFE AGROVETERINARIA</span><h2>Tu próxima compra<br/><em>empieza aquí.</em></h2></div>
          <div><p>Explora el catálogo y encuentra productos para el bienestar animal y el campo.</p><Link className="btn btn-lime" href="/catalog">Ir al catálogo <span>→</span></Link></div>
        </div>
      </div>
    </section>

    <SiteFooter/>
  </main>
}
