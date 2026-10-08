import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase-server";
import {mockDeliveryProvider,activePaymentProvider} from "../../../lib/providers";

export async function POST(req:Request){
 try{
  const body=await req.json();
  const email=String(body.email||"").trim();const phone=String(body.phone||"").trim();
  const name=String(body.name||"").trim();const document=String(body.document||"").trim();
  const city=String(body.shippingAddress?.city||"").trim();const department=String(body.shippingAddress?.department||"Central").trim();
  const address=String(body.shippingAddress?.address||"").trim();const items=Array.isArray(body.items)?body.items:[];
  if(!email||!phone||!city||!address||!items.length)return NextResponse.json({error:"Faltan datos obligatorios del pedido"},{status:400});
  const supabase=await createClient();if(!supabase)return NextResponse.json({error:"Supabase no está configurado"},{status:503});
  if(process.env.PAGOPAR_PUBLIC_KEY&&process.env.PAGOPAR_PRIVATE_KEY&&(!name||!document))return NextResponse.json({error:"Nombre y documento son obligatorios para el medio de pago configurado"},{status:400});
  const {data:{user}}=await supabase.auth.getUser();
  const weightKg=Math.max(1,items.reduce((sum:any,item:any)=>sum+Math.max(1,Number(item.quantity||0)),0));
  const delivery=await mockDeliveryProvider.calculateRate({department,city,weightKg});
  const paymentProviderName=process.env.PAGOPAR_PUBLIC_KEY&&process.env.PAGOPAR_PRIVATE_KEY?"pagopar":"mock";
  const {data,error}=await supabase.rpc("create_order",{p_user_id:user?.id??null,p_email:email,p_phone:phone,p_shipping_address:{department,city,address,name,document},p_items:items,p_delivery_provider:"mock",p_delivery_pyg:delivery.amount,p_delivery_eta:delivery.eta,p_payment_provider:paymentProviderName});
  if(error)return NextResponse.json({error:error.message},{status:400});
  const orderId=String(data?.orderId||"");const total=Number(data?.totalPyg||0);
  const ids=items.map((x:any)=>String(x.productId)).filter(Boolean);
  const {data:rows}=await supabase.from("products").select("id,name,description,image_path").in("id",ids);
  const byId=new Map((rows??[]).map((x:any)=>[x.id,x]));
  const paymentItems=items.map((x:any)=>{const p=byId.get(String(x.productId));return {id:p?.id,name:p?.name,description:p?.description,image:p?.image_path?process.env.NEXT_PUBLIC_SUPABASE_URL+"/storage/v1/object/public/product-images/"+p.image_path:"",quantity:Number(x.quantity||1),total:0};});
  const payment=await activePaymentProvider.createPayment({orderId,amount:total,currency:"PYG",returnUrl:"/checkout",metadata:{name,document,email,phone,address,items:paymentItems}});
  await supabase.from("payments").update({provider:paymentProviderName,provider_payment_id:payment.id,raw_response:{source:"checkout",payment_url:payment.url}}).eq("order_id",orderId);
  return NextResponse.json({orderId,totalPyg:total,deliveryPyg:Number(data?.deliveryPyg||delivery.amount),deliveryEta:delivery.eta,paymentUrl:payment.url,paymentProvider:paymentProviderName});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Error inesperado"},{status:500});}
}
