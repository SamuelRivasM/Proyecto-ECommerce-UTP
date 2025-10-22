
// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    // Actualiza el contador leyendo desde localStorage
    const updateCartCount = () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        setCartCount(carrito.length);
    };

    useEffect(() => {
        updateCartCount(); // Inicializar al cargar

        // Escuchar cambios en el localStorage (entre pestañas o eventos manuales)
        window.addEventListener("storage", (e) => {
            if (e.key === "carrito") updateCartCount();
        });

        // Custom Event: para avisar manualmente desde cualquier componente
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("storage", handleCartUpdate);
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
