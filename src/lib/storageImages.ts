import { supabase } from "@/integrations/supabase/client";

export type ImageBucket = "avatars" | "destinations" | "packages" | "galleries";

export function getStoragePathFromPublicUrl(
  url: string | null | undefined,
  bucket: ImageBucket
) {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;

  const encodedPath = url.slice(markerIndex + marker.length).split("?")[0];
  if (!encodedPath) return null;

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

export async function removeStorageImages(bucket: ImageBucket, urls: string[]) {
  const paths = Array.from(
    new Set(
      urls
        .map((url) => getStoragePathFromPublicUrl(url, bucket))
        .filter((path): path is string => Boolean(path))
    )
  );

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
}
