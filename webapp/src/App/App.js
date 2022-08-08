import "./App.scss";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const [isDrawerMainOpen, setIsDrawerMainOpen] = useState(false);
  const [isDrawerQueueOpen, setIsDrawerQueueOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
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
            <TopBar
              onMenu={() => setIsDrawerMainOpen(true)}
              onBack={() => navigate(-1)}
            />

            <div className="Main">
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="artists" element={<ArtistsView />} />
                <Route path="albums" element={<AlbumsView />} />
                <Route path="genres" element={<GenresView />} />
                <Route path="playlists" element={<PlaylistsView />} />
                <Route path="albumlists" element={<AlbumlistsView />} />
                <Route path="artist/:id" element={<ArtistView />} />
                <Route path="album/:albumid" element={<AlbumView />} />
                <Route path="genre/:id" element={<GenreView />} />
                <Route path="playlist/:id" element={<PlaylistView />} />
                <Route path="albumlist/:id" element={<AlbumlistView />} />
              </Routes>
            </div>

            <StatusBar />
            <Controls onOpenQueue={() => setIsDrawerQueueOpen(true)} />
          </div>
        </div>
      </ContextPlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
