"use client";

import React from "react";
import { ExternalLink, GraduationCap, Building2 } from "lucide-react";

interface FooterProps {
  language: "en" | "es";
  onOpenFeedback?: () => void;
}

export default function Footer({ language, onOpenFeedback }: FooterProps) {
  const isEs = language === "es";

  return (
    <footer className="rich-footer no-print">
      <div className="footer-grid-layout">
        {/* Brand Col */}
        <div className="footer-col" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img 
              src="/logo.png" 
              alt="LeaseLink Logo" 
              style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} 
            />
            <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.01em", background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LeaseLink
            </span>
          </div>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.5" }}>
            {isEs 
              ? "Asistente de Estabilidad de Vivienda del Área de la Bahía. Reduciendo la asimetría legal para inquilinos y pequeños propietarios en San José, San Francisco y Oakland."
              : "Bay Area Housing Stability Assistant. Empowering tenants and small landlords to resolve housing conflicts under California Civil Code through smart AI assistance."}
          </p>
        </div>

        {/* Internship & Academic Collaboration Col */}
        <div className="footer-col">
          <h3>{isEs ? "Iniciativa Académica" : "Internship Initiative"}</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "12px" }}>
            {isEs 
              ? "Desarrollado como parte de la Pasantía de Verano de Growth Sector en colaboración con San José State University (SJSU)."
              : "Created as part of the Growth Sector Summer Internship in collaboration with San José State University (SJSU)."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a 
              href="https://www.growthsector.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="partner-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.825rem", fontWeight: "600", color: "#818cf8" }}
            >
              <Building2 size={15} />
              <span>Growth Sector</span>
              <ExternalLink size={12} style={{ opacity: 0.7 }} />
            </a>
            <a 
              href="https://www.sjsu.edu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="partner-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.825rem", fontWeight: "600", color: "#818cf8" }}
            >
              <GraduationCap size={15} />
              <span>San José State University (SJSU)</span>
              <ExternalLink size={12} style={{ opacity: 0.7 }} />
            </a>
          </div>
        </div>

        {/* resources links col */}
        <div className="footer-col">
          <h3>{isEs ? "Enlaces de Ayuda" : "Quick Support"}</h3>
          <ul>
            {onOpenFeedback && (
              <li>
                <button 
                  onClick={onOpenFeedback} 
                  style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", padding: 0, font: "inherit", fontWeight: "600", textDecoration: "underline" }}
                >
                  {isEs ? "💬 Enviar Opinión o Comentario" : "💬 Submit User Feedback"}
                </button>
              </li>
            )}
            <li>
              <a href="https://www.lawfoundation.org" target="_blank" rel="noopener noreferrer">
                {isEs ? "Fundación Legal de Silicon Valley" : "Law Foundation of Silicon Valley"}
              </a>
            </li>
            <li>
              <a href="https://sacredheartcs.org" target="_blank" rel="noopener noreferrer">
                {isEs ? "Servicio Comunitario Sagrado Corazón" : "Sacred Heart Community Service"}
              </a>
            </li>
            <li>
              <a href="https://baylegal.org" target="_blank" rel="noopener noreferrer">
                {isEs ? "Ayuda Legal de la Bahía" : "Bay Area Legal Aid"}
              </a>
            </li>
            <li>
              <a href="https://evictiondefense.org" target="_blank" rel="noopener noreferrer">
                {isEs ? "Defensa de Desalojos (SF)" : "Eviction Defense (SF)"}
              </a>
            </li>
          </ul>
        </div>

        {/* Legal disclaimer col */}
        <div className="footer-col">
          <h3>{isEs ? "Aviso Legal" : "Legal Warning"}</h3>
          <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
            {isEs 
              ? "Esta herramienta tiene fines únicamente informativos y de apoyo educativo. No constituye asesoramiento legal ni reemplaza la consulta con un abogado calificado o junta de alquiler local."
              : "This application provides educational assistance and automated document templates. It does not constitute formal legal counsel. For specific legal advice, please consult an attorney."}
          </p>
        </div>
      </div>

      {/* copyright */}
      <div className="footer-bottom">
        <div>
          {isEs 
            ? "© 2026 LeaseLink. Todos los derechos reservados." 
            : "© 2026 LeaseLink. All rights reserved."}
        </div>
        <div>
          {isEs 
            ? "Pasantía de Verano Growth Sector × SJSU" 
            : "Growth Sector Summer Internship × SJSU"}
        </div>
      </div>
    </footer>
  );
}
