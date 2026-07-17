"use client";

import React, { useState } from "react";
import { resources, ResourceItem } from "@/constants/resources";
import { Info, Phone, Globe, MapPin, Search, Landmark, Scale, HelpCircle, Coins } from "lucide-react";

interface ResourceNavigatorProps {
  language: "en" | "es";
  region: string;
}

export default function ResourceNavigator({ language, region }: ResourceNavigatorProps) {
  const isEs = language === "es";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (cat: string) => setSelectedCategory(cat);
  const handleLocationChange = (loc: string) => setSelectedLocation(loc);

  // Filter logic
  const filteredResources = resources.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    // Check regional coverage matches
    const matchesLocation =
      selectedLocation === "all" ||
      item.coverage.includes(selectedLocation as any) ||
      item.coverage.includes("all");

    // Search query matches
    const nameToSearch = isEs ? item.nameEs.toLowerCase() : item.name.toLowerCase();
    const descToSearch = isEs ? item.descriptionEs.toLowerCase() : item.description.toLowerCase();
    const matchesSearch =
      nameToSearch.includes(searchTerm.toLowerCase()) ||
      descToSearch.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesSearch;
  });

  const getCategoryIcon = (category: ResourceItem["category"]) => {
    switch (category) {
      case "legal":
        return <Scale size={20} style={{ color: "var(--accent)" }} />;
      case "financial":
        return <Coins size={20} style={{ color: "var(--success)" }} />;
      case "mediation":
        return <HelpCircle size={20} style={{ color: "var(--info)" }} />;
      case "government":
        return <Landmark size={20} style={{ color: "var(--warning)" }} />;
    }
  };

  return (
    <div className="animated-fade-in">
      <div className="card">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Landmark style={{ color: "var(--accent)" }} />
          {isEs ? "Directorio de Ayuda y Recursos" : "Assistance Program Navigator"}
        </h2>
        <p>
          {isEs
            ? "Encuentre asesoría legal gratuita, fondos de ayuda de alquiler para emergencias, mediadores comunitarios y oficinas de estabilización en el Área de la Bahía."
            : "Connect with local Bay Area legal aid organizations, rent relief programs, mediation resources, and housing stabilization boards."}
        </p>

        {/* Search Input */}
        <div className="form-group" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "38px" }}
            placeholder={isEs ? "Buscar recursos por nombre o descripción..." : "Search resources by name or description..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
        </div>

        {/* Filters Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
          <div className="form-group">
            <label className="form-label">{isEs ? "Filtrar por Región" : "Filter by Location"}</label>
            <select
              className="form-select"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="all">{isEs ? "Todo el Área de la Bahía" : "All Bay Area"}</option>
              <option value="sanjose">San José / Santa Clara</option>
              <option value="sf">San Francisco</option>
              <option value="oakland">Oakland / Alameda</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{isEs ? "Filtrar por Categoría" : "Filter by Category"}</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="all">{isEs ? "Todas las categorías" : "All categories"}</option>
              <option value="legal">{isEs ? "Ayuda Legal y Defensa" : "Legal Aid & Eviction Defense"}</option>
              <option value="financial">{isEs ? "Asistencia Financiera / Alivio de Alquiler" : "Financial Relief / Rental Aid"}</option>
              <option value="mediation">{isEs ? "Mediación y Resolución de Conflictos" : "Mediation & Counseling"}</option>
              <option value="government">{isEs ? "Oficinas de Gobierno / Rent Boards" : "Government Agencies & Boards"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Listings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredResources.length > 0 ? (
          filteredResources.map((item) => (
            <div key={item.id} className="card animated-fade-in" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px", borderRadius: "var(--radius-md)" }}>
                  {getCategoryIcon(item.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1rem", margin: 0 }}>
                    {isEs ? item.nameEs : item.name}
                  </h3>
                  <span className="badge badge-info" style={{ marginTop: "4px", fontSize: "0.65rem", padding: "2px 6px" }}>
                    {item.category}
                  </span>
                  
                  <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {isEs ? item.descriptionEs : item.description}
                  </p>

                  {/* Resource Contacts */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "0.85rem" }}>
                    <a 
                      href={`tel:${item.phone.replace(/[^0-9]/g, "")}`} 
                      style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", textDecoration: "none" }}
                    >
                      <Phone size={14} />
                      {item.phone}
                    </a>
                    <a 
                      href={item.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", textDecoration: "none" }}
                    >
                      <Globe size={14} />
                      {item.website.replace("https://", "")}
                    </a>
                    {item.address && (
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", textDecoration: "none" }}
                      >
                        <MapPin size={14} />
                        {item.address}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "24px" }}>
            <Info size={32} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
            <h3 style={{ margin: 0 }}>{isEs ? "No se encontraron recursos" : "No resources found"}</h3>
            <p style={{ fontSize: "0.85rem" }}>
              {isEs 
                ? "Pruebe ajustando sus criterios de búsqueda o filtros de región/categoría." 
                : "Try adjusting your search criteria or modifying your filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
