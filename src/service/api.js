// src/api.js
// export const BASE_URL = "http://localhost:8888/instagram";

import useAuthStore from "../store/useAuthStore";

// src/api.js
export const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function apiFetch(path, opts = {}) {
  const { token: optToken, credentials, headers: optHeaders, body } = opts;

  // useAuthStore(...) is a hook (Zustand hook). Hooks may only be called inside React function components or other custom hooks — calling it in a plain module like api.js triggers an Invalid hook call.
  // const token = optToken ?? useAuthStore(s => s.token) ?? localStorage.getItem("token");

  // Accessing the Zustand store state directly DOES NOT call a hook
  const token = optToken ?? (useAuthStore && useAuthStore.getState ? useAuthStore.getState().token : null) ?? localStorage.getItem("token");

  const headers = { ...(optHeaders || {}) };

  // Only set Content-Type when there is a non-Form body
  if (body !== undefined && !(body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOpts = {
    ...opts,
    headers,
    // allow callers to pass credentials if they use cookies
    ...(credentials ? { credentials } : {}),
  };

  // build URL (allow path to already include leading slash)
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, fetchOpts);
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const errBody = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);
    const message = (errBody && errBody.message) || errBody || `Request failed: ${res.status}`;
    const e = new Error(message);
    e.status = res.status;
    e.body = errBody;
    throw e;
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json().catch(() => null) : res.text().catch(() => null);
}



// function getToken() {
//   return localStorage.getItem("token");
// }

// export async function apiFetch(url, options = {}) {
//   const token = getToken();

//   const headers = {
//     ...(options.headers || {}),
//     "Content-Type": "application/json",
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const res = await fetch(`${BASE_URL}${url}`, {
//     ...options,
//     headers,
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => res);
//     throw new Error(err.message || `Error ${res.status}`);
//   }

//   return res.json();
// }
