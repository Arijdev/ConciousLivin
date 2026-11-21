const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/diagrams');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function svgWrapper(width, height, title, subtitle, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowTeal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#14b8a6" />
    </marker>
    <marker id="arrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" rx="16" fill="url(#bgGrad)" stroke="#334155" stroke-width="1.5" />
  
  <!-- Grid accents -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.5" stroke-opacity="0.25" />
  </pattern>
  <rect width="${width}" height="${height}" rx="16" fill="url(#grid)" />

  <!-- Header Banner -->
  <g transform="translate(32, 28)">
    <rect x="0" y="0" width="8" height="24" rx="4" fill="#14b8a6" />
    <text x="18" y="18" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#f8fafc" letter-spacing="0.5">${title}</text>
    <text x="18" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="400" fill="#94a3b8">${subtitle}</text>
    <rect x="${width - 190}" y="2" width="130" height="22" rx="11" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" stroke-width="1" />
    <text x="${width - 125}" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#2dd4bf" text-anchor="middle">DR. ARIF CLINICAL CHART</text>
  </g>

  <!-- Main Visual Diagram Body -->
  ${content}
</svg>`;
}

const diagrams = {};

// 1. Gut-Brain Axis Diagram
diagrams['gut-brain-axis.svg'] = svgWrapper(800, 420, "THE GUT-BRAIN AXIS: BIDIRECTIONAL COMMUNICATION", "80-90% Afferent Vagal Signals Travel from Gut to Brain | Serotonin, Dopamine & GABA Hub", `
  <!-- Brain Node -->
  <g transform="translate(60, 90)" filter="url(#shadow)">
    <rect width="200" height="130" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="200" height="30" rx="14" fill="url(#blueGrad)" />
    <text x="100" y="20" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">CENTRAL NERVOUS SYSTEM</text>
    <text x="15" y="55" font-family="sans-serif" font-size="11" font-weight="600" fill="#e2e8f0">• Hypothalamus & Amygdala</text>
    <text x="15" y="75" font-family="sans-serif" font-size="10" fill="#94a3b8">• HPA Axis Stress Regulation</text>
    <text x="15" y="95" font-family="sans-serif" font-size="10" fill="#94a3b8">• Cognitive Clarity & Mood</text>
    <text x="15" y="115" font-family="sans-serif" font-size="10" fill="#38bdf8">• Nucleus Tractus Solitarius (NTS)</text>
  </g>

  <!-- Vagus Nerve Highway -->
  <g transform="translate(290, 100)">
    <!-- Pathway lines -->
    <path d="M 0 35 C 100 20, 120 20, 220 35" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="6,4" marker-end="url(#arrowTeal)" />
    <text x="110" y="15" font-family="sans-serif" font-size="10" font-weight="700" fill="#10b981" text-anchor="middle">80% AFFERENT FIBERS (GUT ➔ BRAIN)</text>
    <text x="110" y="32" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">Nutrient signals, SCFAs, cytokines, satiety</text>

    <path d="M 220 90 C 120 105, 100 105, 0 90" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrowAmber)" />
    <text x="110" y="125" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b" text-anchor="middle">20% EFFERENT FIBERS (BRAIN ➔ GUT)</text>
    <text x="110" y="140" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Motility, enzyme secretion, acid production</text>

    <!-- Center Vagus Badge -->
    <rect x="65" y="50" width="90" height="26" rx="13" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
    <text x="110" y="67" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">VAGUS NERVE</text>
  </g>

  <!-- Gut Node -->
  <g transform="translate(540, 90)" filter="url(#shadow)">
    <rect width="200" height="130" rx="14" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="200" height="30" rx="14" fill="url(#emeraldGrad)" />
    <text x="100" y="20" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">ENTERIC NERVOUS SYSTEM</text>
    <text x="15" y="55" font-family="sans-serif" font-size="11" font-weight="600" fill="#e2e8f0">• 500 Million Neurons ('2nd Brain')</text>
    <text x="15" y="75" font-family="sans-serif" font-size="10" fill="#94a3b8">• 90% Body's Serotonin Synthesized</text>
    <text x="15" y="95" font-family="sans-serif" font-size="10" fill="#94a3b8">• 50% Dopamine + GABA Synthesis</text>
    <text x="15" y="115" font-family="sans-serif" font-size="10" fill="#10b981">• Gut Microbial Metabolites</text>
  </g>

  <!-- Bottom Row: 3 Key Mediators -->
  <g transform="translate(60, 260)">
    <rect x="0" y="0" width="200" height="100" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="100" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">1. NEUROTRANSMITTER AXIS</text>
    <text x="15" y="50" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Tryptophan ➔ 5-HTP ➔ Serotonin</text>
    <text x="15" y="68" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Bifidobacteria generate GABA</text>
    <text x="15" y="86" font-family="sans-serif" font-size="9" fill="#64748b">Direct calming tone on amygdala</text>
  </g>

  <g transform="translate(300, 260)">
    <rect x="0" y="0" width="200" height="100" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="100" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#10b981" text-anchor="middle">2. SHORT-CHAIN FATTY ACIDS</text>
    <text x="15" y="50" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Butyrate, Acetate & Propionate</text>
    <text x="15" y="68" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Crosses Blood-Brain Barrier (BBB)</text>
    <text x="15" y="86" font-family="sans-serif" font-size="9" fill="#64748b">Upregulates BDNF & neuroplasticity</text>
  </g>

  <g transform="translate(540, 260)">
    <rect x="0" y="0" width="200" height="100" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="100" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f43f5e" text-anchor="middle">3. IMMUNE & CYTOKINE PATH</text>
    <text x="15" y="50" font-family="sans-serif" font-size="10" fill="#cbd5e1">• 70% Immune System in GALT</text>
    <text x="15" y="68" font-family="sans-serif" font-size="10" fill="#cbd5e1">• LPS Leakage triggers Neuroinflammation</text>
    <text x="15" y="86" font-family="sans-serif" font-size="9" fill="#64748b">Root cause of brain fog & anxiety</text>
  </g>
`);

// 2. Leaky Gut Zonulin Diagram
diagrams['leaky-gut-zonulin.svg'] = svgWrapper(800, 420, "INTESTINAL EPITHELIAL BARRIER: HEALTHY VS. LEAKY GUT", "Zonulin Modulation, Tight Junction Integrity, and Systemic Endotoxemia (LPS)", `
  <!-- Left Side: Healthy Intact Gut -->
  <g transform="translate(40, 80)">
    <rect width="340" height="300" rx="14" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <rect width="340" height="32" rx="14" fill="url(#emeraldGrad)" />
    <text x="170" y="21" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">HEALTHY TIGHT JUNCTIONS (CLOSED)</text>
    
    <!-- Mucus Layer -->
    <rect x="20" y="45" width="300" height="20" rx="6" fill="#047857" opacity="0.6" />
    <text x="170" y="59" font-family="sans-serif" font-size="9" font-weight="600" fill="#a7f3d0" text-anchor="middle">Thick Protective Mucus Layer (MUC2)</text>

    <!-- Cells -->
    <g transform="translate(30, 80)">
      <rect x="0" y="0" width="55" height="90" rx="6" fill="#334155" stroke="#10b981" stroke-width="2" />
      <rect x="58" y="0" width="55" height="90" rx="6" fill="#334155" stroke="#10b981" stroke-width="2" />
      <rect x="116" y="0" width="55" height="90" rx="6" fill="#334155" stroke="#10b981" stroke-width="2" />
      <rect x="174" y="0" width="55" height="90" rx="6" fill="#334155" stroke="#10b981" stroke-width="2" />
      <rect x="232" y="0" width="55" height="90" rx="6" fill="#334155" stroke="#10b981" stroke-width="2" />
      
      <!-- Tight Junction Staples -->
      <line x1="56" y1="15" x2="57" y2="35" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
      <line x1="114" y1="15" x2="115" y2="35" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
      <line x1="172" y1="15" x2="173" y2="35" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
      <line x1="230" y1="15" x2="231" y2="35" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
    </g>

    <!-- Blood Vessel -->
    <rect x="20" y="195" width="300" height="35" rx="8" fill="#881337" opacity="0.5" stroke="#f43f5e" stroke-width="1" />
    <text x="170" y="217" font-family="sans-serif" font-size="10" font-weight="600" fill="#fecdd3" text-anchor="middle">Bloodstream: Clean & Nutrients Only</text>

    <!-- Status bullets -->
    <text x="25" y="255" font-family="sans-serif" font-size="10" fill="#a7f3d0">✔ Claudins & Occludin Intact (ZO-1 locked)</text>
    <text x="25" y="275" font-family="sans-serif" font-size="10" fill="#a7f3d0">✔ Toxins, bacteria & undigested peptides blocked</text>
  </g>

  <!-- Right Side: Leaky Gut -->
  <g transform="translate(420, 80)">
    <rect width="340" height="300" rx="14" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" />
    <rect width="340" height="32" rx="14" fill="url(#roseGrad)" />
    <text x="170" y="21" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">HYPERPERMEABLE / LEAKY GUT (OPEN)</text>
    
    <!-- Degraded Mucus -->
    <rect x="20" y="45" width="120" height="10" rx="3" fill="#be123c" opacity="0.4" />
    <rect x="200" y="45" width="100" height="10" rx="3" fill="#be123c" opacity="0.4" />
    <text x="170" y="55" font-family="sans-serif" font-size="8" font-weight="600" fill="#fca5a5" text-anchor="middle">Eroded Mucus Layer (Dysbiosis / Seed Oils)</text>

    <!-- Separated Cells -->
    <g transform="translate(25, 80)">
      <rect x="0" y="0" width="50" height="90" rx="6" fill="#334155" stroke="#f43f5e" stroke-width="1.5" />
      <!-- Gap with Zonulin trigger -->
      <path d="M 68 10 L 68 70" stroke="#fbbf24" stroke-width="3" stroke-dasharray="3,3" />
      <rect x="80" y="0" width="50" height="90" rx="6" fill="#334155" stroke="#f43f5e" stroke-width="1.5" />
      <path d="M 148 10 L 148 70" stroke="#fbbf24" stroke-width="3" stroke-dasharray="3,3" />
      <rect x="160" y="0" width="50" height="90" rx="6" fill="#334155" stroke="#f43f5e" stroke-width="1.5" />
      <path d="M 228 10 L 228 70" stroke="#fbbf24" stroke-width="3" stroke-dasharray="3,3" />
      <rect x="240" y="0" width="50" height="90" rx="6" fill="#334155" stroke="#f43f5e" stroke-width="1.5" />
      
      <!-- Translocation indicator -->
      <text x="145" y="45" font-family="sans-serif" font-size="9" font-weight="700" fill="#f87171" text-anchor="middle">LPS & Gliadin Leak</text>
    </g>

    <!-- Inflamed Blood Vessel -->
    <rect x="20" y="195" width="300" height="35" rx="8" fill="#991b1b" opacity="0.6" stroke="#f87171" stroke-width="1.5" />
    <text x="170" y="217" font-family="sans-serif" font-size="10" font-weight="700" fill="#fecaca" text-anchor="middle">Systemic Endotoxemia & NF-κB Cytokines</text>

    <!-- Status bullets -->
    <text x="25" y="255" font-family="sans-serif" font-size="10" fill="#fca5a5">✘ Zonulin triggered by gluten, NSAIDs & stress</text>
    <text x="25" y="275" font-family="sans-serif" font-size="10" fill="#fca5a5">✘ Liver overload, brain fog, fatigue & autoimmune risk</text>
  </g>
