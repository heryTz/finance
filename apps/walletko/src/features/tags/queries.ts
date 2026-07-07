import { queryOptions } from "@tanstack/react-query";
import { listTagsFn, listTagsPagedFn } from "src/server/functions/tags.fn";

export const TAGS_PAGE_SIZE = 20;

export const tagKeys = {
  all: ["tags"] as const,
  list: () => [...tagKeys.all] as const,
  paged: (page: number, pageSize: number) =>
    [...tagKeys.all, "paged", page, pageSize] as const,
};

export const tagsQuery = queryOptions({
  queryKey: tagKeys.list(),
  queryFn: () => listTagsFn(),
});

export const tagsPagedQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: tagKeys.paged(page, pageSize),
    queryFn: () => listTagsPagedFn({ data: { page, pageSize } }),
  });
