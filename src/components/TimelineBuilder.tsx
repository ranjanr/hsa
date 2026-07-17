"use client";

import React, { useState, useEffect } from "react";
import { getOrCreateSessionId } from "@/utils/session";
import { saveTimelineEventAction, getTimelineEventsAction, deleteTimelineEventAction } from "@/app/dbActions";
import { Calendar, Trash2, Printer, PlusCircle, Clock, FileText, CheckCircle } from "lucide-react";

interface TimelineBuilderProps {
  language: "en" | "es";
}

export default function TimelineBuilder({ language }: TimelineBuilderProps) {
  const isEs = language === "es";
  const sessionId = getOrCreateSessionId();

  // Form states
  const [eventDate, setEventDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("communication");

  // States
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  // Sync current date by default
  useEffect(() => {
    setEventDate(new Date().toISOString().split("T")[0]);
  }, []);

  const loadEvents = async () => {
    if (!sessionId) return;
    const response = await getTimelineEventsAction(sessionId);
    if (response.success && response.data) {
      setEvents(response.data);
      setDbStatus("connected");
    } else {
      const localEvents = localStorage.getItem(`hsa_timeline_${sessionId}`);
      if (localEvents) {
        setEvents(JSON.parse(localEvents));
      }
      setDbStatus("local");
    }
  };

  useEffect(() => {
    loadEvents();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    setLoading(true);
    try {
      if (dbStatus === "connected") {
        const res = await saveTimelineEventAction(
          sessionId,
          eventDate,
          title,
          description,
          category
        );
        if (res.success) {
          loadEvents();
        }
      } else {
        const newEvent = {
          id: `local_${Date.now()}`,
          eventDate,
          title,
          description,
          category,
          createdAt: new Date().toISOString(),
        };
        // Sort chronologically desc
        const updatedEvents = [newEvent, ...events].sort(
          (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
        setEvents(updatedEvents);
        localStorage.setItem(`hsa_timeline_${sessionId}`, JSON.stringify(updatedEvents));
      }

      // Reset form fields (except date)
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error saving timeline event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isEs ? "¿Está seguro de eliminar este evento?" : "Are you sure you want to delete this event?")) return;

    if (id.startsWith("local_")) {
      const updatedEvents = events.filter(e => e.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem(`hsa_timeline_${sessionId}`, JSON.stringify(updatedEvents));
    } else {
      const res = await deleteTimelineEventAction(id);
      if (res.success) {
        loadEvents();
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "notice": return "var(--danger)";
      case "repair": return "var(--warning)";
      case "payment": return "var(--success)";
      case "communication": return "var(--info)";
      default: return "var(--accent)";
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (isEs) {
      switch (cat) {
        case "notice": return "Aviso Oficial";
        case "repair": return "Reparación/Daño";
        case "payment": return "Pago/Recibo";
        case "communication": return "Comunicación";
        default: return "Otro";
      }
    }
    switch (cat) {
      case "notice": return "Official Notice";
      case "repair": return "Repair/Habitability";
      case "payment": return "Payment/Receipt";
      case "communication": return "Communication";
      default: return "Other";
    }
  };

  return (
    <div className="animated-fade-in">
      <div className="card no-print">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock style={{ color: "var(--accent)" }} />
          {isEs ? "Constructor de Línea de Tiempo" : "Documentation Timeline Builder"}
        </h2>
        <p>
          {isEs
            ? "Registre interacciones, avisos y solicitudes con su arrendador de manera cronológica. Esto genera una bitácora imprimible y organizada, ideal para presentar ante ayuda legal o mediadores."
            : "Keep a chronological log of water leaks, repair requests, notice serving, and payments. This builds an organized, printable timeline to present to legal aid or mediation boards."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">{isEs ? "Fecha del Evento" : "Date of Event"}</label>
              <input
                type="date"
                className="form-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isEs ? "Categoría" : "Category"}</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="communication">{isEs ? "Comunicación (Llamada/Mensaje)" : "Communication (Text/Call)"}</option>
                <option value="notice">{isEs ? "Aviso Oficial Escrito" : "Official Written Notice"}</option>
                <option value="repair">{isEs ? "Reporte de Reparación / Avería" : "Repair Issue / Leak"}</option>
                <option value="payment">{isEs ? "Pago de Alquiler / Transacción" : "Rent Payment / Transaction"}</option>
                <option value="other">{isEs ? "Otro Suceso" : "Other Event"}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isEs ? "Título del Suceso" : "Event Title"}</label>
            <input
              type="text"
              className="form-input"
              placeholder={isEs ? "Ej: Reporté fuga de agua por mensaje de texto" : "e.g. Reported leak in kitchen by text message"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isEs ? "Descripción o Notas Adicionales" : "Description / Notes"}</label>
            <textarea
              className="form-textarea"
              placeholder={isEs ? "Escriba detalles, testigos, o respuestas recibidas..." : "Detail what happened, responses, or follow-ups..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: "flex", gap: "6px" }}>
            <PlusCircle size={18} />
            {isEs ? "Agregar a la Bitácora" : "Add to Timeline"}
          </button>
        </form>
      </div>

      {/* Render the timeline */}
      {events.length > 0 ? (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>
              {isEs ? "Bitácora Cronológica de Hechos" : "Chronological Evidence Log"}
              {dbStatus === "connected" && (
                <span className="badge badge-success" style={{ marginLeft: "8px", textTransform: "none" }}>
                  Cloud Sync
                </span>
              )}
            </h3>
            <button 
              onClick={handlePrint}
              className="btn btn-secondary no-print"
              style={{ width: "auto", padding: "8px 12px", fontSize: "0.85rem", display: "flex", gap: "4px" }}
            >
              <Printer size={14} />
              {isEs ? "Imprimir Bitácora" : "Print Log"}
            </button>
          </div>

          {/* Printable custom header */}
          <div className="print-only" style={{ marginBottom: "24px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
            <h1 style={{ color: "#000000", fontSize: "20pt", margin: 0 }}>
              {isEs ? "Línea de Tiempo de Vivienda" : "Housing Tenancy Timeline Log"}
            </h1>
            <p style={{ color: "#666", fontSize: "10pt", margin: "4px 0 0 0" }}>
              {isEs 
                ? `Generado por Asistente de Estabilidad de Vivienda. ID de Sesión: ${sessionId}`
                : `Generated by Rent & Housing Stability Assistant. Session ID: ${sessionId}`}
            </p>
          </div>

          <div className="timeline">
            {events.map((event) => (
              <div key={event.id} className="timeline-item animated-fade-in">
                <div 
                  className="timeline-marker" 
                  style={{ background: getCategoryColor(event.category) }} 
                />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="timeline-date" style={{ color: getCategoryColor(event.category) }}>
                      {event.eventDate} — <span style={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "700" }}>{getCategoryLabel(event.category)}</span>
                    </div>
                    <div className="timeline-title">{event.title}</div>
                    {event.description && <div className="timeline-desc" style={{ marginTop: "4px", fontSize: "0.85rem" }}>{event.description}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="no-print"
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "4px", alignSelf: "flex-start" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card no-print" style={{ textAlign: "center", padding: "30px", borderStyle: "dashed" }}>
          <FileText size={40} style={{ color: "var(--text-muted)", marginBottom: "12px", opacity: 0.6 }} />
          <h3 style={{ margin: 0 }}>{isEs ? "No hay sucesos registrados" : "No timeline events logged yet"}</h3>
          <p style={{ fontSize: "0.85rem" }}>
            {isEs 
              ? "Use el formulario anterior para empezar a construir la cronología de su caso." 
              : "Use the form above to start documenting key events for your housing file."}
          </p>
        </div>
      )}
    </div>
  );
}