`);

// 3. 4R Clinical Protocol Flowchart
diagrams['4r-protocol-flow.svg'] = svgWrapper(800, 400, "THE 4R CLINICAL GUT RESTORATION PROTOCOL", "Functional Medicine Sequence: Remove ➔ Replace ➔ Reinoculate ➔ Repair", `
  <!-- Phase 1 -->
  <g transform="translate(40, 90)">
    <rect width="165" height="250" rx="12" fill="#1e293b" stroke="#f43f5e" stroke-width="2" />
    <rect width="165" height="32" rx="12" fill="url(#roseGrad)" />
    <text x="82" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">1. REMOVE</text>
    <text x="82" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#fca5a5" text-anchor="middle">WEEKS 1 - 4</text>
    <text x="15" y="85" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Gluten & Gliadin</text>
    <text x="15" y="110" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Seed Oils (Canola, Corn)</text>
    <text x="15" y="135" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Refined Sugars / HCFS</text>
    <text x="15" y="160" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Alcohol & NSAIDs</text>
    <text x="15" y="185" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Pathobiont bacteria</text>
    <rect x="12" y="210" width="140" height="26" rx="6" fill="#881337" opacity="0.6" />
    <text x="82" y="227" font-family="sans-serif" font-size="9" fill="#fecdd3" text-anchor="middle">Goal: Clear Triggers</text>
  </g>

  <!-- Arrow 1-2 -->
  <path d="M 215 210 L 230 210" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Phase 2 -->
  <g transform="translate(235, 90)">
    <rect width="165" height="250" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
    <rect width="165" height="32" rx="12" fill="url(#amberGrad)" />
    <text x="82" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">2. REPLACE</text>
    <text x="82" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#fde68a" text-anchor="middle">WEEKS 2 - 6</text>
    <text x="15" y="85" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Betaine HCl + Pepsin</text>
    <text x="15" y="110" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Broad Digest Enzymes</text>
    <text x="15" y="135" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Ox Bile / Taurine</text>
    <text x="15" y="160" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Herbal Digestive Bitters</text>
    <text x="15" y="185" font-family="sans-serif" font-size="10" fill="#e2e8f0">• ACV in warm water</text>
    <rect x="12" y="210" width="140" height="26" rx="6" fill="#78350f" opacity="0.6" />
    <text x="82" y="227" font-family="sans-serif" font-size="9" fill="#fef3c7" text-anchor="middle">Goal: Restore Acid/Bile</text>
  </g>

  <!-- Arrow 2-3 -->
  <path d="M 410 210 L 425 210" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Phase 3 -->
  <g transform="translate(430, 90)">
    <rect width="165" height="250" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="165" height="32" rx="12" fill="url(#blueGrad)" />
    <text x="82" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">3. REINOCULATE</text>
    <text x="82" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#bae6fd" text-anchor="middle">WEEKS 4 - 12</text>
    <text x="15" y="85" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Spore-based Probiotics</text>
    <text x="15" y="110" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Prebiotic Fibers (PHGG)</text>
    <text x="15" y="135" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Resistant Starch (RS3)</text>
    <text x="15" y="160" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Cultured Sauerkraut</text>
    <text x="15" y="185" font-family="sans-serif" font-size="10" fill="#e2e8f0">• 30+ Plant Points/Week</text>
    <rect x="12" y="210" width="140" height="26" rx="6" fill="#1e3a8a" opacity="0.6" />
    <text x="82" y="227" font-family="sans-serif" font-size="9" fill="#bfdbfe" text-anchor="middle">Goal: Seed Flora Ecosystem</text>
  </g>

  <!-- Arrow 3-4 -->
  <path d="M 605 210 L 620 210" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Phase 4 -->
  <g transform="translate(625, 90)">
    <rect width="145" height="250" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="145" height="32" rx="12" fill="url(#emeraldGrad)" />
    <text x="72" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">4. REPAIR</text>
    <text x="72" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#a7f3d0" text-anchor="middle">WEEKS 6 - 16+</text>
    <text x="12" y="85" font-family="sans-serif" font-size="10" fill="#e2e8f0">• L-Glutamine (5g BID)</text>
    <text x="12" y="110" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Zinc Carnosine (75mg)</text>
    <text x="12" y="135" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Collagen Peptides</text>
    <text x="12" y="160" font-family="sans-serif" font-size="10" fill="#e2e8f0">• D3 + K2 + Retinol A</text>
    <text x="12" y="185" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Bone Broth gelatin</text>
    <rect x="10" y="210" width="125" height="26" rx="6" fill="#064e3b" opacity="0.6" />
    <text x="72" y="227" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">Goal: Seal Gut Lining</text>
  </g>
`);

// 4. Microbiome SCFA Cycle
diagrams['microbiome-scfa-cycle.svg'] = svgWrapper(800, 400, "MICROBIAL FERMENTATION & THE SCFA METABOLIC CASCADE", "How Prebiotic Fibers Transform Into Butyrate, Acetate & Propionate to Fuel Cells", `
  <!-- Ingestion -->
  <g transform="translate(50, 90)">
    <circle cx="60" cy="70" r="50" fill="#1e293b" stroke="#14b8a6" stroke-width="2" />
    <text x="60" y="60" font-family="sans-serif" font-size="11" font-weight="700" fill="#2dd4bf" text-anchor="middle">PREBIOTIC</text>
    <text x="60" y="75" font-family="sans-serif" font-size="11" font-weight="700" fill="#2dd4bf" text-anchor="middle">FIBERS</text>
    <text x="60" y="92" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">RS3, Inulin, PHGG</text>
  </g>

  <path d="M 120 160 L 170 160" stroke="#14b8a6" stroke-width="3" marker-end="url(#arrowTeal)" />

  <!-- Fermentation -->
  <g transform="translate(180, 90)">
    <rect width="180" height="140" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="180" height="28" rx="12" fill="url(#blueGrad)" />
    <text x="90" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">COLONIC FERMENTATION</text>
    <text x="15" y="55" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Faecalibacterium prausnitzii</text>
    <text x="15" y="75" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Akkermansia muciniphila</text>
    <text x="15" y="95" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Roseburia & Bifidobacteria</text>
    <text x="15" y="115" font-family="sans-serif" font-size="9" fill="#38bdf8">Breaks complex glycosidic bonds</text>
  </g>

  <!-- 3 Branches -->
  <path d="M 370 130 C 400 130, 420 100, 450 100" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowTeal)" />
  <path d="M 370 160 L 450 160" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)" />
  <path d="M 370 190 C 400 190, 420 220, 450 220" stroke="#a855f7" stroke-width="2.5" />

  <!-- Output 1: Butyrate -->
  <g transform="translate(460, 60)">
    <rect width="290" height="65" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <text x="15" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399">BUTYRATE (70% Fuel for Colonocytes)</text>
    <text x="15" y="40" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Upregulates tight junction proteins (ZO-1, claudins)</text>
    <text x="15" y="55" font-family="sans-serif" font-size="9.5" fill="#94a3b8">• Histone Deacetylase (HDAC) inhibitor ➔ Anti-tumor & anti-inflammatory</text>
  </g>

  <!-- Output 2: Acetate -->
  <g transform="translate(460, 135)">
    <rect width="290" height="65" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <text x="15" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8">ACETATE (Peripheral Circulation & Brain)</text>
    <text x="15" y="40" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Crosses Blood-Brain Barrier ➔ Hypothalamic appetite control</text>
    <text x="15" y="55" font-family="sans-serif" font-size="9.5" fill="#94a3b8">• Substrate for lipogenesis in muscle & brown adipose tissue</text>
  </g>

  <!-- Output 3: Propionate -->
  <g transform="translate(460, 210)">
    <rect width="290" height="65" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="1.5" />
    <text x="15" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#c084fc">PROPIONATE (Hepatic Metabolism)</text>
    <text x="15" y="40" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Directly inhibits hepatic HMG-CoA reductase (lowers cholesterol)</text>
    <text x="15" y="55" font-family="sans-serif" font-size="9.5" fill="#94a3b8">• Modulates gluconeogenesis & enhances GLP-1 insulin sensitivity</text>
  </g>

  <!-- Bottom Summary Strip -->
  <g transform="translate(50, 310)">
    <rect width="700" height="55" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="20" y="24" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b">CLINICAL TAKEAWAY:</text>
    <text x="20" y="42" font-family="sans-serif" font-size="10" fill="#e2e8f0">Without fermentable resistant starch and diverse fibers, your microbiome starves, colonocytes undergo autophagy, and mucosal integrity collapses within 72 hours.</text>
  </g>
