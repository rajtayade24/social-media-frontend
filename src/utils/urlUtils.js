import { BASE_URL } from "../service/api";

// helper to safely build image URL
export default function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}
