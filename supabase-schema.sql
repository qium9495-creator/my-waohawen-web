create extension if not exists pgcrypto;
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), sku text not null unique, name text not null,
  collection text not null check (collection in ('Fuyi Collection','Art Collection','RH-Style Collection')),
  room text, category text, style text, price numeric, description text, material text,
  dimensions text, finish text, images jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid default auth.uid()
);
alter table public.products enable row level security;
create policy "Public can read published products" on public.products for select using (status = 'published');
create policy "Authenticated admins can read all products" on public.products for select to authenticated using (true);
create policy "Authenticated admins can insert products" on public.products for insert to authenticated with check (auth.uid() = created_by);
create policy "Authenticated admins can update products" on public.products for update to authenticated using (true) with check (true);
create policy "Authenticated admins can delete products" on public.products for delete to authenticated using (true);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('product-images','product-images',true,8388608,array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public=true,file_size_limit=8388608,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy "Public can view product images" on storage.objects for select using (bucket_id='product-images');
create policy "Authenticated admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id='product-images');
create policy "Authenticated admins can update product images" on storage.objects for update to authenticated using (bucket_id='product-images');
create policy "Authenticated admins can delete product images" on storage.objects for delete to authenticated using (bucket_id='product-images');
