import { KeyTerm } from "@/components/KeyTerms";

/**
 * Key terms for each calculator, keyed by calculator slug.
 * These appear in the collapsible "Key Terms & Concepts" panel.
 */

export const keyTerms: Record<string, { standard?: string; terms: KeyTerm[] }> = {
  "rational-method": {
    standard: "MSMA 2nd Edition",
    terms: [
      {
        term: "Runoff Coefficient (C)",
        definition:
          "A dimensionless factor (0–1) representing the fraction of rainfall that becomes surface runoff. Higher values indicate more impervious surfaces.",
        msContext:
          "MSMA Table 2.1 provides C values for Malaysian land use types. Residential: 0.40–0.70, Commercial: 0.80–0.95, Forest: 0.10–0.30.",
      },
      {
        term: "Rainfall Intensity (i)",
        definition:
          "The rate of rainfall measured in mm/hr for a given storm duration and return period (ARI). Obtained from IDF curves specific to the rainfall station.",
        msContext:
          "Use MSMA Appendix 2.B or DID HP1 IDF parameters for your nearest rainfall station in Malaysia.",
      },
      {
        term: "Average Recurrence Interval (ARI)",
        definition:
          "The average time between rainfall events of a given intensity. Common design ARIs: 2yr for minor drains, 10yr for major drains, 100yr for flood protection.",
        msContext:
          "Malaysian practice: minor system = 10yr ARI, major system = 100yr ARI per MSMA Chapter 2.",
      },
      {
        term: "Catchment Area (A)",
        definition:
          "The total land area (in hectares) that drains to a given outlet point. The Rational Method is typically valid for catchments up to 80 ha.",
      },
    ],
  },

  "time-of-concentration": {
    standard: "MSMA 2nd Edition",
    terms: [
      {
        term: "Time of Concentration (tc)",
        definition:
          "The time required for runoff to travel from the hydraulically most distant point in the catchment to the outlet. Used to determine rainfall intensity from IDF curves.",
        msContext: "MSMA specifies a minimum tc of 5 minutes (Clause 2.4.3).",
      },
      {
        term: "Overland Flow Time (to)",
        definition:
          "The time taken for sheet flow to travel across a surface before it enters a defined channel or drain. Calculated using Friend's formula.",
        msContext:
          "MSMA limits overland flow path length: max 50m on steep terrain (>10%) and 100m on gentle slopes.",
      },
      {
        term: "Manning's Roughness (n)",
        definition:
          "A coefficient that represents the surface resistance to flow. Higher values mean rougher surfaces that slow the flow. Ranges from 0.01 (smooth concrete) to 0.80 (dense vegetation).",
      },
      {
        term: "Drain Flow Time (td)",
        definition:
          "The travel time for water flowing through a defined drain or channel to reach the outlet. Calculated as drain length divided by flow velocity.",
      },
    ],
  },

  "idf-curve": {
    standard: "MSMA 2nd Edition / DID HP1",
    terms: [
      {
        term: "IDF Curve",
        definition:
          "Intensity-Duration-Frequency curve — a graphical relationship showing how rainfall intensity varies with storm duration for different return periods (ARI).",
        msContext:
          "MSMA Appendix 2.B provides IDF fitting constants (λ, κ, θ, η) for rainfall stations across Malaysia.",
      },
      {
        term: "ARI (Average Recurrence Interval)",
        definition:
          "The expected average time between exceedances of a given rainfall event. A 100-year ARI has a 1% chance of being exceeded in any given year.",
      },
      {
        term: "Storm Duration",
        definition:
          "The length of a rainfall event, typically set equal to the time of concentration (tc) of the catchment for peak flow calculations.",
      },
      {
        term: "IDF Constants (λ, κ, θ, η)",
        definition:
          "Empirical fitting parameters derived from rainfall analysis. They define the shape of the IDF curve for a specific location.",
        msContext:
          "Different rainfall stations in Malaysia have different constants. Always verify using the latest DID/MSMA publications.",
      },
    ],
  },

  "drain-sizing": {
    standard: "MSMA 2nd Edition",
    terms: [
      {
        term: "Manning's Equation",
        definition:
          "An empirical formula Q = (1/n)·A·R^(2/3)·S^(1/2) used to calculate flow capacity of open channels based on shape, roughness, and slope.",
      },
      {
        term: "Hydraulic Radius (R)",
        definition:
          "The ratio of flow cross-sectional area (A) to wetted perimeter (P). A key parameter in Manning's equation: R = A/P.",
      },
      {
        term: "Freeboard",
        definition:
          "The vertical distance between the water surface and the top of the drain. Provides safety against overtopping.",
        msContext:
          "MSMA recommends minimum 150mm freeboard for lined drains and 300mm for earth drains.",
      },
      {
        term: "Self-Cleansing Velocity",
        definition:
          "The minimum flow velocity required to prevent sediment deposition in a drain. Typically 0.6–0.9 m/s.",
        msContext:
          "MSMA requires minimum velocity of 0.6 m/s at partial flow to maintain self-cleansing.",
      },
    ],
  },

  "culvert-design": {
    standard: "MSMA 2nd Edition / REAM Vol 4",
    terms: [
      {
        term: "Culvert",
        definition:
          "A closed conduit (pipe or box) that conveys water under a road, railway, or embankment. Sized to pass the design flow without excessive headwater.",
      },
      {
        term: "Headwater (HW)",
        definition:
          "The depth of water upstream of the culvert inlet. Must not exceed acceptable levels relative to road formation or surrounding properties.",
        msContext:
          "REAM guidelines specify maximum headwater depth = 1.2× culvert height for inlet control conditions.",
      },
      {
        term: "Inlet Control vs Outlet Control",
        definition:
          "Inlet control: capacity governed by entrance geometry. Outlet control: capacity governed by barrel friction, length, and tailwater. Design uses the more conservative result.",
      },
      {
        term: "Number of Barrels",
        definition:
          "Multiple parallel culvert barrels used when a single barrel cannot provide enough capacity or when the crossing width is limited.",
      },
    ],
  },

  "detention-pond": {
    standard: "MSMA 2nd Edition, Chapter 5",
    terms: [
      {
        term: "On-Site Detention (OSD)",
        definition:
          "A stormwater management approach that temporarily stores runoff on-site so that post-development peak flows do not exceed pre-development levels.",
        msContext:
          "MSMA Chapter 5 requires OSD for developments that increase impervious area. Mandatory for most new developments in Malaysia.",
      },
      {
        term: "Permissible Site Discharge (PSD)",
        definition:
          "The maximum flow rate allowed from a development site, typically equal to the pre-development peak flow rate.",
      },
      {
        term: "Pre-Development vs Post-Development",
        definition:
          "Pre-development: the natural state of the land (lower C values). Post-development: after construction (higher C values due to more impervious surfaces).",
      },
      {
        term: "Critical Storm Duration",
        definition:
          "The storm duration that produces the maximum required storage volume. Found by testing multiple durations — not always equal to tc.",
      },
    ],
  },

  "cut-fill-volume": {
    standard: "JKR Earthworks Manual",
    terms: [
      {
        term: "Average End Area Method",
        definition:
          "A volume calculation method: V = (L/2)×(A1 + A2), where A1 and A2 are cross-section areas at two stations separated by distance L. Simple but slightly overestimates volume.",
      },
      {
        term: "Prismoidal Formula",
        definition:
          "A more accurate method: V = (L/6)×(A1 + 4Am + A2), where Am is the area of the mid-section. Reduces overestimation of the end-area method.",
      },
      {
        term: "Cut and Fill",
        definition:
          "Cut: excavation of earth to lower ground level. Fill: placement of earth to raise ground level. Mass haul diagrams track cumulative cut/fill along a route.",
      },
      {
        term: "Bulking & Shrinkage Factor",
        definition:
          "Bulking: excavated soil occupies more volume than in-situ. Shrinkage: compacted fill occupies less. Typical shrinkage factor for Malaysian laterite: 0.85–0.90.",
      },
    ],
  },

  "slope-gradient": {
    standard: "JKR Guidelines",
    terms: [
      {
        term: "Slope Ratio (H:V)",
        definition:
          "Expressed as horizontal distance to vertical rise. A 2:1 slope means 2m horizontal for every 1m vertical. Steeper slopes have lower ratios.",
        msContext:
          "JKR typical cut slopes: 1:1 to 2:1. Fill slopes: 2:1 to 3:1 depending on soil type and height.",
      },
      {
        term: "Batter",
        definition:
          "The sloped face of an embankment or cutting. The angle or ratio of the batter is critical for stability.",
      },
      {
        term: "Factor of Safety (FOS)",
        definition:
          "The ratio of resisting forces to driving forces on a slope. FOS > 1.0 indicates stability. Malaysian standards typically require FOS ≥ 1.4 for permanent slopes.",
      },
    ],
  },

  "compaction-check": {
    standard: "JKR Standard Specification",
    terms: [
      {
        term: "Maximum Dry Density (MDD)",
        definition:
          "The highest dry density achievable for a soil at its Optimum Moisture Content (OMC), determined by the Proctor compaction test in the lab.",
      },
      {
        term: "Optimum Moisture Content (OMC)",
        definition:
          "The water content at which a soil achieves its maximum dry density under a given compactive effort.",
      },
      {
        term: "Compaction Percentage",
        definition:
          "The ratio of field dry density to lab MDD, expressed as a percentage. Used to verify that field compaction meets design specifications.",
        msContext:
          "JKR requirements: ≥95% for subgrade, ≥98% for sub-base, ≥100% for road base.",
      },
      {
        term: "Sand Replacement Test",
        definition:
          "A field test to determine in-situ dry density by excavating a hole and measuring the volume using calibrated sand. Common method in Malaysian earthworks QC.",
      },
    ],
  },

  "pavement-design": {
    standard: "JKR ATJ 5/85",
    terms: [
      {
        term: "ESAL (Equivalent Standard Axle Load)",
        definition:
          "The cumulative number of standard 80kN single axle loads expected during the design period. Used to categorize traffic loading for pavement design.",
      },
      {
        term: "Truck Factor (TF)",
        definition:
          "The damage factor per commercial vehicle, converting actual axle loads to equivalent standard axle loads. Depends on vehicle type and load.",
        msContext:
          "JKR ATJ 5/85 Table 2 provides typical truck factors for Malaysian vehicle classes.",
      },
      {
        term: "CBR (California Bearing Ratio)",
        definition:
          "A measure of subgrade soil strength. The ratio of force required to penetrate a soil sample vs. standard crushed stone, expressed as a percentage.",
        msContext:
          "JKR requires soaked 4-day CBR values for pavement design. Typical Malaysian soils: 3–8% (soft clay) to 20–30% (laterite).",
      },
      {
        term: "Traffic Category (TC)",
        definition:
          "JKR classification of road traffic loading from TC1 (lightest) to TC7 (heaviest). Determines the pavement layer thicknesses from the JKR design catalogue.",
      },
    ],
  },

  "sewer-sizing": {
    standard: "MSIG / SPAN UTG",
    terms: [
      {
        term: "Population Equivalent (PE)",
        definition:
          "A measure of sewage load. 1 PE = the average daily sewage contribution of one person. Used to estimate design flows.",
        msContext:
          "MSIG uses PE to size sewer systems. Residential: 1 PE/person. Commercial and industrial have different PE conversion rates.",
      },
      {
        term: "Peak Factor (Harmon's Formula)",
        definition:
          "A multiplier applied to average dry weather flow to account for peak hourly flow variations. Smaller populations have higher peak factors.",
      },
      {
        term: "Dry Weather Flow (DWF)",
        definition:
          "The average sewage flow rate without infiltration or rainfall inflow. DWF = PE × per capita flow / 86400.",
      },
      {
        term: "Infiltration Allowance",
        definition:
          "An additional flow allowance for groundwater seeping into sewer joints and cracks. Added to peak DWF for pipe sizing.",
        msContext:
          "MSIG allows 0.05 L/s per mm pipe diameter per km of sewer length as infiltration allowance.",
      },
    ],
  },

  "load-takeoff": {
    standard: "MS EN 1991-1-1 (EC1)",
    terms: [
      {
        term: "Dead Load (Gk)",
        definition:
          "Permanent loads from self-weight of structural elements and fixed finishes. Concrete density: 25 kN/m³ per MS EN 1991-1-1.",
      },
      {
        term: "Imposed Load (Qk)",
        definition:
          "Variable loads from occupancy and use. Values depend on building category (residential, office, etc.).",
        msContext:
          "Malaysia NA values: Residential 1.5 kN/m², Office 2.5–3.0 kN/m², Retail 4.0 kN/m².",
      },
      {
        term: "ULS Load Combination",
        definition:
          "Ultimate Limit State combination: 1.35Gk + 1.5Qk. Used for structural design to ensure adequate strength against failure.",
      },
      {
        term: "Tributary Width",
        definition:
          "The width of slab that a beam supports — typically half the span on each side of the beam. Converts area loads (kN/m²) to line loads (kN/m) on beams.",
      },
    ],
  },

  "beam-moment": {
    standard: "MS EN 1992-1-1 (EC2)",
    terms: [
      {
        term: "Effective Depth (d)",
        definition:
          "The distance from the compression face to the centroid of the tension reinforcement. d = h − cover − link diameter − bar radius.",
      },
      {
        term: "K Factor",
        definition:
          "A dimensionless ratio K = M/(bd²fck) used to determine the lever arm and check if compression reinforcement is needed. K must not exceed K' = 0.167.",
      },
      {
        term: "Lever Arm (z)",
        definition:
          "The distance between the compression and tension force resultants. Calculated as z = d[0.5 + √(0.25 − K/1.134)], limited to 0.95d.",
      },
      {
        term: "αcc = 0.85",
        definition:
          "A coefficient for long-term effects on concrete compressive strength. The Malaysia National Annex specifies αcc = 0.85.",
        msContext:
          "This is the Malaysian NA value. Some other countries use 1.0. Always use 0.85 for Malaysian practice.",
      },
    ],
  },

  "beam-shear": {
    standard: "MS EN 1992-1-1 (EC2)",
    terms: [
      {
        term: "Concrete Shear Resistance (VRd,c)",
        definition:
          "The shear capacity of a beam without shear reinforcement. If applied shear VEd > VRd,c, shear links are required.",
      },
      {
        term: "Size Effect Factor (k)",
        definition:
          "k = 1 + √(200/d) ≤ 2.0. Accounts for the observation that deeper beams have relatively lower shear stress at failure.",
      },
      {
        term: "Variable Strut Inclination Method",
        definition:
          "EC2's method for designing shear links. The strut angle θ (between 21.8° and 45°) is chosen so cot θ ranges from 1.0 to 2.5. A flatter strut needs fewer links but risks crushing.",
      },
      {
        term: "Strut Crushing Limit (VRd,max)",
        definition:
          "The maximum shear a beam can carry before the concrete compression strut between cracks crushes. If VEd > VRd,max, the section must be enlarged.",
      },
    ],
  },

  "column-interaction": {
    standard: "MS EN 1992-1-1 (EC2)",
    terms: [
      {
        term: "N-M Interaction Diagram",
        definition:
          "A plot of axial force (N) vs. bending moment (M) showing all combinations a column section can resist. The design point (NEd, MEd) must fall inside the curve.",
      },
      {
        term: "Balanced Point",
        definition:
          "The N-M combination where the concrete reaches its crushing strain (0.0035) simultaneously with the tension steel yielding. Below this point, the section is tension-controlled.",
      },
      {
        term: "Rectangular Stress Block",
        definition:
          "A simplified representation of concrete compression. EC2 uses λ = 0.8 (depth factor) and η = 1.0 (for fck ≤ 50 MPa) to define the stress block.",
      },
      {
        term: "Neutral Axis Depth (x)",
        definition:
          "The distance from the compression face to where the strain is zero. Determines whether reinforcement is in tension or compression.",
      },
    ],
  },

  "pad-footing": {
    standard: "MS EN 1992-1-1 / MS EN 1997-1",
    terms: [
      {
        term: "Bearing Pressure",
        definition:
          "The stress applied by the footing to the soil. Maximum bearing pressure q = N/A ± 6M/(BL²) must not exceed the allowable bearing capacity.",
      },
      {
        term: "Punching Shear",
        definition:
          "A local failure mode where the column punches through the footing slab. Checked at a perimeter 2d from the column face per EC2 Clause 6.4.",
      },
      {
        term: "Critical Perimeter (u₁)",
        definition:
          "The control perimeter at a distance 2d from the column face, used for punching shear verification. u₁ = 2(a+b) + 4πd for a rectangular column.",
      },
      {
        term: "SLS vs ULS Checks",
        definition:
          "Bearing pressure uses SLS (characteristic/unfactored) loads. Flexure and punching shear use ULS (factored) loads.",
        msContext:
          "Allowable bearing pressure from Malaysian SI reports (geotechnical) is an SLS value — do not factor it.",
      },
    ],
  },

  "crack-width": {
    standard: "MS EN 1992-1-1 (EC2)",
    terms: [
      {
        term: "Crack Width (wk)",
        definition:
          "The calculated width of flexural cracks at the concrete surface. EC2 limits crack width to 0.3mm for most exposure classes under quasi-permanent loads.",
        msContext:
          "Malaysian exposure classes follow EC2. Typical: XC1 (indoor), XC2 (buried/soil contact), XC3/XC4 (exposed outdoors).",
      },
      {
        term: "Maximum Crack Spacing (sr,max)",
        definition:
          "The predicted maximum distance between cracks. Depends on cover, bar diameter, and reinforcement ratio. sr,max = 3.4c + 0.425·k1·k2·φ/ρp,eff.",
      },
      {
        term: "Effective Tension Area (Ac,eff)",
        definition:
          "The area of concrete surrounding the tension reinforcement that participates in crack control. hc,ef = min(2.5(h−d), (h−x)/3, h/2).",
      },
      {
        term: "Load Duration Factor (kt)",
        definition:
          "Accounts for the effect of load duration on cracking. kt = 0.6 for short-term (frequent) loading, 0.4 for long-term (quasi-permanent) loading.",
      },
    ],
  },
};
