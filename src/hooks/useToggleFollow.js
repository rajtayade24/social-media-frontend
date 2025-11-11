import { useMutation, useQueryClient } from "@tanstack/react-query";
import { follow, unFollow } from "../service/userService";

export function useToggleFollow(currentUserId) {
  const queryClient = useQueryClient();

  return useMutation(
    // mutationFn expects a single variable object
    ({ targetId, currentlyFollowing }) => {
      return currentlyFollowing ? unFollow(targetId, currentUserId) : follow(targetId, currentUserId);
    },
    {
      // optimistic update
      onMutate: async ({ targetId, currentlyFollowing }) => {
        const usersKey = ['users', currentUserId];
        const followingsKey = ['userFollowings', currentUserId]; // if you keep this

        // cancel outgoing refetches so we don't overwrite optimistic update
        await queryClient.cancelQueries({ queryKey: usersKey });

        // Snapshot previous data to rollback if needed
        const previousUsers = queryClient.getQueryData(usersKey);
        const previousFollowings = queryClient.getQueryData(followingsKey);

        // Helper to update both simple array and infinite pages shapes
        const updateUsersCache = (old) => {
          if (!old) return old;
          // if it's an infinite query shape: { pageParams, pages: [...] }
          if (old.pages) {
            const newPages = old.pages.map(page => ({
              ...page,
              content: (page.content || []).map(u =>
                u.id === targetId
                  ? {
                      ...u,
                      following: !currentlyFollowing,
                      followerCount: typeof u.followerCount === 'number'
                        ? u.followerCount + (currentlyFollowing ? -1 : 1)
                        : u.followerCount
                    }
                  : u
              )
            }));
            return { ...old, pages: newPages };
          }
          // otherwise assume an array of users
          return old.map(u =>
            u.id === targetId
              ? {
                  ...u,
                  following: !currentlyFollowing,
                  followerCount: typeof u.followerCount === 'number'
                    ? u.followerCount + (currentlyFollowing ? -1 : 1)
                    : u.followerCount
                }
              : u
          );
        };

        // Apply optimistic edit
        queryClient.setQueryData(usersKey, old => updateUsersCache(old));

        // Also update the followings list if present (infinite/pages)
        queryClient.setQueryData(followingsKey, old => {
          if (!old) return old;
          // if it's infiniteQuery shape:
          if (old.pages) {
            const newPages = old.pages.map(page => ({
              ...page,
              content: (page.content || []).map(u =>
                u.id === targetId ? { ...u, following: !currentlyFollowing } : u
              )
            }));
            return { ...old, pages: newPages };
          }
          // fallback: array
          return old.map(u => (u.id === targetId ? { ...u, following: !currentlyFollowing } : u));
        });

        // return rollback context
        return { previousUsers, previousFollowings };
      },

      onError: (err, variables, context) => {
        // rollback
        const usersKey = ['users', currentUserId];
        const followingsKey = ['userFollowings', currentUserId];
        if (context?.previousUsers) {
          queryClient.setQueryData(usersKey, context.previousUsers);
        }
        if (context?.previousFollowings) {
          queryClient.setQueryData(followingsKey, context.previousFollowings);
        }
        console.error("Follow toggle failed", err);
      },

      // optionally re-sync with server data
      onSettled: (_, __, ____, ___) => {
        const usersKey = ['users', currentUserId];
        const followingsKey = ['userFollowings', currentUserId];
        queryClient.invalidateQueries({ queryKey: usersKey });
        queryClient.invalidateQueries({ queryKey: followingsKey });
      }
    }
  );
}
