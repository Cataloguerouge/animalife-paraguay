create or replace function public.create_order(
  p_user_id uuid,
  p_email text,
  p_phone text,
  p_shipping_address jsonb,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  v_order_id uuid;
  v_subtotal bigint := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if jsonb_array_length(p_items)=0 then raise exception 'El carrito está vacío'; end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty <= 0 then raise exception 'Cantidad inválida'; end if;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid and active=true for update;
    if not found then raise exception 'Producto no disponible'; end if;
    if v_product.stock < v_qty then raise exception 'Stock insuficiente para %',v_product.name; end if;
    v_subtotal := v_subtotal + coalesce(v_product.sale_price_pyg,v_product.price_pyg) * v_qty;
  end loop;

  insert into public.orders(user_id,email,phone,status,subtotal_pyg,total_pyg,shipping_address)
  values(p_user_id,p_email,p_phone,'CREATED',v_subtotal,v_subtotal,p_shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid for update;
    insert into public.order_items(order_id,product_id,sku,name,unit_price_pyg,quantity)
    values(v_order_id,v_product.id,v_product.sku,v_product.name,coalesce(v_product.sale_price_pyg,v_product.price_pyg),v_qty);
    update public.products set stock=stock-v_qty where id=v_product.id;
    insert into public.inventory_movements(product_id,quantity_delta,reason,order_id)
    values(v_product.id,-v_qty,'ORDER_RESERVED',v_order_id);
  end loop;
  return v_order_id;
end;
$$;

grant execute on function public.create_order(uuid,text,text,jsonb,jsonb) to anon,authenticated;
