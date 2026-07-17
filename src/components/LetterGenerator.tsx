"use client";

import React, { useState, useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";
import { getOrCreateSessionId } from "@/utils/session";
import { saveLetterAction, getLettersAction, deleteLetterAction } from "@/app/dbActions";
import { FileSignature, Copy, Printer, Trash2, Check, FileText } from "lucide-react";

interface LetterGeneratorProps {
  language: "en" | "es";
  role: "tenant" | "landlord";
  initialDetails?: string;
  initialSubject?: string;
}

export default function LetterGenerator({ language, role, initialDetails = "", initialSubject = "" }: LetterGeneratorProps) {
  const isEs = language === "es";
  const { generateLetter } = useGemini();
  const sessionId = getOrCreateSessionId();

  // Form inputs
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [templateType, setTemplateType] = useState("");

  // States
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  // Sync initial inputs if passed from other tabs (like rent calculator)
  useEffect(() => {
    if (initialDetails) {
      setDetails(initialDetails);
      setTemplateType("rent_dispute");
    }
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialDetails, initialSubject]);

  // Load history from database
  const loadHistory = async () => {
    if (!sessionId) return;
    const response = await getLettersAction(sessionId);
    if (response.success && response.data) {
      setHistory(response.data);
      setDbStatus("connected");
    } else {
      const localHist = localStorage.getItem(`hsa_letters_history_${sessionId}`);
      if (localHist) {
        setHistory(JSON.parse(localHist));
      }
      setDbStatus("local");
    }
  };

  useEffect(() => {
    loadHistory();
  }, [sessionId]);

  // Define templates selection
  const templates = role === "tenant" 
    ? [
        { value: "repair_request", label: isEs ? "Solicitud de Reparación (Habitabilidad)" : "Repair Request (Habitability)" },
        { value: "rent_dispute", label: isEs ? "Disputa de Aumento de Alquiler" : "Rent Increase Dispute" },
        { value: "notice_response", label: isEs ? "Respuesta a Aviso de Desalojo" : "Response to Eviction Notice" },
        { value: "deposit_request", label: isEs ? "Devolución de Depósito de Seguridad" : "Security Deposit Return Request" },
      ]
    : [
        { value: "entry_notice", label: isEs ? "Aviso de Entrada a la Propiedad (24 hrs)" : "Notice to Enter Property (24 hrs)" },
        { value: "rent_reminder", label: isEs ? "Recordatorio de Pago de Alquiler" : "Friendly Rent Reminder" },
        { value: "repair_acknowledgement", label: isEs ? "Aviso de Reparación Programada" : "Scheduled Repair Acknowledgement" },
      ];

  const handleTemplateChange = (val: string) => {
    setTemplateType(val);
    if (val === "repair_request") {
      setSubject(isEs ? "SOLICITUD URGENTE DE REPARACIONES - CÓDIGO CIVIL 1941.1" : "URGENT REQUEST FOR REPAIRS - CIVIL CODE 1941.1");
      setDetails(isEs ? "Describa las reparaciones necesarias aquí (ej: fuga de agua en el baño, calefacción descompuesta)..." : "Please fix the leaking pipe in the bathroom/heater is broken. This issue began on [date]...");
    } else if (val === "rent_dispute") {
      setSubject(isEs ? "Aviso de Disputa por Aumento de Alquiler Ilegal" : "Objection to Unlawful Rent Increase Notice");
    } else if (val === "notice_response") {
      setSubject(isEs ? "Respuesta al Aviso Recibido" : "Response to Notice served on [Date]");
      setDetails(isEs ? "Explique su respuesta o plan de pago aquí..." : "Detail your proposal or compliance status here...");
    } else if (val === "deposit_request") {
      setSubject(isEs ? "Devolución de Depósito de Seguridad - Código Civil 1950.5" : "Request for Return of Security Deposit - Civil Code 1950.5");
      setDetails(isEs ? "Mi contrato de alquiler terminó el [fecha]. Solicito el reembolso total del depósito de $ [monto] a mi nueva dirección: [dirección]..." : "My tenancy ended on [date]. I request the full return of my security deposit of $ [amount] to my new forwarding address: [address]...");
    } else if (val === "entry_notice") {
      setSubject(isEs ? "Aviso de 24 Horas para Ingresar a la Propiedad" : "24-Hour Notice of Intent to Enter Premises");
      setDetails(isEs ? "Programado para [Fecha/Hora] para realizar [reparaciones/inspección]..." : "Scheduled for [Date/Time] to perform [repairs/annual inspection]...");
    } else if (val === "rent_reminder") {
      setSubject(isEs ? "Recordatorio de Pago de Alquiler - Unidad [Número]" : "Friendly Rent Payment Reminder - Unit [Number]");
      setDetails(isEs ? "Su alquiler mensual correspondiente a [Mes] aún no ha sido recibido..." : "Your monthly rent for [Month] is outstanding...");
    } else if (val === "repair_acknowledgement") {
      setSubject(isEs ? "Confirmación y Programación de Reparaciones" : "Maintenance Work Scheduled");
      setDetails(isEs ? "Confirmamos el reporte recibido. Un técnico visitará la propiedad el [Fecha/Hora]..." : "Confirming receipt of maintenance report. A technician will visit on [Date/Time]...");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const letterText = await generateLetter({
        type: templateType,
        recipient,
        sender,
        propertyAddress,
        subject,
        details,
      }, language);

      setGeneratedContent(letterText);

      // Save to database/local
      if (dbStatus === "connected") {
        const dbRes = await saveLetterAction(
          sessionId,
          templateType || "custom",
          recipient,
          subject,
          letterText
        );
        if (dbRes.success) {
          loadHistory();
        }
      } else {
        const newHistItem = {
          id: `local_${Date.now()}`,
          type: templateType || "custom",
          recipient,
          subject,
          content: letterText,
          createdAt: new Date().toISOString(),
        };
        const updatedHist = [newHistItem, ...history];
        setHistory(updatedHist);
        localStorage.setItem(`hsa_letters_history_${sessionId}`, JSON.stringify(updatedHist));
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      alert(isEs ? "Error al generar la carta." : "Error generating letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isEs ? "¿Está seguro de eliminar esta carta?" : "Are you sure you want to delete this letter?")) return;

    if (id.startsWith("local_")) {
      const updatedHist = history.filter(item => item.id !== id);
      setHistory(updatedHist);
      localStorage.setItem(`hsa_letters_history_${sessionId}`, JSON.stringify(updatedHist));
    } else {
      const res = await deleteLetterAction(id);
      if (res.success) {
        loadHistory();
      }
    }
  };

  const selectHistoryItem = (item: any) => {
    setGeneratedContent(item.content);
    setSubject(item.subject);
    setRecipient(item.recipient);
  };

  return (
    <div className="animated-fade-in">
      <div className="card no-print">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileSignature style={{ color: "var(--accent)" }} />
          {isEs ? "Generador de Documentos y Cartas" : "Document & Letter Generator"}
        </h2>
        <p>
          {isEs 
            ? "Genere comunicados y solicitudes formales con bases legales para enviar a su arrendador o inquilino."
            : "Draft formal communications and legal requests to send to your landlord or tenant."}
        </p>

        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label">{isEs ? "Seleccionar Plantilla" : "Select Template"}</label>
            <select
              className="form-select"
              value={templateType}
              onChange={(e) => handleTemplateChange(e.target.value)}
              required
            >
              <option value="">-- {isEs ? "Seleccione un escenario" : "Select a scenario"} --</option>
              {templates.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">
                {role === "tenant"
                  ? (isEs ? "Nombre del Arrendador/Propietario" : "Landlord/Manager Name")
                  : (isEs ? "Nombre del Inquilino" : "Tenant Name")}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                {role === "tenant"
                  ? (isEs ? "Su Nombre (Inquilino)" : "Your Name (Tenant)")
                  : (isEs ? "Su Nombre (Arrendador)" : "Your Name (Landlord)")}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="John Smith"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isEs ? "Dirección de la Propiedad" : "Property Address"}</label>
            <input
              type="text"
              className="form-input"
              placeholder="123 Main St, Apt 4, San Jose, CA 95112"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isEs ? "Asunto de la Carta" : "Subject of the Letter"}</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isEs ? "Detalles Adicionales para Incluir" : "Additional Specific Details"}</label>
            <textarea
              className="form-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading 
              ? (isEs ? "Generando Escrito..." : "Generating Document...") 
              : (isEs ? "Generar Carta Personalizada" : "Generate Custom Letter")}
          </button>
        </form>
      </div>

      {/* Generated content display */}
      {generatedContent && (
        <div className="card animated-fade-in" style={{ border: "1px solid var(--accent)", position: "relative" }}>
          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>{isEs ? "Carta Generada" : "Generated Draft"}</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={handleCopy} 
                className="btn btn-secondary" 
                style={{ padding: "8px 12px", width: "auto", fontSize: "0.85rem", display: "flex", gap: "4px" }}
              >
                {copied ? <Check size={14} style={{ color: "var(--success)" }} /> : <Copy size={14} />}
                {copied ? (isEs ? "Copiado" : "Copied") : (isEs ? "Copiar" : "Copy")}
              </button>
              <button 
                onClick={handlePrint} 
                className="btn btn-secondary" 
                style={{ padding: "8px 12px", width: "auto", fontSize: "0.85rem", display: "flex", gap: "4px" }}
              >
                <Printer size={14} />
                {isEs ? "Imprimir" : "Print / PDF"}
              </button>
            </div>
          </div>

          {/* This is the sheet of paper for printing */}
          <div 
            className="letter-paper"
            style={{ 
              background: "#ffffff", 
              color: "#1f2937", 
              padding: "24px", 
              borderRadius: "6px", 
              fontSize: "0.95rem", 
              lineHeight: "1.6", 
              whiteSpace: "pre-wrap", 
              fontFamily: "monospace",
              border: "1px solid #d1d5db",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)"
            }}
          >
            {generatedContent}
          </div>
          
          <p className="no-print" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "12px", fontStyle: "italic" }}>
            {isEs 
              ? "*Revise y firme este documento antes de entregarlo. Puede imprimirlo directamente o guardarlo como PDF usando el botón Imprimir."
              : "*Please read, verify and sign this letter. You can print it or save it as a PDF using the Print button."}
          </p>
        </div>
      )}

      {/* History panel */}
      {history.length > 0 && (
        <div className="card no-print">
          <h3 style={{ fontSize: "1rem", marginBottom: "12px", color: "var(--text-muted)" }}>
            {isEs ? "Cartas y Borradores Guardados" : "Saved Letters & Drafts"}
            {dbStatus === "connected" && (
              <span className="badge badge-success" style={{ marginLeft: "8px", textTransform: "none" }}>
                Cloud Sync
              </span>
            )}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map((item) => (
              <div 
                key={item.id} 
                className="animated-fade-in"
                onClick={() => selectHistoryItem(item)}
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid var(--border-color)", 
                  padding: "12px", 
                  borderRadius: "var(--radius-md)", 
                  cursor: "pointer",
                  transition: "background 0.2s ease" 
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={18} style={{ color: "var(--accent)" }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{item.subject}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {isEs ? "Para" : "To"}: {item.recipient} | {new Date(item.createdAt).toLocaleDateString(isEs ? "es-ES" : "en-US")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "4px" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
