
// src/components/Layout/LandbotChat.jsx
import { useEffect, useRef } from "react";

const LANDBOT_SCRIPT_ID = "landbot-script";

const LandbotChat = () => {
    const landbotRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        const removeLandbotElements = () => {
            try {
                if (landbotRef.current?.destroy) {
                    landbotRef.current.destroy();
                }
            } catch (error) {
                console.warn("No se pudo destruir Landbot:", error);
            }

            landbotRef.current = null;

            const selectors = [
                "iframe[src*='landbot']",
                "script[src*='landbot']",
                "[class*='Landbot']",
                "[class*='landbot']",
                "[id*='Landbot']",
                "[id*='landbot']",
            ];

            selectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach((element) => {
                    element.remove();
                });
            });
        };

        const initLandbot = () => {
            if (cancelled || landbotRef.current) return;

            const createLandbot = () => {
                if (cancelled || landbotRef.current || !window.Landbot) return;

                landbotRef.current = new window.Landbot.Livechat({
                    configUrl:
                        "https://storage.googleapis.com/landbot.online/v3/H-3225970-9CLKYG99W21TUJ2Z/index.json",
                });
            };

            const existingScript = document.getElementById(LANDBOT_SCRIPT_ID);

            if (existingScript) {
                createLandbot();
                return;
            }

            const script = document.createElement("script");
            script.id = LANDBOT_SCRIPT_ID;
            script.type = "module";
            script.async = true;
            script.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs";

            script.addEventListener("load", createLandbot);

            document.body.appendChild(script);
        };

        window.addEventListener("mouseover", initLandbot, { once: true });
        window.addEventListener("touchstart", initLandbot, { once: true });
        window.addEventListener("auth-logout-local", removeLandbotElements);

        return () => {
            cancelled = true;

            window.removeEventListener("mouseover", initLandbot);
            window.removeEventListener("touchstart", initLandbot);
            window.removeEventListener("auth-logout-local", removeLandbotElements);

            removeLandbotElements();
        };
    }, []);

    return null;
};

export default LandbotChat;
