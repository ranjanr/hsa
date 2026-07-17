export interface RentCalculatorInput {
  currentRent: number;
  proposedRent: number;
  propertyType: "apartment" | "duplex" | "condo" | "single_family" | "other";
  constructionYear: number;
  region: "sanjose" | "sf" | "oakland" | "other_ca";
  isCorporateOwned: boolean; // Relevant for single-family/condo AB 1482 exemption
  isLandlordOccupiedDuplex: boolean; // Exemption for duplexes where landlord lives in one unit
}

export interface RentCalculatorOutput {
  isCoveredByLocalRentControl: boolean;
  isCoveredByAB1482: boolean;
  proposedIncreasePercent: number;
  maxAllowedIncreasePercent: number;
  maxAllowedRent: number;
  isLegal: boolean;
  applicableLawName: string;
  explanation: string;
}

export function calculateRentLegality(input: RentCalculatorInput): RentCalculatorOutput {
  const {
    currentRent,
    proposedRent,
    propertyType,
    constructionYear,
    region,
    isCorporateOwned,
    isLandlordOccupiedDuplex,
  } = input;

  const currentYear = 2026;
  const buildingAge = currentYear - constructionYear;

  const proposedIncrease = proposedRent - currentRent;
  const proposedIncreasePercent = parseFloat(((proposedIncrease / currentRent) * 100).toFixed(2));

  let isCoveredByLocalRentControl = false;
  let isCoveredByAB1482 = false;
  let maxAllowedIncreasePercent = 100; // default to no limit if exempt
  let applicableLawName = "Exempt from Rent Caps";
  let explanation = "";

  // 1. Check Local Rent Control Ordinances (Costa-Hawkins exemption for single-family and post-1995 construction)
  if (region === "sanjose") {
    // San Jose Apartment Rent Ordinance (ARO)
    // Applies to apartments (3+ units) built and occupied on or before Sept 7, 1979.
    if (propertyType === "apartment" && constructionYear <= 1979) {
      isCoveredByLocalRentControl = true;
      maxAllowedIncreasePercent = 5.0; // Max 5% annually under San Jose ARO
      applicableLawName = "San José Apartment Rent Ordinance (ARO)";
      explanation = "This property qualifies under the San José Apartment Rent Ordinance (pre-1979 apartments with 3+ units). Landlords are restricted to a maximum 5% rent increase in any 12-month period.";
    }
  } else if (region === "sf") {
    // SF Rent Ordinance
    // Generally applies to multi-unit buildings built before June 13, 1979.
    if (propertyType === "apartment" && constructionYear <= 1979) {
      isCoveredByLocalRentControl = true;
      maxAllowedIncreasePercent = 1.7; // 2026 San Francisco Rent Board cap is approximately 1.7%
      applicableLawName = "San Francisco Rent Ordinance";
      explanation = "This property is subject to the San Francisco Rent Ordinance (pre-1979 multi-unit housing). The standard annual rent increase limit is capped at 1.7% (effective March 2026).";
    }
  } else if (region === "oakland") {
    // Oakland Rent Adjustment Program
    // Generally applies to multi-unit buildings built before Jan 1, 1983.
    if (propertyType === "apartment" && constructionYear <= 1983) {
      isCoveredByLocalRentControl = true;
      maxAllowedIncreasePercent = 2.3; // 2026 Oakland Rent Board cap (based on CPI)
      applicableLawName = "Oakland Rent Adjustment Program (RAP)";
      explanation = "This property is subject to the Oakland Rent Adjustment Program (pre-1983 apartments). The annual allowable rent increase is capped at 2.3% (effective July 2026).";
    }
  }

  // 2. Check Statewide Rent Control (AB 1482 - Tenant Protection Act)
  // If not covered by local rent control, it might be covered by statewide AB 1482.
  if (!isCoveredByLocalRentControl) {
    // AB 1482 applies to properties built more than 15 years ago (built before 2011).
    const isOver15YearsOld = buildingAge >= 15;

    // Check exemptions:
    // - Duplex where landlord lives in one unit
    // - Single-family homes and condos that are NOT corporate-owned (e.g. owned by LLC/Corp)
    const isExemptSingleFamilyOrCondo =
      (propertyType === "single_family" || propertyType === "condo") && !isCorporateOwned;
    
    const isExemptDuplex = propertyType === "duplex" && isLandlordOccupiedDuplex;

    if (isOver15YearsOld && !isExemptSingleFamilyOrCondo && !isExemptDuplex) {
      isCoveredByAB1482 = true;
      // AB 1482 cap is 5% + CPI.
      // For Bay Area (including Santa Clara, San Francisco, Alameda/Oakland) in 2026, the cap is 8.8% (5% + 3.8% CPI)
      // For other regions, it defaults to a standard 8.8% or 10.0% cap
      maxAllowedIncreasePercent = 8.8; 
      applicableLawName = "California Tenant Protection Act of 2019 (AB 1482)";
      explanation = `This property is subject to statewide rent caps under AB 1482 since it is older than 15 years (${buildingAge} years old) and is not corporate-exempt. For the Bay Area, the maximum annual rent increase is capped at 8.8% for the 2026-2027 cycle.`;
    }
  }

  // If exempt from both
  if (!isCoveredByLocalRentControl && !isCoveredByAB1482) {
    applicableLawName = "Exempt from Rent Control";
    explanation = "This property is exempt from state and local rent stabilization laws. This is typically due to newer construction (built within the last 15 years) or being an individually owned single-family home/condo. While there is no specific cap, rent increases over 10% still require a 90-day written notice under California law.";
  }

  const maxAllowedRent = parseFloat((currentRent * (1 + maxAllowedIncreasePercent / 100)).toFixed(2));
  const isLegal = proposedIncreasePercent <= maxAllowedIncreasePercent;

  return {
    isCoveredByLocalRentControl,
    isCoveredByAB1482,
    proposedIncreasePercent,
    maxAllowedIncreasePercent,
    maxAllowedRent,
    isLegal,
    applicableLawName,
    explanation,
  };
}
