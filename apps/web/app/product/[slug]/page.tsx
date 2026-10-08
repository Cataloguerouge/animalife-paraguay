import Link from "next/link";
import {notFound} from "next/navigation";
import {formatPYG} from "@animalife/shared";
import {getProductBySlug,productEmoji} from "../../../lib/catalog-server";
import AddToCart from "../../../components/AddToCart";

function Art({product}:{product:any}) {
  return <div className="product-art detail">{product.image?<img src={product.image} alt=""/>:<div className="product-placeholder" aria-hidden>{productEmoji(product)}</div>}</div>;
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const p=await getProductBySlug(slug);
 if(!p) notFound();
 const purchasable=p.verified&&p.stock>0&&p.price>0;
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>AGROVETERINARIA</small></Link><div className="search"><Link className="button secondary" href="/catalog">Ver catálogo</Link></div><nav className="header-actions"><Link href="/account">Mi cuenta</Link><Link href="/cart">Carrito</Link></nav></div></header>
 <div className="container breadcrumbs"><Link href="/">Inicio</Link> / <Link href="/catalog">Catálogo</Link> / {p.name}</div>
 <section className="product-detail container"><Art product={p}/><div className="detail-copy"><span className="tag">{purchasable?"Disponible":"Datos por verificar"}</span><h1>{p.name}</h1><p className="brand-line">{p.brand??p.category} {p.packageSize&&"· "+p.packageSize}</p><p>{p.description}</p><div className="price">{p.price>0?formatPYG(p.salePrice??p.price):"Precio a confirmar"}</div><div className="quantity"><span>1 unidad</span></div><AddToCart productId={p.id} disabled={!purchasable}/>{!purchasable&&<p className="notice">Este producto no está disponible para compra hasta que precio, stock y ficha comercial sean confirmados.</p>}<div className="detail-trust"><span>🚚 Envío coordinado</span><span>✓ Compra segura</span><span>💬 Atención por WhatsApp</span></div></div></section>
 </main>;
}
