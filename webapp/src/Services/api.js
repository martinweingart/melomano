import { SERVER_URL } from "../config";

const API_URL = `${SERVER_URL}/api`;

export async function getArtists() {
  const response = await fetch(`${API_URL}/artists`);
  return response.json();
}

export async function getArtist(name) {
  const response = await fetch(`${API_URL}/artists/${name}`);
  return response.json();
}

export async function getAlbums() {
  const response = await fetch(`${API_URL}/albums`);
  return response.json();
}

export async function getAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}`);
  return response.json();
}

export async function getRecent(id) {
  const response = await fetch(`${API_URL}/albums/recent`);
  return response.json();
}

export async function getGenres() {
  const response = await fetch(`${API_URL}/genres`);
  return response.json();
}

export async function getGenre(name) {
  const response = await fetch(`${API_URL}/genres/${name}`);
  return response.json();
}

export async function getTracksByAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}/tracks`);
  return response.json();
}

export async function getTracksByArtist(name) {
  const response = await fetch(`${API_URL}/artists/${name}/tracks`);
  return response.json();
}

export async function getTracksByGenre(name) {
  const response = await fetch(`${API_URL}/genres/${name}/tracks`);
  return response.json();
}

export async function getPlaylists() {
  const response = await fetch(`${API_URL}/playlists`);
  return response.json();
}

export async function getPlaylist(name) {
  const response = await fetch(`${API_URL}/playlists/${name}`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function getTracksByPlaylist(name) {
  const response = await fetch(`${API_URL}/playlists/${name}/tracks`);
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

export function updatePlaylist(playlist) {
  return fetch(`${API_URL}/playlists/${playlist.name}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(playlist),
  });
}

export async function addToPlaylist(name, tracks) {
  const playlist = await getPlaylist(name);
  if (playlist) {
    updatePlaylist({
      name,
      tracks: [...playlist.tracks, ...tracks],
    });
  } else {
    addPlaylist({ name, tracks });
  }
}

export function removePlaylist(name) {
  return fetch(`${API_URL}/playlists/${name}`, {
    method: "DELETE",
  });
}

export async function getAlbumlists() {
  const response = await fetch(`${API_URL}/albumlists`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function getAlbumlist(name) {
  const response = await fetch(`${API_URL}/albumlists/${name}`);
  if (response.status === 404) return Promise.resolve();
  return response.json();
}

export async function addAlbumlist(albumlist) {
  const response = await fetch(`${API_URL}/albumlists`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(albumlist),
  });
  return response.json();
}

export function updateAlbumlist(albumlist) {
  return fetch(`${API_URL}/albumlists/${albumlist.name}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(albumlist),
  });
}

export async function addToAlbumlist(name, albumId) {
  const albumList = await getAlbumlist(name);
  if (albumList) {
    updateAlbumlist({
      name,
      albums: [...albumList.albums, albumId],
    });
  } else {
    addAlbumlist({ name, albums: [albumId] });
  }
}

export function removeAlbumlist(name) {
  return fetch(`${API_URL}/albumlists/${name}`, {
    method: "DELETE",
  });
}
