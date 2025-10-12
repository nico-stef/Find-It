import { Link } from "react-router-dom";
import menuImage from "./assets/menuImage2.png";
import './styles/menu.css'

const options = ["Feed", "Profil"];

const AppMenu = () => {
  return (
    <nav className="app-menu">
      <div className="menu-left">
        <img src={menuImage} alt="Logo" className="menu-logo" />
        {options.map((item) => (
          <Link key={item} to={`/${item.toLowerCase()}`} className="menu-link">
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AppMenu;
