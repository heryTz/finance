import { render, screen } from "@testing-library/react";
import { AdminGuard } from "../admin-guard";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");
jest.mock("next/navigation");

describe("admin guard", () => {
  it("show loading", async () => {
    jest.mocked(useSession).mockReturnValueOnce({
      status: "loading",
      data: null,
      update: jest.fn(),
    });
    render(<AdminGuard />);
    const loader = await screen.findByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  it("show content if authenticated", async () => {
    jest.mocked(useSession).mockReturnValueOnce({
      status: "authenticated",
      data: { expires: "" },
      update: jest.fn(),
    });
    render(<AdminGuard>Content</AdminGuard>);
    const content = await screen.findByText("Content");
    expect(content).toBeInTheDocument();
  });
});