`);

// 5. 12 Hallmarks of Aging Wheel
diagrams['12-hallmarks-aging.svg'] = svgWrapper(800, 440, "THE 12 HALLMARKS OF CELLULAR AGING (LÓPEZ-OTÍN 2023)", "The Molecular Targets of Evidence-Based Geroscience & Biological Age Reversal", `
  <!-- Left Column: Primary Drivers -->
  <g transform="translate(40, 80)">
    <rect width="225" height="320" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <rect width="225" height="28" rx="12" fill="url(#blueGrad)" />
    <text x="112" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">PRIMARY (DAMAGE DRIVERS)</text>
    
    <text x="15" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">1. Genomic Instability</text>
    <text x="25" y="70" font-family="sans-serif" font-size="9" fill="#94a3b8">DNA repair, BER/NER failure</text>

    <text x="15" y="95" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">2. Telomere Attrition</text>
    <text x="25" y="110" font-family="sans-serif" font-size="9" fill="#94a3b8">Chromosome end-cap erosion</text>

    <text x="15" y="135" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">3. Epigenetic Alterations</text>
    <text x="25" y="150" font-family="sans-serif" font-size="9" fill="#94a3b8">DNA methylation drift (Horvath)</text>

    <text x="15" y="175" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">4. Loss of Proteostasis</text>
    <text x="25" y="190" font-family="sans-serif" font-size="9" fill="#94a3b8">Misfolded protein accumulation</text>

    <text x="15" y="215" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">5. Disabled Macroautophagy</text>
    <text x="25" y="230" font-family="sans-serif" font-size="9" fill="#94a3b8">Inability to clear cellular waste</text>

    <rect x="15" y="255" width="195" height="50" rx="8" fill="#0f172a" />
    <text x="25" y="275" font-family="sans-serif" font-size="9" font-weight="600" fill="#38bdf8">Core Clinical Therapies:</text>
    <text x="25" y="292" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">Autophagy, Fasting, NAD+, Exercise</text>
  </g>

  <!-- Middle Column: Antagonistic Responses -->
  <g transform="translate(285, 80)">
    <rect width="225" height="320" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
    <rect width="225" height="28" rx="12" fill="url(#amberGrad)" />
    <text x="112" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">ANTAGONISTIC (RESPONSE)</text>
    
    <text x="15" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b">6. Deregulated Nutrient Sensing</text>
    <text x="25" y="70" font-family="sans-serif" font-size="9" fill="#94a3b8">Chronic mTOR / IGF-1 elevation</text>

    <text x="15" y="105" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b">7. Mitochondrial Dysfunction</text>
    <text x="25" y="120" font-family="sans-serif" font-size="9" fill="#94a3b8">Reduced ATP & high electron leak</text>

    <text x="15" y="155" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b">8. Cellular Senescence</text>
    <text x="25" y="170" font-family="sans-serif" font-size="9" fill="#94a3b8">'Zombie' cells secreting toxic SASP</text>

    <rect x="15" y="255" width="195" height="50" rx="8" fill="#0f172a" />
    <text x="25" y="275" font-family="sans-serif" font-size="9" font-weight="600" fill="#f59e0b">Core Clinical Therapies:</text>
    <text x="25" y="292" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">AMPK switches, Senolytics, Zone 2</text>
  </g>

  <!-- Right Column: Integrative Phenotypes -->
  <g transform="translate(530, 80)">
    <rect width="230" height="320" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <rect width="230" height="28" rx="12" fill="url(#emeraldGrad)" />
    <text x="115" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">INTEGRATIVE (SYSTEMIC)</text>
    
    <text x="15" y="55" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">9. Stem Cell Exhaustion</text>
    <text x="25" y="70" font-family="sans-serif" font-size="9" fill="#94a3b8">Loss of regenerative reserve</text>

    <text x="15" y="95" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">10. Altered Intercellular Signal</text>
    <text x="25" y="110" font-family="sans-serif" font-size="9" fill="#94a3b8">Loss of hormonal/endocrine rhythm</text>

    <text x="15" y="135" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">11. Chronic Inflammaging</text>
    <text x="25" y="150" font-family="sans-serif" font-size="9" fill="#94a3b8">Sterile cytokine-mediated decay</text>

    <text x="15" y="175" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">12. Microbiome Dysbiosis</text>
    <text x="25" y="190" font-family="sans-serif" font-size="9" fill="#94a3b8">Loss of keystone barrier protectors</text>

    <rect x="15" y="255" width="200" height="50" rx="8" fill="#0f172a" />
    <text x="25" y="275" font-family="sans-serif" font-size="9" font-weight="600" fill="#34d399">Core Clinical Therapies:</text>
    <text x="25" y="292" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">Thermal stress, Diet, Omega-3s, Gut repair</text>
  </g>
`);

// 6. AMPK vs mTOR Switch
diagrams['ampk-mtor-switch.svg'] = svgWrapper(800, 420, "THE AMPK / mTOR METABOLIC SEESAW", "Balancing Cellular Housekeeping (Autophagy/Repair) vs Anabolic Synthesis (Growth)", `
  <!-- Left Side: AMPK Repair Mode -->
  <g transform="translate(50, 80)">
    <rect width="330" height="260" rx="14" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="330" height="34" rx="14" fill="url(#emeraldGrad)" />
    <text x="165" y="22" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">AMPK ON: "REPAIR & HOUSEKEEPING"</text>

    <text x="20" y="60" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399">PRIMARY TRIGGERS:</text>
    <text x="20" y="80" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Intermittent Fasting (16:8 or 24h)</text>
    <text x="20" y="100" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Zone 2 Cardio & Low Muscle Glycogen</text>
    <text x="20" y="120" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Cold Thermogenesis, Berberine, Resveratrol</text>

    <text x="20" y="150" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399">DOWNSTREAM BIOLOGICAL OUTPUTS:</text>
    <text x="20" y="170" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Activates Autophagy (ULK1 phosphorylation)</text>
    <text x="20" y="190" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Mitochondrial Biogenesis (PGC-1α)</text>
    <text x="20" y="210" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Fatty Acid Oxidation (Burns Visceral Fat)</text>
    <text x="20" y="230" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Downregulates mTORC1 via TSC2</text>
  </g>

  <!-- Right Side: mTOR Growth Mode -->
  <g transform="translate(420, 80)">
    <rect width="330" height="260" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="330" height="34" rx="14" fill="url(#blueGrad)" />
    <text x="165" y="22" font-family="sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">mTOR ON: "BUILD & GROW"</text>

    <text x="20" y="60" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8">PRIMARY TRIGGERS:</text>
    <text x="20" y="80" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Dietary Amino Acids (Leucine &gt; 3g threshold)</text>
    <text x="20" y="100" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Heavy Resistance Training (Mechanical load)</text>
    <text x="20" y="120" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Insulin and IGF-1 Spikes (Carb feeding)</text>

    <text x="20" y="150" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8">DOWNSTREAM BIOLOGICAL OUTPUTS:</text>
    <text x="20" y="170" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Muscle Protein Synthesis (Prevents Sarcopenia)</text>
    <text x="20" y="190" font-family="sans-serif" font-size="10" fill="#cbd5e1">✔ Bone Mineral Density & Connective Tissue</text>
    <text x="20" y="210" font-family="sans-serif" font-size="10" fill="#cbd5e1">✘ Autophagy Suppressed (No cellular waste cleanup)</text>
    <text x="20" y="230" font-family="sans-serif" font-size="10" fill="#cbd5e1">✘ Chronic elevation accelerates cellular senescence</text>
  </g>

  <!-- Bottom Recommendation Card -->
  <g transform="translate(50, 355)">
    <rect width="700" height="45" rx="8" fill="#0f172a" stroke="#475569" stroke-width="1" />
    <text x="350" y="27" font-family="sans-serif" font-size="11" font-weight="600" fill="#f8fafc" text-anchor="middle">OPTIMAL PROTOCOL: Night = AMPK Clean-up (Fasting) | Day = mTOR Pulses (Workout + Protein)</text>
  </g>
