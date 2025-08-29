import { Outlet } from "react-router-dom";
import AppMenu from "./Menu";

const Layout = () => {
  return (
    <>
      <AppMenu />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
