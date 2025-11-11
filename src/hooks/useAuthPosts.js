// src/hooks/useAuthPosts.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../service/api";

const PAGE_SIZE = 10;

export function useAuthPosts(currentUserId) {
  return useInfiniteQuery({
    queryKey: ["authPosts", currentUserId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await apiFetch(`/users/${currentUserId}/posts?page=${pageParam}&size=${PAGE_SIZE}`);
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (typeof lastPage.number !== "number" || typeof lastPage.totalPages !== "number") {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
    enabled: !!currentUserId,
    keepPreviousData: true, // correct prop name (not `previousData`)
  });
}
