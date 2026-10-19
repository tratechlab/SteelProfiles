export type Language = 'hr' | 'en' | 'de';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  databaseTab: string;
  calculatorTab: string;
  historyTab: string;
  allStandards: string;
  enStandard: string;
  astmStandard: string;
  dinStandard: string;
  isoStandard: string;
  allSeries: string;
  searchPlaceholder: string;
  filters: string;
  resetFilters: string;
  profile: string;
  standard: string;
  dimensions: string;
  thickness: string;
  area: string;
  weight: string;
  inertiaY: string;
  inertiaZ: string;
  elasticModulus: string;
  plasticModulus: string;
  youngsModulus: string;
  tangentModulus: string;
  yieldStrength: string;
  tensileStrength: string;
  shearModulus: string;
  poissonRatio: string;
  density: string;
  materialType: string;
  materialFamily: string;
  activeMaterial: string;
  selectMaterial: string;
  materialNotice: string;
  actions: string;
  preview2D: string;
  loadToCalculator: string;
  compare: string;
  compared: string;
  maxCompareAlert: string;
  clearCompare: string;
  designLoads: string;
  axialForce: string;
  bendingMomentY: string;
  bendingMomentZ: string;
  shearForce: string;
  spanLength: string;
  bucklingLengthY: string;
  bucklingLengthZ: string;
  ltbLength: string;
  deflectionLimit: string;
  uniformLoad: string;
  pointLoad: string;
  compression: string;
  tension: string;
  criticalRatio: string;
  satisfies: string;
  overstressed: string;
  marginal: string;
  governingCheck: string;
  remainingCapacity: string;
  overloadBy: string;
  totalStress: string;
  crossSectionClass: string;
  elasticState: string;
  inelasticState: string;
  recommendedProfile: string;
  applyProfile: string;
  exportPdf: string;
  saveToProject: string;
  saveToHistory: string;
  project: string;
  member: string;
  engineer: string;
  investor: string;
  cloudSync: string;
  offlineMode: string;
  offlineNotice: string;
  collaboration: string;
  connectedEngineers: string;
  roomCode: string;
  copyLink: string;
  copied: string;
  myRole: string;
  updateRole: string;
  activityLog: string;
  sendNote: string;
  sendNotePlaceholder: string;
  exportCsv: string;
  clearHistory: string;
  historyTitle: string;
  historySubtitle: string;
  date: string;
  status: string;
  load: string;
  thicknessReductionNotice: string;
  materialDescTitle: string;
  languageSelect: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  hr: {
    appTitle: 'StahlEuro',
    appSubtitle: 'Baza Čeličnih Profila & Eurocode 3 Proračun Nosivosti',
    databaseTab: 'Baza Profila (EN/ASTM/DIN/ISO)',
    calculatorTab: 'Kalkulator Nosivosti',
    historyTab: 'Povijest Proračuna',
    allStandards: 'Svi Standardi',
    enStandard: 'Europska norma (EN)',
    astmStandard: 'Američki standard (ASTM)',
    dinStandard: 'Njemački standard (DIN)',
    isoStandard: 'Međunarodna norma (ISO)',
    allSeries: 'Sve serije',
    searchPlaceholder: 'Pretraži npr. IPE 300, W14x90, IPN, ISO I...',
    filters: 'Filtri',
    resetFilters: 'Resetiraj filtre',
    profile: 'Profil',
    standard: 'Standard',
    dimensions: 'h × b (mm)',
    thickness: 'tw / tf (mm)',
    area: 'A (cm²)',
    weight: 'Masa (kg/m)',
    inertiaY: 'Iy (cm⁴)',
    inertiaZ: 'Iz (cm⁴)',
    elasticModulus: 'Wel,y (cm³)',
    plasticModulus: 'Wpl,y (cm³)',
    youngsModulus: 'Modul elastičnosti (E)',
    tangentModulus: 'Tangencijalni modul (Et)',
    yieldStrength: 'Granica razvlačenja (fy)',
    tensileStrength: 'Vlačna čvrstoća (fu)',
    shearModulus: 'Modul posmika (G)',
    poissonRatio: 'Poissonov koeficijent (ν)',
    density: 'Gustoća (ρ)',
    materialType: 'Vrsta Materijala / Kvaliteta Čelika',
    materialFamily: 'Skupina materijala',
    activeMaterial: 'Aktivna vrsta materijala',
    selectMaterial: 'Odaberite vrstu materijala za proračun mehaničkih svojstava',
    materialNotice: 'Mehanička svojstva (E, Et, fy, fu, G, gustoća) ovise o vrsti materijala i debljini pojasnice tf.',
    actions: 'Akcije',
    preview2D: '2D Skica',
    loadToCalculator: 'Učitaj u kalkulator',
    compare: 'Usporedi',
    compared: 'Odabrano',
    maxCompareAlert: 'Maksimalno možete uspoređivati 4 profila istovremeno.',
    clearCompare: 'Očisti usporedbu',
    designLoads: 'Mjerodavna Opterećenja (Granično Stanje Nosivosti - ULS)',
    axialForce: 'Uzdužna sila N_Ed (kN)',
    bendingMomentY: 'Moment savijanja M_y,Ed (kNm)',
    bendingMomentZ: 'Moment savijanja M_z,Ed (kNm)',
    shearForce: 'Posmična sila V_z,Ed (kN)',
    spanLength: 'Raspon L (m)',
    bucklingLengthY: 'L_cr,y izvijanje (m)',
    bucklingLengthZ: 'L_cr,z izvijanje (m)',
    ltbLength: 'L_LT bočno nepridržano (m)',
    deflectionLimit: 'Granica progiba (SLS)',
    uniformLoad: 'Kontinuirani teret q (kN/m)',
    pointLoad: 'Koncentrirana sila F (kN)',
    compression: 'Tlak (+)',
    tension: 'Vlak (-)',
    criticalRatio: 'Mjerodavni Stupanj Iskorištenosti (η_max)',
    satisfies: 'ZADOVOLJAVA',
    overstressed: 'PREKORAČENO',
    marginal: 'GRANIČNO',
    governingCheck: 'Mjerodavni dokaz',
    remainingCapacity: 'Preostala rezerva nosivosti',
    overloadBy: 'Preopterećeno za',
    totalStress: 'Ukupno naprezanje (σ_max)',
    crossSectionClass: 'Klasa poprečnog presjeka',
    elasticState: 'Potpuno elastično (Et = E)',
    inelasticState: 'Neelastično područje (CRC model)',
    recommendedProfile: 'Preporučeni jači profil iz iste serije',
    applyProfile: 'Primijeni profil',
    exportPdf: 'Izvezi PDF Elaborat',
    saveToProject: 'Spremi u projekt',
    saveToHistory: 'Zabilježi povijest',
    project: 'Projekt',
    member: 'Pozicija',
    engineer: 'Inženjer',
    investor: 'Investitor',
    cloudSync: 'Oblak',
    offlineMode: 'Offline gradilište',
    offlineNotice: 'Offline način za gradilište. Svi proračuni rade lokalno.',
    collaboration: 'Suradnja',
    connectedEngineers: 'Povezani Inženjeri',
    roomCode: 'Soba za suradnju',
    copyLink: 'Kopiraj Link',
    copied: 'Kopirano',
    myRole: 'Vaš Inženjerski Identitet',
    updateRole: 'Ažuriraj Ulogu',
    activityLog: 'Dnevnik Izmjena',
    sendNote: 'Pošalji',
    sendNotePlaceholder: 'Pošalji brzu statičku bilješku timu...',
    exportCsv: 'Izvoz CSV',
    clearHistory: 'Očisti',
    historyTitle: 'Povijest Proračuna i Statičkih Dokaza',
    historySubtitle: 'Kronološki registar svih proračuna s mogućnošću vraćanja u kalkulator',
    date: 'Datum i Vrijeme',
    status: 'Status',
    load: 'Učitaj',
    thicknessReductionNotice: 'Uračunato smanjenje fy zbog debljine pojasnice tf > 16mm (EN 10025 / ISO 630)',
    materialDescTitle: 'Karakteristike odabranog materijala',
    languageSelect: 'Jezik',
  },
  en: {
    appTitle: 'StahlEuro',
    appSubtitle: 'Steel Profiles Database & Eurocode 3 Capacity Engine',
    databaseTab: 'Profiles Database (EN/ASTM/DIN/ISO)',
    calculatorTab: 'Capacity Calculator',
    historyTab: 'Calculation History',
    allStandards: 'All Standards',
    enStandard: 'European Standard (EN)',
    astmStandard: 'American Standard (ASTM)',
    dinStandard: 'German Standard (DIN)',
    isoStandard: 'International Standard (ISO)',
    allSeries: 'All series',
    searchPlaceholder: 'Search e.g. IPE 300, W14x90, IPN, ISO I...',
    filters: 'Filters',
    resetFilters: 'Reset filters',
    profile: 'Profile',
    standard: 'Standard',
    dimensions: 'h × b (mm)',
    thickness: 'tw / tf (mm)',
    area: 'A (cm²)',
    weight: 'Mass (kg/m)',
    inertiaY: 'Iy (cm⁴)',
    inertiaZ: 'Iz (cm⁴)',
    elasticModulus: 'Wel,y (cm³)',
    plasticModulus: 'Wpl,y (cm³)',
    youngsModulus: "Young's Modulus (E)",
    tangentModulus: 'Tangent Modulus (Et)',
    yieldStrength: 'Yield Strength (fy)',
    tensileStrength: 'Tensile Strength (fu)',
    shearModulus: 'Shear Modulus (G)',
    poissonRatio: "Poisson's Ratio (ν)",
    density: 'Density (ρ)',
    materialType: 'Material Type / Steel Grade',
    materialFamily: 'Material category',
    activeMaterial: 'Active material grade',
    selectMaterial: 'Select material type to calculate mechanical properties',
    materialNotice: 'Mechanical properties (E, Et, fy, fu, G, density) depend on the chosen material and flange thickness tf.',
    actions: 'Actions',
    preview2D: '2D Section',
    loadToCalculator: 'Load to calculator',
    compare: 'Compare',
    compared: 'Selected',
    maxCompareAlert: 'You can compare up to 4 profiles simultaneously.',
    clearCompare: 'Clear comparison',
    designLoads: 'Design Internal Forces (Ultimate Limit State - ULS)',
    axialForce: 'Axial force N_Ed (kN)',
    bendingMomentY: 'Bending moment M_y,Ed (kNm)',
    bendingMomentZ: 'Bending moment M_z,Ed (kNm)',
    shearForce: 'Shear force V_z,Ed (kN)',
    spanLength: 'Span length L (m)',
    bucklingLengthY: 'L_cr,y buckling length (m)',
    bucklingLengthZ: 'L_cr,z buckling length (m)',
    ltbLength: 'L_LT unrestrained length (m)',
    deflectionLimit: 'Deflection limit (SLS)',
    uniformLoad: 'Uniform load q (kN/m)',
    pointLoad: 'Point load F (kN)',
    compression: 'Compression (+)',
    tension: 'Tension (-)',
    criticalRatio: 'Governing Utilization Ratio (η_max)',
    satisfies: 'SATISFIES',
    overstressed: 'FAILED',
    marginal: 'CRITICAL',
    governingCheck: 'Governing check',
    remainingCapacity: 'Remaining reserve capacity',
    overloadBy: 'Overloaded by',
    totalStress: 'Maximum combined stress (σ_max)',
    crossSectionClass: 'Cross-section class',
    elasticState: 'Fully elastic range (Et = E)',
    inelasticState: 'Inelastic range (CRC Tangent Modulus)',
    recommendedProfile: 'Recommended stronger profile in same series',
    applyProfile: 'Apply profile',
    exportPdf: 'Export PDF Report',
    saveToProject: 'Save to project',
    saveToHistory: 'Record to history',
    project: 'Project',
    member: 'Member / Mark',
    engineer: 'Engineer',
    investor: 'Client',
    cloudSync: 'Cloud',
    offlineMode: 'Offline site mode',
    offlineNotice: 'Offline site mode active. All calculations work without network.',
    collaboration: 'Collaboration',
    connectedEngineers: 'Connected Engineers',
    roomCode: 'Room Code',
    copyLink: 'Copy Link',
    copied: 'Copied',
    myRole: 'Engineer Identity in Room',
    updateRole: 'Update Role',
    activityLog: 'Activity Stream',
    sendNote: 'Send',
    sendNotePlaceholder: 'Send a quick engineering note to teammates...',
    exportCsv: 'Export CSV',
    clearHistory: 'Clear history',
    historyTitle: 'Calculation History & Structural Checks',
    historySubtitle: 'Chronological calculation ledger with instant restore capabilities',
    date: 'Date & Time',
    status: 'Status',
    load: 'Load',
    thicknessReductionNotice: 'Yield strength fy adjusted for flange thickness tf > 16mm (EN 10025 / ISO 630)',
    materialDescTitle: 'Selected Material Mechanical Specifications',
    languageSelect: 'Language',
  },
  de: {
    appTitle: 'StahlEuro',
    appSubtitle: 'Stahlprofil-Datenbank & Eurocode 3 Tragfähigkeitsberechnung',
    databaseTab: 'Profiltabellen (EN/ASTM/DIN/ISO)',
    calculatorTab: 'Tragfähigkeitsnachweis',
    historyTab: 'Berechnungsverlauf',
    allStandards: 'Alle Normen',
    enStandard: 'Europäische Norm (EN)',
    astmStandard: 'Amerikanische Norm (ASTM)',
    dinStandard: 'Deutsche Norm (DIN)',
    isoStandard: 'Internationale Norm (ISO)',
    allSeries: 'Alle Profilreihen',
    searchPlaceholder: 'Suche z.B. IPE 300, W14x90, IPN, ISO I...',
    filters: 'Filter',
    resetFilters: 'Filter zurücksetzen',
    profile: 'Profil',
    standard: 'Norm',
    dimensions: 'h × b (mm)',
    thickness: 'tw / tf (mm)',
    area: 'A (cm²)',
    weight: 'Gewicht (kg/m)',
    inertiaY: 'Iy (cm⁴)',
    inertiaZ: 'Iz (cm⁴)',
    elasticModulus: 'Wel,y (cm³)',
    plasticModulus: 'Wpl,y (cm³)',
    youngsModulus: 'Elastizitätsmodul (E)',
    tangentModulus: 'Tangentenmodul (Et)',
    yieldStrength: 'Streckgrenze (fy)',
    tensileStrength: 'Zugfestigkeit (fu)',
    shearModulus: 'Schubmodul (G)',
    poissonRatio: 'Querkontraktionszahl (ν)',
    density: 'Dichte (ρ)',
    materialType: 'Werkstoff / Baustahlgüte',
    materialFamily: 'Werkstoffgruppe',
    activeMaterial: 'Aktive Werkstoffgüte',
    selectMaterial: 'Werkstoff zur Berechnung der mechanischen Kennwerte wählen',
    materialNotice: 'Mechanische Kennwerte (E, Et, fy, fu, G, Dichte) hängen von der Werkstoffgüte und Flanschdicke tf ab.',
    actions: 'Aktionen',
    preview2D: '2D Querschnitt',
    loadToCalculator: 'In Rechner laden',
    compare: 'Vergleichen',
    compared: 'Ausgewählt',
    maxCompareAlert: 'Sie können maximal 4 Profile gleichzeitig vergleichen.',
    clearCompare: 'Vergleich leeren',
    designLoads: 'Bemessungsschnittgrößen (Grenzzustand der Tragfähigkeit - GZT)',
    axialForce: 'Normalkraft N_Ed (kN)',
    bendingMomentY: 'Biegemoment M_y,Ed (kNm)',
    bendingMomentZ: 'Biegemoment M_z,Ed (kNm)',
    shearForce: 'Querkraft V_z,Ed (kN)',
    spanLength: 'Spannweite L (m)',
    bucklingLengthY: 'Knicklänge L_cr,y (m)',
    bucklingLengthZ: 'Knicklänge L_cr,z (m)',
    ltbLength: 'Biegedrillknicklänge L_LT (m)',
    deflectionLimit: 'Durchbiegungsgrenze (GZG)',
    uniformLoad: 'Gleichlast q (kN/m)',
    pointLoad: 'Einzellast F (kN)',
    compression: 'Druck (+)',
    tension: 'Zug (-)',
    criticalRatio: 'Maßgebender Ausnutzungsgrad (η_max)',
    satisfies: 'ERFÜLLT',
    overstressed: 'NICHT ERFÜLLT',
    marginal: 'GRENZWERTIG',
    governingCheck: 'Maßgebender Nachweis',
    remainingCapacity: 'Verbleibende Traglastreserve',
    overloadBy: 'Überlastet um',
    totalStress: 'Gesamtspannung (σ_max)',
    crossSectionClass: 'Querschnittsklasse',
    elasticState: 'Voll elastischer Bereich (Et = E)',
    inelasticState: 'Unelastischer Bereich (CRC Tangentenmodul)',
    recommendedProfile: 'Empfohlenes stärkeres Profil derselben Reihe',
    applyProfile: 'Profil anwenden',
    exportPdf: 'PDF-Statikbericht exportieren',
    saveToProject: 'Im Projekt speichern',
    saveToHistory: 'Im Verlauf sichern',
    project: 'Projekt',
    member: 'Bauteil / Position',
    engineer: 'Prüfingenieur / Statiker',
    investor: 'Bauherr',
    cloudSync: 'Cloud',
    offlineMode: 'Baustellen-Offlinebetrieb',
    offlineNotice: 'Baustellenmodus aktiv. Alle Berechnungen laufen lokal.',
    collaboration: 'Zusammenarbeit',
    connectedEngineers: 'Verbundene Ingenieure',
    roomCode: 'Raum-Code',
    copyLink: 'Link kopieren',
    copied: 'Kopiert',
    myRole: 'Ingenieurrolle im Raum',
    updateRole: 'Rolle aktualisieren',
    activityLog: 'Aktivitätsprotokoll',
    sendNote: 'Senden',
    sendNotePlaceholder: 'Kurze Statiknotiz an Kollegen senden...',
    exportCsv: 'CSV exportieren',
    clearHistory: 'Verlauf leeren',
    historyTitle: 'Berechnungsverlauf & Statiknachweise',
    historySubtitle: 'Chronologisches Prüfprotokoll mit Sofort-Wiederherstellung',
    date: 'Datum & Uhrzeit',
    status: 'Status',
    load: 'Laden',
    thicknessReductionNotice: 'Streckgrenzenreduzierung nach EN 10025 / ISO 630 für Flanschdicke tf > 16mm berücksichtigt',
    materialDescTitle: 'Mechanische Kennwerte des gewählten Werkstoffs',
    languageSelect: 'Sprache',
  },
};
