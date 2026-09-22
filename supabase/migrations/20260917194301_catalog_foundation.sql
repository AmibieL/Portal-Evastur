-- Fundação do catálogo Evastur.
-- Esta migration é deliberadamente aditiva e idempotente para permitir uma
-- transição gradual sem interromper o catálogo e o checkout atuais.

-- ---------------------------------------------------------------------------
-- Classificação e estados dos produtos
-- ---------------------------------------------------------------------------

alter table public.packages
  add column if not exists package_type text,
  add column if not exists travel_scope text,
  add column if not exists publication_status text,
  add column if not exists sales_status text;

update public.packages
set
  package_type = coalesce(
    package_type,
    case when category = 'interno' then 'regional' else 'external' end
  ),
  travel_scope = coalesce(
    travel_scope,
    case
      when category = 'internacional' then 'international'
      when category in ('nacional', 'cruzeiro') then 'national'
      else null
    end
  ),
  publication_status = coalesce(
    publication_status,
    case
      when status = 'rascunho' then 'draft'
      when active = false then 'archived'
      else 'published'
    end
  ),
  sales_status = coalesce(
    sales_status,
    case
      when status = 'esgotado' then 'sold_out'
      when status = 'rascunho' then 'paused'
      else 'available'
    end
  );

alter table public.packages
  alter column package_type set default 'external',
  alter column package_type set not null,
  alter column publication_status set default 'draft',
  alter column publication_status set not null,
  alter column sales_status set default 'paused',
  alter column sales_status set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'packages_package_type_check'
      and conrelid = 'public.packages'::regclass
  ) then
    alter table public.packages
      add constraint packages_package_type_check
      check (package_type in ('external', 'regional'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'packages_travel_scope_check'
      and conrelid = 'public.packages'::regclass
  ) then
    alter table public.packages
      add constraint packages_travel_scope_check
      check (travel_scope is null or travel_scope in ('national', 'international'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'packages_publication_status_check'
      and conrelid = 'public.packages'::regclass
  ) then
    alter table public.packages
      add constraint packages_publication_status_check
      check (publication_status in ('draft', 'published', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'packages_sales_status_check'
      and conrelid = 'public.packages'::regclass
  ) then
    alter table public.packages
      add constraint packages_sales_status_check
      check (sales_status in ('available', 'paused', 'sold_out'));
  end if;
end
$$;

comment on column public.packages.package_type is
  'Tipo comercial do produto: external para viagens saindo do Acre ou regional para turismo dentro do Acre.';
comment on column public.packages.travel_scope is
  'Abrangência do pacote externo: national ou international. Deve ser nulo para experiências regionais.';
comment on column public.packages.publication_status is
  'Estado editorial: draft, published ou archived.';
comment on column public.packages.sales_status is
  'Estado comercial: available, paused ou sold_out.';

-- Mantém os campos novos sincronizados enquanto as telas antigas ainda gravam
-- category/status/active. Este trigger será removido quando a migração do
-- frontend estiver completa e os campos novos forem a fonte principal.
create or replace function public.sync_package_catalog_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.package_type := case
    when new.category = 'interno' then 'regional'
    else 'external'
  end;

  new.travel_scope := case
    when new.category = 'internacional' then 'international'
    when new.category in ('nacional', 'cruzeiro') then 'national'
    else null
  end;

  new.publication_status := case
    when new.status = 'rascunho' then 'draft'
    when new.active = false then 'archived'
    else 'published'
  end;

  new.sales_status := case
    when new.status = 'esgotado' then 'sold_out'
    when new.status = 'rascunho' then 'paused'
    else 'available'
  end;

  return new;
end;
$$;

drop trigger if exists trg_sync_package_catalog_fields on public.packages;
create trigger trg_sync_package_catalog_fields
  before insert or update of category, status, active
  on public.packages
  for each row
  execute function public.sync_package_catalog_fields();

-- Correções apontadas pelo Security Advisor em funções legadas.
alter function public.auto_soldout_on_zero_slots() set search_path = public;
alter function public.restore_slots_on_cancel() set search_path = public;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Conteúdo editorial dos destinos
-- ---------------------------------------------------------------------------

alter table public.destinations
  add column if not exists publication_status text,
  add column if not exists region_type text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text,
  add column if not exists summary text,
  add column if not exists access_info text,
  add column if not exists recommendations text,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

update public.destinations
set
  publication_status = coalesce(
    publication_status,
    case when active then 'published' else 'archived' end
  ),
  country = coalesce(country, 'Brasil');

alter table public.destinations
  alter column publication_status set default 'draft',
  alter column publication_status set not null,
  alter column country set default 'Brasil';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'destinations_publication_status_check'
      and conrelid = 'public.destinations'::regclass
  ) then
    alter table public.destinations
      add constraint destinations_publication_status_check
      check (publication_status in ('draft', 'published', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'destinations_region_type_check'
      and conrelid = 'public.destinations'::regclass
  ) then
    alter table public.destinations
      add constraint destinations_region_type_check
      check (region_type is null or region_type in ('regional', 'national', 'international'));
  end if;
end
$$;

-- Relação normalizada e expansível: um pacote pode visitar mais de um destino.
create table if not exists public.package_destinations (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (package_id, destination_id)
);

create unique index if not exists package_destinations_one_primary_idx
  on public.package_destinations(package_id)
  where is_primary;

create index if not exists package_destinations_destination_idx
  on public.package_destinations(destination_id, sort_order);

create table if not exists public.destination_highlights (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  title text not null,
  description text,
  icon text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create index if not exists destination_highlights_destination_idx
  on public.destination_highlights(destination_id, sort_order);

create table if not exists public.destination_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (destination_id, day_number)
);

create index if not exists destination_itinerary_destination_idx
  on public.destination_itinerary_days(destination_id, day_number);

alter table public.destination_gallery
  add column if not exists storage_path text,
  add column if not exists alt_text text,
  add column if not exists caption text;

-- ---------------------------------------------------------------------------
-- Data API e Row Level Security
-- ---------------------------------------------------------------------------

alter table public.package_destinations enable row level security;
alter table public.destination_highlights enable row level security;
alter table public.destination_itinerary_days enable row level security;

grant select on public.package_destinations to anon;
grant select, insert, update, delete on public.package_destinations to authenticated;
grant select on public.destination_highlights to anon;
grant select, insert, update, delete on public.destination_highlights to authenticated;
grant select on public.destination_itinerary_days to anon;
grant select, insert, update, delete on public.destination_itinerary_days to authenticated;

drop policy if exists "Public can view package destinations" on public.package_destinations;
create policy "Public can view package destinations"
  on public.package_destinations
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.packages p
      join public.destinations d on d.id = package_destinations.destination_id
      where p.id = package_destinations.package_id
        and p.active = true
        and p.publication_status = 'published'
        and d.active = true
        and d.publication_status = 'published'
    )
  );

drop policy if exists "Admins can manage package destinations" on public.package_destinations;
create policy "Admins can manage package destinations"
  on public.package_destinations
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Public can view destination highlights" on public.destination_highlights;
create policy "Public can view destination highlights"
  on public.destination_highlights
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.destinations d
      where d.id = destination_id
        and d.active = true
        and d.publication_status = 'published'
    )
  );

