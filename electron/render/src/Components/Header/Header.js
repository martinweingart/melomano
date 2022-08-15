import "./Header.css";
import { h } from "preact";

const Header = ({ onChange, onShutDown }) => (
  <header class="header">
    <h1>Melomano</h1>
    <nav>
      <a href="javascript:void(0)" onClick={() => onChange("server")}>
        Server
      </a>
      <a href="javascript:void(0)" onClick={() => onChange("scanner")}>
        Scanner
      </a>

      <a href="javascript:void(0)" onClick={onShutDown}>
        Shut Down
      </a>
    </nav>
  </header>
);

export default Header;
