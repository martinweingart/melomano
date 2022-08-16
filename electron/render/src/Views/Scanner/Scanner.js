import "./Scanner.css";
import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { Config, Status } from "../../App";

const Scanner = () => {
  const { config, setConfig } = useContext(Config);
  const status = useContext(Status);
  const [loading, setLoading] = useState(false);

  const onAdd = async () => {
    const status = await window.electronAPI.getStatus();
    if (status.scanner !== "Running") {
      setLoading(true);
      const path = await window.electronAPI.addFolder();
      setConfig({ ...config, folders: [...config.folders, path] });
      setLoading(false);
    } else {
      window.electronAPI.showMessage(
        "Scanner running! Please wait until it ends"
      );
    }
  };

  const onRemove = async (path) => {
    const status = await window.electronAPI.getStatus();
    if (status.scanner !== "Running") {
      setLoading(true);
      await window.electronAPI.removeFolder(path);
      setConfig({
        ...config,
        folders: config.folders.filter((f) => f !== path),
      });
      setLoading(false);
    } else {
      window.electronAPI.showMessage(
        "Scanner running! Please wait until it ends"
      );
    }
  };

  const onScan = async () => {
    const status = await window.electronAPI.getStatus();
    if (status.scanner !== "Running") {
      window.electronAPI.scan();
    } else {
      window.electronAPI.showMessage("Scanner already running!");
    }
  };

  return (
    <div class="scanner">
      <div class="status">
        <p>Scanner status: {status?.scanner ? status.scanner : "-"}</p>
      </div>

      <h3>Folders</h3>
      <ul>
        {config.folders.map((f) => (
          <li class="folder">
            <span>{f}</span>
            <button
              disabled={status?.scanner === "Running"}
              onClick={() => onRemove(f)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <footer>
        <button
          disabled={
            loading ||
            config.folders.length === 0 ||
            status?.scanner === "Running"
          }
          onClick={onScan}
        >
          Start Scan
        </button>
        <button
          disabled={loading || status?.scanner === "Running"}
          onClick={onAdd}
        >
          Add Folder
        </button>
      </footer>
    </div>
  );
};

export default Scanner;
