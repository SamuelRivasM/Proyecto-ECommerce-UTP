
// src/components/Layout/LandbotChat.jsx
import { useEffect } from "react";

const LandbotChat = () => {
    useEffect(() => {
        let myLandbot = null;

        const initLandbot = () => {
            if (!myLandbot) {
                const script = document.createElement("script");
                script.type = "module";
                script.async = true;    

                script.addEventListener("load", () => {
                    /* global Landbot */
                    myLandbot = new Landbot.Livechat({
                        configUrl:
                            "https://storage.googleapis.com/landbot.online/v3/H-3225970-9CLKYG99W21TUJ2Z/index.json",
                        container: document.getElementById("landbot-livechat"),
                    });

                });

                script.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs";
                document.body.appendChild(script);
            }
        };

        window.addEventListener("mouseover", initLandbot, { once: true });
        window.addEventListener("touchstart", initLandbot, { once: true });

        return () => {
            window.removeEventListener("mouseover", initLandbot);
            window.removeEventListener("touchstart", initLandbot);
        };
    }, []);

    return null;
};

export default LandbotChat;
