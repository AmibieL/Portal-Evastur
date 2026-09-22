import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminPackageForm from "./AdminPackageForm";

function renderRegionalForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/admin/pacotes/regionais/novo"]}>
        <Routes>
          <Route
            path="/admin/pacotes/regionais/:id"
            element={<AdminPackageForm packageType="regional" />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AdminPackageForm regional schedule", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("allows an optional fixed date and time and flags partial input", () => {
    renderRegionalForm();

    const dateInput = screen.getByLabelText("Data");
    const timeInput = screen.getByLabelText("Horário");

    expect(screen.getByText("Data fixa da experiência")).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("aria-invalid", "false");
    expect(timeInput).toHaveAttribute("aria-invalid", "false");

    fireEvent.change(dateInput, { target: { value: "2026-10-15" } });
    expect(dateInput).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Preencha data e horário juntos ou deixe ambos vazios.")).toBeInTheDocument();

    fireEvent.change(timeInput, { target: { value: "08:30" } });
    expect(dateInput).toHaveAttribute("aria-invalid", "false");
    expect(timeInput).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByText("Preencha data e horário juntos ou deixe ambos vazios.")).not.toBeInTheDocument();
  });
});
