const API_URL = import.meta.env.VITE_API_URL;
import { Navigate, Outlet } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {

    const [isAuth, setIsAuth] = useState(null);

    // daca user-ul e logat, are jwt in cookie. fiind in cookie, jwt il accesam doar pe backend => apel la endpoint
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API_URL}/checkIfAuth`, {
                    withCredentials: true
                });
                setIsAuth(response.data.authenticated);
            } catch (err) {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
    //outlet e un replacement pt toate rutele puse sub protected routes
    //replace inlocuieste ultima intrare din history in loc sa adauge o noua intrare => nu mai poate da back
}

export default ProtectedRoutes;