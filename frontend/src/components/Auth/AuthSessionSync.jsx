
// src/components/Auth/AuthSessionSync.jsx
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const AuthSessionSync = () => {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const tokenRef = useRef(null);

    const disconnectSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.removeAllListeners();
            socketRef.current.disconnect();
            socketRef.current = null;
            tokenRef.current = null;
            sessionStorage.removeItem("socketId");
        }
    }, []);

    const clearSessionAndRedirect = useCallback(
        (message = "Sesión cerrada desde otro navegador.") => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            disconnectSocket();

            toast.info(message);
            navigate("/", { replace: true });
        },
        [disconnectSocket, navigate]
    );

    const validateCurrentToken = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) return false;

        try {
            await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return true;
        } catch (error) {
            const status = error.response?.status;

            if (status === 401 || status === 403) {
                clearSessionAndRedirect(
                    error.response?.data?.message || "Sesión inválida o cerrada desde otro navegador"
                );
            }

            return false;
        }
    }, [clearSessionAndRedirect]);

    const connectSocket = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            disconnectSocket();
            return;
        }

        const isValid = await validateCurrentToken();

        if (!isValid) return;

        if (
            socketRef.current &&
            tokenRef.current === token &&
            socketRef.current.connected
        ) {
            return;
        }

        disconnectSocket();

        tokenRef.current = token;

        const socket = io(SOCKET_URL, {
            auth: {
                token,
            },
            transports: ["websocket", "polling"],
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket conectado para sincronización de sesión:", socket.id);

            // Guardamos el socket actual de esta ventana/pestaña
            sessionStorage.setItem("socketId", socket.id);
        });

        socket.on("force-logout", (data) => {
            clearSessionAndRedirect(
                data?.message || "Sesión cerrada desde otro navegador."
            );
        });

        socket.on("connect_error", (error) => {
            console.warn("Error de conexión Socket.IO:", error.message);
        });
    }, [clearSessionAndRedirect, disconnectSocket, validateCurrentToken]);

    useEffect(() => {
        connectSocket();

        const handleAuthLogin = () => {
            connectSocket();
        };

        const handleLocalLogout = () => {
            disconnectSocket();
        };

        const handleStorageChange = (event) => {
            if (event.key === "token" || event.key === "user") {
                connectSocket();
            }
        };

        window.addEventListener("auth-login", handleAuthLogin);
        window.addEventListener("auth-logout-local", handleLocalLogout);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("auth-login", handleAuthLogin);
            window.removeEventListener("auth-logout-local", handleLocalLogout);
            window.removeEventListener("storage", handleStorageChange);
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    return null;
};

export default AuthSessionSync;
