-- Normaliza os dados legados do catálogo sem remover colunas/tabelas ainda
-- consumidas pela versão publicada do frontend. A remoção física deve ocorrer
-- somente depois do deploy da aplicação que lê package_destinations.

-- ---------------------------------------------------------------------------
-- Destinos reais e migração dos relacionamentos legados
-- ---------------------------------------------------------------------------

insert into public.destinations (
  name,
  slug,
  subtitle,
  summary,
  description,
  region_type,
  city,
  state,
  country,
  publication_status,
  active,
  seo_title,
  seo_description
)
values
  (
    'São Paulo',
    'sao-paulo',
    'Negócios, cultura e experiências urbanas',
    'Destino nacional para viagens de negócios, eventos e lazer.',
    'São Paulo reúne grandes eventos, gastronomia, cultura e uma ampla rede de serviços para o viajante.',
    'national',
    'São Paulo',
    'SP',
    'Brasil',
    'published',
    true,
    'São Paulo | Destinos Evastur',
    'Conheça os pacotes Evastur com destino a São Paulo.'
  ),
  (
    'Rio Branco',
    'rio-branco-acre',
    'A capital do Acre',
    'Destino para eventos, negócios e experiências culturais no Acre.',
    'Rio Branco combina serviços, cultura e conexões com diferentes regiões do Acre.',
    'regional',
    'Rio Branco',
    'Acre',
    'Brasil',
    'published',
    true,
    'Rio Branco | Destinos Evastur',
    'Conheça os pacotes Evastur com destino a Rio Branco, Acre.'
  )
on conflict (slug) do nothing;

insert into public.destinations (
  name,
  slug,
  subtitle,
  summary,
  description,
  region_type,
  city,
  state,
  country,
  cover_image_url,
  cover_image_path,
  access_info,
  recommendations,
  publication_status,
  active,
  seo_title,
  seo_description
)
values (
  'Rio Croa',
  'rio-croa',
  'Natureza amazônica em águas tranquilas',
  'Uma experiência regional de contemplação, navegação e contato com a floresta.',
  'O Rio Croa oferece uma paisagem amazônica singular para quem busca tranquilidade, natureza e uma experiência conduzida por pessoas da região.',
  'regional',
  'Cruzeiro do Sul',
  'Acre',
  'Brasil',
  'https://ryzggxbhxoclojqejjne.supabase.co/storage/v1/object/public/destinations/wfduznqqwn_1773185400582.webp',
  'wfduznqqwn_1773185400582.webp',
  'Combine o deslocamento e o passeio com antecedência. A Evastur pode orientar sobre transporte e acompanhamento local.',
  'Use roupas leves, proteção solar e repelente. Leve água e proteja equipamentos eletrônicos durante o passeio.',
  'published',
  true,
  'Rio Croa, Acre | Evastur',
  'Descubra o Rio Croa em Cruzeiro do Sul, Acre, com informações e experiências selecionadas pela Evastur.'
)
on conflict (slug) do update set
  name = excluded.name,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  description = excluded.description,
  region_type = excluded.region_type,
  city = excluded.city,
  state = excluded.state,
  country = excluded.country,
  cover_image_url = excluded.cover_image_url,
  cover_image_path = excluded.cover_image_path,
  access_info = excluded.access_info,
  recommendations = excluded.recommendations,
  publication_status = excluded.publication_status,
  active = excluded.active,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();

insert into public.destination_gallery (
  destination_id,
  image_url,
  storage_path,
  alt_text,
  caption,
  sort_order
)
select
  d.id,
  image.image_url,
  image.storage_path,
  image.alt_text,
  image.caption,
  image.sort_order
from public.destinations d
cross join (
  values
    (
      'https://ryzggxbhxoclojqejjne.supabase.co/storage/v1/object/public/galleries/jszetmkj2on_1773185393810.webp',
      'jszetmkj2on_1773185393810.webp',
      'Passeio de barco no Rio Croa',
      'Navegação em meio à paisagem amazônica',
      1
    ),
    (
      'https://ryzggxbhxoclojqejjne.supabase.co/storage/v1/object/public/galleries/87v83qlbh9e_1773185408174.webp',
      '87v83qlbh9e_1773185408174.webp',
      'Canoa navegando no Rio Croa',
      'Contato próximo com a natureza',
      2
    )
) as image(image_url, storage_path, alt_text, caption, sort_order)
where d.slug = 'rio-croa'
  and not exists (
    select 1
    from public.destination_gallery existing
    where existing.destination_id = d.id
      and existing.storage_path = image.storage_path
  );