`);

// 7. Mitochondrial Biogenesis Pathway
diagrams['mitochondrial-biogenesis.svg'] = svgWrapper(800, 400, "MITOCHONDRIAL BIOGENESIS: PGC-1α CASCADE", "How Cold, Exercise, and NAD+ Trigger New, High-Efficiency Cellular Powerhouses", `
  <!-- Upstream triggers -->
  <g transform="translate(50, 90)">
    <rect width="200" height="230" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="100" y="28" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">UPSTREAM STIMULI</text>

    <rect x="15" y="45" width="170" height="35" rx="8" fill="#0f172a" />
    <text x="25" y="67" font-family="sans-serif" font-size="10" fill="#f8fafc">Zone 2 Cardio (CaMK/p38)</text>

    <rect x="15" y="90" width="170" height="35" rx="8" fill="#0f172a" />
    <text x="25" y="112" font-family="sans-serif" font-size="10" fill="#f8fafc">Fasting / AMP Surge (AMPK)</text>

    <rect x="15" y="135" width="170" height="35" rx="8" fill="#0f172a" />
    <text x="25" y="157" font-family="sans-serif" font-size="10" fill="#f8fafc">NMN / NR / Fasting (SIRT1)</text>

    <rect x="15" y="180" width="170" height="35" rx="8" fill="#0f172a" />
    <text x="25" y="202" font-family="sans-serif" font-size="10" fill="#f8fafc">Cold Exposure (β-Adrenergic)</text>
  </g>

  <!-- Arrow to Master Hub -->
  <path d="M 260 205 L 310 205" stroke="#14b8a6" stroke-width="4" marker-end="url(#arrowTeal)" />

  <!-- Center Hub: PGC-1alpha -->
  <g transform="translate(320, 120)">
    <circle cx="80" cy="85" r="75" fill="#1e293b" stroke="#14b8a6" stroke-width="3" />
    <text x="80" y="70" font-family="sans-serif" font-size="13" font-weight="800" fill="#2dd4bf" text-anchor="middle">PGC-1α</text>
    <text x="80" y="90" font-family="sans-serif" font-size="9" font-weight="600" fill="#e2e8f0" text-anchor="middle">Master Coactivator of</text>
    <text x="80" y="105" font-family="sans-serif" font-size="9" font-weight="600" fill="#e2e8f0" text-anchor="middle">Mitochondrial Life</text>
  </g>

  <!-- Arrow to Nuclear Transcription -->
  <path d="M 485 205 L 535 205" stroke="#14b8a6" stroke-width="4" marker-end="url(#arrowTeal)" />

  <!-- Downstream Effectors -->
  <g transform="translate(545, 90)">
    <rect width="205" height="230" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <text x="102" y="28" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">DOWNSTREAM TARGETS</text>

    <text x="15" y="60" font-family="sans-serif" font-size="10" font-weight="600" fill="#f8fafc">• NRF-1 & NRF-2</text>
    <text x="25" y="75" font-family="sans-serif" font-size="9" fill="#94a3b8">Nuclear respiratory factors</text>

    <text x="15" y="105" font-family="sans-serif" font-size="10" font-weight="600" fill="#f8fafc">• TFAM Transcription</text>
    <text x="25" y="120" font-family="sans-serif" font-size="9" fill="#94a3b8">Copies mtDNA & ETC complexes</text>

    <text x="15" y="150" font-family="sans-serif" font-size="10" font-weight="600" fill="#f8fafc">• Mitophagy (Urolithin A)</text>
    <text x="25" y="165" font-family="sans-serif" font-size="9" fill="#94a3b8">Prunes defective, leaky units</text>

    <rect x="15" y="185" width="175" height="30" rx="6" fill="#064e3b" />
    <text x="102" y="204" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#a7f3d0" text-anchor="middle">➔ 30-50% Higher ATP Output</text>
  </g>
`);

// 8. Hormesis Thermal Curve
diagrams['hormesis-thermal-curve.svg'] = svgWrapper(800, 400, "THE HORMESIS DOSE-RESPONSE CURVE: HEAT & COLD", "Why Brief Controlled Stress Extends Healthspan While Chronic Stress Destroys It", `
  <!-- Curve graph axes -->
  <g transform="translate(100, 80)">
    <!-- Y Axis -->
    <line x1="0" y1="0" x2="0" y2="240" stroke="#64748b" stroke-width="2" />
    <text x="-40" y="20" font-family="sans-serif" font-size="10" fill="#34d399" transform="rotate(-90, -40, 20)">Biological Resilience (HSP70, BDNF)</text>

    <!-- X Axis -->
    <line x1="0" y1="200" x2="600" y2="200" stroke="#64748b" stroke-width="2" />
    <text x="300" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Thermal Stress Dose (Intensity x Duration)</text>

    <!-- Zero Baseline -->
    <line x1="0" y1="200" x2="600" y2="200" stroke="#475569" stroke-width="1" stroke-dasharray="4,4" />
    <text x="10" y="190" font-family="sans-serif" font-size="9" fill="#94a3b8">Baseline Homeostasis</text>

    <!-- Hormesis Inverted U curve -->
    <path d="M 0 200 Q 180 -20, 360 200 T 560 300" fill="none" stroke="#22d3ee" stroke-width="4" />

    <!-- Sweet Spot Zone -->
    <rect x="110" y="20" width="160" height="175" rx="8" fill="rgba(34, 211, 238, 0.1)" stroke="#0891b2" stroke-width="1" stroke-dasharray="4,4" />
    <text x="190" y="45" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">HORMETIC SWEET SPOT</text>
    <text x="190" y="65" font-family="sans-serif" font-size="9" fill="#e2e8f0" text-anchor="middle">• Sauna: 19-20 min @ 85°C</text>
    <text x="190" y="80" font-family="sans-serif" font-size="9" fill="#e2e8f0" text-anchor="middle">• Cold Plunge: 2-3 min @ 10°C</text>
    <text x="190" y="100" font-family="sans-serif" font-size="9" font-weight="600" fill="#34d399" text-anchor="middle">+40% All-Cause Mortality Benefit</text>

    <!-- Sub-threshold zone -->
    <text x="45" y="160" font-family="sans-serif" font-size="9" fill="#94a3b8">Sub-threshold (no stimulus)</text>

    <!-- Toxic zone -->
    <text x="460" y="170" font-family="sans-serif" font-size="10" font-weight="700" fill="#f43f5e">Exhaustion / Toxicity</text>
    <text x="460" y="185" font-family="sans-serif" font-size="8.5" fill="#fca5a5">(Rhabdo, heat stroke, hypothermia)</text>
  </g>
`);

// 9. Liver Detox Phases
diagrams['liver-detox-phases.svg'] = svgWrapper(800, 400, "LIVER DETOXIFICATION: PHASE I & PHASE II DUAL PATHWAY", "How Toxins Are Functionalized and Conjugated for Safe Excretion", `
  <!-- Fat-Soluble Toxins -->
  <g transform="translate(40, 100)">
    <rect width="180" height="110" rx="12" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" />
    <text x="90" y="30" font-family="sans-serif" font-size="11" font-weight="700" fill="#f43f5e" text-anchor="middle">FAT-SOLUBLE TOXINS</text>
    <text x="15" y="55" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Pesticides & Microplastics</text>
    <text x="15" y="75" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Prescription Metabolites</text>
    <text x="15" y="95" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Endogenous Steroids/Bile</text>
  </g>

  <path d="M 230 155 L 270 155" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Phase 1: CYP450 -->
  <g transform="translate(280, 80)">
    <rect width="210" height="150" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="210" height="28" rx="12" fill="url(#blueGrad)" />
    <text x="105" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">PHASE I: CYP450 ENZYMES</text>
    <text x="15" y="52" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Oxidation, Reduction, Hydrolysis</text>
    <text x="15" y="72" font-family="sans-serif" font-size="9.5" fill="#f59e0b">⚠️ Produces Reactive Intermediates</text>
    <text x="15" y="90" font-family="sans-serif" font-size="8.5" fill="#94a3b8">(More toxic than parent molecule!)</text>
    <text x="15" y="112" font-family="sans-serif" font-size="9" font-weight="600" fill="#38bdf8">Cofactors: B2, B3, B6, Folate, Zinc</text>
    <text x="15" y="128" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Antioxidants: Glutathione, Vit C & E</text>
  </g>

  <path d="M 500 155 L 535 155" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Phase 2: Conjugation -->
  <g transform="translate(545, 80)">
    <rect width="215" height="150" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="215" height="28" rx="12" fill="url(#emeraldGrad)" />
    <text x="107" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">PHASE II: CONJUGATION</text>
    <text x="15" y="52" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Glutathione Conjugation (NAC)</text>
    <text x="15" y="72" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Sulfation & Methylation (TMG)</text>
    <text x="15" y="92" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Glucuronidation & Glycine path</text>
    <text x="15" y="112" font-family="sans-serif" font-size="9" font-weight="600" fill="#10b981">Cruciferous vegetables (Sulforaphane)</text>
    <text x="15" y="128" font-family="sans-serif" font-size="8.5" fill="#a7f3d0">Converts toxins to water-soluble forms</text>
  </g>

  <!-- Bottom: Elimination Route -->
  <g transform="translate(180, 260)">
    <rect width="440" height="90" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
    <text x="220" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc" text-anchor="middle">PHASE III: SAFE SYSTEMIC EXCRETION</text>
    <g transform="translate(20, 40)">
      <rect width="185" height="36" rx="8" fill="#0f172a" />
      <text x="92" y="17" font-family="sans-serif" font-size="10" font-weight="600" fill="#38bdf8" text-anchor="middle">KIDNEYS ➔ URINE</text>
      <text x="92" y="30" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">Requires 3L+ Electrolyte Water</text>
    </g>
    <g transform="translate(235, 40)">
      <rect width="185" height="36" rx="8" fill="#0f172a" />
      <text x="92" y="17" font-family="sans-serif" font-size="10" font-weight="600" fill="#10b981" text-anchor="middle">BILE ➔ STOOL (FIBER BIND)</text>
      <text x="92" y="30" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">Requires 35g+ daily insoluble fiber</text>
    </g>
  </g>
