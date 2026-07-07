import { describe, it, expect } from "vitest";
import { renderOtpEmail } from "./otp-email";

describe("renderOtpEmail", () => {
  it("includes the OTP code in the rendered HTML", async () => {
    const html = await renderOtpEmail("123456", "user@example.com");
    expect(html).toContain("123456");
  });

  it("includes the expiry message", async () => {
    const html = await renderOtpEmail("123456", "user@example.com");
    expect(html).toContain("5 minutes");
  });

  it("includes Walletko branding", async () => {
    const html = await renderOtpEmail("123456", "user@example.com");
    expect(html).toContain("Walletko");
  });

  it("includes the sign-in instructions", async () => {
    const html = await renderOtpEmail("123456", "user@example.com");
    expect(html).toContain("sign in");
  });
});
