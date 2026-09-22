-- Pacotes passam a ser autocontidos: o destino/local é salvo diretamente em
-- packages.destination_name e não depende mais de um guia em destinations.

with package_destination_names as (
  select
    relation.package_id,
    destination.name,
    row_number() over (
      partition by relation.package_id
      order by relation.is_primary desc, relation.sort_order, relation.created_at
    ) as position
  from public.package_destinations relation
  join public.destinations destination on destination.id = relation.destination_id
)
update public.packages package
set destination_name = source.name
from package_destination_names source
where source.package_id = package.id
  and source.position = 1
  and nullif(trim(package.destination_name), '') is null;

comment on column public.packages.destination_name is
  'Destino ou local exibido diretamente no pacote, sem dependência de uma página de destino.';

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

  if nullif(trim(p_package ->> 'destination_name'), '') is null then
    raise exception 'Informe o destino ou local do produto.';
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

  insert into public.packages (
    id,
    title,
    slug,
    destination_name,
    category,
    duration,
    price,
    installments,
    short_description,
    full_description,
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
    trim(p_package ->> 'destination_name'),
    p_package ->> 'category',
    nullif(trim(p_package ->> 'duration'), ''),
    (p_package ->> 'price')::numeric,
    coalesce((p_package ->> 'installments')::integer, 10),
    nullif(trim(p_package ->> 'short_description'), ''),
    nullif(trim(p_package ->> 'full_description'), ''),
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
    destination_name = excluded.destination_name,
    category = excluded.category,
    duration = excluded.duration,
    price = excluded.price,
    installments = excluded.installments,
    short_description = excluded.short_description,
    full_description = excluded.full_description,
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

  -- Remove vínculos antigos quando um pacote é salvo pelo novo editor. As
  -- tabelas de destinos continuam preservadas durante a transição.
  delete from public.package_destinations where package_id = v_package_id;

  return v_package_id;
end;
$$;

comment on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb) is
  'Salva um pacote autocontido e suas coleções atomicamente; o destino é armazenado em packages.destination_name.';

revoke execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  from public, anon;
grant execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  to authenticated;
