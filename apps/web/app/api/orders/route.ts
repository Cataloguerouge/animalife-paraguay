import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase-server";
import {mockDeliveryProvider,mockPaymentProvider} from "../../../lib/providers";

export async function POST(req:Request){
 try{
  const body=await req.json();
  const email=String(body.email||"").trim();
  const phone=String(body.phone||"").trim();
  const city=String(body.shippingAddress?.city||"").trim();
  const department=String(body.shippingAddress?.department||"Central").trim();
  const address=String(body.shippingAddress?.address||"").trim();
  const items=Array.isArray(body.items)?body.items:[];

  if(!email||!phone||!city||!address||!items.length)
    return NextResponse.json({error:"Faltan datos obligatorios del pedido"},{status:400});

  const supabase=await createClient();
  if(!supabase)return NextResponse.json({error:"Supabase no está configurado"},{status:503});

  const {data:{user}}=await supabase.auth.getUser();
  const weightKg=Math.max(1,items.reduce((sum:any,item:any)=>sum+Math.max(1,Number(item.quantity||0)),0));
  const delivery=await mockDeliveryProvider.calculateRate({department,city,weightKg});

  const {data,error}=await supabase.rpc("create_order",{
    p_user_id:user?.id??null,
    p_email:email,
    p_phone:phone,
    p_shipping_address:{department,city,address},
    p_items:items,
    p_delivery_provider:"mock",
    p_delivery_pyg:delivery.amount,
    p_delivery_eta:delivery.eta,
    p_payment_provider:"mock"
  });
  if(error)return NextResponse.json({error:error.message},{status:400});

  const orderId=String(data?.orderId||"");
  const total=Number(data?.totalPyg||0);
  const payment=await mockPaymentProvider.createPayment({
    orderId,amount:total,currency:"PYG",
    returnUrl:"/checkout"
  });

  return NextResponse.json({orderId,totalPyg:total,deliveryPyg:Number(data?.deliveryPyg||delivery.amount),deliveryEta:delivery.eta,paymentUrl:payment.url});
 }catch(error){
  return NextResponse.json({error:error instanceof Error?error.message:"Error inesperado"},{status:500});
 }
}
