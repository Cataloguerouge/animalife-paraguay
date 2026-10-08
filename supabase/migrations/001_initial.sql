create extension if not exists pgcrypto;

create type public.user_role as enum ('CUSTOMER','ADMIN');
create type public.order_status as enum ('CREATED','PAYMENT_PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED');
create type public.payment_status as enum ('PENDING','AUTHORIZED','PAID','FAILED','REFUNDED');
create type public.delivery_status as enum ('PENDING','READY','SHIPPED','IN_TRANSIT','DELIVERED','CANCELLED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'CUSTOMER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  brand text,
  category_id uuid references public.categories(id),
  animal text not null,
  description text not null default '',
  package_size text,
  price_pyg bigint not null default 0 check (price_pyg >= 0),
  sale_price_pyg bigint check (sale_price_pyg is null or sale_price_pyg >= 0),
  stock integer not null default 0 check (stock >= 0),
  low_stock_threshold integer not null default 5,
  image_path text,
  verified boolean not null default false,
  regulated boolean not null default false,
  requires_prescription boolean not null default false,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Principal',
  recipient_name text not null,
  phone text,
  department text not null,
  city text not null,
  address_line text not null,
  reference text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ANL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  phone text,
  status public.order_status not null default 'CREATED',
  currency text not null default 'PYG' check (currency='PYG'),
  subtotal_pyg bigint not null default 0 check (subtotal_pyg >= 0),
  delivery_pyg bigint not null default 0 check (delivery_pyg >= 0),
  total_pyg bigint not null default 0 check (total_pyg >= 0),
  shipping_address jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  sku text not null,
  name text not null,
  unit_price_pyg bigint not null check (unit_price_pyg >= 0),
  quantity integer not null check (quantity > 0),
  line_total_pyg bigint generated always as (unit_price_pyg * quantity) stored
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  status public.payment_status not null default 'PENDING',
  amount_pyg bigint not null check (amount_pyg >= 0),
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  provider text not null,
  tracking_number text,
  status public.delivery_status not null default 'PENDING',
  department text,
  city text,
  quoted_pyg bigint not null default 0 check (quoted_pyg >= 0),
  eta text,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  quantity_delta integer not null,
  reason text not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  discount_percent numeric(5,2) check (discount_percent between 0 and 100),
  discount_pyg bigint check (discount_pyg is null or discount_pyg >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

create index products_category_idx on public.products(category_id);
create index products_active_idx on public.products(active);
create index orders_user_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index order_items_order_idx on public.order_items(order_id);

insert into public.categories(name,slug,sort_order) values
('Perros','perros',1),('Gatos','gatos',2),('Bovinos','bovinos',3),
('Equinos','equinos',4),('Campo','campo',5),('Ofertas','ofertas',6)
on conflict (slug) do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.delivery_shipments enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.promotions enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='ADMIN'); $$;

create policy "public read active categories" on public.categories for select using (active=true or public.is_admin());
create policy "public read active products" on public.products for select using (active=true or public.is_admin());
create policy "users read own profile" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy "users manage own addresses" on public.addresses for all using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy "users read own orders" on public.orders for select using (user_id=auth.uid() or public.is_admin());
create policy "users read own order items" on public.order_items for select using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_admin())));
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage deliveries" on public.delivery_shipments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage inventory" on public.inventory_movements for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,full_name,phone) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),new.raw_user_meta_data->>'phone'); return new; end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger products_touch before update on public.products for each row execute procedure public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute procedure public.touch_updated_at();
create trigger payments_touch before update on public.payments for each row execute procedure public.touch_updated_at();
create trigger deliveries_touch before update on public.delivery_shipments for each row execute procedure public.touch_updated_at();
