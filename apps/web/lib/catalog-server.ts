import type { Product } from "@animalife/shared";
import { createClient } from "./supabase-server";
import { products as fallbackProducts, categories as fallbackCategories } from "./catalog";

export type CatalogCategory = { name: string; icon: string; slug: string };

const icons: Record<string,string> = {
  perros:"🐕", gatos:"🐈", bovinos:"🐄", equinos:"🐎", campo:"🌾", ofertas:"%"
};

function mapProduct(row:any, categoryName:string):Product {
  const animal = row.animal as Product["animal"];
  const image = row.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${row.image_path}`
    : "";
  return {
    id:row.id, sku:row.sku, slug:row.slug, name:row.name, brand:row.brand ?? undefined,
    category:categoryName, animal, description:row.description, packageSize:row.package_size ?? undefined,
    price:Number(row.price_pyg||0), salePrice:row.sale_price_pyg == null ? undefined : Number(row.sale_price_pyg),
    stock:Number(row.stock||0), image, verified:Boolean(row.verified), regulated:Boolean(row.regulated),
    requiresPrescription:Boolean(row.requires_prescription), featured:Boolean(row.featured), active:Boolean(row.active)
  };
}

export async function getCatalogCategories():Promise<CatalogCategory[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackCategories.map(c=>({name:c.name,icon:c.icon,slug:c.name.toLowerCase()}));
  const {data,error}=await supabase.from("categories").select("name,slug,sort_order").eq("active",true).order("sort_order");
  if (error) return [];
  return (data??[]).map(c=>({name:c.name,slug:c.slug,icon:icons[c.slug] ?? "•"}));
}

export async function getCatalogProducts():Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackProducts;
  const [{data:rows,error},{data:cats}] = await Promise.all([
    supabase.from("products").select("*").eq("active",true).order("featured",{ascending:false}).order("name"),
    supabase.from("categories").select("id,name")
  ]);
  if (error) return [];
  const catMap=new Map((cats??[]).map(c=>[c.id,c.name]));
  return (rows??[]).map(row=>mapProduct(row,catMap.get(row.category_id)??"Otros"));
}

export async function getProductBySlug(slug:string):Promise<Product|null> {
  const supabase=await createClient();
  if (!supabase) return fallbackProducts.find(p=>p.slug===slug) ?? null;
  const {data:row,error}=await supabase.from("products").select("*").eq("slug",slug).eq("active",true).maybeSingle();
  if (error || !row) return null;
  let categoryName="Otros";
  if(row.category_id){
    const {data:cat}=await supabase.from("categories").select("name").eq("id",row.category_id).maybeSingle();
    categoryName=cat?.name ?? categoryName;
  }
  return mapProduct(row,categoryName);
}

export function productEmoji(p:Product) {
  return p.animal==="BOVINOS"?"🐄":p.animal==="EQUINOS"?"🐎":p.animal==="CAMPO"?"🌾":p.animal==="GATOS"?"🐈":"🐕";
}
