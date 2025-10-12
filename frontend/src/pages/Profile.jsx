const API_URL = import.meta.env.VITE_API_URL;
import "../styles/profile.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import PostComponent from "../components/PostComponent";
import AdFormComponent from "../components/AdFormComponent";
import { useNavigate } from 'react-router-dom';
import GridLoader from "react-spinners/GridLoader";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [showForm, setShowForm] = useState(false);
  const [yourPosts, setYourPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const limit = 6;
  const navigate = useNavigate();

  const getYourPosts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/posts/me?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );

      setYourPosts(res.data.posts)
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    getYourPosts();
    if (!showForm)
      getYourPosts();
  }, [page, limit, showForm]);

  const getUserInfo = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/profile`,
        { withCredentials: true }
      );

      setUserInfo(res.data)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <div className="profile-details">
        {userInfo && (
          <>
            {userInfo.avatar && <img src={userInfo.avatar} alt="Profile picture" className="profile-img" />}
            <div style={{ flex: 1 }}>
              <h2>{userInfo.firstName} {userInfo.lastName}</h2>
              <ul className="account-details">
                <li className="detail-li">
                  <FaEnvelope />
                  {userInfo.email}
                </li>
                {userInfo.city &&
                  <li className="detail-li">
                    <FaMapMarkerAlt />
                    {userInfo.city}
                  </li>}
                <li className="detail-li">
                  <FaCalendar />
                  Membru din {new Date(userInfo.createdAt).getFullYear()}
                </li>
              </ul>
            </div>
          </>
        )}


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
              onClick={() => navigate(`/post/${post._id}`)}
            />
          ))
        ) : (
          yourPosts && yourPosts.length === 0 ? (
            <p>Nu ai postări încă.</p>
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
      {yourPosts && yourPosts.length > 0 && (
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

export default Profile;
