import { SERVER_URL } from "../config";

const API_URL = `${SERVER_URL}/api`;

export async function getArtists({ limit, offset, filter }) {
  const queryString = filter ? `qname=${filter}` : "";
  const response = await fetch(
    `${API_URL}/artists?limit=${limit}&offset=${offset}&${queryString}`
  );
  return response.json();
}

export async function getArtist(id) {
  const response = await fetch(`${API_URL}/artists/${id}`);
  return response.json();
}

export async function getAlbums({ limit, offset, filter }) {
  const queryString = filter ? `qname=${filter}` : "";
  const response = await fetch(
    `${API_URL}/albums?limit=${limit}&offset=${offset}&${queryString}`
  );
  return response.json();
}

export async function getAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}`);
  return response.json();
}

export function getDownloadAlbumUrl(id) {
  return `${API_URL}/albums/${id}/download`;
}

export async function getRecent() {
  const response = await fetch(`${API_URL}/albums/recent`);
  return response.json();
}

export async function getGenres({ limit, offset, filter }) {
  const queryString = filter ? `qname=${filter}` : "";
  const response = await fetch(
    `${API_URL}/genres?limit=${limit}&offset=${offset}&${queryString}`
  );
  return response.json();
}

export async function getGenre(id) {
  const response = await fetch(`${API_URL}/genres/${id}`);
  return response.json();
}

export async function getTracksByAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}/tracks`);
  return response.json();
}

export async function getTracksByArtist(id) {
  const response = await fetch(`${API_URL}/artists/${id}/tracks`);
  return response.json();
}

export async function getTracksByGenre(id) {
  const response = await fetch(`${API_URL}/genres/${id}/tracks`);
  return response.json();
}

export async function getPlaylists({ filter }) {
  const queryString = filter ? `qname=${filter}` : "";
  const response = await fetch(`${API_URL}/playlists?${queryString}`);
  return response.json();
}

export async function getPlaylist(id) {
  const response = await fetch(`${API_URL}/playlists/${id}`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function getPlaylistByName(name) {
  const response = await fetch(`${API_URL}/playlists?qname=${name}`);
  const list = await response.json();
  if (list.length === 0) return Promise.resolve();
  else return list[0];
}

export async function getTracksByPlaylist(id) {
  const response = await fetch(`${API_URL}/playlists/${id}/tracks`);
  return response.json();
}

export async function addPlaylist(playlist) {
  const response = await fetch(`${API_URL}/playlists`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(playlist),
  });
  return response.json();
}

export function addTracksToList(id, tracks) {
  return fetch(`${API_URL}/playlists/${id}/add`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(tracks),
  });
}

export function updatePlaylist(id, playlist) {
  return fetch(`${API_URL}/playlists/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(playlist),
  });
}

export async function addToPlaylist(name, tracks) {
  const playlist = await getPlaylistByName(name);
  if (playlist) {
    addTracksToList(playlist.id, tracks);
    return false;
  } else {
    addPlaylist({ name, tracks });
    return true;
  }
}

export function removePlaylist(name) {
  return fetch(`${API_URL}/playlists/${name}`, {
    method: "DELETE",
  });
}

export async function getAlbumlists({ filter }) {
  const queryString = filter ? `qname=${filter}` : "";
  const response = await fetch(`${API_URL}/albumlists?${queryString}`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function getAlbumlist(id) {
  const response = await fetch(`${API_URL}/albumlists/${id}`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function getAlbumlistByName(name) {
  const response = await fetch(`${API_URL}/albumlists?qname=${name}`);
  const list = await response.json();
  if (list.length === 0) return Promise.resolve();
  else return list[0];
}

export async function addAlbumlist(albumlist) {
  const response = await fetch(`${API_URL}/albumlists`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(albumlist),
  });
  return response.json();
}

export function updateAlbumlist(id, albumlist) {
  return fetch(`${API_URL}/albumlists/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(albumlist),
  });
}

export function addAlbumsToList(id, list) {
  return fetch(`${API_URL}/albumlists/${id}/add`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(list),
  });
}

export async function addToAlbumlist(name, albumId) {
  const albumList = await getAlbumlistByName(name);
  if (albumList) {
    addAlbumsToList(albumList.id, [albumId]);
    return false;
  } else {
    addAlbumlist({ name, albums: [albumId] });
    return true;
  }
}

export function removeAlbumlist(id) {
  return fetch(`${API_URL}/albumlists/${id}`, {
    method: "DELETE",
  });
}
