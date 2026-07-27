"use client";

import React, { useState } from "react";
import { FileText, Copy, Printer, Check, ShieldCheck, AlertTriangle, Building2 } from "lucide-react";

interface LeaseGeneratorProps {
  language: "en" | "es";
  role: "tenant" | "landlord";
}

export default function LeaseGenerator({ language, role }: LeaseGeneratorProps) {
  const isEs = language === "es";

  // Form intake state
  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [landlordEmail, setLandlordEmail] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [unitNum, setUnitNum] = useState("");
  const [city, setCity] = useState("San Jose");
  const [zipCode, setZipCode] = useState("");
  
  // Terms & Financials
  const [leaseType, setLeaseType] = useState<"fixed" | "month_to_month">("fixed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState<string>("2500");
  const [securityDeposit, setSecurityDeposit] = useState<string>("2500");
  const [rentDueDay, setRentDueDay] = useState("1st");
  const [lateFee, setLateFee] = useState("50");
  const [gracePeriodDays, setGracePeriodDays] = useState("5");
  
  // Utilities & Policies
  const [utilitiesLandlord, setUtilitiesLandlord] = useState<string[]>(["Water", "Trash"]);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [petDeposit, setPetDeposit] = useState("300");
  const [smokingAllowed, setSmokingAllowed] = useState<boolean>(false);
  const [yearBuilt, setYearBuilt] = useState("1985");

  // California Law Compliance Toggles
  const [isAb1482Exempt, setIsAb1482Exempt] = useState<boolean>(false);
  const [ab1482ExemptReason, setAb1482ExemptReason] = useState<string>("single_family");
  const [inFloodHazardZone, setInFloodHazardZone] = useState<boolean>(false);

  // Output State
  const [generatedLease, setGeneratedLease] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Calculated checks
  const rentVal = parseFloat(monthlyRent) || 0;
  const depositVal = parseFloat(securityDeposit) || 0;
  const isDepositOverCap = depositVal > rentVal && rentVal > 0; // AB 12 1-month cap rule
  const isPre1978 = parseInt(yearBuilt) < 1978 && parseInt(yearBuilt) > 1800;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedLandlord = landlordName || "[Landlord Name]";
    const formattedTenant = tenantName || "[Tenant Name(s)]";
    const fullAddress = `${propertyAddress}${unitNum ? ` Unit ${unitNum}` : ""}, ${city}, CA ${zipCode || "[Zip]"}`;
    const formattedRent = `$${rentVal.toLocaleString()}`;
    const formattedDeposit = `$${depositVal.toLocaleString()}`;

    // Construct California Residential Lease Agreement Text
    let doc = `================================================================================
CALIFORNIA RESIDENTIAL LEASE AGREEMENT
(COMPLIANT WITH CALIFORNIA CIVIL CODE & AB 1482 / AB 12)
================================================================================

1. PARTIES & PROPERTY
This Residential Lease Agreement ("Agreement") is made on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}, by and between:
LANDLORD: ${formattedLandlord} (${landlordPhone ? `Phone: ${landlordPhone}` : ""} ${landlordEmail ? `Email: ${landlordEmail}` : ""})
TENANT(S): ${formattedTenant}

Landlord hereby leases to Tenant, and Tenant agrees to lease from Landlord, the real property situated in the City of ${city}, County of Santa Clara/Bay Area, State of California, described as:
Address: ${fullAddress}

2. LEASE TERM
${leaseType === "fixed" 
  ? `This Agreement shall be a Fixed-Term Lease beginning on ${startDate || "[Start Date]"} and ending on ${endDate || "[End Date]"}. Upon expiration, this lease shall automatically convert to a Month-to-Month tenancy unless renewed or terminated in writing according to California law.`
  : `This Agreement shall be a Month-to-Month Tenancy beginning on ${startDate || "[Start Date]"} and continuing monthly until terminated by either party giving written notice in compliance with California Civil Code § 1946.1.`}

3. RENT PAYMENT & LATE FEES
- Monthly Rent: Tenant agrees to pay Landlord monthly rent in the amount of ${formattedRent} per month, payable in advance on the ${rentDueDay} day of each calendar month.
- Grace Period & Late Fee: Rent paid after the ${gracePeriodDays}th day of the month shall incur a late charge of $${lateFee}.
- Accepted Payment Methods: Electronic bank transfer, check, or cashier's check as designated by Landlord.

4. SECURITY DEPOSIT (CALIFORNIA CIVIL CODE § 1950.5 & AB 12 COMPLIANCE)
- Security Deposit Amount: ${formattedDeposit}.
${isDepositOverCap ? "NOTE: Landlord confirms this security deposit complies with statutory exceptions under California AB 12." : "- Statutory Cap Notice: In accordance with California Assembly Bill 12 (effective July 1, 2024), the security deposit does not exceed one (1) month's total rent."}
- Return Timeline: Within 21 calendar days after Tenant vacates the premises, Landlord shall return the security deposit along with an itemized accounting of any lawful deductions (for unpaid rent, repair of damage beyond normal wear and tear, or cleaning), pursuant to California Civil Code § 1950.5.

5. UTILITIES & SERVICES
- Landlord Responsibility: ${utilitiesLandlord.length > 0 ? utilitiesLandlord.join(", ") : "None"}.
- Tenant Responsibility: All other utilities and services not explicitly paid by Landlord (including electricity, gas, internet/cable, and water/trash if not selected above).

6. PETS & SMOKING POLICY
- Smoking Policy: ${smokingAllowed ? "Smoking is permitted in designated outdoor areas only." : "Smoking, vaping, or burning of any substance is STRICTLY PROHIBITED anywhere on the property pursuant to California Civil Code § 1947.5."}
- Pets Policy: ${petsAllowed ? `Pets permitted subject to prior written Approval and an additional Pet Deposit of $${petDeposit}.` : "No pets or animals allowed on the premises without prior written approval from Landlord, except registered service or emotional support animals under state and federal fair housing laws."}

7. MAINTENANCE, REPAIRS & HABITABILITY (CIVIL CODE § 1941.1)
- Landlord Obligations: Landlord shall maintain the premises in a tenantable condition as mandated by California Civil Code § 1941.1 (waterproof roof, operable plumbing, heating, electrical systems, and sanitation facilities).
- Tenant Obligations: Tenant agrees to keep the premises clean and sanitary, operate all electrical and plumbing fixtures properly, and promptly notify Landlord of any needed repairs or hazardous conditions.

8. LANDLORD RIGHT OF ENTRY (CIVIL CODE § 1954)
Landlord may enter the premises only: (a) in case of emergency; (b) to make necessary repairs or inspections; or (c) to show the property to prospective buyers or tenants. Except in emergency, Landlord shall provide at least twenty-four (24) hours written notice prior to entry.

9. AB 1482 TENANT PROTECTION ACT DISCLOSURE (CIVIL CODE § 1946.2 & § 1947.12)
${isAb1482Exempt ? `[PROPERTY EXEMPT FROM AB 1482 RENT CAPS & JUST CAUSE]
"This property is not subject to the rent limits imposed by Section 1947.12 of the Civil Code and is not subject to the just-cause requirements of Section 1946.2 of the Civil Code. This property meets the requirements of Sections 1947.12(d)(5) and 1946.2(e)(8) of the Civil Code (${ab1482ExemptReason === "single_family" ? "Single-family dwelling or condo owned by non-corporate entity" : "New construction issued Certificate of Occupancy within the last 15 years"})."` : `[PROPERTY COVERED BY AB 1482 RENT CAPS & JUST CAUSE]
"California law limits the amount your rent can be increased. See Section 1947.12 of the Civil Code for more information. California law also provides that after all of the tenants have continuously and lawfully occupied the property for 12 months or more, a landlord must provide a statement of cause in any notice to terminate a tenancy. See Section 1946.2 of the Civil Code for more information."`}

10. MANDATORY CALIFORNIA STATUTORY DISCLOSURES
- Megan's Law Notice (Civ. Code § 2079.10a): Notice: Pursuant to Section 2079.10a of the Civil Code, information about specified registered sex offenders is made available to the public via an Internet Web site maintained by the Department of Justice at www.meganslaw.ca.gov.
- Bedbug Information Notice (Civ. Code § 1954.603): Landlord confirms the property has been inspected and is free of bedbug infestations. Tenant agrees to report any signs of bedbugs immediately.
${isPre1978 ? `- Lead-Based Paint Disclosure: Housing built prior to 1978 may contain lead-based paint. Landlord provides Tenant with the EPA-approved lead hazard informational pamphlet prior to lease signing.` : ""}
${inFloodHazardZone ? `- Flood Hazard Disclosure (Civ. Code § 8589.45): Landlord notifies Tenant that the property is located in a designated special flood hazard area.` : ""}

11. SIGNATURES & ACKNOWLEDGMENT
By signing below, Landlord and Tenant acknowledge having read, understood, and agreed to all terms, covenants, and statutory disclosures of this Agreement.


LANDLORD SIGNATURE: ___________________________    DATE: _________________
Name: ${formattedLandlord}


TENANT SIGNATURE(S): ___________________________    DATE: _________________
Name: ${formattedTenant}
================================================================================`;

    setGeneratedLease(doc);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLease);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lease-generator-container animated-fade-in" style={{ paddingBottom: "40px" }}>
      {/* Header Banner */}
      <div className="no-print" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <FileText size={24} style={{ color: "#818cf8" }} />
          <h2 style={{ fontSize: "1.4rem", margin: 0, fontWeight: "700" }}>
            {isEs ? "Generador de Contrato de Arrendamiento (CA)" : "California Residential Lease Agreement Generator"}
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
          {isEs
            ? "Cree un contrato de alquiler residencial completo y legalmente conforme con las leyes de California (AB 1482, límite de depósito AB 12 y divulgaciones obligatorias)."
            : "Generate a fully customizable, legally binding California Residential Lease Agreement integrated with CA statutory disclosures (AB 1482 Just Cause/Rent Caps, AB 12 Deposit Limit, Megan's Law, and Bedbug notices)."}
        </p>
      </div>

      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: generatedLease ? "1fr 1.2fr" : "1fr", gap: "24px" }}>
        {/* Intake Form Column */}
        <div className="no-print card-panel" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", padding: "24px", borderRadius: "var(--radius-lg)" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Building2 size={18} style={{ color: "var(--accent)" }} />
            {isEs ? "Datos del Inmueble y las Partes" : "Intake & Lease Terms"}
          </h3>

          <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Landlord & Tenant Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">{isEs ? "Nombre del Arrendador" : "Landlord Name"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jane Doe"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isEs ? "Nombre del Inquilino(s)" : "Tenant Name(s)"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Smith & Mary Smith"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">{isEs ? "Dirección del Inmueble" : "Property Address"}</label>
              <input
                type="text"
                className="form-input"
                placeholder="123 Main Street"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">{isEs ? "Unidad #" : "Unit #"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Apt 4B"
                  value={unitNum}
                  onChange={(e) => setUnitNum(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isEs ? "Ciudad" : "City"}</label>
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="San Jose">San Jose</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Oakland">Oakland</option>
                  <option value="Santa Clara">Santa Clara</option>
                  <option value="Sunnyvale">Sunnyvale</option>
                  <option value="Other CA City">Other CA City</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isEs ? "Código Postal" : "Zip Code"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="95112"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>

            {/* Lease Type & Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">{isEs ? "Tipo de Contrato" : "Lease Type"}</label>
                <select className="form-select" value={leaseType} onChange={(e) => setLeaseType(e.target.value as any)}>
                  <option value="fixed">{isEs ? "Plazo Fijo (1 Año)" : "Fixed-Term (e.g. 1 Year)"}</option>
                  <option value="month_to_month">{isEs ? "Mes a Mes" : "Month-to-Month"}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isEs ? "Fecha de Inicio" : "Start Date"}</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Financials & Security Deposit */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">{isEs ? "Renta Mensual ($)" : "Monthly Rent ($)"}</label>
                <input
                  type="number"
                  className="form-input"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isEs ? "Depósito de Garantía ($)" : "Security Deposit ($)"}</label>
                <input
                  type="number"
                  className="form-input"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* AB 12 Security Deposit Warning */}
            {isDepositOverCap && (
              <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "var(--radius-md)", padding: "10px 14px", display: "flex", gap: "10px", alignItems: "center" }}>
                <AlertTriangle size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: "0.775rem", color: "#f59e0b" }}>
                  {isEs 
                    ? "Atención: La ley AB 12 de California limita los depósitos a 1 mes de renta. (Solo pequeños propietarios exentos pueden requerir 2 meses)."
                    : "CA AB 12 Rule: Security deposit exceeds 1 month's rent ($" + monthlyRent + "). Under AB 12 (eff. July 2024), residential deposits are capped at 1 month's rent unless you qualify for the small landlord exemption."}
                </p>
              </div>
            )}

            {/* California Toggles: AB 1482 & Pre-1978 */}
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={16} style={{ color: "#818cf8" }} />
                {isEs ? "Cumplimiento Normativo de California" : "California Regulatory Settings"}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.8rem" }}>
                <input
                  type="checkbox"
                  checked={isAb1482Exempt}
                  onChange={(e) => setIsAb1482Exempt(e.target.checked)}
                />
                <span>{isEs ? "Propiedad exenta de límites de renta AB 1482 (Casa unifamiliar/Condominio)" : "Exempt from AB 1482 Rent Caps & Just Cause (Single Family Home/Condo)"}</span>
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label className="form-label">{isEs ? "Año de Construcción" : "Year Built"}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isEs ? "Permitir Mascotas" : "Pets Allowed"}</label>
                  <select className="form-select" value={petsAllowed ? "yes" : "no"} onChange={(e) => setPetsAllowed(e.target.value === "yes")}>
                    <option value="no">{isEs ? "No" : "No Pets"}</option>
                    <option value="yes">{isEs ? "Sí" : "Pets Allowed"}</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "10px", width: "100%", padding: "12px", fontSize: "0.95rem", fontWeight: "700" }}>
              <FileText size={18} />
              {isEs ? "Generar Contrato de Arrendamiento" : "Generate CA Lease Agreement"}
            </button>
          </form>
        </div>

        {/* Generated Output Preview */}
        {generatedLease && (
          <div className="lease-output-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                ✓ {isEs ? "Contrato Generado Conforme a la Ley de CA" : "CA Compliant Agreement Ready"}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  {copied ? <Check size={14} style={{ color: "var(--success)" }} /> : <Copy size={14} />}
                  {copied ? (isEs ? "Copiado" : "Copied") : (isEs ? "Copiar Texto" : "Copy Text")}
                </button>
                <button onClick={handlePrint} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  <Printer size={14} />
                  {isEs ? "Imprimir / Guardar PDF" : "Print / Export PDF"}
                </button>
              </div>
            </div>

            {/* Printable Document Box */}
            <div 
              className="printable-document" 
              style={{ 
                background: "#ffffff", 
                color: "#111827", 
                padding: "36px 40px", 
                borderRadius: "var(--radius-md)", 
                fontFamily: "Courier, monospace", 
                fontSize: "0.825rem", 
                lineHeight: "1.6", 
                whiteSpace: "pre-wrap", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                maxHeight: "750px",
                overflowY: "auto",
                border: "1px solid #e5e7eb"
              }}
            >
              {generatedLease}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
