
// src/hooks/useGlobalLogout.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useGlobalLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            const socketId = sessionStorage.getItem("socketId");

            if (token) {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/auth/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "X-Socket-Id": socketId || "",
                        },
                    }
                );

                toast.success(response.data?.message || "Sesión cerrada correctamente.");
            } else {
                toast.info("Sesión cerrada correctamente.");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("No se pudo notificar el cierre global. Se cerrará la sesión local.");
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("socketId");

            window.dispatchEvent(new Event("auth-logout-local"));

            navigate("/", { replace: true });
        }
    };

    return logout;
};

export default useGlobalLogout;
