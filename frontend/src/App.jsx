import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} /> /*la pagina de login nu va
        aparea layoutul inclus in toate ca mai jos */
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
