-- Supabase schema for Catálogo Premium
-- Execute in Supabase SQL Editor (Project > SQL).

-- 1) Products
create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  price numeric(12,2) not null,
  category text not null default '',
  description text not null default '',
  image text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

-- 2) Orders + items
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  total numeric(12,2) not null default 0,
  source text,
  customer jsonb
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id bigint,
  name text not null,
  price numeric(12,2) not null,
  quantity int not null default 1
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- 3) Admins
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;

-- Policies
-- Public can read active products
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
on public.products for select
using (active = true);

-- Admin can do everything on products
drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
on public.products for all
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Anyone (anon) can create orders and items (checkout)
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
on public.order_items for insert
to anon, authenticated
with check (true);

-- Admin can read orders/items
drop policy if exists "orders_admin_select" on public.orders;
create policy "orders_admin_select"
on public.orders for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "order_items_admin_select" on public.order_items;
create policy "order_items_admin_select"
on public.order_items for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Admin can manage admin_users (so you can promote others)
drop policy if exists "admin_users_admin_all" on public.admin_users;
create policy "admin_users_admin_all"
on public.admin_users for all
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