`);

// 10. Glucose Insulin Curve
diagrams['glucose-insulin-curve.svg'] = svgWrapper(800, 400, "GLUCOSE & INSULIN DYNAMICS: ROLLERCOASTER VS METABOLIC FLEXIBILITY", "Why Spike-and-Crash Feeding Patterns Drive Craving, Brain Fog & Visceral Fat", `
  <!-- Graph Axes -->
  <g transform="translate(80, 80)">
    <line x1="0" y1="0" x2="0" y2="220" stroke="#64748b" stroke-width="2" />
    <line x1="0" y1="200" x2="640" y2="200" stroke="#64748b" stroke-width="2" />
    <text x="320" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Time of Day (8 AM ➔ 12 PM ➔ 4 PM ➔ 8 PM)</text>
    <text x="-35" y="20" font-family="sans-serif" font-size="10" fill="#94a3b8" transform="rotate(-90, -35, 20)">Blood Glucose (mg/dL)</text>

    <!-- Normal Target Band (70 - 110 mg/dL) -->
    <rect x="0" y="110" width="640" height="70" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" stroke-width="0.5" stroke-dasharray="2,2" />
    <text x="645" y="150" font-family="sans-serif" font-size="9" fill="#10b981">Optimal Band (70-110)</text>

    <!-- Rollercoaster Curve (Standard American Diet: Bagel, Soda, Snacks) -->
    <path d="M 0 160 Q 60 20, 120 160 T 240 220 Q 300 30, 360 170 T 480 230 Q 540 40, 600 160" fill="none" stroke="#f43f5e" stroke-width="3.5" />
    <text x="140" y="45" font-family="sans-serif" font-size="10" font-weight="700" fill="#f43f5e">Postprandial Spike (&gt;160 mg/dL)</text>
    <text x="210" y="240" font-family="sans-serif" font-size="9" font-weight="700" fill="#f87171">Hypoglycemic Crash (Hunger/Brain Fog)</text>

    <!-- Dr Arif Metabolic Blueprint Curve (Protein + Fiber First + TRF) -->
    <path d="M 0 145 C 80 135, 120 130, 180 140 C 240 150, 300 130, 420 135 C 500 140, 560 145, 640 140" fill="none" stroke="#22d3ee" stroke-width="3" />
    <text x="420" y="115" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">Metabolically Flexible Curve (Variance &lt; 30 mg/dL)</text>
  </g>

  <!-- Legend -->
  <g transform="translate(180, 345)">
    <line x1="0" y1="10" x2="30" y2="10" stroke="#f43f5e" stroke-width="3" />
    <text x="38" y="14" font-family="sans-serif" font-size="10" fill="#cbd5e1">Refined Carbs & Snacking</text>

    <line x1="220" y1="10" x2="250" y2="10" stroke="#22d3ee" stroke-width="3" />
    <text x="258" y="14" font-family="sans-serif" font-size="10" fill="#cbd5e1">Dr. Arif 7-Day Reset Protocol</text>
  </g>
`);

// 11. 7-Day Protocol Timeline
diagrams['7day-protocol-timeline.svg'] = svgWrapper(800, 380, "THE 7-DAY METABOLIC RESET ROADMAP", "Phase 1: Flush (Days 1-2) ➔ Phase 2: Sensitize (Days 3-5) ➔ Phase 3: Stabilize (Days 6-7)", `
  <!-- Day 1-2 -->
  <g transform="translate(40, 90)">
    <rect width="215" height="230" rx="12" fill="#1e293b" stroke="#14b8a6" stroke-width="2" />
    <rect width="215" height="32" rx="12" fill="url(#tealGrad)" />
    <text x="107" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">DAYS 1 - 2: THE FLUSH</text>
    <text x="15" y="60" font-family="sans-serif" font-size="10" font-weight="600" fill="#2dd4bf">Objective: Deplete Glycogen</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Eliminate all processed sugars & dairy</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 3L lemon-electrolyte water daily</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 2 Cups Bone Broth / Potassium Broth</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Light Zone 2 Walking (30 min)</text>
    <rect x="15" y="185" width="185" height="30" rx="6" fill="#0f172a" />
    <text x="107" y="204" font-family="sans-serif" font-size="9" fill="#14b8a6" text-anchor="middle">Result: 2-4 lbs water weight & bloat gone</text>
  </g>

  <!-- Arrow -->
  <path d="M 265 200 L 285 200" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Day 3-5 -->
  <g transform="translate(290, 90)">
    <rect width="215" height="230" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="215" height="32" rx="12" fill="url(#blueGrad)" />
    <text x="107" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">DAYS 3 - 5: SENSITIZE</text>
    <text x="15" y="60" font-family="sans-serif" font-size="10" font-weight="600" fill="#38bdf8">Objective: Restore Insulin Sensitivity</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 16:8 Time-Restricted Feeding</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Eat fiber & protein first, carbs last</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 1 Tbsp ACV in 4oz water pre-meal</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Resistance training post-fast break</text>
    <rect x="15" y="185" width="185" height="30" rx="6" fill="#0f172a" />
    <text x="107" y="204" font-family="sans-serif" font-size="9" fill="#38bdf8" text-anchor="middle">Result: Glucose spikes drop 40%</text>
  </g>

  <!-- Arrow -->
  <path d="M 515 200 L 535 200" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Day 6-7 -->
  <g transform="translate(540, 90)">
    <rect width="220" height="230" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="220" height="32" rx="12" fill="url(#emeraldGrad)" />
    <text x="110" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">DAYS 6 - 7: STABILIZE</text>
    <text x="15" y="60" font-family="sans-serif" font-size="10" font-weight="600" fill="#34d399">Objective: Long-Term Flexibility</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Re-introduce complex resistant starches</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Seed fermented foods (kefir/sauerkraut)</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Calibrate sustainable eating schedule</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Measure fasting glucose & waistline</text>
    <rect x="15" y="185" width="190" height="30" rx="6" fill="#0f172a" />
    <text x="110" y="204" font-family="sans-serif" font-size="9" fill="#34d399" text-anchor="middle">Result: Sustained all-day cellular energy</text>
  </g>
`);

// 12. Fasting Autophagy Timeline
diagrams['fasting-autophagy-timeline.svg'] = svgWrapper(800, 420, "THE CELLULAR FASTING CLOCK: 0 TO 72 HOURS", "Metabolic Milestones: Glycogen Depletion, Ketogenesis, Autophagy & Stem Cell Renewal", `
  <!-- Timeline horizontal bar -->
  <g transform="translate(60, 90)">
    <line x1="0" y1="50" x2="680" y2="50" stroke="#475569" stroke-width="4" />
    
    <!-- Milestone 1: 0-12h -->
    <circle cx="20" cy="50" r="10" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
    <text x="20" y="30" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">12 HOURS</text>
    <rect x="-10" y="75" width="125" height="110" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="52" y="95" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#38bdf8" text-anchor="middle">Insulin Drops</text>
    <text x="0" y="115" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Digestive tract rest</text>
    <text x="0" y="130" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Glycogen begins burn</text>
    <text x="0" y="145" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• MMC sweeps gut</text>

    <!-- Milestone 2: 16-18h -->
    <circle cx="180" cy="50" r="10" fill="#10b981" stroke="#ffffff" stroke-width="2" />
    <text x="180" y="30" font-family="sans-serif" font-size="10" font-weight="700" fill="#10b981" text-anchor="middle">16 - 18 HOURS</text>
    <rect x="120" y="75" width="135" height="110" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1" />
    <text x="187" y="95" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#34d399" text-anchor="middle">Autophagy Begins</text>
    <text x="128" y="115" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Lipolysis accelerates</text>
    <text x="128" y="130" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• ULK1 activates cleanup</text>
    <text x="128" y="145" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Mild ketone synthesis</text>

    <!-- Milestone 3: 24h -->
    <circle cx="360" cy="50" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    <text x="360" y="30" font-family="sans-serif" font-size="10" font-weight="700" fill="#f59e0b" text-anchor="middle">24 HOURS</text>
    <rect x="300" y="75" width="135" height="110" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1" />
    <text x="367" y="95" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#fbbf24" text-anchor="middle">Autophagy Peaks</text>
    <text x="308" y="115" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Liver glycogen empty</text>
    <text x="308" y="130" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Intestinal stem repair</text>
    <text x="308" y="145" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• BDNF surges in brain</text>

    <!-- Milestone 4: 48-72h -->
    <circle cx="580" cy="50" r="10" fill="#a855f7" stroke="#ffffff" stroke-width="2" />
    <text x="580" y="30" font-family="sans-serif" font-size="10" font-weight="700" fill="#a855f7" text-anchor="middle">48 - 72 HOURS</text>
    <rect x="500" y="75" width="165" height="110" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="1" />
    <text x="582" y="95" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#c084fc" text-anchor="middle">Immune System Reset</text>
    <text x="508" y="115" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Apoptosis of damaged WBCs</text>
    <text x="508" y="130" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Hematopoietic stem activation</text>
    <text x="508" y="145" font-family="sans-serif" font-size="8.5" fill="#cbd5e1">• Deep systemic rejuvenation</text>
  </g>

  <!-- Bottom clinical quote -->
  <g transform="translate(60, 320)">
    <rect width="680" height="50" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="340" y="23" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#14b8a6" text-anchor="middle">DR. ARIF'S CLINICAL NOTE:</text>
    <text x="340" y="39" font-family="sans-serif" font-size="10" fill="#e2e8f0" text-anchor="middle">You do NOT need 72-hour fasts every week. Daily 16:8 + quarterly 36h fast delivers 90% of longevity benefits without muscle loss.</text>
  </g>
