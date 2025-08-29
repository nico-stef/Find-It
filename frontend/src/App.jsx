import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Profile from "./Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
