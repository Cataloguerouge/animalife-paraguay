"use client";
import {useState} from "react";
export default function AddToCart({productId,disabled=false}:{productId:string;disabled?:boolean}){
 const [added,setAdded]=useState(false);
 function add(){if(disabled)return;let cart:Record<string,number>={};try{cart=JSON.parse(localStorage.getItem("animalife-cart")||"{}")}catch{};cart[productId]=(cart[productId]||0)+1;localStorage.setItem("animalife-cart",JSON.stringify(cart));setAdded(true);setTimeout(()=>setAdded(false),1600)}
 return <button className="button primary wide" disabled={disabled} onClick={add}>{added?"✓ Agregado al carrito":"Agregar al carrito"}</button>
}
