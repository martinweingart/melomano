import "./AddListModal.scss";
import { useEffect, useState } from "react";
import { Button, Modal, Autocomplete } from "../Base";
import { getPlaylists, getAlbumlists } from "../../Services/api";

export function AddListModal({ isOpen, type, onSave, onClose }) {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const get = async () => {
      let list = [];
      if (type === "playlist") {
        list = await getPlaylists();
      } else {
        list = await getAlbumlists();
      }
      setList(list);
    };

    get();
  }, [type]);

  useEffect(() => {
    if (!isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const options = list.map((p) => p.name);

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
