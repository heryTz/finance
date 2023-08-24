import { GetTagResponse } from "@/app/api/v1/tags/route";
import { httpClient } from "@/app/helper";
import { useQuery } from "react-query";

export function useTags() {
  return useQuery("tags", () => httpClient.get<GetTagResponse>("/tags"));
}
