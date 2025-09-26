import "../styles/profile.css";
import profileImage from "../assets/default-profile.jpg";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import PostComponent from "../components/PostComponent";
import AdFormComponent from "../components/AdFormComponent";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [showForm, setShowForm] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/logout`,
        {},
        { withCredentials: true } //pentru a trimite si cookie
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  }

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

        <button className="btn-profile">Editează Profile</button>
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

      <div style={{ display: "flex", gap: "20px", justifyContent: 'space-evenly', flexWrap: "wrap", margin: "2rem" }}>
        <PostComponent
          image="https://picsum.photos/153"
          title="My first post"
          location="Bucuresti"
          date="17 Sept 2025"
        />
        <PostComponent
          image="https://picsum.photos/150"
          title="Another post"
          location="Cluj"
          date="16 Sept 2025"
        />
        <PostComponent
          image="https://picsum.photos/156"
          title="Another post"
          location="Cluj"
          date="16 Sept 2025"
        />
        <PostComponent
          image="https://picsum.photos/159"
          title="Another post"
          location="Cluj"
          date="16 Sept 2025"
        />
        <PostComponent
          image="https://picsum.photos/160"
          title="Another post"
          location="Cluj"
          date="16 Sept 2025"
        />
        <PostComponent
          image="https://picsum.photos/170"
          title="Another post"
          location="Cluj"
          date="16 Sept 2025"
        />

      </div>

    </div>
  );
};

export default Profile;
