import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

const BRAND_URL = process.env.APP_URL ?? "https://walletko.herynirintsoa.com";
const LOGO_SRC = `${BRAND_URL}/logo-256.png`;

const fontStack =
  "'Geist', 'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const monoStack =
  "'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

const brandGradient =
  "linear-gradient(135deg, #7c3aed 0%, #4f46e5 55%, #06b6d4 100%)";

const styles = {
  body: {
    backgroundColor: "#f0f0f2", // --desk
    fontFamily: fontStack,
    margin: "0",
    padding: "24px 12px",
  },
  card: {
    backgroundColor: "#ffffff", // --card
    margin: "0 auto",
    maxWidth: "464px",
    borderRadius: "16px",
    border: "1px solid #e7e7ea", // --border
    overflow: "hidden",
    boxShadow:
      "0 1px 2px rgba(31, 32, 36, 0.04), 0 10px 28px rgba(31, 32, 36, 0.06)",
  },
  rail: {
    height: "4px",
    lineHeight: "4px",
    fontSize: "1px",
    backgroundColor: "#6d28d9", // --primary fallback (Outlook)
    backgroundImage: brandGradient,
  },
  inner: {
    padding: "36px 40px 32px",
  },
  brandRow: {
    textAlign: "center" as const,
    padding: "0 0 28px 0",
  },
  logoTile: {
    display: "inline-block",
    verticalAlign: "middle",
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    backgroundColor: "#6d28d9", // shows through if image is blocked
    backgroundImage: brandGradient,
    overflow: "hidden",
  },
  logoImg: {
    display: "block",
    borderRadius: "11px",
  },
  wordmark: {
    display: "inline-block",
    verticalAlign: "middle",
    paddingLeft: "11px",
    fontSize: "19px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "#1f2024", // --foreground
  },
  heading: {
    fontSize: "21px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
    color: "#1f2024", // --foreground
    margin: "0 0 8px 0",
    textAlign: "center" as const,
  },
  body_text: {
    fontSize: "14px",
    color: "#71717a", // --muted-foreground
    margin: "0 0 26px 0",
    lineHeight: "1.55",
    textAlign: "center" as const,
  },
  otp_section: {
    textAlign: "center" as const,
    margin: "0 0 16px 0",
  },
  otp_code: {
    display: "inline-block",
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "0.28em",
    // pad the right so the last glyph's tracking doesn't break centering
    textIndent: "0.28em",
    color: "#3a1d6e", // --highlight-foreground
    backgroundColor: "#efe9fb", // --accent
    border: "1px solid #d9cdf5",
    borderRadius: "12px",
    padding: "18px 28px",
    margin: "0",
    fontFamily: monoStack,
    fontVariantNumeric: "tabular-nums" as const,
    boxShadow: "0 2px 10px rgba(109, 40, 217, 0.10)",
  },
  expiry: {
    fontSize: "13px",
    color: "#71717a", // --muted-foreground
    textAlign: "center" as const,
    margin: "0",
  },
  expiryDot: {
    color: "#6d28d9", // --primary
    fontSize: "13px",
  },
  hr: {
    borderColor: "#e7e7ea", // --border
    margin: "28px 0 20px",
  },
  footer: {
    fontSize: "12px",
    color: "#71717a", // --muted-foreground
    textAlign: "center" as const,
    lineHeight: "1.5",
    margin: "0 0 10px 0",
  },
  footerLink: {
    color: "#6d28d9", // --primary
    textDecoration: "none",
  },
  tagline: {
    fontSize: "11px",
    color: "#a1a1aa",
    textAlign: "center" as const,
    letterSpacing: "0.02em",
    margin: "0",
  },
};

type OtpEmailProps = {
  otp: string;
};

export default function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>Your Walletko sign-in code: {otp}</Preview>
      <Body style={styles.body}>
        <Container style={styles.card}>
          <Section style={styles.rail}>&nbsp;</Section>

          <Section style={styles.inner}>
            <Section style={styles.brandRow}>
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                border={0}
                align="center"
                style={{ margin: "0 auto" }}
              >
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "middle" }}>
                      <span style={styles.logoTile}>
                        <Img
                          src={LOGO_SRC}
                          width="40"
                          height="40"
                          alt="Walletko"
                          style={styles.logoImg}
                        />
                      </span>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <span style={styles.wordmark}>Walletko</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Heading style={styles.heading}>Your sign-in code</Heading>
            <Text style={styles.body_text}>
              Enter the code below to sign in to your Walletko account. We use
              it to confirm it&apos;s really you.
            </Text>

            <Section style={styles.otp_section}>
              <Text style={styles.otp_code}>{otp}</Text>
            </Section>

            <Text style={styles.expiry}>
              <span style={styles.expiryDot}>&#9679;</span> Expires in 5 minutes
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Didn&apos;t try to sign in? You can safely ignore this email —
              your account stays locked and unchanged.
            </Text>
            <Text style={styles.tagline}>
              <Link href={BRAND_URL} style={styles.footerLink}>
                Walletko
              </Link>{" "}
              — personal budget, simplified
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderOtpEmail(
  otp: string,
  _email: string,
): Promise<string> {
  return render(<OtpEmail otp={otp} />);
}
