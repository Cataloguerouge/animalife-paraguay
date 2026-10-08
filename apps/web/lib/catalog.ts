import type { Product } from "@animalife/shared";

export const products: Product[] = [
  {id:"demo-finotrato",sku:"FINO-PRIME-15",slug:"finotrato-prime-15kg",name:"FINOTRATO PRIME",brand:"VB Alimentos",category:"Perros",animal:"PERROS",description:"Alimento completo para perros. Presentación de 15 kg. Ficha comercial pendiente de verificación.",packageSize:"15 kg",price:0,stock:0,image:"food",verified:false,regulated:false,requiresPrescription:false,featured:true,active:true},
  {id:"demo-fluralab",sku:"FLUR-BOV-1L",slug:"fluralab-bovinos-5-1l",name:"FLURALAB BOVINOS 5%",brand:"LABETS",category:"Bovinos",animal:"BOVINOS",description:"Fluralaner 5% para bovinos, presentación 1 L. Precio y ficha sujetos a verificación comercial.",packageSize:"1 L",price:669999,stock:0,image:"bovinos",verified:false,regulated:true,requiresPrescription:false,featured:true,active:true},
  {id:"demo-raguife",sku:"RAG-PRIME-CREC",slug:"raguife-prime-combo-crecimiento",name:"RAGUIFE PRIME COMBO CRECIMIENTO",brand:"Raguife",category:"Perros",animal:"PERROS",description:"Producto de referencia del diseño aprobado. Datos comerciales pendientes de carga oficial.",packageSize:"Combo",price:0,stock:0,image:"food",verified:false,regulated:false,requiresPrescription:false,featured:true,active:true},
  {id:"demo-ranger",sku:"RAN-757-SG",slug:"ranger-757-sg",name:"RANGER 75,7 SG",category:"Campo",animal:"CAMPO",description:"Producto de referencia del diseño aprobado. Ficha técnica y precio por verificar.",price:0,stock:0,image:"field",verified:false,regulated:true,requiresPrescription:false,featured:false,active:true},
  {id:"demo-ciper",sku:"CIP-6-CALBOS",slug:"cipermetrina-6-calbos",name:"CIPERMETRINA 6% CALBOS",category:"Campo",animal:"CAMPO",description:"Producto de referencia del diseño aprobado. Ficha técnica y precio por verificar.",packageSize:"6%",price:0,stock:0,image:"field",verified:false,regulated:true,requiresPrescription:false,featured:false,active:true},
  {id:"demo-hipofen",sku:"HIP-PAS-20",slug:"hipofen-pasta-oral-20g",name:"HIPOFEN PASTA ORAL 20g",category:"Equinos",animal:"EQUINOS",description:"Producto de referencia del diseño aprobado. Ficha técnica y precio por verificar.",packageSize:"20 g",price:0,stock:0,image:"horse",verified:false,regulated:true,requiresPrescription:false,featured:false,active:true}
];

export const categories=[
  {name:"Perros",icon:"🐕"},
  {name:"Gatos",icon:"🐈"},
  {name:"Bovinos",icon:"🐄"},
  {name:"Equinos",icon:"🐎"},
  {name:"Campo",icon:"🌾"},
  {name:"Ofertas",icon:"%" }
];

export function getProduct(slug:string){return products.find(p=>p.slug===slug);}
export function displayPrice(p:Product){return p.salePrice ?? p.price;}
