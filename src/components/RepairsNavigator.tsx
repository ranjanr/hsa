"use client";

import React, { useState } from "react";
import { Wrench, ShieldAlert, Clock, AlertTriangle, FileText, CheckCircle, HelpCircle, ArrowRight } from "lucide-react";
import { saveTimelineEventAction } from "@/app/dbActions";
import { getOrCreateSessionId } from "@/utils/session";

interface RepairsNavigatorProps {
  language: "en" | "es";
  role: "tenant" | "landlord";
  onTriggerLetter: (details: string, subject: string) => void;
}

interface RepairCategory {
  id: string;
  name: string;
  nameEs: string;
  lawRef: string;
  timeline: string;
  timelineEs: string;
  isEmergency: boolean;
  desc: string;
  descEs: string;
  tenantRemedies: string[];
  tenantRemediesEs: string[];
  landlordObligations: string[];
  landlordObligationsEs: string[];
}

const repairCategories: RepairCategory[] = [
  {
    id: "plumbing",
    name: "Plumbing, Leaks & Sewage",
    nameEs: "Plomería, Fugas y Drenaje",
    lawRef: "Cal. Civil Code § 1941.1(a)(3)",
    timeline: "24 to 72 hours for major leaks/sewage backup; up to 30 days for minor leaks.",
    timelineEs: "24 a 72 horas para fugas graves/drenaje; hasta 30 días para goteos menores.",
    isEmergency: true,
    desc: "Includes broken toilets, sewage backup, lack of hot/cold running water, or severe water leaks.",
    descEs: "Incluye inodoros rotos, reflujo de aguas residuales, falta de agua caliente o fría, o fugas graves de agua.",
    tenantRemedies: [
      "Repair and Deduct: If the landlord fails to act, you may pay a professional plumber and deduct the cost (up to 1 month's rent) from next month's payment (allowed twice a year).",
      "Rent Withholding: You can withhold rent for severe plumbing failures, but this carries legal risk. Put withheld rent in an escrow account.",
      "Constructive Eviction: If uninhabitable, you can terminate the lease and move out immediately without penalty."
    ],
    tenantRemediesEs: [
      "Reparar y Deducir: Si el propietario no actúa, puede pagar a un plomero y deducir el costo (hasta 1 mes de alquiler) del próximo pago (permitido 2 veces al año).",
      "Retención de Alquiler: Puede retener la renta por fallas graves de plomería, pero conlleva riesgos legales. Guarde el dinero en una cuenta de garantía.",
      "Desalojo Constructivo: Si la vivienda es inhabitable, puede dar por terminado el contrato y mudarse inmediatamente sin penalización."
    ],
    landlordObligations: [
      "Maintain hot and cold running water connected to an approved sewage disposal system.",
      "Repair all plumbing facilities to comply with local housing codes.",
      "Do not retaliate against tenants reporting leaks by raising rent or giving notices to vacate."
    ],
    landlordObligationsEs: [
      "Mantener agua corriente fría y caliente conectada a un sistema de alcantarillado aprobado.",
      "Reparar todas las instalaciones de plomería para cumplir con los códigos de vivienda locales.",
      "No tomar represalias contra los inquilinos que reporten fugas aumentando la renta o dando avisos de desalojo."
    ]
  },
  {
    id: "heating",
    name: "Heating & Ventilation",
    nameEs: "Calefacción y Ventilación",
    lawRef: "Cal. Civil Code § 1941.1(a)(4)",
    timeline: "24 to 48 hours in cold weather (temperatures below 50°F); otherwise up to 30 days.",
    timelineEs: "24 a 48 horas en climas fríos (temperaturas menores a 50°F); de lo contrario hasta 30 días.",
    isEmergency: true,
    desc: "Heating facilities must be in good working order. Renting a unit without functional heat is a statutory violation of habitability.",
    descEs: "Las instalaciones de calefacción deben estar en buen estado. Rentar una unidad sin calefacción funcional es una violación legal de habitabilidad.",
    tenantRemedies: [
      "Repair and Deduct: Hire an HVAC tech if the landlord neglects written requests.",
      "Withhold Rent: Only if temperatures make the unit completely uninhabitable."
    ],
    tenantRemediesEs: [
      "Reparar y Deducir: Contrate a un técnico si el propietario ignora las solicitudes escritas.",
      "Retener Renta: Solo si las temperaturas hacen que la unidad sea completamente inhabitable."
    ],
    landlordObligations: [
      "Provide and maintain heating facilities that comply with local building and housing codes.",
      "Respond immediately to complaints of total heater failure during winter months."
    ],
    landlordObligationsEs: [
      "Proporcionar y mantener calefacción en cumplimiento con los códigos locales de construcción.",
      "Responder inmediatamente a quejas de fallas totales de calefacción en los meses de invierno."
    ]
  },
  {
    id: "mold",
    name: "Mold, Dampness & Damp Rot",
    nameEs: "Moho y Humedad Humeda",
    lawRef: "Cal. Health & Safety Code § 17920.3 & Civ Code 1941.1",
    timeline: "14 to 30 days depending on the severity and spread of the mold spore growth.",
    timelineEs: "14 a 30 días dependiendo de la gravedad y propagación de las esporas de moho.",
    isEmergency: false,
    desc: "Visible mold growth or severe dampness caused by waterproofing defects or plumbing leaks that endangers tenant health.",
    descEs: "Crecimiento visible de moho o humedad severa causada por defectos de impermeabilización o fugas que ponen en peligro la salud del inquilino.",
    tenantRemedies: [
      "Notify Code Enforcement: In the Bay Area, you can request a local code inspector (e.g. San Jose Code Enforcement) to issue an official citation to the landlord.",
      "Repair and Deduct: Only for professional mold remediation costs within statutory limits."
    ],
    tenantRemediesEs: [
      "Notificar a Inspectores de Código: Puede solicitar a un inspector local (ej: San José Code Enforcement) que emita una citación oficial al propietario.",
      "Reparar y Deducir: Solo para costos de remediación profesional de moho dentro de los límites legales."
    ],
    landlordObligations: [
      "Remediate mold that exceeds safe exposure limits or is visible on walls/ceilings.",
      "Fix underlying leaks, roof water intrusions, or plumbing issues causing the mold growth."
    ],
    landlordObligationsEs: [
      "Remediar el moho que exceda los límites seguros de exposición o sea visible en paredes/techos.",
      "Reparar las fugas subyacentes, filtraciones en techos o problemas de plomería que causan el moho."
    ]
  },
  {
    id: "electrical",
    name: "Electrical Outlets, Wiring & Lights",
    nameEs: "Tomacorrientes, Cableado y Luces",
    lawRef: "Cal. Civil Code § 1941.1(a)(5)",
    timeline: "24 to 72 hours if electrical failure sparks danger or cuts off power to refrigeration/medical devices.",
    timelineEs: "24 a 72 horas si la falla eléctrica provoca chispas peligrosas o apaga el refrigerador/equipos médicos.",
    isEmergency: true,
    desc: "Includes exposed wires, outlets that don't work, breaker boxes that constantly trip, or total loss of electricity.",
    descEs: "Incluye cables expuestos, enchufes que no funcionan, cajas de fusibles que se disparan constantemente o pérdida total de electricidad.",
    tenantRemedies: [
      "Contact Utility: Verify it's not a grid outage first.",
      "Repair and Deduct: Call an electrician if the landlord fails to address a safety hazard after written notice."
    ],
    tenantRemediesEs: [
      "Contactar a la Compañía Eléctrica: Verifique primero que no sea un apagón de la red.",
      "Reparar y Deducir: Llame a un electricista si el propietario no atiende el peligro tras un aviso por escrito."
    ],
    landlordObligations: [
      "Maintain all electrical wiring, outlets, and lighting systems in safe, functional condition.",
      "Ensure the electrical capacity meets local municipal occupancy standards."
    ],
    landlordObligationsEs: [
      "Mantener todo el cableado eléctrico, tomacorrientes y sistemas de iluminación en condiciones seguras y funcionales.",
      "Asegurar que la capacidad eléctrica cumpla con los estándares locales de ocupación."
    ]
  },
  {
    id: "pests",
    name: "Rodents, Bedbugs & Pests",
    nameEs: "Roedores, Chinches y Plagas",
    lawRef: "Cal. Civil Code § 1941.1(a)(1) & (2)",
    timeline: "14 to 30 days to start treatment or fumigation services.",
    timelineEs: "14 a 30 días para comenzar el tratamiento o servicios de fumigación.",
    isEmergency: false,
    desc: "Infestation of rats, mice, bedbugs, cockroaches, or other pests in the building. Landlord is responsible unless pest introduction is caused by tenant waste.",
    descEs: "Infestación de ratas, ratones, chinches, cucarachas u otras plagas. El propietario es responsable a menos que la plaga sea causada por acumulación de basura del inquilino.",
    tenantRemedies: [
      "Withhold Rent: Only if the infestation is severe enough to cause health department citations.",
      "Filing Petitions: In rent-controlled units (like SF/Oakland), you can petition for a rent reduction for loss of housing services."
    ],
    tenantRemediesEs: [
      "Retener Renta: Solo si la infestación es lo suficientemente grave como para provocar citaciones del departamento de salud.",
      "Presentar Peticiones: En unidades con control de renta, puede solicitar una reducción de renta por pérdida de servicios de vivienda."
    ],
    landlordObligations: [
      "Provide professional extermination and seal pest entry points.",
      "Maintain common areas free of trash and nesting spots."
    ],
    landlordObligationsEs: [
      "Proporcionar exterminación profesional y sellar puntos de entrada de plagas.",
      "Mantener las áreas comunes libres de basura y criaderos de plagas."
    ]
  }
];