drop policy if exists "Admins can manage destination highlights" on public.destination_highlights;
create policy "Admins can manage destination highlights"
  on public.destination_highlights
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Public can view destination itinerary" on public.destination_itinerary_days;
create policy "Public can view destination itinerary"
  on public.destination_itinerary_days
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.destinations d
      where d.id = destination_id
        and d.active = true
        and d.publication_status = 'published'
    )
  );

drop policy if exists "Admins can manage destination itinerary" on public.destination_itinerary_days;
create policy "Admins can manage destination itinerary"
  on public.destination_itinerary_days
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

-- Substitui leituras públicas irrestritas por leituras condicionadas ao pai.
drop policy if exists "Anyone can view active packages" on public.packages;
drop policy if exists "Public can view published packages" on public.packages;
create policy "Public can view published packages"
  on public.packages
  for select
  to anon, authenticated
  using (active = true and publication_status = 'published');

drop policy if exists "Anyone can view package images" on public.package_images;
drop policy if exists "Public can view published package images" on public.package_images;
create policy "Public can view published package images"
  on public.package_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id
        and p.active = true
        and p.publication_status = 'published'
    )
  );

drop policy if exists "Anyone can view inclusions" on public.package_inclusions;
drop policy if exists "Public can view published package inclusions" on public.package_inclusions;
create policy "Public can view published package inclusions"
  on public.package_inclusions
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id
        and p.active = true
        and p.publication_status = 'published'
    )
  );

drop policy if exists "Anyone can view itinerary" on public.package_itinerary_days;
drop policy if exists "Anyone can view itinerary days" on public.package_itinerary_days;
drop policy if exists "Public can view published package itinerary" on public.package_itinerary_days;
create policy "Public can view published package itinerary"
  on public.package_itinerary_days
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id
        and p.active = true
        and p.publication_status = 'published'
    )
  );

drop policy if exists "menu_items_select_all" on public.package_menu_items;
drop policy if exists "Public can view published package menu items" on public.package_menu_items;
create policy "Public can view published package menu items"
  on public.package_menu_items
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id
        and p.active = true
        and p.publication_status = 'published'
    )
  );

drop policy if exists "Anyone can view active destinations" on public.destinations;
drop policy if exists "Public can view published destinations" on public.destinations;
create policy "Public can view published destinations"
  on public.destinations
  for select
  to anon, authenticated
  using (active = true and publication_status = 'published');

drop policy if exists "Anyone can view destination gallery" on public.destination_gallery;
drop policy if exists "Anyone can view gallery images" on public.destination_gallery;
drop policy if exists "Public can view published destination gallery" on public.destination_gallery;
create policy "Public can view published destination gallery"
  on public.destination_gallery
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.destinations d
      where d.id = destination_id
        and d.active = true
        and d.publication_status = 'published'
    )
  );
