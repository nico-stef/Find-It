const API_URL = import.meta.env.VITE_API_URL;
import defaulProfile from "../assets/default-profile.jpg"
import '../styles/profilePopUp.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';

const ProfilePopUp = ({ onClose, email }) => {
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/user?email=${encodeURIComponent(email)}`,
                { withCredentials: true }
            );

            setUserInfo(res.data)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, [])

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    return (
        <div className="overlay">
            {userInfo && (
                <div className="popup">
                    <div onClick={onClose} className="close-button-container">
                        <span className="close-button">X</span>
                    </div>
                    <div className='user-image-container'>
                        <div className="blur-overlay" style={{ backgroundImage: `url(${userInfo.avatar})` }}></div>
                        <img src={userInfo.avatar || defaulProfile} className='user-image' />
                    </div>
                    <h3>{userInfo.firstName} {userInfo.lastName}</h3>
                    <div className="user-buttons">
                        {/* <button className="btn btn-large">Vezi postări</button> */}
                        <button className="btn btn-small"><FaCommentDots /><span style={{ marginLeft: '5px' }}>Trimite mesaj</span></button>
                    </div>

                    <div className='user-details'>
                        <p className='detail'><FaEnvelope color="black" /> {userInfo.email}</p>
                        {userInfo.phone && <p className='detail'><FaPhone color="black" />{userInfo.phone}</p>}
                        {userInfo.city && <p className='detail'><FaMapMarkerAlt color="black" />{userInfo.city} </p>}
                        <p className='detail'><FaCalendarAlt color="black" />Membru din: {new Date(userInfo.createdAt).toLocaleDateString()} </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePopUp;
