import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest, signupRequest } from "../service/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      userMainId: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setUserMainId: (id) => set({ userMainId: id }),
      setAuthenticated: (v) => set({ isAuthenticated: v }),

      verificationSuccess: "",
      verificationStatus: "",
      updateSuccess: "",
      updateStatus: "",
      setVerificationSuccess: (value) => set({ verificationSuccess: value }),
      setVerificationStatus: (value) => set({ verificationStatus: value }),
      setUpdateSuccess: (value) => set({ updateSuccess: value }),
      setUpdateStatus: (value) => set({ updateStatus: value }),

      unreadCountMessage: 0,

      // update count directly
      setUnreadCountMessage: (count) => set({ unreadCountMessage: count }),

      // --- signup action (safe, production-ready) ---
      signup: async (formData) => {
        try {
          const { ok, status, data, error } = await signupRequest(formData);

          console.log({ ok, status, data });

          set({
            verificationSuccess: data?.success ?? false,
            verificationStatus: data?.message ?? data?.status ?? error ?? "",
          });
          if (!ok) { return { ok: false, status, data, error }; }
          const userObj = data.user ?? data;

          set({
            user: userObj,
            token: data.token ?? "",
            userMainId: userObj?.id ?? null,
            isAuthenticated: true,
            profile: userObj,
          });
          try {
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user ?? data));
          } catch (e) { /* ignore */ }
          return { ok: true, status, data };
        } catch (err) {
          console.error("signup (store) error:", err);
          set({
            verificationSuccess: false,
            verificationStatus: err.message || "Signup failed",
          });
          return { ok: false, error: err.message || String(err) };
        }
      },

      login: async ({ identifier, userPassword }) => {
        try {
          const { ok, status, payload } = await loginRequest({ identifier, userPassword });

          set({
            verificationSuccess: payload?.success ?? null,
            verificationStatus: payload?.message ?? "",
          });

          if (!ok) {
            set({ isAuthenticated: false });
            console.log("status: ", status);
            return { ok: false, payload };
          }

          if (payload?.success && payload.token) {
            set({
              userMainId: payload.user?.id,
              user: payload.user,
              token: payload.token,
              isAuthenticated: true,
            });

            // persist handled by middleware, but also write explicit localStorage if you want
            try {
              localStorage.setItem("token", payload.token);
              localStorage.setItem("currentUser", JSON.stringify(payload.user));
            } catch (e) { }
            return { ok: true, payload };
          }

          return { ok: false, payload };
        } catch (err) {
          console.error("auth.login error", err);
          set({ isAuthenticated: false, verificationSuccess: false, verificationStatus: err.message });
          return { ok: false, error: err };
        }
      },

      logout: () => {
        set({
          user: null,
          userMainId: null,
          token: null,
          isAuthenticated: false,
          profile: null,
          profileId: null,
          verificationStatus: "",
          verificationSuccess: null,
        });
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          localStorage.removeItem('auth-storage'); // will clear Zustand persist store
        } catch (e) {}
      },

      profile: null,
      profileId: null,
      setProfile: (profile) => set({ profile }),
      setProfileId: (profileId) => set({ profileId }),

      allUsers: [],
      recs: [],
      setAllUsers: (users) => set({ allUsers: users }),
      setRecs: (recommendations) => set({ recs: recommendations }),

      allPosts: [],
      myPosts: [],
      setAllPosts: (posts) => set({ allPosts: posts }),
      setMyPosts: (posts) => set({ myPosts: posts }),

      myFollowings: [],
      myFollowers: [],

      // initialize from arrays
      setMyFollowings: (arr) =>
        set({ myFollowings: Array.isArray(arr) ? Array.from(new Set(arr)) : [] }),
      setMyFollowers: (arr) =>
        set({ myFollowers: Array.isArray(arr) ? Array.from(new Set(arr)) : [] }),

      // add/remove helpers (keep unique)
      addFollowing: (id) =>
        set((state) => { // obj state zustand only accept ob(ie. set obj)
          const next = Array.from(new Set([...(state.myFollowings || []), id]));
          return { myFollowings: next };
        }),

      removeFollowing: (id) =>
        set((state) => ({
          myFollowings: (state.myFollowings || []).filter((x) => x !== id),
        })),

      addFollower: (id) =>
        set((state) => {
          const next = Array.from(new Set([...(state.myFollowers || []), id]));
          return { myFollowers: next };
        }),

      removeFollower: (id) =>
        set((state) => ({
          myFollowers: (state.myFollowers || []).filter((x) => x !== id),
        })),

      // check helpers (array-based)
      isFollowing: (id) => (get().myFollowings || []).includes(id),
      isFollower: (id) => (get().myFollowers || []).includes(id),

      selectedFiles: [],
      caption: "",

      setSelectedFiles: (files) => set({ selectedFiles: files }),
      setCaption: (caption) => set({ caption }),

      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      setPostCount: (count) => set({ postCount: count }),
      setFollowerCount: (count) => set({ followerCount: count }),
      setFollowingCount: (count) => set({ followingCount: count }),

      activeSection: null,
      setActiveSection: (section) => set({ activeSection: section }),
      setProfileSectionShown: (v) =>
        set({ activeSection: v ? "profile" : null }),


      windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
      setWindowWidth: (value) => set({ windowWidth: value }),


      showPostMenu: null, // null means no menu open
      setShowPostMenu: (postId) => set({ showPostMenu: postId }),
      closePostMenu: () => set({ showPostMenu: null }),

      // --- STATES ---
      userImageSrc: null,
      allFollowers: [],
      allFollowings: [],
      darkMode: (() => {
        try {
          return localStorage.getItem("dark") === "true";
        } catch (e) {
          return false;
        }
      })(),

      // --- ACTIONS (setters) ---
      setUserImageSrc: (src) => set({ userImageSrc: src }),
      setAllFollowers: (followers) => set({ allFollowers: followers }),
      setAllFollowings: (followings) => set({ allFollowings: followings }),
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode
          localStorage.setItem("dark", newMode)
          return { darkMode: newMode }
        }),
    }),
    {
      name: "auth-storage", // optional: localStorage key
    }
  )
);

export default useAuthStore;
