import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase-server";

const localImages:Record<string,string> = {
  "raguife-prime-combo-crecimiento": "/products/raguife-prime-combo-crecimiento.jpg"
};

export async function GET(req:Request){
  const supabase=await createClient();
  if(!supabase)return NextResponse.json({products:[]},{status:503});
  const ids=new URL(req.url).searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  let query=supabase.from("products").select("*").eq("active",true);
  if(ids.length) query=query.in("id",ids);
  const {data:rows,error}=await query.order("name");
  if(error)return NextResponse.json({error:error.message},{status:500});
  const {data:cats}=await supabase.from("categories").select("id,name");
  const catMap=new Map((cats??[]).map(c=>[c.id,c.name]));
  const products=(rows??[]).map((p:any)=>({
    id:p.id,sku:p.sku,slug:p.slug,name:p.name,brand:p.brand,category:catMap.get(p.category_id)??"Otros",
    animal:p.animal,description:p.description,packageSize:p.package_size,
    price:Number(p.price_pyg||0),salePrice:p.sale_price_pyg==null?undefined:Number(p.sale_price_pyg),
    stock:Number(p.stock||0),
    image:p.image_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${p.image_path}`
      : (localImages[p.slug]?new URL(localImages[p.slug],req.url).toString():""),
    verified:Boolean(p.verified),regulated:Boolean(p.regulated),requiresPrescription:Boolean(p.requires_prescription),
    featured:Boolean(p.featured),active:Boolean(p.active)
  }));
  return NextResponse.json({products});
}
