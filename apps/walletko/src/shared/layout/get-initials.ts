export function getInitials({
  name,
  email,
}: {
  name?: string | null;
  email: string;
}) {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  return email[0].toUpperCase();
}
