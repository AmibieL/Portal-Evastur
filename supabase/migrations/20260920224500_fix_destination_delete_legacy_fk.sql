-- packages.destination_id is a transitional legacy column. The canonical
-- relationship lives in package_destinations, whose foreign key already uses
-- ON DELETE CASCADE. Keep the legacy column compatible until it can be dropped,
-- but never let it block deleting a destination.

alter table public.packages
  drop constraint if exists packages_destination_id_fkey;

alter table public.packages
  add constraint packages_destination_id_fkey
  foreign key (destination_id)
  references public.destinations(id)
  on delete set null;

create index if not exists packages_destination_id_idx
  on public.packages(destination_id)
  where destination_id is not null;
