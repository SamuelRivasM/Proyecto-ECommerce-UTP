// src/components/Layout/AccessibilityWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AccessibilityWidget.css";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Estados de accesibilidad
  const [grayscale, setGrayscale] = useState(
    localStorage.getItem("a11y-grayscale") === "true"
  );
  const [inverted, setInverted] = useState(
    localStorage.getItem("a11y-inverted") === "true"
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("a11y-high-contrast") === "true"
  );
  const [dyslexic, setDyslexic] = useState(
    localStorage.getItem("a11y-dyslexic") === "true"
  );
  const [spacedText, setSpacedText] = useState(
    localStorage.getItem("a11y-spaced-text") === "true"
  );
  const [largeCursor, setLargeCursor] = useState(
    localStorage.getItem("a11y-large-cursor") === "true"
  );
  const [stopAnimations, setStopAnimations] = useState(
    localStorage.getItem("a11y-stop-animations") === "true"
  );
  const [speechEnabled, setSpeechEnabled] = useState(
    localStorage.getItem("a11y-speech") === "true"
  );
  const [fontSizeStep, setFontSizeStep] = useState(
    parseInt(localStorage.getItem("a11y-font-size-step") || "0", 10)
  );
  const [readingGuide, setReadingGuide] = useState(
    localStorage.getItem("a11y-reading-guide") === "true"
  );
  const [readingMask, setReadingMask] = useState(
    localStorage.getItem("a11y-reading-mask") === "true"
  );

  // Estado para la posición de la guía/máscara
  const [mouseY, setMouseY] = useState(0);

  const panelRef = useRef(null);

  // Alternar apertura del panel
  const togglePanel = () => setIsOpen(!isOpen);

  // Cerrar el panel al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest(".a11y-trigger")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Actualizar clases de body para cada opción
  useEffect(() => {
    const body = document.body;

    const toggleClass = (className, active) => {
      if (active) {
        body.classList.add(className);
      } else {
        body.classList.remove(className);
      }
    };

    toggleClass("a11y-grayscale-mode", grayscale);
    toggleClass("a11y-inverted-mode", inverted);
    toggleClass("a11y-high-contrast-mode", highContrast);
    toggleClass("a11y-dyslexic-mode", dyslexic);
    toggleClass("a11y-spaced-mode", spacedText);
    toggleClass("a11y-large-cursor-mode", largeCursor);
    toggleClass("a11y-stop-animations-mode", stopAnimations);

    // Guardar en localStorage
    localStorage.setItem("a11y-grayscale", grayscale);
    localStorage.setItem("a11y-inverted", inverted);
    localStorage.setItem("a11y-high-contrast", highContrast);
    localStorage.setItem("a11y-dyslexic", dyslexic);
    localStorage.setItem("a11y-spaced-text", spacedText);
    localStorage.setItem("a11y-large-cursor", largeCursor);
    localStorage.setItem("a11y-stop-animations", stopAnimations);
  }, [grayscale, inverted, highContrast, dyslexic, spacedText, largeCursor, stopAnimations]);

  // Manejar cambio de tamaño de fuente global
  useEffect(() => {
    const html = document.documentElement;
    let size = "";
    if (fontSizeStep === 1) size = "112.5%"; // A+
    if (fontSizeStep === 2) size = "125%";   // A++
    if (fontSizeStep === 3) size = "137.5%"; // A+++

    html.style.fontSize = size;
    localStorage.setItem("a11y-font-size-step", fontSizeStep);
  }, [fontSizeStep]);

  // Incrementar tamaño de fuente
  const increaseFontSize = () => {
    if (fontSizeStep < 3) setFontSizeStep((prev) => prev + 1);
  };

  // Decrementar tamaño de fuente
  const decreaseFontSize = () => {
    if (fontSizeStep > 0) setFontSizeStep((prev) => prev - 1);
  };

  // Efecto para Guía y Máscara de Lectura (Eventos de mousemove)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseY(e.clientY);
    };

    if (readingGuide || readingMask) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    localStorage.setItem("a11y-reading-guide", readingGuide);
    localStorage.setItem("a11y-reading-mask", readingMask);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [readingGuide, readingMask]);

  // Efecto para Lector de Voz (TTS)
  useEffect(() => {
    let lastSpokenText = "";

    const handleMouseOver = (e) => {
      if (!speechEnabled) return;

      // Elementos que son legibles e interesantes
      const target = e.target.closest("h1, h2, h3, h4, h5, h6, p, span, button, a, li, label, input, select, textarea");
      if (!target) return;

      // Obtener el texto limpio
      let text = "";
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        text = target.placeholder || target.value || "Campo de texto";
      } else if (target.tagName === "SELECT") {
        text = `Menú desplegable. Opción seleccionada: ${target.options[target.selectedIndex]?.text || ""}`;
      } else {
        text = target.innerText || target.textContent || "";
      }

      text = text.trim();

      if (text && text !== lastSpokenText) {
        lastSpokenText = text;
        target.classList.add("a11y-reading-highlight");

        // Síntesis de voz
        window.speechSynthesis.cancel(); // Parar cualquier lectura previa
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES"; // Español
        window.speechSynthesis.speak(utterance);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("h1, h2, h3, h4, h5, h6, p, span, button, a, li, label, input, select, textarea");
      if (target) {
        target.classList.remove("a11y-reading-highlight");
      }
      lastSpokenText = "";
    };

    if (speechEnabled) {
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
    } else {
      window.speechSynthesis.cancel();
    }

    localStorage.setItem("a11y-speech", speechEnabled);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.speechSynthesis.cancel();
    };
  }, [speechEnabled]);

  // Restablecer todas las configuraciones
  const resetAll = () => {
    setGrayscale(false);
    setInverted(false);
    setHighContrast(false);
    setDyslexic(false);
    setSpacedText(false);
    setLargeCursor(false);
    setStopAnimations(false);
    setSpeechEnabled(false);
    setFontSizeStep(0);
    setReadingGuide(false);
    setReadingMask(false);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="a11y-widget">
      {/* Botón flotante */}
      <button
        className={`a11y-trigger ${isOpen ? "active" : ""}`}
        onClick={togglePanel}
        aria-label="Menú de Accesibilidad"
        title="Opciones de Accesibilidad"
      >
        {isOpen ? (
          // Icono X de cerrar
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Icono Internacional de Accesibilidad (Persona con brazos abiertos en círculo)
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8"></path>
            <path d="M8 11h8"></path>
            <circle cx="12" cy="5" r="1" fill="currentColor"></circle>
            <path d="M9 16c.5 1.5 1.5 2 3 2s2.5-.5 3-2"></path>
          </svg>
        )}
      </button>

      {/* Panel de control */}
      <div ref={panelRef} className={`a11y-panel ${isOpen ? "open" : ""}`}>
        <div className="a11y-header">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8"></path>
              <path d="M8 11h8"></path>
            </svg>
            Accesibilidad
          </h3>
          <button className="a11y-reset-btn" onClick={resetAll}>
            Restablecer
          </button>
        </div>

        <div className="a11y-body">
          {/* Sección Visual */}
          <div>
            <div className="a11y-section-title">Ajustes Visuales</div>
            <div className="a11y-grid">
              <button
                className={`a11y-option-btn ${highContrast ? "active" : ""}`}
                onClick={() => {
                  setHighContrast(!highContrast);
                  if (!highContrast) {
                    setGrayscale(false);
                    setInverted(false);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 18a6 6 0 1 0 0-12v12z"></path>
                </svg>
                <span>Alto Contraste</span>
              </button>

              <button
                className={`a11y-option-btn ${grayscale ? "active" : ""}`}
                onClick={() => {
                  setGrayscale(!grayscale);
                  if (!grayscale) {
                    setHighContrast(false);
                    setInverted(false);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"></path>
                </svg>
                <span>Monocromo</span>
              </button>

              <button
                className={`a11y-option-btn ${inverted ? "active" : ""}`}
                onClick={() => {
                  setInverted(!inverted);
                  if (!inverted) {
                    setHighContrast(false);
                    setGrayscale(false);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 1 0 9 9h-9V3z"></path>
                  <path d="M12 3a9 9 0 0 1 9 9h-9V3z" fill="currentColor" fillOpacity="0.2"></path>
                </svg>
                <span>Invertir Colores</span>
              </button>

              <button
                className={`a11y-option-btn ${largeCursor ? "active" : ""}`}
                onClick={() => setLargeCursor(!largeCursor)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3l7.07 16.97 2.51-6.16 6.16-2.51L3 3z"></path>
                  <path d="M13 13l6 6"></path>
                </svg>
                <span>Cursor Grande</span>
              </button>
            </div>
          </div>

          {/* Sección Lectura y Voz */}
          <div>
            <div className="a11y-section-title">Lectura y Voz</div>
            <div className="a11y-grid">
              <button
                className={`a11y-option-btn ${speechEnabled ? "active" : ""}`}
                onClick={() => setSpeechEnabled(!speechEnabled)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span>Lector de Voz</span>
              </button>

              <button
                className={`a11y-option-btn ${stopAnimations ? "active" : ""}`}
                onClick={() => setStopAnimations(!stopAnimations)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                </svg>
                <span>Frenar Animación</span>
              </button>
            </div>
          </div>

          {/* Sección TDAH y Enfoque */}
          <div>
            <div className="a11y-section-title">TDAH y Enfoque de Lectura</div>
            <div className="a11y-grid">
              <button
                className={`a11y-option-btn ${readingGuide ? "active" : ""}`}
                onClick={() => {
                  setReadingGuide(!readingGuide);
                  if (!readingGuide) setReadingMask(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
                </svg>
                <span>Guía de Lectura</span>
              </button>

              <button
                className={`a11y-option-btn ${readingMask ? "active" : ""}`}
                onClick={() => {
                  setReadingMask(!readingMask);
                  if (!readingMask) setReadingGuide(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                  <line x1="2" y1="14" x2="22" y2="14"></line>
                </svg>
                <span>Máscara Enfoque</span>
              </button>
            </div>
          </div>

          {/* Sección Texto y Tipografía */}
          <div>
            <div className="a11y-section-title">Texto y Fuentes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="a11y-control-card">
                <label>Tamaño del Texto</label>
                <div className="a11y-flex-row">
                  <div className="a11y-inc-dec-group" style={{ flexGrow: 1 }}>
                    <button
                      className="a11y-adjust-btn"
                      onClick={decreaseFontSize}
                      disabled={fontSizeStep === 0}
                    >
                      A-
                    </button>
                    <span className="a11y-adjust-value">
                      {fontSizeStep === 0 ? "100%" : `${100 + fontSizeStep * 12.5}%`}
                    </span>
                    <button
                      className="a11y-adjust-btn"
                      onClick={increaseFontSize}
                      disabled={fontSizeStep === 3}
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              <div className="a11y-grid">
                <button
                  className={`a11y-option-btn ${dyslexic ? "active" : ""}`}
                  onClick={() => setDyslexic(!dyslexic)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  <span>Fuente Dislexia</span>
                </button>

                <button
                  className={`a11y-option-btn ${spacedText ? "active" : ""}`}
                  onClick={() => setSpacedText(!spacedText)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="4" y1="3" x2="20" y2="3"></line>
                    <line x1="4" y1="21" x2="20" y2="21"></line>
                  </svg>
                  <span>Gran Espaciado</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="a11y-footer">
          Asistente de Accesibilidad UTP v1.0
        </div>
      </div>

      {/* Elementos auxiliares dinámicos */}
      {readingGuide && (
        <div
          className="a11y-reading-guide-line"
          style={{ top: `${mouseY}px` }}
        />
      )}

      {readingMask && (
        <>
          <div
            className="a11y-reading-mask-top"
            style={{ height: `${Math.max(0, mouseY - 50)}px` }}
          />
          <div
            className="a11y-reading-mask-bottom"
            style={{ top: `${mouseY + 50}px`, height: `calc(100vh - ${mouseY + 50}px)` }}
          />
        </>
      )}
    </div>
  );
};

export default AccessibilityWidget;
