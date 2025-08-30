import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*la pagina de login nu va aparea layoutul inclus in toate ca mai jos */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* cand accesezi orice ruta care incepe cu /, afiseaza componenta Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* ruta implicita */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