`);

// 13. Ghrelin Hunger Waves
diagrams['ghrelin-hunger-waves.svg'] = svgWrapper(800, 380, "THE PHYSIOLOGY OF HUNGER: GHRELIN CIRCADIAN WAVES", "Hunger Is Not Linear: It Comes in 20-30 Minute Pulses, Then Recedes on Its Own", `
  <!-- Graph Axes -->
  <g transform="translate(80, 80)">
    <line x1="0" y1="0" x2="0" y2="200" stroke="#64748b" stroke-width="2" />
    <line x1="0" y1="180" x2="640" y2="180" stroke="#64748b" stroke-width="2" />
    <text x="320" y="215" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Hours of Fasting (8 AM ➔ 12 PM ➔ 4 PM ➔ 8 PM)</text>
    <text x="-35" y="20" font-family="sans-serif" font-size="10" fill="#94a3b8" transform="rotate(-90, -35, 20)">Ghrelin Sensation (Perceived Hunger)</text>

    <!-- Mythical Linear Hunger (Dotted red line) -->
    <line x1="0" y1="180" x2="600" y2="20" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,4" />
    <text x="500" y="35" font-family="sans-serif" font-size="9" fill="#f87171">Myth: "Hunger gets worse forever"</text>

    <!-- Actual Ghrelin Waves -->
    <path d="M 0 160 Q 60 40, 120 160 T 240 160 Q 300 50, 360 160 T 480 160 Q 540 60, 600 160" fill="none" stroke="#38bdf8" stroke-width="3.5" />

    <!-- Wave 1 (Breakfast habitual time) -->
    <text x="60" y="35" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#38bdf8" text-anchor="middle">Wave 1: Habitual Meal</text>
    <text x="60" y="50" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">(Surfs down in 20 min)</text>

    <!-- Wave 2 (Lunch time) -->
    <text x="300" y="45" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#38bdf8" text-anchor="middle">Wave 2: Lunch Habit</text>
    
    <!-- Solution box -->
    <rect x="220" y="240" width="300" height="35" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1" />
    <text x="370" y="262" font-family="sans-serif" font-size="10" font-weight="600" fill="#34d399" text-anchor="middle">Solution: Black coffee, green tea, or mineral water</text>
  </g>
`);

// 14. Clean Fast Breaking Steps
diagrams['clean-fast-break-steps.svg'] = svgWrapper(800, 380, "THE 3-STAGE FAST BREAKING PROTOCOL", "Preventing Gastric Distress & Osmotic Diarrhea After 16h - 36h+ Fasts", `
  <!-- Stage 1 -->
  <g transform="translate(40, 90)">
    <rect width="215" height="230" rx="12" fill="#1e293b" stroke="#14b8a6" stroke-width="2" />
    <rect width="215" height="32" rx="12" fill="url(#tealGrad)" />
    <text x="107" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">STAGE 1: HYDRATE & PRIME</text>
    <text x="107" y="55" font-family="sans-serif" font-size="10" font-weight="600" fill="#2dd4bf" text-anchor="middle">MINUTE 0</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 1 Glass Warm Water</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 1 Tbsp Apple Cider Vinegar</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Pinch of Himalayan Pink Salt</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Awakens stomach acid (HCl)</text>
    <rect x="15" y="185" width="185" height="30" rx="6" fill="#0f172a" />
    <text x="107" y="204" font-family="sans-serif" font-size="9" fill="#14b8a6" text-anchor="middle">Wait 15 minutes before food</text>
  </g>

  <!-- Arrow -->
  <path d="M 265 200 L 285 200" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Stage 2 -->
  <g transform="translate(290, 90)">
    <rect width="215" height="230" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="215" height="32" rx="12" fill="url(#blueGrad)" />
    <text x="107" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">STAGE 2: GENTLE FATS</text>
    <text x="107" y="55" font-family="sans-serif" font-size="10" font-weight="600" fill="#38bdf8" text-anchor="middle">MINUTE 15 - 30</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 1 Cup Warm Bone Broth</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Or 1/2 Avocado with sea salt</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Or 5-6 Soaked Raw Almonds</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Signals gallbladder bile release</text>
    <rect x="15" y="185" width="185" height="30" rx="6" fill="#0f172a" />
    <text x="107" y="204" font-family="sans-serif" font-size="9" fill="#38bdf8" text-anchor="middle">Zero insulin surge</text>
  </g>

  <!-- Arrow -->
  <path d="M 515 200 L 535 200" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Stage 3 -->
  <g transform="translate(540, 90)">
    <rect width="220" height="230" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="220" height="32" rx="12" fill="url(#emeraldGrad)" />
    <text x="110" y="21" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">STAGE 3: SOLID MEAL</text>
    <text x="110" y="55" font-family="sans-serif" font-size="10" font-weight="600" fill="#34d399" text-anchor="middle">MINUTE 45+</text>
    <text x="15" y="85" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• 30-40g High-Quality Protein</text>
    <text x="15" y="110" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• (Wild salmon, eggs, grass-fed beef)</text>
    <text x="15" y="135" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Generous leafy greens with EVOO</text>
    <text x="15" y="160" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">• Avoid high-glycemic carbs here</text>
    <rect x="15" y="185" width="190" height="30" rx="6" fill="#0f172a" />
    <text x="110" y="204" font-family="sans-serif" font-size="9" fill="#34d399" text-anchor="middle">Maximizes muscle synthesis</text>
  </g>
`);

// 15. Endothelial Nitric Oxide
diagrams['endothelial-nitric-oxide.svg'] = svgWrapper(800, 400, "THE ENDOTHELIAL NITRIC OXIDE (NO) VASODILATION CASCADE", "The Molecular Miracle of Blood Pressure Normalization & Arterial Elasticity", `
  <!-- L-Arginine / Nitrate Source -->
  <g transform="translate(50, 90)">
    <rect width="180" height="130" rx="12" fill="#1e293b" stroke="#14b8a6" stroke-width="2" />
    <text x="90" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#2dd4bf" text-anchor="middle">NITRATE INPUTS</text>
    <text x="15" y="50" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Beets & Beetroot juice</text>
    <text x="15" y="70" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Arugula & Leafy Greens</text>
    <text x="15" y="90" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• L-Arginine & L-Citrulline</text>
    <text x="15" y="110" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Salivary oral bacteria convert</text>
  </g>

  <path d="M 240 155 L 280 155" stroke="#14b8a6" stroke-width="3" marker-end="url(#arrowTeal)" />

  <!-- Endothelial Cell: eNOS -->
  <g transform="translate(290, 80)">
    <rect width="210" height="150" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect width="210" height="28" rx="12" fill="url(#blueGrad)" />
    <text x="105" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">ENDOTHELIAL LAYER (eNOS)</text>
    <text x="15" y="52" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Shear Stress (Zone 2 Cardio)</text>
    <text x="15" y="72" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• BH4 Cofactor Activation</text>
    <text x="15" y="92" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">➔ Nitric Oxide Gas (NO) Release</text>
    <text x="15" y="115" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Diffuses into vascular smooth muscle</text>
    <text x="15" y="130" font-family="sans-serif" font-size="8.5" fill="#f87171">Blocked by antiseptic mouthwash!</text>
  </g>

  <path d="M 510 155 L 550 155" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />

  <!-- Vascular Smooth Muscle -->
  <g transform="translate(560, 80)">
    <rect width="195" height="150" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect width="195" height="28" rx="12" fill="url(#emeraldGrad)" />
    <text x="97" y="19" font-family="sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">SMOOTH MUSCLE RELAXATION</text>
    <text x="12" y="52" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Soluble Guanylyl Cyclase (sGC)</text>
    <text x="12" y="72" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• GTP ➔ cyclic GMP (cGMP)</text>
    <text x="12" y="92" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Intracellular Calcium drops</text>
    <rect x="10" y="110" width="175" height="28" rx="6" fill="#064e3b" />
    <text x="97" y="128" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#a7f3d0" text-anchor="middle">➔ ARTERIAL VASODILATION</text>
  </g>

  <!-- Bottom Result Banner -->
  <g transform="translate(50, 260)">
    <rect width="705" height="90" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="352" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#2dd4bf" text-anchor="middle">CLINICAL IMPACT ON BLOOD PRESSURE & LONGEVITY</text>
    <text x="30" y="52" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Reduces Systolic BP by 5-10 mmHg without pharmaceutical beta-blockers or ACE inhibitors</text>
    <text x="30" y="72" font-family="sans-serif" font-size="10" fill="#e2e8f0">• Prevents platelet aggregation, arterial stiffness & microvascular ischemic strokes</text>
  </g>
