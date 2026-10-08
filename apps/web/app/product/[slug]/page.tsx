import Link from "next/link";
import {notFound} from "next/navigation";
import {getProduct} from "../../../lib/catalog";
import {formatPYG} from "@animalife/shared";
import AddToCart from "../../../components/AddToCart";
function Art({type}:{type:string}){return <div className={`product-art detail ${type}`}><span>{type==="bovinos"?"🐄":type==="horse"?"🐎":type==="field"?"🌾":"🐕"}</span></div>}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=getProduct(slug); if(!p) notFound();
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><div className="search"><input placeholder="¿Qué estás buscando?"/><button>Buscar</button></div><nav className="header-actions"><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito</Link></nav></div></header>
 <div className="container breadcrumbs"><Link href="/">Inicio</Link> / <Link href="/catalog">Catálogo</Link> / {p.name}</div>
 <section className="product-detail container"><Art type={p.image}/><div className="detail-copy"><span className="tag">{p.verified?"Disponible":"Datos por verificar"}</span><h1>{p.name}</h1><p className="brand-line">{p.brand??p.category} {p.packageSize&&"· "+p.packageSize}</p><p>{p.description}</p><div className="price">{p.price?formatPYG(p.price):"Precio a confirmar"}</div><div className="quantity"><button>−</button><span>1</span><button>+</button></div><AddToCart productId={p.id} disabled={!p.price}/>{!p.price&&<p className="notice">Este producto está cargado como referencia de diseño. El precio y disponibilidad deben ser confirmados antes de la venta.</p>}<div className="detail-trust"><span>🚚 Envío coordinado</span><span>✓ Compra segura</span><span>💬 Atención por WhatsApp</span></div></div></section>
 </main>
}
