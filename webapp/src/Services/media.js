import { SERVER_URL } from "../config";

const MEDIA_URL = `${SERVER_URL}/media`;

export function getImageUrl(url) {
  if (!url) return;

  return `${MEDIA_URL}${url}`;
}

export function getTrackUrl(id) {
  return `${MEDIA_URL}/tracks/${id}`;
}
