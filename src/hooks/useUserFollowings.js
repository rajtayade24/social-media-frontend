import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../service/api";
import { useEffect, useId, useMemo } from "react";
import { follow, unFollow } from "../service/userService";
import useAuthStore from "../store/useAuthStore";

const PAGE_SIZE = 10;

export function useUserFollowings(userId, options = {}) {
  const myFollowings = useAuthStore(s => s.myFollowings);
  const addFollowing = useAuthStore(s => s.addFollowing)
  const removeFollowing = useAuthStore(s => s.removeFollowing)
  const token = useAuthStore(s => s.token);

  useEffect(() => {
    console.log(myFollowings)
    console.log(Array.from(myFollowings));
    console.log(Array.isArray(myFollowings));
  }, [myFollowings])

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["userFollowings", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await apiFetch(`/api/users/${userId}/followings?page=${pageParam}&size=${PAGE_SIZE}`);
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

  const followingMutation = useMutation({
    mutationFn: (targetId) => follow(targetId, userId, token),
    onMutate: async (targetId) => {
      const norm = Number(targetId);
      const queryKey = ["userFollowings", userId];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      const previousFollowings = Array.isArray(myFollowings) ? [...myFollowings] : [];


      addFollowing(targetId)

      return { previousData, previousFollowings };
    },
    onSuccess: (createdFollowing, targetId) => {
      const queryKey = ["userFollowings", userId]
      queryClient.setQueryData(queryKey, (old) => {
        console.log(old);
        if (!old) { // old = { pageParams: [0, 1, 2, ...],pages:  
          return {
            pageParams: [],
            pages: [{ ...createdFollowPage(createdFollowing) }],
          };
        }
        const newPages = [...old.pages];
        // ensure the first page exists
        if (newPages.length === 0) {
          newPages[0] = { content: [createdFollowing], number: 0, last: false };
        } else {
          newPages[0] = {
            ...newPages[0],
            content: [createdFollowing, ...(newPages[0].content || [])],
            totalElements: typeof newPages[0].totalElements === 'number' ? newPages[0].totalElements + 1 : undefined
          };
        }
        // Save to localStorage like your original flow
        try {
          localStorage.setItem(
            "profilePosts",
            JSON.stringify(newPages[0].content || [createdFollowing])
          );
        } catch (e) {
          // ignore storage errors
        }
        return { ...old, pages: newPages };
      });


      addFollowing(targetId)
      // // ensure myFollowings contains the numeric id
      // if (typeof setMyFollowings === "function") {
      //   const norm = Number(targetId);
      //   setMyFollowings(prev => {
      //     const p = Array.isArray(prev) ? [...prev] : [];
      //     if (p.includes(norm)) return p;
      //     return [norm, ...p];
      //   });
      // }
    },
    onError: (err, targetId, context) => {
      const queryKey = ["userFollowings", userId];
      console.error("Follow failed:", err);
      // optional UI: alert("Follow failed")
    },
    onSettled: () => {
      queryClient.invalidateQueries(["userFollowings", userId]);
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

  const deleteFollowingMutation = useMutation({

    mutationFn: (targetId) => unFollow(targetId, userId, token),

    onMutate: async (targetId) => {
      const norm = Number(targetId);
      const queryKey = ["userFollowings", userId]

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages
          .map((page) => {
            const content = page.content || [];
            const newContent = content.filter((p) => {
              const pid = String(p?.id ?? p?.userid ?? p?.userId ?? "");
              return pid !== String(targetId);
            });
            const hadPost = content.some((p) => String(p?.id ?? p?.userid ?? p?.userId ?? "") === String(targetId));


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

      removeFollowing(targetId)

      return { previousData };
    },

    onError: (error, targetId, context) => {
      const queryKey = ["userFollowings", userId];
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      // rollback global follow ids if needed — you could store prev in context too
      // (this example keeps it simple)
      console.error("Unfollow failed:", error);
      alert("Failed to unfollow. Please try again.");
    },

    onSuccess: (data, targetId) => {
      removeFollowing(targetId)
    },
    onSettled: () => {
      const queryKey = ["userFollowings", userId]
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    ...infiniteQuery,
    allFollows,
    deleteFollowingMutation,
    followingMutation,
  };

}



