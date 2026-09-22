alter table public.packages
  add column if not exists travel_time time without time zone;

comment on column public.packages.travel_time is
  'Horário local opcional de uma experiência regional com data fixa. Deve ser combinado com travel_date.';

create or replace function public.save_package_catalog(
  p_package jsonb,
  p_inclusions jsonb,
  p_itinerary jsonb,
  p_images jsonb,
  p_menu_items jsonb,
  p_destinations jsonb,
  p_travel_time text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_package_id uuid;
  v_travel_time time without time zone;
begin
  v_travel_time := nullif(trim(p_travel_time), '')::time without time zone;

  if p_package ->> 'package_type' = 'regional'
    and ((nullif(p_package ->> 'travel_date', '') is null) <> (v_travel_time is null))
  then
    raise exception 'Informe a data e o horário da experiência ou deixe os dois campos vazios.';
  end if;

  if p_package ->> 'package_type' <> 'regional' then
    v_travel_time := null;
  end if;

  v_package_id := public.save_package_catalog(
    p_package,
    p_inclusions,
    p_itinerary,
    p_images,
    p_menu_items,
    p_destinations
  );

  update public.packages
  set travel_time = v_travel_time
  where id = v_package_id;

  return v_package_id;
end;
$$;

comment on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, text) is
  'Salva o catálogo atomicamente e registra o horário local opcional da experiência.';

revoke execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, text)
  from public, anon;
grant execute on function public.save_package_catalog(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, text)
  to authenticated;
