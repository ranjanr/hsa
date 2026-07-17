"use client";

import React, { useState } from "react";
import { calculateRentLegality, RentCalculatorInput } from "@/utils/rentCalculator";
import { Calculator, ShieldAlert, CheckCircle, AlertTriangle, FileSignature } from "lucide-react";

interface RentValidatorProps {
  language: "en" | "es";
  region: "sanjose" | "sf" | "oakland" | "other_ca";
  role: "tenant" | "landlord";
  onTriggerLetter: (details: string, subject: string) => void;
}

export default function RentValidator({ language, region, role, onTriggerLetter }: RentValidatorProps) {
  const isEs = language === "es";

  // Form states
  const [currentRent, setCurrentRent] = useState("");
  const [proposedRent, setProposedRent] = useState("");
  const [propertyType, setPropertyType] = useState<RentCalculatorInput["propertyType"]>("apartment");
  const [constructionYear, setConstructionYear] = useState("1980");
  const [isCorporateOwned, setIsCorporateOwned] = useState(false);
  const [isLandlordOccupiedDuplex, setIsLandlordOccupiedDuplex] = useState(false);

  // Result states
  const [result, setResult] = useState<ReturnType<typeof calculateRentLegality> | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const currRentNum = parseFloat(currentRent);
    const propRentNum = parseFloat(proposedRent);
    const yearNum = parseInt(constructionYear);

    if (isNaN(currRentNum) || isNaN(propRentNum) || isNaN(yearNum)) {
      alert(isEs ? "Por favor ingrese valores numéricos válidos." : "Please enter valid numerical values.");
      return;
    }

    const output = calculateRentLegality({
      currentRent: currRentNum,
      proposedRent: propRentNum,
      propertyType,
      constructionYear: yearNum,
      region,
      isCorporateOwned,
      isLandlordOccupiedDuplex,
    });

    setResult(output);
  };

  const handleTriggerDispute = () => {
    if (!result) return;
    const details = isEs
      ? `Mi alquiler actual es de $${currentRent}. Recibí un aviso para aumentar el alquiler a $${proposedRent}, lo cual representa un aumento del ${result.proposedIncreasePercent}%. Según los cálculos de la herramienta, esta propiedad está sujeta a la ley: ${result.applicableLawName}, la cual limita los aumentos anuales al ${result.maxAllowedIncreasePercent}%. Por lo tanto, el aumento propuesto excede el límite permitido de $${result.maxAllowedRent}.`
      : `My current rent is $${currentRent}. I received a notice increasing the rent to $${proposedRent}, which represents a ${result.proposedIncreasePercent}% increase. According to the Rent Stability Assistant, this property is governed by: ${result.applicableLawName}, which limits annual increases to ${result.maxAllowedIncreasePercent}%. The proposed rent exceeds the legally allowed maximum of $${result.maxAllowedRent} by $${(parseFloat(proposedRent) - result.maxAllowedRent).toFixed(2)}.`;
    
    const subject = isEs ? "Disputa de Aumento de Alquiler Ilegal" : "Dispute of Unlawful Rent Increase";
    onTriggerLetter(details, subject);
  };

  return (
    <div className="animated-fade-in">
      <div className="card">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calculator style={{ color: "var(--accent)" }} />
          {isEs ? "Validador de Aumento de Alquiler" : "Rent Increase Validator"}
        </h2>
        <p>
          {isEs
            ? "Calcule si un aumento de alquiler propuesto excede los límites legales de California (AB 1482) o las regulaciones municipales."
            : "Determine if a proposed rent increase exceeds legal thresholds set by California state law (AB 1482) or local city ordinances."}
        </p>

        <form onSubmit={handleCalculate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">{isEs ? "Alquiler Actual ($)" : "Current Rent ($)"}</label>
              <input
                type="number"
                className="form-input"
                placeholder="2000"
                value={currentRent}
                onChange={(e) => setCurrentRent(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isEs ? "Nuevo Alquiler Propuesto ($)" : "Proposed Rent ($)"}</label>
              <input
                type="number"
                className="form-input"
                placeholder="2200"
                value={proposedRent}
                onChange={(e) => setProposedRent(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">{isEs ? "Tipo de Propiedad" : "Property Type"}</label>
              <select
                className="form-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
              >
                <option value="apartment">{isEs ? "Apartamento (3+ unidades)" : "Apartment (3+ units)"}</option>
                <option value="duplex">Duplex</option>
                <option value="condo">Condominio</option>
                <option value="single_family">{isEs ? "Casa Unifamiliar" : "Single Family Home"}</option>
                <option value="other">{isEs ? "Otro" : "Other"}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isEs ? "Año de Construcción" : "Year Built"}</label>
              <input
                type="number"
                className="form-input"
                placeholder="1985"
                value={constructionYear}
                onChange={(e) => setConstructionYear(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Exemption flags conditional */}
          {(propertyType === "single_family" || propertyType === "condo") && (
            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px" }}>
              <input
                type="checkbox"
                id="corpOwned"
                checked={isCorporateOwned}
                onChange={(e) => setIsCorporateOwned(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="corpOwned" style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                {isEs 
                  ? "La propiedad es de una Corporación o LLC (Fideicomiso)" 
                  : "Property is owned by a Corporation or Real Estate Trust/LLC"}
              </label>
            </div>
          )}

          {propertyType === "duplex" && (
            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px" }}>
              <input
                type="checkbox"
                id="landlordDuplex"
                checked={isLandlordOccupiedDuplex}
                onChange={(e) => setIsLandlordOccupiedDuplex(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="landlordDuplex" style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                {isEs 
                  ? "El propietario vive en la otra unidad del duplex" 
                  : "Landlord resides in the other unit of this duplex"}
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: "8px" }}>
            {isEs ? "Calcular y Validar" : "Calculate & Validate"}
          </button>
        </form>
      </div>

      {/* Render results */}
      {result && (
        <div className="card animated-fade-in" style={{ border: result.isLegal ? "1px solid var(--success)" : "1px solid var(--danger)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>{isEs ? "Resultado de la Validación" : "Validation Summary"}</h3>
            {result.isLegal ? (
              <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle size={14} />
                {isEs ? "Incremento Legal" : "Increase is Lawful"}
              </span>
            ) : (
              <span className="badge badge-danger" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertTriangle size={14} />
                {isEs ? "Incremento Ilegal" : "Increase is Unlawful"}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "AUMENTO PROPUESTO" : "PROPOSED INCREASE"}
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: result.isLegal ? "inherit" : "var(--danger)" }}>
                {result.proposedIncreasePercent}%
              </div>
            </div>
            <div style={{ padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "LÍMITE MÁXIMO PERMITIDO" : "LEGAL MAX CAP"}
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--success)" }}>
                {result.maxAllowedIncreasePercent === 100 
                  ? (isEs ? "Sin Límite" : "No Cap") 
                  : `${result.maxAllowedIncreasePercent}%`}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "16px", fontSize: "0.9rem" }}>
            <div style={{ fontWeight: "700", marginBottom: "4px" }}>
              {isEs ? "Marco Regulatorio Aplicable:" : "Applicable Law:"}
            </div>
            <div style={{ color: "var(--accent)", fontWeight: "600", marginBottom: "8px" }}>
              {result.applicableLawName}
            </div>
            <div style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>
              {result.explanation}
            </div>
          </div>

          {!result.isLegal && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "10px", background: "var(--danger-bg)", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                <ShieldAlert size={18} style={{ color: "var(--danger)", flexShrink: 0 }} />
                <div>
                  {isEs 
                    ? `El alquiler máximo permitido para esta unidad es $${result.maxAllowedRent.toLocaleString()}. La propuesta excede este límite por $${(parseFloat(proposedRent) - result.maxAllowedRent).toFixed(2)} al mes.`
                    : `The legal maximum rent for this property is $${result.maxAllowedRent.toLocaleString()}. The proposed increase exceeds the cap by $${(parseFloat(proposedRent) - result.maxAllowedRent).toFixed(2)} per month.`}
                </div>
              </div>
              {role === "tenant" && (
                <button 
                  onClick={handleTriggerDispute}
                  className="btn btn-primary"
                  style={{ background: "var(--danger)", boxShadow: "none", display: "flex", gap: "8px" }}
                >
                  <FileSignature size={18} />
                  {isEs ? "Redactar Carta de Disputa al Propietario" : "Generate Dispute Letter to Landlord"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
