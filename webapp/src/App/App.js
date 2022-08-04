import "./App.scss";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { TopBar } from "./TopBar/TopBar";
import { StatusBar } from "./StatusBar/StatusBar";
import { Controls } from "./Controls/Controls";
import { DrawerNav } from "./DrawerNav/DrawerNav";
import { DrawerQueue } from "./DrawerQueue/DrawerQueue";
import {
  HomeView,
  ArtistsView,
  AlbumsView,
  GenresView,
  ArtistView,
  AlbumView,
  GenreView,
  PlaylistsView,
  PlaylistView,
  AlbumlistsView,
  AlbumlistView,
} from "./Views";
import { ContextPlayerProvider } from "../Context/ContextPlayer";

function App() {
  const [isDrawerMainOpen, setIsDrawerMainOpen] = useState(false);
  const [isDrawerQueueOpen, setIsDrawerQueueOpen] = useState(false);

  return (
    <ContextPlayerProvider>
      <div className="App">
        <DrawerNav
          isOpen={isDrawerMainOpen}
          onClose={() => setIsDrawerMainOpen(false)}
        />

        <DrawerQueue
          isOpen={isDrawerQueueOpen}
          onClose={() => setIsDrawerQueueOpen(false)}
        />

        <div className="App-content">
          <TopBar onMenuClick={() => setIsDrawerMainOpen(true)} />

          <div className="Main">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="artists" element={<ArtistsView />} />
              <Route path="albums" element={<AlbumsView />} />
              <Route path="genres" element={<GenresView />} />
              <Route path="playlists" element={<PlaylistsView />} />
              <Route path="albumlists" element={<AlbumlistsView />} />
              <Route path="artist/:name" element={<ArtistView />} />
              <Route path="album/:albumid" element={<AlbumView />} />
              <Route path="genre/:name" element={<GenreView />} />
              <Route path="playlist/:name" element={<PlaylistView />} />
              <Route path="albumlist/:name" element={<AlbumlistView />} />
            </Routes>
          </div>

          <StatusBar />
          <Controls onOpenQueue={() => setIsDrawerQueueOpen(true)} />
        </div>
      </div>
    </ContextPlayerProvider>
  );
}

export default App;
