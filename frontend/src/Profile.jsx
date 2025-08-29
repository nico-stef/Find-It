import "./styles/profile.css";
import profileImage from "./assets/default-profile.jpg";

const Profile = () => {
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
          <button className="btn logout">Logout</button>
          <button className="btn delete">Șterge cont</button>
        </div>
      </div>

      <div className="posts-card">postari</div>
    </div>
  );
};

export default Profile;
