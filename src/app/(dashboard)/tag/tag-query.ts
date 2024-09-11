import { httpClient } from "@/lib/http-client";
import { useQuery } from "react-query";
import type { GetTags } from "./tag-service";

export function useTags() {
  return useQuery(useTags.name, () => httpClient.get<GetTags>("/tags"));
}
