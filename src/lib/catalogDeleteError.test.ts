import { describe, expect, it } from "vitest";
import { getCatalogDeleteErrorDescription } from "./catalogDeleteError";

describe("getCatalogDeleteErrorDescription", () => {
  it("explica por que um pacote com reservas não pode ser excluído", () => {
    const description = getCatalogDeleteErrorDescription({
      code: "23503",
      message: "violates foreign key constraint reservations_package_id_fkey",
    }, "package");

    expect(description).toContain("possui reservas");
    expect(description).toContain("Desative ou arquive");
  });

  it("não exibe detalhes internos do banco para vínculos de destino", () => {
    const description = getCatalogDeleteErrorDescription({
      code: "23503",
      message: "violates foreign key constraint packages_destination_id_fkey",
    }, "destination");

    expect(description).toContain("possui vínculos");
    expect(description).not.toContain("foreign key");
  });

  it("usa uma mensagem segura para erros inesperados", () => {
    expect(getCatalogDeleteErrorDescription(new Error("internal"), "package"))
      .toBe("Não foi possível excluir o pacote. Tente novamente ou verifique os dados vinculados.");
  });
});
