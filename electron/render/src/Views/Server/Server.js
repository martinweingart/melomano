import "./Server.css";
import { h } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import { Config, Status } from "../../App";

const Server = () => {
  const { config, setConfig } = useContext(Config);
  const status = useContext(Status);
  const [hostname, setHostname] = useState();
  const [port, setPort] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config) {
      setHostname(config.host);
      setPort(config.port);
    }
  }, [config]);

  const onChange = (e) => setHostname(e.target.value);
  const onChangePort = (e) => setPort(e.target.value);

  const onSave = async () => {
    setLoading(true);
    await window.electronAPI.saveConfig({ ...config, host: hostname, port });
    setConfig({ ...config, host: hostname, port });
    setLoading(false);
  };

  const onRestart = async () => {
    setLoading(true);
    await window.electronAPI.restart();
    setLoading(false);
  };

  const onOpenLog = () => {
    window.electronAPI.openLog();
  };

  const isConfigChanged =
    config && (config.host !== hostname || config.port !== port);

  return (
    <div class="server">
      <div class="status">
        <p>Server status: {status ? status.server : ""}</p>

        <a href="" onClick={onOpenLog}>
          Open log
        </a>
      </div>

      <div class="host">
        <span>http://</span>
        <input
          class="hostname"
          type="text"
          value={hostname}
          oninput={onChange}
        />
        <span>:</span>
        <input class="port" type="number" value={port} oninput={onChangePort} />
      </div>

      <footer>
        <button
          disabled={loading || status?.server === "Running"}
          onClick={onRestart}
        >
          Start Server
        </button>

        <button disabled={!isConfigChanged || loading} onClick={onSave}>
          Save Changes {status?.server === "Running" ? "& Restart" : ""}
        </button>
      </footer>
    </div>
  );
};

export default Server;
