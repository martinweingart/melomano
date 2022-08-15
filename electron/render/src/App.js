import "./App.css";
import { h, createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import Header from "./Components/Header/Header";
import Server from "./Views/Server/Server";
import Scanner from "./Views/Scanner/Scanner";

export const Config = createContext({});
export const Status = createContext({});

export default function App() {
  const [config, setConfig] = useState();
  const [status, setStatus] = useState({});
  const [view, setView] = useState("server");

  useEffect(() => {
    window.electronAPI.onInit((_event, config) => {
      setConfig(config);
    });

    window.electronAPI.onStatusChange((_event, status) => setStatus(status));
  }, []);

  const onClose = () => {
    window.electronAPI.hide();
  };

  const onShutDown = () => {
    window.electronAPI.shutDown();
  };

  return (
    <div class="App">
      <Config.Provider value={{ config, setConfig }}>
        <Status.Provider value={status}>
          <Header
            onChange={(newView) => setView(newView)}
            onClose={onClose}
            onShutDown={onShutDown}
          />
          {view === "server" && <Server />}
          {view === "scanner" && <Scanner />}
        </Status.Provider>
      </Config.Provider>
    </div>
  );
}
