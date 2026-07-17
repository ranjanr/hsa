"use client";

import React from "react";
import { X, Globe, MapPin, Key, RefreshCw } from "lucide-react";
import { getOrCreateSessionId } from "@/utils/session";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (val: string) => void;
  region: "sanjose" | "sf" | "oakland" | "other_ca";
  onRegionChange: (val: "sanjose" | "sf" | "oakland" | "other_ca") => void;
  language: "en" | "es";
  onLanguageChange: (val: "en" | "es") => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  region,
  onRegionChange,
  language,
  onLanguageChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const isEs = language === "es";
  const sessionId = getOrCreateSessionId();

  const handleResetSession = () => {
    if (confirm(isEs ? "¿Está seguro de restablecer su sesión? Esto generará un nuevo ID de sesión y guardará datos en un nuevo perfil de base de datos." : "Are you sure you want to reset your session? This will generate a new session ID and save data to a fresh database profile.")) {
      localStorage.removeItem("hsa_session_id");
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div className="modal-content animated-fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "700" }}>
            {isEs ? "Configuraciones del Asistente" : "Assistant Settings"}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Selection */}
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Globe size={16} style={{ color: "var(--accent)" }} />
            {isEs ? "Idioma de la Interfaz" : "UI Language"}
          </label>
          <select 
            className="form-select" 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value as "en" | "es")}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Region Selection */}
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={16} style={{ color: "var(--accent)" }} />
            {isEs ? "Jurisdicción / Región" : "Local Jurisdiction"}
          </label>
          <select 
            className="form-select" 
            value={region} 
            onChange={(e) => onRegionChange(e.target.value as any)}
          >
            <option value="sanjose">San José / Santa Clara County</option>
            <option value="sf">San Francisco</option>
            <option value="oakland">Oakland / Alameda County</option>
            <option value="other_ca">Other California Cities (Statewide AB 1482)</option>
          </select>
          <p style={{ fontSize: "0.75rem", marginTop: "4px", color: "var(--text-secondary)" }}>
            {isEs 
              ? "Afecta los cálculos del incremento del alquiler y las regulaciones locales de desalojo." 
              : "Determines rent increase calculations and local eviction regulations."}
          </p>
        </div>

        {/* API Key Selection */}
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Key size={16} style={{ color: "var(--accent)" }} />
            {isEs ? "Clave API de Gemini (Opcional)" : "Gemini API Key (Optional)"}
          </label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="AIzaSy..." 
            value={apiKey} 
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
          <p style={{ fontSize: "0.75rem", marginTop: "4px", color: "var(--text-secondary)" }}>
            {isEs 
              ? "Si ingresa su clave, el Notice Interpreter y Letter Generator usarán modelos Gemini activos. De lo contrario, se usará el modo de simulación." 
              : "Enter your Gemini API key to use live AI capabilities. If left blank, the assistant runs in high-fidelity simulation mode."}
          </p>
        </div>

        {/* Session ID display and reset */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span>{isEs ? "ID de Sesión de la Base de Datos:" : "Database Session ID:"}</span>
            <button 
              onClick={handleResetSession}
              style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: "600" }}
            >
              <RefreshCw size={12} />
              {isEs ? "Restablecer" : "Reset Session"}
            </button>
          </div>
          <code style={{ display: "block", background: "rgba(0,0,0,0.2)", padding: "6px", borderRadius: "4px", wordBreak: "break-all", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
            {sessionId}
          </code>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={onClose}
          style={{ marginTop: "20px" }}
        >
          {isEs ? "Guardar y Cerrar" : "Save & Close"}
        </button>
      </div>
    </div>
  );
}
