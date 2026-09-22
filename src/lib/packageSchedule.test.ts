import { describe, expect, it } from "vitest";
import { getFixedPackageSchedule } from "./packageSchedule";

describe("getFixedPackageSchedule", () => {
  it("does not expose a partial or empty regional schedule", () => {
    expect(getFixedPackageSchedule(null, null)).toBeNull();
    expect(getFixedPackageSchedule("2026-10-15", null)).toBeNull();
    expect(getFixedPackageSchedule(null, "08:30:00")).toBeNull();
  });

  it("combines the fixed date and local time for reservations", () => {
    expect(getFixedPackageSchedule("2026-10-15", "08:30:00")).toEqual({
      date: "2026-10-15",
      time: "08:30",
      dateTime: "2026-10-15T08:30:00",
    });
  });
});
