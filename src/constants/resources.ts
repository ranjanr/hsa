export interface ResourceItem {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  phone: string;
  website: string;
  coverage: ("sanjose" | "sf" | "oakland" | "all")[];
  category: "legal" | "financial" | "mediation" | "government";
  address?: string;
}

export const resources: ResourceItem[] = [
  {
    id: "law-foundation",
    name: "Law Foundation of Silicon Valley",
    nameEs: "Fundación Legal del Valle del Silicio",
    description: "Provides free legal advice, representation, and advocacy for Santa Clara County tenants facing eviction, discrimination, or landlord harassment.",
    descriptionEs: "Ofrece asesoramiento legal gratuito, representación y defensa para inquilinos del condado de Santa Clara que enfrentan desalojo, discriminación o acoso del arrendador.",
    phone: "(408) 280-2424",
    website: "https://www.lawfoundation.org",
    coverage: ["sanjose", "all"],
    category: "legal",
    address: "4 N. Second Street, Suite 1300, San Jose, CA 95113",
  },
  {
    id: "sacred-heart",
    name: "Sacred Heart Community Service",
    nameEs: "Servicio Comunitario del Sagrado Corazón",
    description: "Offers financial assistance, emergency rental relief funds, utility payment help, and housing search support for families in Santa Clara County.",
    descriptionEs: "Ofrece asistencia financiera, fondos de alivio de alquiler de emergencia, ayuda con el pago de servicios públicos y apoyo para la búsqueda de vivienda en el condado de Santa Clara.",
    phone: "(408) 278-2160",
    website: "https://sacredheartcs.org",
    coverage: ["sanjose", "all"],
    category: "financial",
    address: "1381 S. First Street, San Jose, CA 95110",
  },
  {
    id: "bay-area-legal-aid",
    name: "Bay Area Legal Aid",
    nameEs: "Ayuda Legal del Área de la Bahía",
    description: "Provides civil legal aid including eviction defense, fair housing advocacy, and tenant rights counseling across multiple Bay Area counties (Santa Clara, SF, Alameda, etc.).",
    descriptionEs: "Brinda ayuda legal civil que incluye defensa contra desalojos, defensa de vivienda justa y asesoramiento sobre derechos de inquilinos en varios condados de la Bahía.",
    phone: "(800) 551-5554",
    website: "https://baylegal.org",
    coverage: ["sanjose", "sf", "oakland", "all"],
    category: "legal",
  },
  {
    id: "project-sentinel",
    name: "Project Sentinel",
    nameEs: "Proyecto Centinela",
    description: "Provides dispute resolution, mediation, tenant-landlord counseling, and fair housing investigation in Santa Clara, San Mateo, and Stanislaus Counties.",
    descriptionEs: "Brinda resolución de disputas, mediación, asesoramiento para inquilinos y propietarios, e investigación de vivienda justa en los condados de Santa Clara, San Mateo y Stanislaus.",
    phone: "(408) 720-9888",
    website: "https://www.housing.org",
    coverage: ["sanjose", "all"],
    category: "mediation",
    address: "298 S. Sunnyvale Ave, Suite 120, Sunnyvale, CA 94086",
  },
  {
    id: "sj-rent-stabilization",
    name: "City of San José Rent Stabilization Program",
    nameEs: "Programa de Estabilización de Alquileres de San José",
    description: "Government agency administering the local Apartment Rent Ordinance (ARO). Provides official information regarding rent increase allowances and ordinance compliance.",
    descriptionEs: "Agencia gubernamental que administra la Ordenanza local de Alquiler de Apartamentos (ARO). Proporciona información oficial sobre aumentos de alquiler permitidos y cumplimiento de la ordenanza.",
    phone: "(408) 975-4480",
    website: "https://www.sanjoseca.gov/your-government/departments-offices/housing/tenants-landlords",
    coverage: ["sanjose"],
    category: "government",
    address: "200 E. Santa Clara St., 12th Floor, San Jose, CA 95113",
  },
  {
    id: "sf-eviction-defense",
    name: "Eviction Defense Collaborative (SF)",
    nameEs: "Colaborativa de Defensa de Desalojo (SF)",
    description: "The primary provider of eviction defense legal services for low-income tenants in San Francisco, offering emergency legal representation and rental assistance counseling.",
    descriptionEs: "El principal proveedor de servicios legales de defensa contra desalojos para inquilinos de bajos ingresos en San Francisco, que ofrece representación legal de emergencia y asesoría en asistencia para el alquiler.",
    phone: "(415) 947-0797",
    website: "https://evictiondefense.org",
    coverage: ["sf"],
    category: "legal",
    address: "1338 Mission Street, 4th Floor, San Francisco, CA 94103",
  },
  {
    id: "centro-legal",
    name: "Centro Legal de la Raza (Oakland)",
    nameEs: "Centro Legal de la Raza (Oakland)",
    description: "Provides legal services including eviction defense, housing clinic consultations, and community advocacy for tenants in Oakland and Alameda County.",
    descriptionEs: "Brinda servicios legales que incluyen defensa contra desalojos, consultas en clínicas de vivienda y defensa comunitaria para inquilinos en Oakland y el condado de Alameda.",
    phone: "(510) 437-1554",
    website: "https://www.centrolegal.org",
    coverage: ["oakland"],
    category: "legal",
    address: "3400 E. 12th Street, Oakland, CA 94601",
  },
  {
    id: "oakland-rap",
    name: "Oakland Rent Adjustment Program (RAP)",
    nameEs: "Programa de Ajuste de Alquileres de Oakland (RAP)",
    description: "Government department managing Oakland's rent stabilization ordinance. Hosts petition filings, rent hearings, and landlord compliance workshops.",
    descriptionEs: "Departamento gubernamental que administra la ordenanza de estabilización de alquileres de Oakland. Alberga presentaciones de peticiones, audiencias de alquiler y talleres de cumplimiento para propietarios.",
    phone: "(510) 238-3721",
    website: "https://www.oaklandca.gov/topics/rent-adjustment-program",
    coverage: ["oakland"],
    category: "government",
    address: "250 Frank H. Ogawa Plaza, Suite 5313, Oakland, CA 94612",
  },
];