insert into public.destination_highlights (
  destination_id,
  title,
  description,
  icon,
  sort_order
)
select d.id, highlight.title, highlight.description, highlight.icon, highlight.sort_order
from public.destinations d
cross join (
  values
    ('Navegação contemplativa', 'Percurso em embarcação para observar a paisagem com calma.', 'boat', 1),
    ('Floresta amazônica', 'Contato direto com a vegetação e os sons da floresta.', 'trees', 2),
    ('Experiência regional', 'Atividade organizada com orientação e conhecimento local.', 'map-pin', 3)
) as highlight(title, description, icon, sort_order)
where d.slug = 'rio-croa'
  and not exists (
    select 1
    from public.destination_highlights existing
    where existing.destination_id = d.id
      and existing.title = highlight.title
  );

insert into public.destination_itinerary_days (
  destination_id,
  day_number,
  title,
  description
)
select d.id, 1, 'Imersão no Rio Croa',
  'Deslocamento combinado, recepção, passeio contemplativo e tempo para aproveitar a paisagem amazônica.'
from public.destinations d
where d.slug = 'rio-croa'
on conflict (destination_id, day_number) do nothing;

with legacy_mapping(destination_name, destination_slug) as (
  values
    ('são paulo', 'sao-paulo'),
    ('rio branco', 'rio-branco-acre')
)
insert into public.package_destinations (
  package_id,
  destination_id,
  is_primary,
  sort_order
)
select p.id, d.id, true, 0
from public.packages p
join legacy_mapping mapping
  on lower(trim(p.destination_name)) = mapping.destination_name
join public.destinations d
  on d.slug = mapping.destination_slug
where not exists (
  select 1
  from public.package_destinations existing
  where existing.package_id = p.id
)
on conflict (package_id, destination_id) do nothing;

-- Mantém o FK legado coerente enquanto a versão publicada ainda o utiliza.
update public.packages p
set destination_id = relation.destination_id
from public.package_destinations relation
where relation.package_id = p.id
  and relation.is_primary
  and p.destination_id is distinct from relation.destination_id;

-- ---------------------------------------------------------------------------
-- Salvamento atômico usando apenas o relacionamento normalizado
-- ---------------------------------------------------------------------------

