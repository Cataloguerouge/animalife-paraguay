import Link from "next/link";
import {createClient} from "../../lib/supabase-server";
export default async function Admin(){
 const supabase=await createClient();
 if(!supabase)return <Gate text="Supabase no está configurado." />;
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return <Gate text="Inicia sesión para acceder al panel." />;
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="ADMIN")return <Gate text="Tu cuenta no tiene permisos de administrador." />;
 return <main><header className="site-header"><div className="header-top container"><Link className="brand" href="/">ANIMALIFE <small>ADMIN</small></Link><Link href="/">Ver tienda</Link></div></header><div className="container admin"><span className="eyebrow">ADMINISTRACIÓN</span><h1>Panel de control</h1><div className="admin-grid">{["Productos","Pedidos","Clientes","Inventario","Promociones","Entregas","Pagos"].map(x=><div className="admin-card" key={x}><b>{x}</b><span>Gestión conectada a Supabase</span><a href="#">Abrir →</a></div>)}</div></div></main>
}
function Gate({text}:{text:string}){return <main><div className="container checkout-page"><div className="empty"><span className="eyebrow">ADMIN</span><h1>Acceso restringido</h1><p>{text}</p><Link className="button primary" href="/account">Ir a mi cuenta</Link></div></div></main>}
