import { useEffect, useRef } from "react";
import { cn } from "src/shared/lib/utils";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export function OtpInput({ value, onChange, disabled, error }: OtpInputProps) {
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    const composed = next.join("").replace(/ /g, "");
    onChange(composed);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset resets break the inline layout
    <div
      className="flex gap-2 justify-between"
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, i) => (
        <input
          // biome-ignore lint/suspicious/noArrayIndexKey: OTP digits are positionally stable
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit === " " ? "" : digit}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-10 h-12 text-center text-lg font-semibold rounded-md border bg-background shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-destructive" : "border-input",
          )}
        />
      ))}
    </div>
  );
}
