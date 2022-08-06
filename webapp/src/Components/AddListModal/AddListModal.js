import "./AddListModal.scss";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Autocomplete } from "../Base";
import { getPlaylists, getAlbumlists } from "../../Services/api";

export function AddListModal({ isOpen, type, onSave, onClose }) {
  const [value, setValue] = useState("");

  const { data: playlists } = useQuery(["playlists"], getPlaylists);
  const { data: albumlists } = useQuery(["albumlists"], getAlbumlists);

  useEffect(() => {
    if (!isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const list = type === "playlists" ? playlists : albumlists;
  const options = list ? list.map((p) => p.name) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="AddListModal">
        <div className="form">
          <label>{type === "playlist" ? "Playlist" : "Albumlist"}:</label>
          <Autocomplete
            options={options}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>

        <footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button disabled={value.length === 0} onClick={() => onSave(value)}>
            Save
          </Button>
        </footer>
      </div>
    </Modal>
  );
}
