"use client";

import React, { useState, useEffect } from "react";
import { useGemini, NoticeAnalysis } from "@/hooks/useGemini";
import { getOrCreateSessionId } from "@/utils/session";
import { saveNoticeAction, getNoticesAction, deleteNoticeAction } from "@/app/dbActions";
import { AlertTriangle, Calendar, ClipboardCheck, Info, FileText, CheckCircle2, ShieldAlert, Trash2, Clock, Camera, Upload } from "lucide-react";

interface NoticeInterpreterProps {
  language: "en" | "es";
  region: string;
  role: "tenant" | "landlord";
}

export default function NoticeInterpreter({ language, region, role }: NoticeInterpreterProps) {
  const isEs = language === "es";
  const { analyzeNotice } = useGemini();
  
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<NoticeAnalysis | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  // File Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileMimeType, setFileMimeType] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const sessionId = getOrCreateSessionId();

  // Load history from database
  const loadHistory = async () => {
    if (!sessionId) return;
    const response = await getNoticesAction(sessionId);
    if (response.success && response.data) {
      setHistory(response.data);
      setDbStatus("connected");
    } else {
      // Fallback: local storage history
      const localHist = localStorage.getItem(`hsa_notices_history_${sessionId}`);
      if (localHist) {
        setHistory(JSON.parse(localHist));
      }
      setDbStatus("local");
    }
  };

  useEffect(() => {
    loadHistory();
  }, [sessionId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Get base64 data by removing "data:image/png;base64," etc.
      const base64Data = base64String.split(",")[1];
      setFileBase64(base64Data);
      
      if (file.type.startsWith("image/")) {
        setPreviewUrl(base64String);
      } else {
        setPreviewUrl(""); // No preview for PDFs
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileBase64("");
    setFileMimeType("");
    setPreviewUrl("");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    setLoading(true);
    try {
      const fileData = selectedFile ? { data: fileBase64, mimeType: fileMimeType } : undefined;
      const result = await analyzeNotice(inputText, region, fileData);
      setActiveAnalysis(result);

      // Save to history
      const savedContent = inputText.trim() || (selectedFile ? `[Uploaded File: ${selectedFile.name}]` : "");
      
      if (dbStatus === "connected") {
        const dbResponse = await saveNoticeAction(
          sessionId,
          result.noticeType,
          savedContent,
          result
        );
        if (dbResponse.success) {
          loadHistory();
        }
      } else {
        // Fallback local save
        const newHistItem = {
          id: `local_${Date.now()}`,
          title: result.noticeType,
          content: savedContent,
          metadata: result,
          createdAt: new Date().toISOString(),
        };
        const updatedHist = [newHistItem, ...history];
        setHistory(updatedHist);
        localStorage.setItem(`hsa_notices_history_${sessionId}`, JSON.stringify(updatedHist));
      }

      // Cleanup uploads on success
      handleRemoveFile();
    } catch (error) {
      console.error("Error analyzing notice:", error);
      alert(isEs ? "Error al analizar el aviso. Intente nuevamente." : "Error analyzing notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isEs ? "¿Está seguro de eliminar este aviso?" : "Are you sure you want to delete this notice?")) return;

    if (id.startsWith("local_")) {
      const updatedHist = history.filter(item => item.id !== id);
      setHistory(updatedHist);
      localStorage.setItem(`hsa_notices_history_${sessionId}`, JSON.stringify(updatedHist));
    } else {
      const res = await deleteNoticeAction(id);
      if (res.success) {
        loadHistory();
      }
    }
  };

  const selectHistoryItem = (item: any) => {
    setActiveAnalysis(item.metadata);
    setInputText(item.content);
  };

  // Determine deadline urgency style
  const getUrgencyClass = (days: number) => {
    if (days <= 3) return "badge-danger";
    if (days <= 15) return "badge-warning";
    return "badge-success";
  };

  return (
    <div className="animated-fade-in">
      <div className="card">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldAlert style={{ color: "var(--accent)" }} />
          {role === "tenant"
            ? (isEs ? "Intérprete de Avisos de Desalojo" : "Notice Interpreter for Tenants")
            : (isEs ? "Verificador de Cumplimiento de Avisos" : "Landlord Notice Compliance Auditor")
          }
        </h2>
        <p>
          {role === "tenant"
            ? (isEs 
                ? "Suba una foto/PDF de su aviso de desalojo, o pegue el texto, para evaluar sus plazos legales y detectar posibles fallas en su redacción."
                : "Upload a camera photo/PDF of your notice, or paste the text directly, to check response timelines and identify potential legal defects.")
            : (isEs
                ? "Suba una foto/PDF de su aviso para verificar si cumple con el texto legal obligatorio de California o las ordenanzas locales (ej: San José ARO)."
                : "Upload a photo/PDF of your notice to ensure it complies with required California state text or local ordinances (e.g. San Jose ARO).")
          }
        </p>

        <form onSubmit={handleAnalyze}>
          {/* File Upload / Camera Trigger Container */}
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{isEs ? "Tomar Foto / Cargar Archivo (PDF/Imagen)" : "Take Photo / Upload Document (PDF/Image)"}</span>
              {selectedFile && (
                <button 
                  type="button" 
                  onClick={handleRemoveFile} 
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}
                >
                  {isEs ? "Quitar Archivo" : "Remove File"}
                </button>
              )}
            </label>
            
            {!selectedFile ? (
              <label 
                htmlFor="file-upload" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  padding: "24px", 
                  border: "2px dashed var(--border-color)", 
                  borderRadius: "var(--radius-md)", 
                  cursor: "pointer",
                  background: "var(--input-bg)",
                  transition: "border-color 0.2s ease"
                }}
              >
                <div style={{ display: "flex", gap: "10px", color: "var(--accent)", marginBottom: "8px" }}>
                  <Camera size={24} />
                  <Upload size={24} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                  {isEs ? "Haga clic para tomar foto o elegir archivo" : "Click to capture image or browse file"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  PNG, JPG, WEBP, PDF (Max 5MB)
                </span>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px", 
                  padding: "12px", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "var(--radius-md)" 
                }}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Notice preview" 
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-color)" }} 
                  />
                ) : (
                  <div style={{ width: "50px", height: "50px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={22} style={{ color: "var(--accent)" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {isEs 
                ? "O pegue el texto escrito aquí (Opcional si cargó archivo)" 
                : "Or paste notice text here (Optional if file uploaded)"}
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: "100px" }}
              placeholder={isEs ? "Pegue o escriba el contenido del documento aquí..." : "Paste or type the document text here..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required={!selectedFile}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading 
              ? (isEs ? "Analizando Documento..." : "Analyzing Document...") 
              : (isEs ? "Escanear y Validar Aviso" : "Scan & Validate Notice")}
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {activeAnalysis && (
        <div className="card animated-fade-in" style={{ border: "1px solid var(--accent)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <span className={`badge ${getUrgencyClass(activeAnalysis.daysRemaining)}`} style={{ marginBottom: "6px" }}>
                <Clock size={12} style={{ marginRight: "4px" }} />
                {activeAnalysis.daysRemaining <= 0 
                  ? (isEs ? "Vencido / Plazo cumplido" : "Deadline Passed")
                  : `${activeAnalysis.daysRemaining} ${isEs ? "días restantes" : "days remaining"}`}
              </span>
              <h3 style={{ fontSize: "1.2rem", margin: "4px 0" }}>{activeAnalysis.noticeType}</h3>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px", background: "rgba(0,0,0,0.15)", padding: "12px", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "FECHA DE EMISIÓN" : "DATE ISSUED"}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                <Calendar size={14} style={{ color: "var(--accent)" }} />
                {activeAnalysis.issueDate}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "FECHA LÍMITE LEGAL" : "LEGAL DEADLINE"}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: "700", color: activeAnalysis.daysRemaining <= 3 ? "var(--danger)" : "var(--accent)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                <Calendar size={14} />
                {activeAnalysis.deadlineDate}
              </span>
            </div>
            {activeAnalysis.rentOwed > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gridColumn: "span 2", borderTop: "1px solid var(--border-color)", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {isEs ? "MONTO DE ALQUILER EXIGIDO" : "DEMANDED RENT AMOUNT"}
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--warning)", marginTop: "2px" }}>
                  ${activeAnalysis.rentOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "INQUILINO" : "TENANT"}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{activeAnalysis.tenantName}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {isEs ? "ARRENDADOR" : "LANDLORD"}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{activeAnalysis.landlordName}</span>
            </div>
          </div>

          {/* Compliance Audit Section */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--danger)" }}>
              <AlertTriangle size={16} />
              {isEs ? "Auditoría de Cumplimiento Legal" : "Legal Compliance Audit"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {activeAnalysis.complianceIssues.map((issue, idx) => (
                <div key={idx} className="alert alert-danger" style={{ margin: 0, padding: "8px 12px" }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div>
            <h3 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--success)" }}>
              <ClipboardCheck size={16} />
              {isEs ? "Pasos de Acción Recomendados" : "Recommended Action Steps"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}>
              {activeAnalysis.actionChecklist.map((step, idx) => (
                <div key={idx} className="checklist-item">
                  <CheckCircle2 size={16} className="checklist-check" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ marginTop: "20px" }}
            onClick={() => setActiveAnalysis(null)}
          >
            {isEs ? "Analizar Otro Documento" : "Analyze Another Document"}
          </button>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: "12px", color: "var(--text-muted)" }}>
            {isEs ? "Historial de Análisis Guardados" : "Saved Analysis History"}
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
                    <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(item.createdAt).toLocaleDateString(isEs ? "es-ES" : "en-US", { hour: "2-digit", minute: "2-digit" })}
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
