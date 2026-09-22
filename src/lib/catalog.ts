export type DestinationNameRelation = {
  destination_id?: string;
  is_primary: boolean;
  sort_order: number;
  destinations: { name: string } | null;
};

export function getPrimaryDestinationId(
  relations: DestinationNameRelation[] | null | undefined
) {
  if (!relations?.length) return null;

  const ordered = [...relations].sort((left, right) => {
    if (left.is_primary !== right.is_primary) return left.is_primary ? -1 : 1;
    return left.sort_order - right.sort_order;
  });

  return ordered.find((relation) => relation.destination_id)?.destination_id ?? null;
}

export function getPrimaryDestinationName(
  relations: DestinationNameRelation[] | null | undefined
) {
  if (!relations?.length) return null;

  const ordered = [...relations].sort((left, right) => {
    if (left.is_primary !== right.is_primary) return left.is_primary ? -1 : 1;
    return left.sort_order - right.sort_order;
  });

  return ordered.find((relation) => relation.destinations?.name)?.destinations?.name ?? null;
}

type PackageDestinationNameSources = {
  destinationName?: string | null;
  legacyDestinationName?: string | null;
  relations?: DestinationNameRelation[] | null;
  routeDestinationName?: string | null;
};

export function resolvePackageDestinationName({
  destinationName,
  legacyDestinationName,
  relations,
  routeDestinationName,
}: PackageDestinationNameSources) {
  const candidates = [
    destinationName,
    legacyDestinationName,
    getPrimaryDestinationName(relations),
    routeDestinationName,
  ];

  return candidates.find((candidate) => candidate?.trim())?.trim() ?? "";
}
