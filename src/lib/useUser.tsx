import { useSession } from "next-auth/react";

export function useUser() {
  const session = useSession();
  if (!session?.data?.user)
    throw new Error("You should wrap this hook with AppProvider");
  return session.data.user;
}
