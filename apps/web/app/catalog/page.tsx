import CatalogClient from "../../components/CatalogClient";
import {getCatalogCategories,getCatalogProducts} from "../../lib/catalog-server";

export default async function CatalogPage({searchParams}:{searchParams?:Promise<{category?:string|string[]}>}) {
  const params=await searchParams;
  const category=Array.isArray(params?.category)?params?.category[0]:params?.category;
  const [products,categories]=await Promise.all([getCatalogProducts(),getCatalogCategories()]);
  return <CatalogClient products={products} categories={categories} initialCategory={category||"Todos"}/>;
}
