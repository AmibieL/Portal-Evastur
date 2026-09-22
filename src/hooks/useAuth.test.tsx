import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  authStateCallback: null as ((event: string, session: Session | null) => void) | null,
  getSession: vi.fn(),
  getProfile: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: authMocks.getSession,
      onAuthStateChange: vi.fn((callback) => {
        authMocks.authStateCallback = callback;
        return { data: { subscription: { unsubscribe: authMocks.unsubscribe } } };
      }),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ single: authMocks.getProfile })),
      })),
    })),
  },
}));

import { AuthProvider, useAuth } from "./useAuth";

const session = {
  access_token: "initial-token",
  refresh_token: "refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: { id: "admin-1" },
} as Session;

function AuthStatus() {
  const { loading, profile } = useAuth();
  return <div>{loading ? "carregando" : `pronto:${profile?.role}`}</div>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    authMocks.authStateCallback = null;
    authMocks.getSession.mockResolvedValue({ data: { session } });
    authMocks.getProfile.mockResolvedValue({
      data: { role: "admin", full_name: "Admin", avatar_url: null },
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("mantém o app montado quando a sessão da mesma pessoa é renovada", async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    await screen.findByText("pronto:admin");
    expect(authMocks.getProfile).toHaveBeenCalledTimes(1);

    act(() => {
      authMocks.authStateCallback?.("TOKEN_REFRESHED", {
        ...session,
        access_token: "renewed-token",
      });
    });

    await waitFor(() => expect(screen.getByText("pronto:admin")).toBeInTheDocument());
    expect(authMocks.getProfile).toHaveBeenCalledTimes(1);
  });
});
