import { httpClient } from "@/lib";
import { useQuery } from "react-query";
import type { GetTags } from "./tag-service";

export function useTags() {
  return useQuery("tags", () => httpClient.get<GetTags>("/tags"));
}
