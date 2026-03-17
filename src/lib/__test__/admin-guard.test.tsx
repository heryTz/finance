import { render, screen } from "@testing-library/react";
import { AdminGuard } from "../admin-guard";
import { authClient } from "@/lib/auth-client";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn(),
  },
}));

jest.mock("next/navigation");

describe("admin guard", () => {
  it("show loading while session is pending", async () => {
    jest.mocked(authClient.useSession).mockReturnValueOnce({
      data: null,
      isPending: true,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    render(<AdminGuard />);
    const loader = await screen.findByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  it("show content when authenticated", async () => {
    jest.mocked(authClient.useSession).mockReturnValueOnce({
      data: { user: { id: "1", email: "test@example.com" }, session: {} },
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    render(<AdminGuard>Content</AdminGuard>);
    const content = await screen.findByText("Content");
    expect(content).toBeInTheDocument();
  });
});
