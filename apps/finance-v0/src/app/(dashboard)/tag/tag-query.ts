import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import type { GetTags } from "./tag-service";

export function useTags() {
  return useQuery({
    queryKey: ["useTags"],
    queryFn: () => httpClient.get<GetTags>("/tags"),
  });
}
