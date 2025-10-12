const API_URL = import.meta.env.VITE_API_URL;
import '../styles/home.css';
import LostBag from '../assets/lost-bag.avif';
import { useNavigate } from 'react-router-dom';
import AdFormComponent from "../components/AdFormComponent";
import { useEffect, useState } from "react";
import axios from 'axios';
import PostComponent from "../components/PostComponent";
import GridLoader from "react-spinners/GridLoader";

const Home = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const limit = 6;

  const getPosts = async () => {
    try {
      if (location && !selectedPlaceId) {
        setLocationError("Te rugăm să alegi o locație din lista de sugestii!");
        return;
      }
      setLocationError("");
      setSelectedPlaceId(null);

      const res = await axios.get(
        `${API_URL}/posts?type=${type}&location=${encodeURIComponent(location)}&date=${date}&page=${page}&limit=${limit}`,
        { withCredentials: true }
      );

      setPosts(res.data.posts)
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    getPosts();
    if (!showForm)
      getPosts();
  }, [page, limit, showForm]);

  const handleLocationSearch = async (e) => {
    try {
      const value = e.target.value;
      setLocation(value);
      const res = await axios.get(`${API_URL}/locationsAutocomplete`, {
        params: { input: value },
        withCredentials: true
      });
      setLocationSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {/* componenta formular de creare postare  */}
      <div>
        {showForm && <AdFormComponent onClose={() => setShowForm(false)} />}
      </div>

      <div className="banner">
        <div className="banner-text">
          <h1>Ai pierdut sau găsit ceva?</h1>
          <p>Postează aici și ajută comunitatea să-și recupereze lucrurile.</p>
          <button className="banner-btn" onClick={() => setShowForm(!showForm)}>Adaugă o postare</button>
        </div>
        <div className="banner-img">
          <img src={LostBag} alt="Lost and Found" />
        </div>
      </div>

      <div className='filters'>
        {locationError && <p className="error-message">{locationError}</p>}
        {/* Tip  */}
        <div className="filter">
          <label>Tip: </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Toate</option>
            <option value="lost">Pierdut</option>
            <option value="found">Găsit</option>
            <option value="resolved">Rezolvat</option>
          </select>
        </div>

        {/* Data */}
        <div className="filter">
          <label>Data: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Zona */}
        <div className="filter" style={{ position: "relative" }}>
          <label>Locația: </label>
          <input
            type="text"
            placeholder="Caută locația..."
            value={location}
            onChange={handleLocationSearch}
          />
          {locationSuggestions && locationSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {locationSuggestions.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => {
                    setLocation(s.description);
                    setSelectedPlaceId(s.place_id);
                    setLocationSuggestions([]);
                  }}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="search-btn" onClick={() => { getPosts(); setPage(1); }}>Caută</button>
      </div>

      <div style={{ display: "flex", gap: "2rem", justifyContent: 'space-evenly', flexWrap: "wrap", margin: "2rem" }}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostComponent
              key={post._id}
              type={post.type}
              title={post.title}
              location={post.location.address}
              images={post.images}
              dateTime={post.dateTime}
              description={post.description}
              onClick={() => navigate(`/post/${post._id}`)}
            />
          ))
        ) : (
          posts && posts.length === 0 ? (
            <p>Nu există postări.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GridLoader
                color="#562db9"
                loading
                size={20}
              />
            </div>
          )
        )}
      </div>

      {/* PAGINATION - apare doar daca sunt postari*/}
      {posts && posts.length > 0 && (
        <>
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))} //se asigura ca pagina nu scade sub 1
              disabled={page === 1}
              className="pagination-btn"
            >
              &lt; Înapoi
            </button>

            {Array.from({ length: totalPages }, (_, i) => ( //creeaza un array de lungimea totalPages. nu nu intereseaza elementul, de accea _. ne intereseaza indexul i
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))} //se asigura ca pagina nu creste peste valoarea totalPages
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Înainte &gt;
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default Home;
