import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase-server";
import {createClient as createAdminClient} from "@supabase/supabase-js";

export async function POST(req:Request){
 try{
  const body=await req.json();
  const email=String(body.email||"").trim();
  const phone=String(body.phone||"").trim();
  const items=Array.isArray(body.items)?body.items:[];
  if(!email||!items.length)return NextResponse.json({error:"email e items son obligatorios"},{status:400});
  const userClient=await createClient();
  const session=await userClient?.auth.getUser();
  const userId=session?.data.user?.id??null;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!service)return NextResponse.json({error:"Supabase no está configurado todavía"},{status:503});
  const admin=createAdminClient(url,service);
  const {data,error}=await admin.rpc("create_order",{p_user_id:userId,p_email:email,p_phone:phone,p_shipping_address:body.shippingAddress??{},p_items:items});
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({orderId:data});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Error inesperado"},{status:500});}
}