export default function RepairsNavigator({ language, role, onTriggerLetter }: RepairsNavigatorProps) {
  const isEs = language === "es";
  const [selectedCatId, setSelectedCatId] = useState<string>("plumbing");
  const [timelineAdded, setTimelineAdded] = useState(false);

  const activeCat = repairCategories.find(c => c.id === selectedCatId) || repairCategories[0];
  const sessionId = getOrCreateSessionId();

  const handleTriggerLetterDraft = () => {
    const details = isEs
      ? `Le escribo para reportar formalmente un problema con la categoría: ${activeCat.nameEs}. Específicamente, el problema es el siguiente: [Describa el daño aquí, ej: goteo constante debajo del fregadero]. Según el Código Civil de California Sección 1941.1, es obligación del arrendador reparar esto. Le pido atentamente programar la reparación dentro del plazo legal aplicable de: ${activeCat.timelineEs}.`
      : `I am writing to formally report an issue regarding ${activeCat.name}. Specifically, the issue is: [Describe the issue here, e.g., the water heater is leaking]. Under California Civil Code Section 1941.1, the landlord is obligated to repair this. Please schedule a repair within the legal timeframe for this category, which is: ${activeCat.timeline}.`;
    
    const subject = isEs 
      ? `SOLICITUD DE REPARACIÓN - ${activeCat.nameEs.toUpperCase()}`
      : `MAINTENANCE REQUEST - ${activeCat.name.toUpperCase()}`;
    
    onTriggerLetter(details, subject);
  };

  const handleAddToTimeline = async () => {
    setTimelineAdded(true);
    const title = isEs ? `Reportó problema de ${activeCat.nameEs}` : `Logged ${activeCat.name} issue`;
    const desc = isEs 
      ? `Identifiqué el problema y le notifiqué al propietario. Plazo legal de respuesta: ${activeCat.timelineEs}`
      : `Identified issues and notified landlord. Legal response window: ${activeCat.timeline}`;

    await saveTimelineEventAction(sessionId, new Date().toISOString().split("T")[0], title, desc, "repair");
    
    setTimeout(() => {
      setTimelineAdded(false);
    }, 2500);
  };

  return (
    <div className="animated-fade-in">
      <div className="card">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Wrench style={{ color: "var(--accent)" }} />
          {isEs ? "Navegador de Obligaciones de Reparación" : "Repair Obligation Navigator"}
        </h2>
        <p>
          {isEs
            ? "Seleccione un problema de mantenimiento para ver las obligaciones legales del arrendador, plazos y sus derechos de habitabilidad según el Código Civil de California."
            : "Select a maintenance issue to view landlord obligations, repair deadlines, and legal tenant remedies under California Civil Code."}
        </p>

        {/* Category Select tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", margin: "16px 0 8px 0", scrollbarWidth: "none" }}>
          {repairCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`tab-btn ${selectedCatId === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCatId(cat.id)}
              style={{ fontSize: "0.8rem", borderRadius: "8px" }}
            >
              {isEs ? cat.nameEs : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* active details card */}
      <div className="card animated-fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <span className={`badge ${activeCat.isEmergency ? "badge-danger" : "badge-warning"}`} style={{ marginBottom: "6px" }}>
              {activeCat.isEmergency 
                ? (isEs ? "Urgencia Habitabilidad" : "Urgent Habitability") 
                : (isEs ? "Estándar" : "Standard Period")}
            </span>
            <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{isEs ? activeCat.nameEs : activeCat.name}</h3>
          </div>
          <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.06)", padding: "4px 8px", borderRadius: "6px", fontFamily: "monospace" }}>
            {activeCat.lawRef}
          </span>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          {isEs ? activeCat.descEs : activeCat.desc}
        </p>

        {/* Timeline block */}
        <div style={{ background: "var(--info-bg)", border: "1px solid var(--info)", borderRadius: "var(--radius-md)", padding: "14px", display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Clock size={20} style={{ color: "var(--info)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-primary)" }}>
              {isEs ? "PLAZO MÁXIMO DE RESPUESTA" : "LEGAL REPAIR TIMELINE"}
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "600", marginTop: "2px" }}>
              {isEs ? activeCat.timelineEs : activeCat.timeline}
            </div>
          </div>
        </div>

        {/* Role specific guidelines */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {role === "tenant" ? (
            <div>
              <h3 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)" }}>
                <ShieldAlert size={16} />
                {isEs ? "Recursos y Opciones del Inquilino" : "Tenant Remedies & Options"}
              </h3>
              <ul style={{ paddingLeft: "20px", marginTop: "8px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px" }}>
                {(isEs ? activeCat.tenantRemediesEs : activeCat.tenantRemedies).map((rem, idx) => (
                  <li key={idx} style={{ lineHeight: "1.4" }}>{rem}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--success)" }}>
                <CheckCircle size={16} />
                {isEs ? "Obligaciones del Propietario" : "Landlord Compliance Requirements"}
              </h3>
              <ul style={{ paddingLeft: "20px", marginTop: "8px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px" }}>
                {(isEs ? activeCat.landlordObligationsEs : activeCat.landlordObligations).map((obl, idx) => (
                  <li key={idx} style={{ lineHeight: "1.4" }}>{obl}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action triggers */}
        <div style={{ display: "flex", gap: "10px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
          {role === "tenant" ? (
            <button 
              onClick={handleTriggerLetterDraft}
              className="btn btn-primary"
              style={{ flex: 1, display: "flex", gap: "6px" }}
            >
              <FileText size={16} />
              {isEs ? "Redactar Solicitud de Reparación" : "Draft Repair Request"}
            </button>
          ) : (
            <button 
              onClick={handleTriggerLetterDraft}
              className="btn btn-primary"
              style={{ flex: 1, display: "flex", gap: "6px" }}
            >
              <FileText size={16} />
              {isEs ? "Redactar Aviso de Reparación" : "Draft Work Schedule Notice"}
            </button>
          )}

          <button 
            onClick={handleAddToTimeline}
            className="btn btn-secondary"
            disabled={timelineAdded}
            style={{ width: "auto", padding: "12px", display: "flex", gap: "6px" }}
          >
            {timelineAdded ? (
              <>
                <CheckCircle size={16} style={{ color: "var(--success)" }} />
                {isEs ? "Registrado" : "Logged"}
              </>
            ) : (
              <>
                <Clock size={16} />
                {isEs ? "Registrar Suceso" : "Log Event"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
