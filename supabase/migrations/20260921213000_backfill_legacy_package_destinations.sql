-- Preenche o novo destino direto usando os vínculos mantidos pelos pacotes
-- antigos. Isso permite editar status e outros campos sem exigir que o
-- administrador informe novamente um destino já cadastrado anteriormente.

update public.packages package
set destination_name = destination.name
from public.destinations destination
where package.destination_id = destination.id
  and nullif(trim(package.destination_name), '') is null;

with primary_destination as (
  select distinct on (relation.package_id)
    relation.package_id,
    destination.name
  from public.package_destinations relation
  join public.destinations destination on destination.id = relation.destination_id
  order by
    relation.package_id,
    relation.is_primary desc,
    relation.sort_order,
    relation.created_at
)
update public.packages package
set destination_name = source.name
from primary_destination source
where source.package_id = package.id
  and nullif(trim(package.destination_name), '') is null;
