create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'ADMIN'
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'phone');
  return new;
end;
$$;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "public read active categories" on public.categories;
drop policy if exists "admins manage categories" on public.categories;
drop policy if exists "public read active products" on public.products;
drop policy if exists "admins manage products" on public.products;
drop policy if exists "users read own profile" on public.profiles;
drop policy if exists "users update own profile" on public.profiles;
drop policy if exists "users manage own addresses" on public.addresses;
drop policy if exists "users read own orders" on public.orders;
drop policy if exists "admins manage orders" on public.orders;
drop policy if exists "users read own order items" on public.order_items;
drop policy if exists "admins manage order items" on public.order_items;
drop policy if exists "admins manage payments" on public.payments;
drop policy if exists "admins manage deliveries" on public.delivery_shipments;
drop policy if exists "admins manage inventory" on public.inventory_movements;
drop policy if exists "admins manage promotions" on public.promotions;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "admins upload product images" on storage.objects;
drop policy if exists "admins update product images" on storage.objects;
drop policy if exists "admins delete product images" on storage.objects;

revoke all on table public.profiles, public.categories, public.products, public.addresses,
  public.orders, public.order_items, public.payments, public.delivery_shipments,
  public.inventory_movements, public.promotions from anon, authenticated;

grant select on table public.categories, public.products to anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.addresses to authenticated;
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.order_items to authenticated;
grant select, insert, update, delete on table public.payments to authenticated;
grant select, insert, update, delete on table public.delivery_shipments to authenticated;
grant select, insert, update, delete on table public.inventory_movements to authenticated;
grant select, insert, update, delete on table public.promotions to authenticated;
grant insert, update, delete on table public.categories, public.products to authenticated;

create policy "anon read active categories" on public.categories
for select to anon using (active = true);

create policy "authenticated read categories" on public.categories
for select to authenticated using (active = true or (select private.is_admin()));

create policy "admins insert categories" on public.categories
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update categories" on public.categories
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete categories" on public.categories
for delete to authenticated using ((select private.is_admin()));

create policy "anon read active products" on public.products
for select to anon using (active = true);

create policy "authenticated read products" on public.products
for select to authenticated using (active = true or (select private.is_admin()));

create policy "admins insert products" on public.products
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update products" on public.products
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete products" on public.products
for delete to authenticated using ((select private.is_admin()));

create policy "users read own profile" on public.profiles
for select to authenticated
using ((select auth.uid()) = id or (select private.is_admin()));

create policy "users update own profile" on public.profiles
for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "users read own addresses" on public.addresses
for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "users insert own addresses" on public.addresses
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "users update own addresses" on public.addresses
for update to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()))
with check ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "users delete own addresses" on public.addresses
for delete to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "users read own orders" on public.orders
for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "admins insert orders" on public.orders
for insert to authenticated
with check ((select private.is_admin()));

create policy "admins update orders" on public.orders
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete orders" on public.orders
for delete to authenticated using ((select private.is_admin()));

create policy "users read own order items" on public.order_items
for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.user_id = (select auth.uid()) or (select private.is_admin()))
  )
);

create policy "admins insert order items" on public.order_items
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update order items" on public.order_items
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete order items" on public.order_items
for delete to authenticated using ((select private.is_admin()));

create policy "admins read payments" on public.payments
for select to authenticated using ((select private.is_admin()));

create policy "admins insert payments" on public.payments
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update payments" on public.payments
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete payments" on public.payments
for delete to authenticated using ((select private.is_admin()));

create policy "admins read deliveries" on public.delivery_shipments
for select to authenticated using ((select private.is_admin()));

create policy "admins insert deliveries" on public.delivery_shipments
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update deliveries" on public.delivery_shipments
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete deliveries" on public.delivery_shipments
for delete to authenticated using ((select private.is_admin()));

create policy "admins read inventory" on public.inventory_movements
for select to authenticated using ((select private.is_admin()));

create policy "admins insert inventory" on public.inventory_movements
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update inventory" on public.inventory_movements
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete inventory" on public.inventory_movements
for delete to authenticated using ((select private.is_admin()));

create policy "admins read promotions" on public.promotions
for select to authenticated using ((select private.is_admin()));

create policy "admins insert promotions" on public.promotions
for insert to authenticated with check ((select private.is_admin()));

create policy "admins update promotions" on public.promotions
for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admins delete promotions" on public.promotions
for delete to authenticated using ((select private.is_admin()));

create index if not exists addresses_user_idx on public.addresses(user_id);
create index if not exists inventory_movements_product_idx on public.inventory_movements(product_id);
create index if not exists inventory_movements_order_idx on public.inventory_movements(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);
create index if not exists payments_order_idx on public.payments(order_id);

create policy "public read product images" on storage.objects
for select to public using (bucket_id = 'product-images');

create policy "admins upload product images" on storage.objects
for insert to authenticated
with check (bucket_id = 'product-images' and (select private.is_admin()));

create policy "admins update product images" on storage.objects
for update to authenticated
using (bucket_id = 'product-images' and (select private.is_admin()))
with check (bucket_id = 'product-images' and (select private.is_admin()));

create policy "admins delete product images" on storage.objects
for delete to authenticated
using (bucket_id = 'product-images' and (select private.is_admin()));

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure private.handle_new_user();

drop trigger if exists profiles_touch on public.profiles;
drop trigger if exists products_touch on public.products;
drop trigger if exists orders_touch on public.orders;
drop trigger if exists payments_touch on public.payments;
drop trigger if exists deliveries_touch on public.delivery_shipments;

create trigger profiles_touch before update on public.profiles for each row execute procedure private.touch_updated_at();
create trigger products_touch before update on public.products for each row execute procedure private.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute procedure private.touch_updated_at();
create trigger payments_touch before update on public.payments for each row execute procedure private.touch_updated_at();
create trigger deliveries_touch before update on public.delivery_shipments for each row execute procedure private.touch_updated_at();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;

drop function if exists public.handle_new_user();
drop function if exists public.touch_updated_at();
drop function if exists public.is_admin();