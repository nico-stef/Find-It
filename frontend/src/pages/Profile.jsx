import "../styles/profile.css";
import profileImage from "../assets/default-profile.jpg";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import PostComponent from "../components/PostComponent";
import AdFormComponent from "../components/AdFormComponent";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showForm, setShowForm] = useState(false);
  const [yourPosts, setYourPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const limit = 6;

  useEffect(() => {
    const getYourPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/posts/me?page=${page}&limit=${limit}`,
          { withCredentials: true }
        );

        setYourPosts(res.data.posts)
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    getYourPosts();
  }, [page, limit]);


  useEffect(() => {
    console.log("FormData s-a schimbat:", yourPosts);
  }, [yourPosts]);

  return (
    <div>
      <div className="profile-details">
        <img src={profileImage} alt="Profile picture" className="profile-img" />
        <div style={{ flex: 1 }}>
          <h2>Ion Popescu</h2>
          <ul className="account-details">
            <li className="detail-li">
              <FaEnvelope />
              ion@gmail.com
            </li>
            <li className="detail-li">
              <FaMapMarkerAlt />
              Bucuresti
            </li>
            <li className="detail-li">
              <FaCalendar />
              Membru din 2025
            </li>
          </ul>

        </div>

        <Link to="/editProfile" className="btn-profile">
          Setări profil
        </Link>

      </div>

      <div>
        <div className="post-ad-container">
          <button
            className="post-ad-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Postează anunț
          </button>
        </div>

        {showForm && <AdFormComponent onClose={() => setShowForm(false)} />}
      </div>


      <div className="switch-buttons">
        <button
          className={`switch-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Postările tale
        </button>
        <button
          className={`switch-button ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activitate
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", justifyContent: 'space-evenly', flexWrap: "wrap", margin: "2rem" }}>
        {yourPosts && yourPosts.length > 0 ? (
          yourPosts.map((post) => (
            <PostComponent
              key={post._id}
              type={post.type}
              title={post.title}
              location={post.location.address}
              images={post.images}
              dateTime={post.dateTime}
              description={post.description}
            />
          ))
        ) : (
          <p>Nu ai postări încă.</p>
        )}
      </div>

      {/* PAGINATION */}
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


    </div>
  );
};

export default Profile;
