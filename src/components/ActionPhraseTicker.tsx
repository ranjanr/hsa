"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldAlert, Calculator, FileSignature, FileText, Clock, ShieldCheck } from "lucide-react";

interface ActionPhraseTickerProps {
  language?: "en" | "es";
}

export default function ActionPhraseTicker({ language = "en" }: ActionPhraseTickerProps) {
  const isEs = language === "es";

  const phrases = isEs ? [
    { text: "Navegar avisos de desalojo", icon: <ShieldAlert size={16} style={{ color: "#818cf8" }} />, tag: "Aviso Legal" },
    { text: "Calcular aumentos de renta lícitos", icon: <Calculator size={16} style={{ color: "#34d399" }} />, tag: "Tope AB 1482" },
    { text: "Redactar respuestas formales e impresas", icon: <FileSignature size={16} style={{ color: "#a5b4fc" }} />, tag: "Carta IA" },
    { text: "Generar contratos de arrendamiento en CA", icon: <FileText size={16} style={{ color: "#34d399" }} />, tag: "Arrendador" },
    { text: "Auditar cumplimiento normativo obligatorio", icon: <ShieldCheck size={16} style={{ color: "#60a5fa" }} />, tag: "Cumplimiento" },
    { text: "Registrar evidencias y bitácora de tiempo", icon: <Clock size={16} style={{ color: "#f59e0b" }} />, tag: "Bitácora" },
  ] : [
    { text: "Navigate eviction notices", icon: <ShieldAlert size={16} style={{ color: "#818cf8" }} />, tag: "Legal Notice" },
    { text: "Calculate lawful rent increases", icon: <Calculator size={16} style={{ color: "#34d399" }} />, tag: "AB 1482 Rent Cap" },
    { text: "Draft formal legal responses", icon: <FileSignature size={16} style={{ color: "#a5b4fc" }} />, tag: "AI Generator" },
    { text: "Generate CA residential leases", icon: <FileText size={16} style={{ color: "#34d399" }} />, tag: "Landlord Tool" },
    { text: "Audit mandatory legal compliance", icon: <ShieldCheck size={16} style={{ color: "#60a5fa" }} />, tag: "Legal Audit" },
    { text: "Log chronological event evidence", icon: <Clock size={16} style={{ color: "#f59e0b" }} />, tag: "Timeline" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setAnimating(false);
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, [phrases.length]);

  const current = phrases[currentIndex];

  return (
    <div className="action-hero-ticker">
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)" }}>
        <Sparkles size={18} className="pulse-sparkle" />
      </div>
      <div 
        className="action-ticker-text"
        style={{
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(-8px) scale(0.97)" : "translateY(0) scale(1)",
        }}
      >
        {current.icon}
        <span>{current.text}</span>
      </div>
      <span 
        style={{ 
          fontSize: "0.7rem", 
          fontWeight: "800", 
          textTransform: "uppercase", 
          padding: "3px 8px", 
          borderRadius: "12px", 
          background: "rgba(99, 102, 241, 0.2)", 
          color: "#a5b4fc", 
          border: "1px solid rgba(99, 102, 241, 0.3)",
          letterSpacing: "0.05em"
        }}
      >
        {current.tag}
      </span>
    </div>
  );
}
