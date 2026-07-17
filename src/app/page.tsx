"use client";

import React, { useState, useEffect } from "react";
import { Settings, ShieldAlert, Scale, Calculator, FileSignature, Clock, Landmark, User, ShieldCheck, ArrowRight, HelpCircle, AlertCircle, MessageSquare, DollarSign, ChevronLeft, Wrench, Menu, X } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import NoticeInterpreter from "@/components/NoticeInterpreter";
import RentValidator from "@/components/RentValidator";
import LetterGenerator from "@/components/LetterGenerator";
import TimelineBuilder from "@/components/TimelineBuilder";
import ResourceNavigator from "@/components/ResourceNavigator";
import RepairsNavigator from "@/components/RepairsNavigator";
import Footer from "@/components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // States
  const [view, setView] = useState<"landing" | "portal">("landing");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [region, setRegion] = useState<"sanjose" | "sf" | "oakland" | "other_ca">("sanjose");
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("notice");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-tab interaction states
  const [triggeredLetterDetails, setTriggeredLetterDetails] = useState("");
  const [triggeredLetterSubject, setTriggeredLetterSubject] = useState("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("hsa_role") as "tenant" | "landlord";
      const storedLang = localStorage.getItem("hsa_language") as "en" | "es";
      const storedRegion = localStorage.getItem("hsa_region") as any;
      const storedKey = localStorage.getItem("gemini_api_key") || "";
      const storedView = localStorage.getItem("hsa_view") as "landing" | "portal";

      if (storedRole) setRole(storedRole);
      if (storedLang) setLanguage(storedLang);
      if (storedRegion) setRegion(storedRegion);
      if (storedKey) setApiKey(storedKey);
      if (storedView) setView(storedView);
    }
  }, []);

  const handleRoleChange = (newRole: "tenant" | "landlord") => {
    setRole(newRole);
    localStorage.setItem("hsa_role", newRole);
    setTriggeredLetterDetails("");
    setTriggeredLetterSubject("");
  };

  const handleLanguageChange = (newLang: "en" | "es") => {
    setLanguage(newLang);
    localStorage.setItem("hsa_language", newLang);
  };

  const handleRegionChange = (newRegion: "sanjose" | "sf" | "oakland" | "other_ca") => {
    setRegion(newRegion);
    localStorage.setItem("hsa_region", newRegion);
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  const handleTriggerLetter = (details: string, subject: string) => {
    setTriggeredLetterDetails(details);
    setTriggeredLetterSubject(subject);
    setActiveTab("letter");
  };

  const navigateToPortal = (selectedRole: "tenant" | "landlord") => {
    handleRoleChange(selectedRole);
    setView("portal");
    localStorage.setItem("hsa_view", "portal");
  };

  const navigateToLanding = () => {
    setView("landing");
    localStorage.setItem("hsa_view", "landing");
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <ShieldAlert size={40} style={{ animation: "pulse 2s infinite", color: "#6366f1", marginBottom: "12px" }} />
          <div>Loading HSA Dashboard...</div>
        </div>
      </div>
    );
  }

  const isEs = language === "es";

  // Navigation Tabs for Tenant vs Landlord Portals
  const tabs = [
    { id: "notice", label: isEs ? "Aviso" : "Notice", icon: role === "tenant" ? <ShieldAlert size={16} /> : <ShieldCheck size={16} /> },
    { id: "rent", label: isEs ? "Alquiler" : "Rent", icon: <Calculator size={16} /> },
    { id: "repairs", label: isEs ? "Reparación" : "Repairs", icon: <Wrench size={16} /> },
    { id: "letter", label: isEs ? "Carta" : "Letter", icon: <FileSignature size={16} /> },
    { id: "timeline", label: isEs ? "Bitácora" : "Timeline", icon: <Clock size={16} /> },
    { id: "resources", label: isEs ? "Ayuda" : "Resources", icon: <Landmark size={16} /> },
  ];

  return (
    <div className={`theme-${role}`}>
      {view === "landing" ? (
        /* Landing Page Layout */
        <div className="landing-container animated-fade-in">
          {/* Header */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img 
                src="/logo.png" 
                alt="HSA Logo" 
                style={{ width: "42px", height: "42px", borderRadius: "8px", boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)" }} 
              />
              <div>
                <h1 style={{ fontSize: "1.6rem", margin: 0, background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  HSA
                </h1>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {isEs ? "Estabilidad de Vivienda" : "Housing Stability Assistant"}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select 
                className="form-select" 
                style={{ width: "120px", padding: "6px 10px", fontSize: "0.8rem", height: "36px" }}
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value as any)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <button 
                onClick={() => setSettingsOpen(true)}
                style={{ 
                  background: "var(--panel-bg)", 
                  border: "1px solid var(--panel-border)", 
                  borderRadius: "50%", 
                  width: "36px", 
                  height: "36px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "var(--text-primary)", 
                  cursor: "pointer",
                }}
              >
                <Settings size={18} />
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="landing-hero" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img 
              src="/logo.png" 
              alt="HSA Large Logo" 
              style={{ width: "120px", height: "120px", borderRadius: "24px", marginBottom: "24px", boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)" }} 
            />
            <span className="badge badge-info" style={{ marginBottom: "16px", padding: "6px 12px", fontSize: "0.75rem" }}>
              {isEs ? "Enfoque en el Área de la Bahía" : "Bay Area Protection Focus"}
            </span>
            <h1 style={{ fontSize: "2.8rem", marginBottom: "16px" }}>
              {isEs ? "Vivienda Equitativa, Simplificada" : "Balanced Housing Stability"}
            </h1>
            <p style={{ maxWidth: "600px", margin: "0 auto 30px auto", fontSize: "1.1rem", color: "var(--text-secondary)" }}>
              {isEs 
                ? "Una plataforma de asistencia inteligente para inquilinos y pequeños propietarios de California. Entienda sus derechos, verifique el cumplimiento normativo y resuelva conflictos de alquiler antes de que escalen."
                : "A mobile-first AI assistant for California tenants and small landlords. Navigate eviction notices, calculate lawful rent increases, and draft formal responses before issues escalate."}
            </p>
          </section>

          {/* Persona Card Selections */}
          <section className="persona-selection">
            {/* Tenant Selection */}
            <div 
              className="persona-card persona-card-tenant"
              onClick={() => navigateToPortal("tenant")}
            >
              <div style={{ zIndex: 1 }}>
                <div style={{ background: "rgba(99, 102, 241, 0.15)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <User size={24} style={{ color: "#818cf8" }} />
                </div>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "8px", fontWeight: "700" }}>
                  {isEs ? "Soy Inquilino" : "I am a Tenant"}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {isEs 
                    ? "Revise avisos de desalojo por fallas legales, valide si el aumento de renta es lícito y genere cartas formales a su arrendador."
                    : "Interpret confusing eviction notices, validate rent increase limits (AB 1482 / San Jose ARO), log repairs, and search assistance programs."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "#818cf8", zIndex: 1, marginTop: "20px" }}>
                {isEs ? "Ingresar al Portal" : "Enter Tenant Portal"}
                <ArrowRight size={16} />
              </div>
            </div>

            {/* Landlord Selection */}
            <div 
              className="persona-card persona-card-landlord"
              onClick={() => navigateToPortal("landlord")}
            >
              <div style={{ zIndex: 1 }}>
                <div style={{ background: "rgba(16, 185, 129, 0.15)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Scale size={24} style={{ color: "#34d399" }} />
                </div>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "8px", fontWeight: "700" }}>
                  {isEs ? "Soy Arrendador" : "I am a Landlord"}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {isEs 
                    ? "Audite el cumplimiento de sus notificaciones escritas, verifique límites legales de renta y redacte avisos de entrada de 24 horas."
                    : "Audit your notice text for legal compliance, verify maximum allowable rent increases, and draft valid property entry reminders."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "#34d399", zIndex: 1, marginTop: "20px" }}>
                {isEs ? "Ingresar al Portal" : "Enter Landlord Portal"}
                <ArrowRight size={16} />
              </div>
            </div>
          </section>

          {/* Social Problems Context / Stats Section */}
          <section style={{ marginTop: "60px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
              {isEs ? "Entendiendo la Asimetría del Alquiler" : "Contextualizing the Housing Challenge"}
            </h2>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-number">
                  <DollarSign size={24} style={{ display: "inline", verticalAlign: "middle" }} />
                  {isEs ? "Top" : "Top"}
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px" }}>
                  {isEs ? "Costos de Alquiler" : "National Rents"}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  {isEs ? "San José tiene las rentas más altas del país." : "San Jose rents are among the highest in the US."}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number" style={{ color: "var(--warning)" }}>3-90</div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px" }}>
                  {isEs ? "Días de Plazo" : "Response Days"}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  {isEs ? "Los tiempos de respuesta de desalojo son rápidos y confusos." : "Eviction notices have extremely short and strict timelines."}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number" style={{ color: "var(--danger)" }}>{isEs ? "Alta" : "High"}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px" }}>
                  {isEs ? "Barrera de Idioma" : "Language Barriers"}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  {isEs ? "Familias vulnerables reciben escritos que no comprenden." : "Migrant communities often receive documents they cannot read."}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number" style={{ color: "var(--info)" }}>0$</div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px" }}>
                  {isEs ? "Simulado / Local" : "Self-Contained"}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  {isEs ? "Conexión a base de datos Neon local o gratuita." : "Uses client-side AI and database fallback protocols."}
                </div>
              </div>
            </div>
          </section>

          {/* Capabilities Grid */}
          <section style={{ marginTop: "60px", borderTop: "1px solid var(--border-color)", paddingTop: "50px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "8px" }}>
              {isEs ? "Capacidades de la Plataforma" : "Core Assistant Capabilities"}
            </h2>
            <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px" }}>
              {isEs ? "Explore todo lo que nuestro asistente inteligente puede hacer por usted:" : "Discover how the application balances housing regulatory asymmetries:"}
            </p>
            <div className="feature-grid">
              <div className="card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldAlert size={18} style={{ color: "var(--accent)" }} />
                  {isEs ? "Intérprete de Avisos" : "Notice Interpreter"}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>
                  {isEs ? "Analice plazos de aviso de desalojo (3, 30, 60, 90 días) y encuentre defectos normativos obligatorios." : "Parse rental documents, check legal response dates, and audit mandatory advisories."}
                </p>
              </div>

              <div className="card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Calculator size={18} style={{ color: "var(--accent)" }} />
                  {isEs ? "Validador de Renta" : "Rent Cap Calculator"}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>
                  {isEs ? "Valide topes según el ARO de San José (5%) o el límite de California AB 1482 (8.8% para la Bahía)." : "Validate rent increases using statewide AB 1482 formulas or San Jose local ARO ordinances."}
                </p>
              </div>

              <div className="card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileSignature size={18} style={{ color: "var(--accent)" }} />
                  {isEs ? "Redactor de Cartas" : "Legal Letter Generator"}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>
                  {isEs ? "Genere comunicados y disputas de habitabilidad o rentas injustas pulidas por IA para imprimir." : "Draft and polish print-ready letters (habitability requests, rent disputes, entry notices) using AI."}
                </p>
              </div>

              <div className="card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={18} style={{ color: "var(--accent)" }} />
                  {isEs ? "Bitácora Escrita" : "Timeline Builder"}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>
                  {isEs ? "Registre eventos cronológicamente (fugas, textos, pagos) para generar reportes ante defensa legal." : "Log rental events (harassment, water leaks, letters) to compile chronological evidence reports."}
                </p>
              </div>
            </div>
          </section>

          {/* Landing Footer */}
          <Footer language={language} />
        </div>
      ) : (
        /* Portal Dashboard Layout */
        <div className="app-container">
          {/* Header */}
          <header className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", background: "var(--panel-bg)", border: "1px solid var(--panel-border)", padding: "12px 16px", borderRadius: "var(--radius-lg)", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img 
                src="/logo.png" 
                alt="HSA Logo" 
                style={{ width: "32px", height: "32px", borderRadius: "6px" }} 
              />
              <div>
                <span 
                  onClick={navigateToLanding}
                  style={{ fontSize: "1.1rem", fontWeight: "800", background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" }}
                >
                  HSA
                </span>
              </div>
            </div>

            {/* Desktop Only Navigation tabs in header */}
            <div className="desktop-only" style={{ display: "flex", gap: "8px" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ padding: "8px 12px", fontSize: "0.8rem", borderRadius: "16px" }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* Desktop exit portal */}
              <button 
                onClick={navigateToLanding}
                className="btn btn-secondary desktop-only"
                style={{ width: "auto", padding: "8px 12px", fontSize: "0.85rem", height: "34px", borderRadius: "17px" }}
              >
                {isEs ? "Inicio" : "Exit Portal"}
              </button>

              <button 
                onClick={() => setSettingsOpen(true)}
                className="desktop-only"
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "var(--text-secondary)", 
                  cursor: "pointer",
                }}
              >
                <Settings size={18} />
              </button>

              {/* Mobile menu trigger */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-only"
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "var(--text-primary)", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Menu size={24} />
              </button>
            </div>
          </header>

          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", margin: 0 }}>
                {role === "tenant" ? (isEs ? "Portal del Inquilino" : "Tenant Portal") : (isEs ? "Portal del Arrendador" : "Landlord Portal")}
              </h1>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700" }}>
                {region === "sanjose" ? "San José / Santa Clara" : region === "sf" ? "San Francisco" : region === "oakland" ? "Oakland" : "Statewide CA"}
              </p>
            </div>
            
            {/* Quick role-switch badge */}
            <span 
              className="badge" 
              style={{ 
                background: role === "tenant" ? "var(--accent-hover)" : "var(--success-bg)", 
                color: "#ffffff",
                cursor: "pointer"
              }}
              onClick={() => handleRoleChange(role === "tenant" ? "landlord" : "tenant")}
            >
              {role === "tenant" ? (isEs ? "Inquilino" : "Tenant") : (isEs ? "Arrendador" : "Landlord")}
            </span>
          </div>

          {/* Portal Main Views */}
          <main style={{ flex: 1 }}>
            {activeTab === "notice" && (
              <NoticeInterpreter language={language} region={region} role={role} />
            )}

            {activeTab === "rent" && (
              <RentValidator 
                language={language} 
                region={region} 
                role={role} 
                onTriggerLetter={handleTriggerLetter}
              />
            )}

            {activeTab === "repairs" && (
              <RepairsNavigator 
                language={language}
                role={role}
                onTriggerLetter={handleTriggerLetter}
              />
            )}

            {activeTab === "letter" && (
              <LetterGenerator 
                language={language} 
                role={role} 
                initialDetails={triggeredLetterDetails}
                initialSubject={triggeredLetterSubject}
              />
            )}

            {activeTab === "timeline" && (
              <TimelineBuilder language={language} />
            )}

            {activeTab === "resources" && (
              <ResourceNavigator language={language} region={region} />
            )}
          </main>

          {/* Reusable Rich Footer */}
          <Footer language={language} />

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
          )}
          <div className={`mobile-menu-drawer ${mobileMenuOpen ? "open" : ""}`}>
            <div className="mobile-menu-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src="/logo.png" style={{ width: "28px", height: "28px", borderRadius: "4px" }} alt="Logo" />
                <span style={{ fontWeight: "700" }}>Menu</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-menu-items">
              {/* Role toggle option in mobile menu */}
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">{isEs ? "Rol Activo" : "Active Role"}</label>
                <select 
                  className="form-select" 
                  value={role} 
                  onChange={(e) => {
                    handleRoleChange(e.target.value as any);
                    setMobileMenuOpen(false);
                  }}
                >
                  <option value="tenant">{isEs ? "Inquilino" : "Tenant"}</option>
                  <option value="landlord">{isEs ? "Arrendador" : "Landlord"}</option>
                </select>
              </div>

              {/* Navigation items in mobile menu */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{ justifyContent: "flex-start", width: "100%", borderRadius: "8px" }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setSettingsOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{ display: "flex", gap: "6px", fontSize: "0.85rem", justifyContent: "flex-start" }}
                >
                  <Settings size={14} />
                  {isEs ? "Configuraciones" : "Settings"}
                </button>
                
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    navigateToLanding();
                    setMobileMenuOpen(false);
                  }}
                  style={{ display: "flex", gap: "6px", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.2)", justifyContent: "flex-start" }}
                >
                  <ChevronLeft size={14} />
                  {isEs ? "Salir al Inicio" : "Exit Portal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        region={region}
        onRegionChange={handleRegionChange}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
