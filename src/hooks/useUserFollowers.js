  import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../service/api";
import {  useMemo } from "react";
import { follow, unFollow } from "../service/userService";

const PAGE_SIZE = 10;

export function useUserFollowers(userId, options = {}) {
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["userFollowers", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await apiFetch(`/api/users/${userId}/followers?page=${pageParam}&size=${PAGE_SIZE}`);
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (typeof lastPage.number !== "number" || typeof lastPage.totalPages !== "number") {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
    enabled: !!userId,
  });

  const allFollows = useMemo(() => {
    if (!infiniteQuery.data?.pages) return [];
    return infiniteQuery.data.pages.flatMap((p) => p.content || []);
  }, [infiniteQuery.data]);

  const queryClient = useQueryClient();

  const followerMutation = useMutation({
    mutationFn: (targetId, token) => follow(targetId, userId, token),
    onMutate: async () => { },
    onSuccess: (createdFollower) => {
      const queryKey = ["userFollowers", userId]
      queryClient.setQueryData(queryKey, (old) => {
        console.log(old);
        if (!old) { // old = { pageParams: [0, 1, 2, ...],pages:  
          return {
            pageParams: [],
            pages: [{ ...createdFollowPage(createdFollower) }],
          };
        }
        const newPages = [...old.pages];
        // ensure the first page exists
        if (newPages.length === 0) {
          newPages[0] = { content: [createdFollower], number: 0, last: false };
        } else {
          newPages[0] = {
            ...newPages[0],
            content: [createdFollower, ...(newPages[0].content || [])],
            totalElements: typeof newPages[0].totalElements === 'number' ? newPages[0].totalElements + 1 : undefined
          };
        }
        // Save to localStorage like your original flow
        // try {
        //   localStorage.setItem(
        //     "profilePosts",
        //     JSON.stringify(newPages[0].content || [createdFollower])
        //   );
        // } catch (e) {
        //   // ignore storage errors
        // }
        return { ...old, pages: newPages };
      });
    },
    onError: (err) => {
      // show user-friendly message
      const message = err?.message || JSON.stringify(err) || "Upload failed";
      alert("Upload error: " + message);
    },
  });

  // Helper to create a minimal page object if cache empty (not required but keeps shape)
  const createdFollowPage = (follow) => ({
    content: [follow],
    number: 0,
    size: 10,
    totalPages: 1,
    last: true,
  });



  const deleteFollowerMutation = useMutation({

    mutationFn: (targetId, token) =>unFollow(targetId, userId, token),

    onMutate: async ({ id }) => {
      const queryKey = ["userFollowers", userId]

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages
          .map((page) => {
            const content = page.content || [];
            const hadPost = content.some((p) => p.id === id);
            const newContent = content.filter((p) => p.id !== id);

            return {
              ...page,
              content: newContent,
              totalElements:
                typeof page.totalElements === "number"
                  ? hadPost
                    ? page.totalElements - 1
                    : page.totalElements
                  : page.totalElements,
            };
          })

        return { ...old, pages: newPages };
      });

      return { previousData };
    },

    onError: (error, _, context) => {
      const queryKey = ["userFollowers", userId]

      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      console.error("Delete failed:", error);
      alert("Failed to delete post. Please try again.");
      alert("Failed to delete post. Please try again.");
    },

    onSuccess: (_, { id }) => {
      console.log("Post deleted:", id);
    },
    onSettled: () => {
      const queryKey = ["userFollowers", userId]
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    ...infiniteQuery,
    allFollows,
    deleteFollowerMutation,
    followerMutation,
  };

}



