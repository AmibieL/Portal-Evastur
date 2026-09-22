type CatalogEntity = "package" | "destination";

type DatabaseErrorLike = {
  code?: string;
  message?: string;
};

export function getCatalogDeleteErrorDescription(
  error: unknown,
  entity: CatalogEntity,
) {
  const databaseError = error as DatabaseErrorLike | null;

  if (databaseError?.code === "23503") {
    if (
      entity === "package"
      && databaseError.message?.includes("reservations_package_id_fkey")
    ) {
      return "Este pacote possui reservas e precisa ser mantido no histórico. Desative ou arquive o pacote em vez de excluí-lo.";
    }

    return entity === "destination"
      ? "Este destino ainda possui vínculos que impedem a exclusão. Atualize os produtos relacionados e tente novamente."
      : "Este pacote ainda possui dados vinculados que precisam ser preservados. Desative ou arquive o pacote em vez de excluí-lo.";
  }

  return entity === "destination"
    ? "Não foi possível excluir o destino. Tente novamente ou verifique os vínculos cadastrados."
    : "Não foi possível excluir o pacote. Tente novamente ou verifique os dados vinculados.";
}
