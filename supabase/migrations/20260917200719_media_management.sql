-- Keep the public URL for backwards compatibility, but also persist the
-- canonical Storage object path so files can be managed safely.
alter table public.packages
  add column if not exists cover_image_path text;

alter table public.destinations
  add column if not exists cover_image_path text;

alter table public.package_images
  add column if not exists storage_path text,
  add column if not exists alt_text text,
  add column if not exists caption text;

update public.packages
set cover_image_path = nullif(
  split_part(cover_image_url, '/storage/v1/object/public/packages/', 2),
  ''
)
where cover_image_path is null
  and cover_image_url is not null;

update public.destinations
set cover_image_path = nullif(
  split_part(cover_image_url, '/storage/v1/object/public/destinations/', 2),
  ''
)
where cover_image_path is null
  and cover_image_url is not null;

update public.package_images
set storage_path = nullif(
  split_part(image_url, '/storage/v1/object/public/packages/', 2),
  ''
)
where storage_path is null;

-- Enforce the same restrictions on the server that the admin UI applies.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]::text[]
where id in ('avatars', 'destinations', 'packages', 'galleries');
