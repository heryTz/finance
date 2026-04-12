import { guard } from "@/lib/auth";
import { getStats } from "./stat-service";
import { StatContent } from "./components/stat-content";
import { Metadata } from "next";
import { genTitle } from "@/lib/seo";
import { createSearchParamsCache } from "nuqs/server";
import { getStatsQuerySerializer } from "./stat-dto";

export const metadata: Metadata = {
  title: genTitle("Dashboard"),
};

const querySerializer = getStatsQuerySerializer();
const searchParamsCache = createSearchParamsCache({
  [querySerializer.key]: querySerializer.parser,
});

export default async function StatPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await guard();
  const params = searchParamsCache.parse(searchParams);
  const stats = await getStats(user.id, params.filter);

  return <StatContent data={stats} defaultFilter={params.filter} />;
}