create or replace function public.save_package_catalog(
  p_package jsonb,
  p_inclusions jsonb,
  p_itinerary jsonb,
  p_images jsonb,
  p_menu_items jsonb,
  p_destinations jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_package_id uuid;
  v_primary_count integer;
  v_total_slots integer;
  v_available_slots integer;
begin
  if (select auth.uid()) is null then
    raise exception using
      errcode = '42501',
      message = 'É necessário estar autenticado para salvar um produto.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  ) then
    raise exception using
      errcode = '42501',
      message = 'Somente administradores podem salvar produtos.';
  end if;

  if jsonb_typeof(coalesce(p_package, '{}'::jsonb)) <> 'object' then
    raise exception 'Os dados do produto devem ser um objeto JSON.';
  end if;

  if jsonb_typeof(coalesce(p_inclusions, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_itinerary, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_images, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_menu_items, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_destinations, '[]'::jsonb)) <> 'array'
  then
    raise exception 'As coleções do produto devem ser listas JSON.';
  end if;

  v_package_id := coalesce(
    nullif(p_package ->> 'id', '')::uuid,
    gen_random_uuid()
  );
  v_total_slots := nullif(p_package ->> 'total_slots', '')::integer;
  v_available_slots := nullif(p_package ->> 'available_slots', '')::integer;

  if nullif(trim(p_package ->> 'title'), '') is null then
    raise exception 'Informe o título do produto.';
  end if;

  if coalesce(p_package ->> 'slug', '') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception 'O slug informado é inválido.';
  end if;

  if coalesce((p_package ->> 'price')::numeric, 0) <= 0 then
    raise exception 'O preço deve ser maior que zero.';
  end if;

  if v_total_slots is not null and v_total_slots < 0 then
    raise exception 'A capacidade total não pode ser negativa.';
  end if;

  if v_available_slots is not null and v_available_slots < 0 then
    raise exception 'As vagas disponíveis não podem ser negativas.';
  end if;

  if v_total_slots is not null
    and v_available_slots is not null
    and v_available_slots > v_total_slots
  then
    raise exception 'As vagas disponíveis não podem superar a capacidade total.';
  end if;

  select count(*) filter (where is_primary)
  into v_primary_count
  from jsonb_to_recordset(coalesce(p_destinations, '[]'::jsonb))
    as destination_rows(destination_id uuid, is_primary boolean, sort_order integer);

  if jsonb_array_length(coalesce(p_destinations, '[]'::jsonb)) = 0 then
    raise exception 'Vincule pelo menos um destino cadastrado ao produto.';
  end if;

  if v_primary_count <> 1 then
    raise exception 'O produto deve ter exatamente um destino principal.';
  end if;

  insert into public.packages (
    id,
    title,
    slug,
    category,
    duration,
    price,
    installments,
    short_description,
    cover_image_url,
    cover_image_path,
    status,
    active,
    travel_date,
    total_slots,
    available_slots,
    route_info,
    package_details,
    package_type,
    travel_scope,
    publication_status,
    sales_status,
    updated_at
  ) values (
    v_package_id,
    trim(p_package ->> 'title'),
    trim(p_package ->> 'slug'),
    p_package ->> 'category',
    nullif(trim(p_package ->> 'duration'), ''),
    (p_package ->> 'price')::numeric,
    coalesce((p_package ->> 'installments')::integer, 10),
    nullif(trim(p_package ->> 'short_description'), ''),
    nullif(p_package ->> 'cover_image_url', ''),
    nullif(p_package ->> 'cover_image_path', ''),
    p_package ->> 'status',
    coalesce((p_package ->> 'active')::boolean, true),
    nullif(p_package ->> 'travel_date', '')::date,
    v_total_slots,
    v_available_slots,
    nullif(p_package -> 'route_info', 'null'::jsonb),
    nullif(p_package -> 'package_details', 'null'::jsonb),
    p_package ->> 'package_type',
    nullif(p_package ->> 'travel_scope', ''),
    p_package ->> 'publication_status',
    p_package ->> 'sales_status',
    now()
  )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    category = excluded.category,
    duration = excluded.duration,
    price = excluded.price,
    installments = excluded.installments,
    short_description = excluded.short_description,
    cover_image_url = excluded.cover_image_url,
    cover_image_path = excluded.cover_image_path,
    status = excluded.status,
    active = excluded.active,
    travel_date = excluded.travel_date,
    total_slots = excluded.total_slots,
    available_slots = excluded.available_slots,
    route_info = excluded.route_info,
    package_details = excluded.package_details,
    package_type = excluded.package_type,
    travel_scope = excluded.travel_scope,
    publication_status = excluded.publication_status,
    sales_status = excluded.sales_status,
    updated_at = now();

  delete from public.package_inclusions where package_id = v_package_id;
  insert into public.package_inclusions (package_id, inclusion_key, label)
  select v_package_id, inclusion_key, label
  from jsonb_to_recordset(coalesce(p_inclusions, '[]'::jsonb))
    as inclusion_rows(inclusion_key text, label text);

  delete from public.package_itinerary_days where package_id = v_package_id;
  insert into public.package_itinerary_days (package_id, day_number, title, description)
  select v_package_id, day_number, trim(title), nullif(trim(description), '')
  from jsonb_to_recordset(coalesce(p_itinerary, '[]'::jsonb))
    as itinerary_rows(day_number integer, title text, description text)
  where nullif(trim(title), '') is not null;

  delete from public.package_images where package_id = v_package_id;
  insert into public.package_images (
    package_id,
    image_url,
    storage_path,
    alt_text,
    caption,
    sort_order
  )
  select
    v_package_id,
    image_url,
    nullif(storage_path, ''),
    nullif(alt_text, ''),
    nullif(caption, ''),
    sort_order
  from jsonb_to_recordset(coalesce(p_images, '[]'::jsonb))
    as image_rows(
      image_url text,
      storage_path text,
      alt_text text,
      caption text,
      sort_order integer
    );

  delete from public.package_menu_items where package_id = v_package_id;
  insert into public.package_menu_items (package_id, name, description, price, sort_order)
  select v_package_id, trim(name), nullif(trim(description), ''), price, sort_order
  from jsonb_to_recordset(coalesce(p_menu_items, '[]'::jsonb))
    as menu_rows(name text, description text, price numeric, sort_order integer)
  where nullif(trim(name), '') is not null;

  delete from public.package_destinations where package_id = v_package_id;
  insert into public.package_destinations (
    package_id,
    destination_id,
    is_primary,
    sort_order
  )
  select
    v_package_id,
    destination_id,
    coalesce(is_primary, false),
    sort_order
  from jsonb_to_recordset(coalesce(p_destinations, '[]'::jsonb))
    as destination_rows(destination_id uuid, is_primary boolean, sort_order integer);

  return v_package_id;
end;
$$;

comment on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb) is
  'Salva um produto e suas coleções atomicamente usando package_destinations como fonte dos destinos.';

revoke execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  from public, anon;
grant execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  to authenticated;
