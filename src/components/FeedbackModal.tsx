"use client";

import React from "react";
import { X, MessageSquare, ExternalLink } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "en" | "es";
}

export default function FeedbackModal({ isOpen, onClose, language = "en" }: FeedbackModalProps) {
  if (!isOpen) return null;

  const isEs = language === "es";
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdi8GkalaI5JLScfWa7Mt2VGwasw1Ebp9qtXeF7F3-xOoTp_g/viewform?embedded=true";
  const rawFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdi8GkalaI5JLScfWa7Mt2VGwasw1Ebp9qtXeF7F3-xOoTp_g/viewform?usp=publish-editor";

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-container animated-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "750px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: "24px" }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "rgba(99, 102, 241, 0.15)", padding: "8px", borderRadius: "10px", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: "700" }}>
                {isEs ? "Enviar Comentarios y Sugerencias" : "User Feedback & Ratings"}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                {isEs ? "Ayúdenos a mejorar LeaseLink compartiendo su experiencia." : "Help us improve LeaseLink by sharing your experience and feedback."}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Container */}
        <div style={{ flex: 1, minHeight: "450px", overflow: "hidden", borderRadius: "12px", background: "#ffffff" }}>
          <iframe 
            src={formUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: "480px" }}
            title="LeaseLink Feedback Form"
          >
            {isEs ? "Cargando formulario..." : "Loading feedback form..."}
          </iframe>
        </div>

        {/* Modal Footer Fallback */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
          <a 
            href={rawFormUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: "0.8rem", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", fontWeight: "600" }}
          >
            {isEs ? "Abrir en nueva pestaña" : "Open form in new tab"} <ExternalLink size={14} />
          </a>

          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ width: "auto", padding: "6px 18px", fontSize: "0.85rem" }}
          >
            {isEs ? "Cerrar" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