`);

// 16. Atherosclerosis Progression
diagrams['atherosclerosis-progression.svg'] = svgWrapper(800, 420, "THE TRUE PATHOLOGY OF ATHEROSCLEROSIS: ApoB RETENTION & OXIDATION", "Why Cholesterol Itself Is Not the Cause — Endothelial Injury and Inflammation Are", `
  <!-- Stage 1 -->
  <g transform="translate(40, 90)">
    <rect width="165" height="240" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <text x="82" y="25" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#38bdf8" text-anchor="middle">1. ENDOTHELIAL INJURY</text>
    <text x="12" y="55" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Smoking, toxins</text>
    <text x="12" y="75" font-family="sans-serif" font-size="9" fill="#cbd5e1">• High blood pressure</text>
    <text x="12" y="95" font-family="sans-serif" font-size="9" fill="#cbd5e1">• High glucose / AGEs</text>
    <text x="12" y="115" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Systemic inflammation</text>
    <rect x="10" y="170" width="145" height="50" rx="6" fill="#0f172a" />
    <text x="82" y="190" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">Barrier breached;</text>
    <text x="82" y="205" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">adhesion molecules rise</text>
  </g>

  <path d="M 210 210 L 225 210" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Stage 2 -->
  <g transform="translate(230, 90)">
    <rect width="165" height="240" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
    <text x="82" y="25" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#f59e0b" text-anchor="middle">2. ApoB RETENTION</text>
    <text x="12" y="55" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Small dense LDL particles</text>
    <text x="12" y="75" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Enter sub-endothelial space</text>
    <text x="12" y="95" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Trapped by proteoglycans</text>
    <text x="12" y="115" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Particle count (ApoB) matters</text>
    <rect x="10" y="170" width="145" height="50" rx="6" fill="#0f172a" />
    <text x="82" y="190" font-family="sans-serif" font-size="8.5" fill="#fde68a" text-anchor="middle">Particles cannot escape</text>
    <text x="82" y="205" font-family="sans-serif" font-size="8.5" fill="#fde68a" text-anchor="middle">intimal space</text>
  </g>

  <path d="M 400 210 L 415 210" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Stage 3 -->
  <g transform="translate(420, 90)">
    <rect width="165" height="240" rx="12" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" />
    <text x="82" y="25" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#f43f5e" text-anchor="middle">3. OXIDATION & FOAM</text>
    <text x="12" y="55" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Trapped LDL oxidizes</text>
    <text x="12" y="75" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Monocytes ➔ Macrophages</text>
    <text x="12" y="95" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Engulf oxLDL ➔ Foam cells</text>
    <text x="12" y="115" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Fatty streak develops</text>
    <rect x="10" y="170" width="145" height="50" rx="6" fill="#0f172a" />
    <text x="82" y="190" font-family="sans-serif" font-size="8.5" fill="#fca5a5" text-anchor="middle">Inflammatory cascade</text>
    <text x="82" y="205" font-family="sans-serif" font-size="8.5" fill="#fca5a5" text-anchor="middle">recruits more immune cells</text>
  </g>

  <path d="M 590 210 L 605 210" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Stage 4 -->
  <g transform="translate(610, 90)">
    <rect width="150" height="240" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <text x="75" y="25" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#34d399" text-anchor="middle">4. STABILIZE / REVERSE</text>
    <text x="10" y="55" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Lower ApoB &lt; 70</text>
    <text x="10" y="75" font-family="sans-serif" font-size="9" fill="#cbd5e1">• High Omega-3 (SPMs)</text>
    <text x="10" y="95" font-family="sans-serif" font-size="9" fill="#cbd5e1">• K2 MK-7 + Vit D3</text>
    <text x="10" y="115" font-family="sans-serif" font-size="9" fill="#cbd5e1">• Zone 2 Exercise</text>
    <rect x="8" y="170" width="134" height="50" rx="6" fill="#064e3b" />
    <text x="75" y="190" font-family="sans-serif" font-size="8.5" fill="#a7f3d0" text-anchor="middle">Fibrous cap thickens;</text>
    <text x="75" y="205" font-family="sans-serif" font-size="8.5" fill="#a7f3d0" text-anchor="middle">Rupture risk eliminated</text>
  </g>
`);

// 17. Cardiac Biomarker Matrix
diagrams['cardiac-biomarker-matrix.svg'] = svgWrapper(800, 420, "ADVANCED CARDIOMETABOLIC BIOMARKER MATRIX", "Beyond Basic Cholesterol: Modern Functional Lab Targets for Absolute Risk Prevention", `
  <!-- Grid Matrix Header -->
  <g transform="translate(40, 80)">
    <rect width="720" height="35" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="20" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8">BIOMARKER</text>
    <text x="210" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#f87171">CONVENTIONAL</text>
    <text x="390" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399">DR. ARIF OPTIMAL</text>
    <text x="560" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#f59e0b">CLINICAL ACTION</text>
  </g>

  <!-- Row 1: ApoB -->
  <g transform="translate(40, 125)">
    <rect width="720" height="42" rx="6" fill="#0f172a" stroke="#334155" stroke-width="0.5" />
    <text x="20" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc">Apolipoprotein B (ApoB)</text>
    <text x="210" y="25" font-family="sans-serif" font-size="10" fill="#cbd5e1">&lt; 90 mg/dL</text>
    <text x="390" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">&lt; 60 - 70 mg/dL</text>
    <text x="560" y="25" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Soluble fiber, Berberine, Statins</text>
  </g>

  <!-- Row 2: hs-CRP -->
  <g transform="translate(40, 175)">
    <rect width="720" height="42" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5" />
    <text x="20" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc">High-Sensitivity CRP</text>
    <text x="210" y="25" font-family="sans-serif" font-size="10" fill="#cbd5e1">&lt; 3.0 mg/L</text>
    <text x="390" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">&lt; 0.5 mg/L</text>
    <text x="560" y="25" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Omega-3 EPA/DHA (3g), Curcumin</text>
  </g>

  <!-- Row 3: Fasting Insulin -->
  <g transform="translate(40, 225)">
    <rect width="720" height="42" rx="6" fill="#0f172a" stroke="#334155" stroke-width="0.5" />
    <text x="20" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc">Fasting Insulin</text>
    <text x="210" y="25" font-family="sans-serif" font-size="10" fill="#cbd5e1">&lt; 25 μIU/mL</text>
    <text x="390" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">&lt; 5.0 μIU/mL</text>
    <text x="560" y="25" font-family="sans-serif" font-size="9.5" fill="#94a3b8">16:8 Fasting, Low glycemic diet</text>
  </g>

  <!-- Row 4: Lipoprotein(a) -->
  <g transform="translate(40, 275)">
    <rect width="720" height="42" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5" />
    <text x="20" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc">Lipoprotein(a) [Lp(a)]</text>
    <text x="210" y="25" font-family="sans-serif" font-size="10" fill="#cbd5e1">&lt; 75 nmol/L</text>
    <text x="390" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">&lt; 30 nmol/L</text>
    <text x="560" y="25" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Genetic risk; drive other risk to 0</text>
  </g>

  <!-- Row 5: CAC Score -->
  <g transform="translate(40, 325)">
    <rect width="720" height="42" rx="6" fill="#0f172a" stroke="#334155" stroke-width="0.5" />
    <text x="20" y="25" font-family="sans-serif" font-size="11" font-weight="700" fill="#f8fafc">Coronary Calcium (CAC)</text>
    <text x="210" y="25" font-family="sans-serif" font-size="10" fill="#cbd5e1">Age-matched</text>
    <text x="390" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#34d399">Agatston = 0</text>
    <text x="560" y="25" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Vit K2 (MK-7 200mcg), Magnesium</text>
  </g>
`);

// 18. Circadian Cortisol Melatonin
diagrams['circadian-cortisol-melatonin.svg'] = svgWrapper(800, 420, "THE 24-HOUR CIRCADIAN SEESAW: CORTISOL VS. MELATONIN", "Natural Neuroendocrine Waves vs The Inverted Pattern of Insomnia & Burnout", `
  <!-- Graph axes -->
  <g transform="translate(80, 80)">
    <line x1="0" y1="0" x2="0" y2="220" stroke="#64748b" stroke-width="2" />
    <line x1="0" y1="200" x2="640" y2="200" stroke="#64748b" stroke-width="2" />
    <text x="320" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">24-Hour Cycle: 6 AM (Wake) ➔ 12 PM ➔ 6 PM ➔ 10 PM (Sleep) ➔ 2 AM ➔ 6 AM</text>
    <text x="-35" y="20" font-family="sans-serif" font-size="10" fill="#94a3b8" transform="rotate(-90, -35, 20)">Hormone Concentration</text>

    <!-- Normal Cortisol (Awakening Response, then drops) -->
    <path d="M 0 40 Q 60 10, 150 70 T 320 140 T 480 180 T 640 60" fill="none" stroke="#f59e0b" stroke-width="3.5" />
    <text x="70" y="20" font-family="sans-serif" font-size="10" font-weight="700" fill="#fbbf24">Cortisol Awakening Response (CAR)</text>

    <!-- Normal Melatonin (Low during day, surges at 9 PM) -->
    <path d="M 0 190 L 320 190 Q 420 180, 480 70 T 560 30 T 640 180" fill="none" stroke="#38bdf8" stroke-width="3.5" />
    <text x="510" y="25" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">Melatonin Surge (Deep Rest)</text>

    <!-- Dark Band indicator (10 PM to 6 AM) -->
    <rect x="440" y="0" width="200" height="200" fill="rgba(30, 41, 59, 0.4)" stroke="#475569" stroke-width="0.5" stroke-dasharray="2,2" />
    <text x="540" y="190" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">NIGHT PHASE (Darkness)</text>
  </g>

  <!-- Legend -->
  <g transform="translate(180, 345)">
    <line x1="0" y1="10" x2="30" y2="10" stroke="#f59e0b" stroke-width="3" />
    <text x="38" y="14" font-family="sans-serif" font-size="10" fill="#cbd5e1">Cortisol (Energy & Alertness)</text>

    <line x1="260" y1="10" x2="290" y2="10" stroke="#38bdf8" stroke-width="3" />
    <text x="298" y="14" font-family="sans-serif" font-size="10" fill="#cbd5e1">Melatonin (Cellular Repair & Sleep)</text>
  </g>
