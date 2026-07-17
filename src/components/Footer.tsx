"use client";

import React from "react";

interface FooterProps {
  language: "en" | "es";
}

export default function Footer({ language }: FooterProps) {
  const isEs = language === "es";

  return (
    <footer className="rich-footer no-print">
      <div className="footer-grid-layout">
        {/* Brand Col */}
        <div className="footer-col" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img 
              src="/logo.png" 
              alt="HSA Logo" 
              style={{ width: "32px", height: "32px", borderRadius: "6px" }} 
            />
            <span style={{ fontSize: "1.1rem", fontWeight: "800", background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              HSA
            </span>
          </div>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5" }}>
            {isEs 
              ? "Asistente de Estabilidad de Vivienda del Área de la Bahía. Reduciendo la asimetría legal para inquilinos y pequeños propietarios en San José, San Francisco y Oakland."
              : "Bay Area Housing Stability Assistant. Empowering tenants and small landlords to resolve housing conflicts under California Civil Code through smart AI assistance."}
          </p>
        </div>

        {/* resources links col */}
        <div className="footer-col">
          <h3>{isEs ? "Enlaces de Ayuda" : "Quick Support"}</h3>
          <ul>
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
            ? "© 2026 Asistente de Vivienda de la Bahía. Todos los derechos reservados." 
            : "© 2026 Bay Area Housing Stability Assistant. All rights reserved."}
        </div>
        <div>
          {isEs ? "Desarrollado para la Estabilidad Habitacional" : "Built for Bay Area Housing Equity"}
        </div>
      </div>
    </footer>
  );
}
