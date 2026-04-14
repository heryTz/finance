import { Suspense } from "react";
import { OperationPage } from "./operation-page";
import { Loader } from "@/components/loader";
import { getOperationQuerySerializer } from "./operation-dto";
import { createSearchParamsCache } from "nuqs/server";
import { guard } from "@/lib/auth";
import { getOperations } from "./operation-service";

const querySerializer = getOperationQuerySerializer();
const searchParamsCache = createSearchParamsCache({
  [querySerializer.key]: querySerializer.parser,
});

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await guard();
  const params = searchParamsCache.parse(searchParams);

  const operations = await getOperations(user.id, {
    ...params.filter,
    page: params.filter.page ?? 1,
    pageSize: params.filter.pageSize ?? 10,
  });
  const results = operations.results.map((operation) => ({
    ...operation,
    amount: operation.amount.toString(),
  }));

  return (
    <Suspense fallback={<Loader />}>
      <OperationPage operations={{ ...operations, results }} />
    </Suspense>
  );
}
