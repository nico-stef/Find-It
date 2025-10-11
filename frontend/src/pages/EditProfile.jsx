const API_URL = import.meta.env.VITE_API_URL;
import '../styles/editProfile.css';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import defaulProfile from "../assets/default-profile.jpg"
import { useEffect, useState } from 'react';

const EditProfile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        avatar: defaulProfile, // linkul creat pt imaginea incarcata local, folosit pt previzualizarea imaginii fara incarcare pe BE
        avatarFile: null   // fisierul in sine
    });

    const [loading, setLoading] = useState(true);

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/logout`,
                {},
                { withCredentials: true } //pentru a trimite si cookie
            );

            toast.success(response.data.message);
            navigate("/login");
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
    }

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/profile`,
                    { withCredentials: true }
                )
                setUserInfo(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }
        getUserInfo();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserInfo(prev => ({
                ...prev,
                avatar: imageUrl,  // linkul creat pt imaginea incarcata local
                avatarFile: file   // fisierul in sine
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            let dataToSend = new FormData();
            dataToSend.append("firstName", userInfo.firstName);
            dataToSend.append("lastName", userInfo.lastName);
            dataToSend.append("email", userInfo.email);
            dataToSend.append("phone", userInfo.phone);
            dataToSend.append("city", userInfo.city);
            dataToSend.append("image", userInfo.avatarFile);

            const response = await axios.patch(`${API_URL}/profile`,
                dataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                toast.success("Date actualizate cu succes!");
                setUserInfo(response.data);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong.");
            console.log(err);
        }

    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Ești sigur că vrei să îți ștergi contul?");
        if (!confirmed) return;

        try {
            const response = await axios.delete(`${API_URL}/profile`, {
                withCredentials: true
            });

            if (response.status === 204) {
                toast.success("Contul a fost șters cu succes!");
                navigate("/login");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong.");
            console.log(err);
        }
    };


    useEffect(() => {
        console.log(userInfo.avatar, userInfo.avatarFile)
    }, [userInfo.avatar, userInfo.avatarFile])

    return (
        <div className='edit-profile-page'>

            {!loading && userInfo && (<>
                <div className='container'>
                    <button type="button" className="back-btn" >
                        ← Înapoi
                    </button>
                    <div className="header">
                        {/* Stânga: avatar + nume */}
                        <div className="header-picture">
                            <label htmlFor="profilePicInput" className="avatar-wrapper">

                                <img src={userInfo.avatar || defaulProfile}
                                    alt="Avatar"
                                    className="avatar" />


                                <div className="avatar-overlay">
                                    <span className="edit-icon">✎</span> {/* sau folosești un icon din FontAwesome */}
                                </div>
                                <input
                                    type="file"
                                    id="profilePicInput"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleAvatarChange}
                                />
                            </label>

                            <div className="header-name">
                                <h3>{userInfo.firstName} {userInfo.lastName}</h3>
                            </div>
                        </div>

                        {/* Dreapta: buton Salvează */}
                        <div className="header-button">
                            <button className="btn-save" onClick={handleSubmit}>
                                Salvează
                            </button>
                        </div>
                    </div>

                    <div className="container-row">
                        <div className="field">
                            <label>Nume</label>
                            <input
                                value={userInfo.lastName}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, lastName: e.target.value })
                                }
                            />
                        </div>
                        <div className="field">
                            <label>Prenume</label>
                            <input
                                value={userInfo.firstName}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, firstName: e.target.value })
                                } />
                        </div>
                    </div>
                    <div className="container-row">
                        <div className="field">
                            <label>Email</label>
                            <input
                                value={userInfo.email}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="field">
                            <label>Nr telefon</label>
                            <input
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={userInfo.phone}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, phone: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="container-row">
                        <div className="field">
                            <label>Oraș</label>
                            <input
                                value={userInfo.city}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, city: e.target.value })
                                }
                            />
                        </div>
                        <div className="field">
                        </div>
                    </div>



                </div>
                <div className='buttons'>
                    <button className="logout-btn"
                        onClick={handleLogout}>
                        Log out
                    </button>

                    <button className="delete-btn" onClick={handleDeleteAccount}>
                        Șterge contul
                    </button>

                </div>
            </>)}
        </div>
    )
}

export default EditProfile;