`);

// 19. Sleep Cycle Architecture
diagrams['sleep-cycle-architecture.svg'] = svgWrapper(800, 400, "90-MINUTE SLEEP ARCHITECTURE: NREM STAGES 1-3 & REM", "Physical Tissue Repair in Deep Slow-Wave Sleep vs Cognitive Integration in REM", `
  <!-- Stages Container -->
  <g transform="translate(50, 85)">
    <!-- Stage 1 -->
    <g transform="translate(0, 0)">
      <rect width="160" height="230" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
      <rect width="160" height="28" rx="10" fill="#334155" />
      <text x="80" y="19" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">NREM 1 (LIGHT)</text>
      <text x="12" y="55" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Transition from wake</text>
      <text x="12" y="75" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Alpha ➔ Theta waves</text>
      <text x="12" y="95" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Muscle twitching</text>
      <text x="12" y="115" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Duration: 5 - 10 min</text>
      <rect x="10" y="180" width="140" height="30" rx="6" fill="#0f172a" />
      <text x="80" y="199" font-family="sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">5% of Night</text>
    </g>

    <!-- Stage 2 -->
    <g transform="translate(175, 0)">
      <rect width="165" height="230" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
      <rect width="165" height="28" rx="10" fill="url(#blueGrad)" />
      <text x="82" y="19" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">NREM 2 (STABLE)</text>
      <text x="12" y="55" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Sleep spindles</text>
      <text x="12" y="75" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• K-Complex protection</text>
      <text x="12" y="95" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Core body temp drops</text>
      <text x="12" y="115" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Motor memory consolid.</text>
      <rect x="10" y="180" width="145" height="30" rx="6" fill="#0f172a" />
      <text x="82" y="199" font-family="sans-serif" font-size="8.5" fill="#38bdf8" text-anchor="middle">50% of Night</text>
    </g>

    <!-- Stage 3 -->
    <g transform="translate(355, 0)">
      <rect width="170" height="230" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2" />
      <rect width="170" height="28" rx="10" fill="url(#emeraldGrad)" />
      <text x="85" y="19" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">NREM 3 (DEEP SWS)</text>
      <text x="12" y="55" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Delta waves (&lt; 4 Hz)</text>
      <text x="12" y="75" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Human Growth Hormone</text>
      <text x="12" y="95" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Glymphatic Brain Wash</text>
      <text x="12" y="115" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Immune T-Cell loading</text>
      <rect x="10" y="180" width="150" height="30" rx="6" fill="#064e3b" />
      <text x="85" y="199" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#a7f3d0" text-anchor="middle">20-25% (Physical Repair)</text>
    </g>

    <!-- Stage REM -->
    <g transform="translate(540, 0)">
      <rect width="160" height="230" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2" />
      <rect width="160" height="28" rx="10" fill="url(#purpleGrad)" />
      <text x="80" y="19" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">REM (RAPID EYE)</text>
      <text x="12" y="55" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Emotional processing</text>
      <text x="12" y="75" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Vivid dreaming state</text>
      <text x="12" y="95" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Synaptic pruning</text>
      <text x="12" y="115" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">• Muscle atonia (paralysis)</text>
      <rect x="10" y="180" width="140" height="30" rx="6" fill="#581c87" />
      <text x="80" y="199" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#e9d5ff" text-anchor="middle">20-25% (Mental Reset)</text>
    </g>
  </g>

  <!-- Bottom Strip -->
  <g transform="translate(50, 335)">
    <rect width="695" height="40" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="347" y="25" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#2dd4bf" text-anchor="middle">Cycles repeat every 90 minutes. 5 full cycles = 7.5 hours of optimal biological sleep.</text>
  </g>
`);

// 20. Glymphatic Brain Wash
diagrams['glymphatic-brain-wash.svg'] = svgWrapper(800, 400, "THE GLYMPHATIC SYSTEM: THE BRAIN'S NIGHTLY DRAINAGE", "CSF Influx Clears Toxic Beta-Amyloid & Tau Oligomers Exclusively in Deep NREM 3", `
  <!-- Astrocytic endfeet & interstitial space -->
  <g transform="translate(60, 90)">
    <rect width="320" height="220" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <text x="160" y="30" font-family="sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">AWAKE BRAIN (GLYMPHATIC OFF)</text>
    <text x="20" y="65" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Interstitial space is tightly packed</text>
    <text x="20" y="90" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Glial cells swollen by norepinephrine</text>
    <text x="20" y="115" font-family="sans-serif" font-size="10" fill="#f87171">• CSF flow is restricted by 95%</text>
    <text x="20" y="140" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Metabolic waste aggregates in synapses</text>
    <rect x="20" y="170" width="280" height="30" rx="6" fill="#0f172a" />
    <text x="160" y="190" font-family="sans-serif" font-size="9" fill="#fca5a5" text-anchor="middle">Beta-Amyloid & Tau accumulate</text>
  </g>

  <!-- Arrow -->
  <path d="M 395 200 L 425 200" stroke="#10b981" stroke-width="3" marker-end="url(#arrowTeal)" />

  <!-- Asleep Glymphatic Active -->
  <g transform="translate(440, 90)">
    <rect width="320" height="220" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <text x="160" y="30" font-family="sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">DEEP SLEEP (GLYMPHATIC ACTIVE)</text>
    <text x="20" y="65" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Interstitial space expands by +60%</text>
    <text x="20" y="90" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Aquaporin-4 (AQP4) water channels open</text>
    <text x="20" y="115" font-family="sans-serif" font-size="10" fill="#34d399">• Convective CSF-ISF tidal wash surges</text>
    <text x="20" y="140" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Drains waste into cervical lymph nodes</text>
    <rect x="20" y="170" width="280" height="30" rx="6" fill="#064e3b" />
    <text x="160" y="190" font-family="sans-serif" font-size="9" font-weight="700" fill="#a7f3d0" text-anchor="middle">✔ Clears Neurodegenerative Plaque</text>
  </g>

  <!-- Bottom Tip -->
  <g transform="translate(60, 330)">
    <rect width="700" height="40" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="350" y="25" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#2dd4bf" text-anchor="middle">Sleeping on your side (lateral position) optimizes glymphatic convective flow by 25% over back/stomach.</text>
  </g>
`);

// 21. 10-3-2-1-0 Sleep Routine
diagrams['10-3-2-1-0-routine.svg'] = svgWrapper(800, 380, "THE 10-3-2-1-0 CLINICAL SLEEP ARCHITECTURE PROTOCOL", "The Step-by-Step Countdown to Flawless Sleep Quality and Morning Vigor", `
  <!-- Step 1: 10 Hours -->
  <g transform="translate(40, 90)">
    <rect width="125" height="230" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
    <circle cx="62" cy="35" r="22" fill="#d97706" />
    <text x="62" y="42" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">10</text>
    <text x="62" y="80" font-family="sans-serif" font-size="10" font-weight="700" fill="#fde68a" text-anchor="middle">HOURS BEFORE</text>
    <text x="12" y="110" font-family="sans-serif" font-size="9" font-weight="600" fill="#f8fafc">No More Caffeine</text>
    <text x="12" y="130" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Caffeine half-life = 5-8h; blocks adenosine receptors</text>
  </g>

  <!-- Step 2: 3 Hours -->
  <g transform="translate(180, 90)">
    <rect width="125" height="230" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="62" cy="35" r="22" fill="#0284c7" />
    <text x="62" y="42" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">3</text>
    <text x="62" y="80" font-family="sans-serif" font-size="10" font-weight="700" fill="#bae6fd" text-anchor="middle">HOURS BEFORE</text>
    <text x="12" y="110" font-family="sans-serif" font-size="9" font-weight="600" fill="#f8fafc">No Heavy Food/Alcohol</text>
    <text x="12" y="130" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Preserves nocturnal core cooling & suppresses reflux</text>
  </g>

  <!-- Step 3: 2 Hours -->
  <g transform="translate(320, 90)">
    <rect width="125" height="230" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="1.5" />
    <circle cx="62" cy="35" r="22" fill="#7c3aed" />
    <text x="62" y="42" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">2</text>
    <text x="62" y="80" font-family="sans-serif" font-size="10" font-weight="700" fill="#e9d5ff" text-anchor="middle">HOURS BEFORE</text>
    <text x="12" y="110" font-family="sans-serif" font-size="9" font-weight="600" fill="#f8fafc">No Work Tasks</text>
    <text x="12" y="130" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Close laptop; quiet down prefrontal cortex</text>
  </g>

  <!-- Step 4: 1 Hour -->
  <g transform="translate(460, 90)">
    <rect width="125" height="230" rx="10" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" />
    <circle cx="62" cy="35" r="22" fill="#e11d48" />
    <text x="62" y="42" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">1</text>
    <text x="62" y="80" font-family="sans-serif" font-size="10" font-weight="700" fill="#fecdd3" text-anchor="middle">HOUR BEFORE</text>
    <text x="12" y="110" font-family="sans-serif" font-size="9" font-weight="600" fill="#f8fafc">No Blue Light</text>
    <text x="12" y="130" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Dim amber lamps; allow pineal melatonin rise</text>
  </g>

  <!-- Step 5: 0 Hits -->
  <g transform="translate(600, 90)">
    <rect width="140" height="230" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <circle cx="70" cy="35" r="22" fill="#059669" />
    <text x="70" y="42" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">0</text>
    <text x="70" y="80" font-family="sans-serif" font-size="10" font-weight="700" fill="#a7f3d0" text-anchor="middle">SNOOZE HITS</text>
    <text x="12" y="110" font-family="sans-serif" font-size="9" font-weight="600" fill="#f8fafc">Immediate Sunlight</text>
    <text x="12" y="130" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Step outdoors for 10 min; anchors circadian CAR</text>
  </g>
`);

// Write all diagrams to disk
for (const [filename, content] of Object.entries(diagrams)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Generated diagram: ${filename}`);
}

console.log(`Total diagrams generated: ${Object.keys(diagrams).length}`);
