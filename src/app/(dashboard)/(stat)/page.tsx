import { apiGuard } from "@/lib/api-guard";
import { getStats } from "./stat-service";
import { StatContent } from "./components/stat-content";
import { Metadata } from "next";
import { genTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: genTitle("Dashboard"),
};

export default async function StatPage() {
  const { user } = await apiGuard();
  const stats = await getStats(user.id);

  return <StatContent data={stats} />;
}
