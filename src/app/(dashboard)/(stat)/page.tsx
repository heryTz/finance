import { apiGuard } from "@/lib/api-guard";
import { getStats } from "./stat-service";
import { StatContent } from "./components/stat-content";

export default async function StatPage() {
  const { user } = await apiGuard();
  const stats = await getStats(user.id);

  return <StatContent data={stats} />;
}
