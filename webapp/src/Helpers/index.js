export function getDuration(seconds) {
  if (!seconds) return "??:??";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds - minutes * 60);
  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

export function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function removeItemFromList(list, index) {
  return [...list.slice(0, index), ...list.slice(index + 1, list.length)];
}

export function download(url) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

export function openGoogleSearch(query) {
  window.open("http://google.com/search?q=" + query);
}
