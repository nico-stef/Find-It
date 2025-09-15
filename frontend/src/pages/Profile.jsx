import "../styles/profile.css";
import profileImage from "../assets/default-profile.jpg";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();

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
    <div className="profile-card">
      <div className="profile-data-card">
        <div className="profile-photo">
          <img src={profileImage} alt="Poza profil" />
          <div className="overlay">Change picture</div>
        </div>

        <div>Vasile Traian</div>

        <div className="user-info">
          <div className="info-card">
            <span className="info-label">📧 Email</span>
            <span className="info-value">vasile@example.com</span>
          </div>
          <div className="info-card">
            <span className="info-label">📞 Telefon</span>
            <span className="info-value">+40 712 345 678</span>
          </div>
          <div className="info-card">
            <span className="info-label">📍 Locație</span>
            <span className="info-value">București</span>
          </div>
          <div className="info-card">
            <span className="info-label">🗓️ Membru din</span>
            <span className="info-value">01.01.2023</span>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="btn logout">Logout</button>
          <button className="btn delete">Șterge cont</button>
        </div>
      </div>

      <div className="posts-card">postari</div>
    </div>
  );
};

export default Profile;
