create or replace function public.create_order(
  p_user_id uuid,
  p_email text,
  p_phone text,
  p_shipping_address jsonb,
  p_items jsonb,
  p_delivery_provider text,
  p_delivery_pyg bigint,
  p_delivery_eta text,
  p_payment_provider text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_subtotal bigint := 0;
  v_total bigint := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_delivery bigint;
  v_department text := lower(trim(coalesce(p_shipping_address->>'department','Central')));
  v_city text := lower(trim(coalesce(p_shipping_address->>'city','')));
begin
  if auth.uid() is not null and p_user_id is distinct from auth.uid() then
    raise exception 'User mismatch';
  end if;
  if auth.uid() is null and p_user_id is not null then
    raise exception 'Authentication required for user orders';
  end if;
  if p_email is null or length(trim(p_email)) < 3 then
    raise exception 'Email is required';
  end if;
  if p_phone is null or length(trim(p_phone)) < 6 then
    raise exception 'Phone is required';
  end if;
  if v_city = '' or coalesce(p_shipping_address->>'address','') = '' then
    raise exception 'Shipping address is required';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items)=0 then
    raise exception 'El carrito está vacío';
  end if;

  if lower(coalesce(p_delivery_provider,'')) <> 'mock'
     or lower(coalesce(p_payment_provider,'')) <> 'mock' then
    raise exception 'Provider not enabled';
  end if;

  v_delivery := case
    when v_department = 'central' and v_city = 'asunción' then 25000
    else 45000
  end;

  if greatest(coalesce(p_delivery_pyg,0),0) <> v_delivery then
    raise exception 'Invalid delivery quote';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty <= 0 or v_qty > 100 then
      raise exception 'Cantidad inválida';
    end if;

    select * into v_product
    from public.products
    where id=(v_item->>'productId')::uuid
      and active=true
      and verified=true
    for update;

    if not found then raise exception 'Producto no disponible para venta'; end if;
    if v_product.stock < v_qty then
      raise exception 'Stock insuficiente para %',v_product.name;
    end if;

    v_subtotal := v_subtotal + coalesce(v_product.sale_price_pyg,v_product.price_pyg) * v_qty;
  end loop;

  v_total := v_subtotal + v_delivery;

  insert into public.orders(
    user_id,email,phone,status,subtotal_pyg,delivery_pyg,total_pyg,shipping_address
  )
  values(
    p_user_id,p_email,p_phone,'PAYMENT_PENDING',v_subtotal,v_delivery,v_total,p_shipping_address
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid for update;

    insert into public.order_items(order_id,product_id,sku,name,unit_price_pyg,quantity)
    values(v_order_id,v_product.id,v_product.sku,v_product.name,
      coalesce(v_product.sale_price_pyg,v_product.price_pyg),v_qty);

    update public.products set stock=stock-v_qty where id=v_product.id;

    insert into public.inventory_movements(product_id,quantity_delta,reason,order_id)
    values(v_product.id,-v_qty,'ORDER_RESERVED',v_order_id);
  end loop;

  insert into public.delivery_shipments(
    order_id,provider,status,department,city,quoted_pyg,eta,raw_response
  )
  values(
    v_order_id,'mock','PENDING',
    p_shipping_address->>'department',p_shipping_address->>'city',
    v_delivery,p_delivery_eta,jsonb_build_object('source','checkout')
  );

  insert into public.payments(
    order_id,provider,provider_payment_id,status,amount_pyg,raw_response
  )
  values(
    v_order_id,'mock','pending-' || replace(v_order_id::text,'-',''),
    'PENDING',v_total,jsonb_build_object('source','checkout')
  );

  return jsonb_build_object('orderId',v_order_id,'totalPyg',v_total,'deliveryPyg',v_delivery);
end;
$$;
