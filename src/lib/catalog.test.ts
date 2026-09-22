import { describe, expect, it } from "vitest";
import {
  getPrimaryDestinationName,
  getPrimaryDestinationId,
  resolvePackageDestinationName,
  type DestinationNameRelation,
} from "./catalog";

describe("getPrimaryDestinationName", () => {
  it("returns the destination marked as primary", () => {
    const relations: DestinationNameRelation[] = [
      { is_primary: false, sort_order: 0, destinations: { name: "Rio Croa" } },
      { is_primary: true, sort_order: 1, destinations: { name: "Cruzeiro do Sul" } },
    ];

    expect(getPrimaryDestinationName(relations)).toBe("Cruzeiro do Sul");
  });

  it("falls back to the first ordered valid destination", () => {
    const relations: DestinationNameRelation[] = [
      { is_primary: false, sort_order: 2, destinations: { name: "São Paulo" } },
      { is_primary: false, sort_order: 1, destinations: { name: "Rio Branco" } },
    ];

    expect(getPrimaryDestinationName(relations)).toBe("Rio Branco");
  });

  it("ignores relations whose destination is unavailable", () => {
    const relations: DestinationNameRelation[] = [
      { is_primary: true, sort_order: 0, destinations: null },
      { is_primary: false, sort_order: 1, destinations: { name: "Rio Croa" } },
    ];

    expect(getPrimaryDestinationName(relations)).toBe("Rio Croa");
  });

  it("returns null when no relation is available", () => {
    expect(getPrimaryDestinationName([])).toBeNull();
    expect(getPrimaryDestinationName(undefined)).toBeNull();
  });
});

describe("getPrimaryDestinationId", () => {
  it("returns the primary legacy destination id", () => {
    expect(getPrimaryDestinationId([
      { destination_id: "secondary", is_primary: false, sort_order: 0, destinations: { name: "A" } },
      { destination_id: "primary", is_primary: true, sort_order: 1, destinations: { name: "B" } },
    ])).toBe("primary");
  });

  it("returns null when legacy relations are unavailable", () => {
    expect(getPrimaryDestinationId([])).toBeNull();
  });
});

describe("resolvePackageDestinationName", () => {
  it("preserves the destination stored directly on the package", () => {
    expect(resolvePackageDestinationName({
      destinationName: "  Fortaleza, Ceará  ",
      legacyDestinationName: "São Paulo",
    })).toBe("Fortaleza, Ceará");
  });

  it("recovers the destination from the legacy destination_id relation", () => {
    expect(resolvePackageDestinationName({
      destinationName: null,
      legacyDestinationName: "Rio Croa",
    })).toBe("Rio Croa");
  });

  it("falls back to the normalized relation and then to the route", () => {
    expect(resolvePackageDestinationName({
      relations: [
        { is_primary: true, sort_order: 0, destinations: { name: "Rio Branco" } },
      ],
      routeDestinationName: "Manaus",
    })).toBe("Rio Branco");

    expect(resolvePackageDestinationName({
      relations: [],
      routeDestinationName: "Manaus",
    })).toBe("Manaus");
  });
});
