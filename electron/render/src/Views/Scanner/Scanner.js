import "./Scanner.css";
import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { Config, Status } from "../../App";
import { Button } from "../../Components/Button/Button";
import { StatusText } from "../../Components/StatusText/StatusText";

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
        <StatusText text={status?.scanner}></StatusText>
      </div>

      <h3>Folders</h3>
      <ul>
        {config?.folders.map((f) => (
          <li class="folder">
            <span>{f}</span>
            <Button
              disabled={status?.scanner === "Running"}
              onClick={() => onRemove(f)}
            >
              X
            </Button>
          </li>
        ))}
      </ul>

      <footer>
        <Button
          disabled={
            loading ||
            config?.folders.length === 0 ||
            status?.scanner === "Running"
          }
          onClick={onScan}
        >
          Start Scan
        </Button>

        <Button
          disabled={loading || status?.scanner === "Running"}
          onClick={onAdd}
        >
          Add Folder
        </Button>
      </footer>
    </div>
  );
};

export default Scanner;
