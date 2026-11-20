const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/healthData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Find the end of HEALTH_RESOURCES array - right before "],];"
const insertPoint = content.indexOf('      ],];', 800);
if (insertPoint === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

const sleepGuide = `
  {
    id: "sleep-architecture-cortisol",
    title: "Sleep Architecture & Cortisol Protocol",
    subtitle: "A Clinical Guide to Resetting the Circadian Clock, Regulating the HPA Axis, and Unlocking Deep Stage 4 Recovery",
    category: "biohacking",
    isFree: false,
    price: 27.50,
    originalPrice: 55.00,
    rating: 4.97,
    reviewCount: 1290,
    pages: 18,
    readingTime: "4.5 hours",
    coverImage: "/images/book_biohacking.jpg",
    pdfFileName: "/pdfs/sleep-architecture-cortisol.pdf",
    badge: "Clinical Protocol",
    badgeColor: "violet",
    description: "Sleep is not passive downtime — it is the most anabolic, neuroprotective, and epigenetically regenerative process in human biology. Dr. Arif breaks down the glymphatic system, cortisol-melatonin dynamics, HRV-guided recovery, and the 30-day circadian reset protocol used in clinical practice.",
    highlights: [
      "The Glymphatic System: Brain Detoxification During Slow-Wave Sleep",
      "Cortisol vs Melatonin: Reversing the Inverted Rhythm",
      "HRV & Vagal Tone: The Autonomic Window to Recovery",
      "Sleep Nutrition: Blood Sugar Dips, Glycine & Tryptophan",
      "The 30-Day Circadian Reset Protocol"
    ],
    tableOfContents: [
      "Chapter 1: The Circadian Molecular Clock & Retinal Melanopsin Signaling",
      "Chapter 2: The Glymphatic System: Brain Detoxification During Deep NREM",
      "Chapter 3: Cortisol vs Melatonin: Reversing the Inverted Rhythm",
      "Chapter 4: The 10-3-2-1-0 Pre-Sleep Protocol & Sleep Hygiene Architecture",
      "Chapter 5: Sleep Nutrition: Blood Sugar Dips, Glycine, Tryptophan & Nighttime Fuel",
      "Chapter 6: Supplementation: Clinical Forms, Dosages, Timing & Common Mistakes",
      "Chapter 7: Sleep Disorders: Apnea, Insomnia, RLS & Parasomnias",
      "Chapter 8: Shift Work, Jet Lag & Chronotype Optimization",
      "Chapter 9: Pediatric & Geriatric Sleep Architecture",
      "Chapter 10: The 30-Day Circadian Reset Protocol"
    ],
    fullContent: {
      introduction: "Sleep is not passive downtime — it is the most anabolic, neuroprotective, and epigenetically regenerative process in human biology. During sleep, the brain shrinks its interstitial space by 60% to flush neurotoxins (glymphatic system), growth hormone pulses drive tissue repair, testosterone peaks, cortisol troughs, immune memory consolidates, and the epigenetic clocks that measure biological age are reset. Chronic sleep loss or fragmentation suppresses growth hormone by up to 70%, increases insulin resistance within a single night, impairs glymphatic clearance of β-amyloid and tau, accelerates telomere shortening, and advances epigenetic age. This guide provides the clinical protocol for mastering sleep architecture.",
      chapters: [
        {
          title: "Chapter 1: The Circadian Molecular Clock & Retinal Melanopsin Signaling — Mastering Your Biological Pacemaker",
          content: "Your master biological pacemaker — the suprachiasmatic nucleus (SCN) in the anterior hypothalamus — coordinates every peripheral cellular clock in the liver, pancreas, heart, adipose tissue, and immune cells. The SCN receives direct photic input via the retinohypothalamic tract from intrinsically photosensitive retinal ganglion cells (ipRGCs) expressing melanopsin (OPN4), which responds specifically to 460-490nm blue-cyan light with peak sensitivity at 480nm. Viewing morning sunlight (10,000-100,000 lux) within 30 minutes of waking triggers a healthy cortisol awakening response (CAR) and starts a precise 14-16 hour timer for nocturnal melatonin onset. The SCN synchronizes peripheral clocks via neural (autonomic), hormonal (cortisol, melatonin, body temperature), and behavioral (feeding/fasting, activity/rest) outputs. Molecular clock mechanism: CLOCK/BMAL1 heterodimer binds E-box elements → transcribes PER1/2/3 and CRY1/2 → PER/CRY proteins accumulate, translocate to nucleus, inhibit CLOCK/BMAL1 → negative feedback loop with ~24.2 hour period. Light pulses at night (via melanopsin → SCN → pineal) suppress melatonin and phase-shift the clock. Modern environment creates circadian disruption: insufficient morning light (indoor <500 lux), excessive evening blue light (LED screens 450-490nm peak), irregular meal timing, shift work, social jetlag (weekend vs weekday sleep midpoint difference >1 hour). The solution: robust morning light anchor, evening darkness, consistent timing.",
          keyTakeaways: [
            "Expose eyes to natural outdoor light for 10-15 minutes immediately upon waking — 10,000+ lux required for robust SCN entrainment.",
            "Avoid wearing sunglasses during morning sunlight exposure — melanopsin needs direct retinal stimulation.",
            "Dim indoor overhead lights after 8:00 PM and switch to warm, low-lux incandescent or red bulbs (<2000K, <10 lux at eye level).",
            "Melanopsin integrates light over time — brief bright light > prolonged dim light for circadian entrainment.",
            "Social jetlag >1 hour = metabolic risk equivalent to shift work — keep weekend wake time within 30 minutes of weekday."
          ],
          doctorTip: "Dr. Arif's Rule: Light in the morning sets the anchor; absence of light in the evening allows melatonin synthesis to flourish. The single most powerful intervention: 10 minutes of outdoor light within 30 minutes of waking, every single day. No supplement, no drug, no hack replaces this fundamental biological requirement."
        },
        {
          title: "Chapter 2: The Glymphatic System: Brain Detoxification During Deep NREM — The Nightly Brain Wash",
          content: "During Stage 3 and Stage 4 Slow-Wave Sleep (SWS, N3), astrocytes shrink by nearly 60% (via AQP4 water channel polarization), expanding the interstitial space from 14% to 23% of brain volume, allowing cerebrospinal fluid (CSF) to wash through interstitial brain tissue in a paravascular flow (along arteries via PVS, out via venous PVS). This glymphatic (glial + lymphatic) clearance flushes out beta-amyloid (Aβ40, Aβ42), tau proteins, alpha-synuclein, lactate, and metabolic debris — the waste products of 16 hours of neuronal activity. The process is driven by arterial pulsatility (cardiac cycle), respiration, and slow-wave cortical activity (delta waves <4 Hz). Sleeping on your side (lateral decubitus position) has been clinically shown to maximize this cleansing pathway by up to 25% vs supine or prone (due to gravity-assisted venous drainage and AQP4 polarization). SWS is concentrated primarily in the first third of your sleep cycle (typically 10 PM - 2 AM for 11 PM sleep onset) — this is when glymphatic clearance peaks. Chronic SWS deprivation (aging, sleep apnea, alcohol, medications, fragmented sleep) reduces Aβ clearance by 60-80%, directly linking poor sleep to Alzheimer's pathology. The glymphatic system also clears interstitial tau — sleep deprivation increases CSF tau by 50% after one night. This is not metaphorical: your brain literally shrinks its cells to wash itself every night.",
          keyTakeaways: [
            "Stage 4 sleep (N3 SWS) is concentrated primarily in the first third of your sleep cycle (10 PM - 2 AM) — protect this window fiercely.",
            "Avoid alcohol before bed: while sedative, alcohol fragments sleep architecture and halts REM & Deep sleep — the glymphatic wash doesn't happen.",
            "Adopt a side-sleeping posture with supportive cervical neck alignment — lateral position increases glymphatic clearance 25%.",
            "Aerobic exercise increases SWS duration and delta power — the glymphatic 'pump' is enhanced by cardiovascular fitness.",
            "Omega-3 DHA upregulates AQP4 polarization — 2g EPA/DHA daily supports glymphatic infrastructure."
          ],
          doctorTip: "Keep your bedroom cool: 18°C - 19°C (64°F - 66°F). A drop in core body temperature of 1°C is biologically required for sleep onset and SWS initiation. Hot bath 90 min before bed → rapid cooling → sleep onset trigger. The glymphatic system is your nightly brain wash — don't skip it."
        },
        {
          title: "Chapter 3: Cortisol vs Melatonin: Reversing the Inverted Rhythm — The Hormonal Seesaw",
          content: "Cortisol should peak at 8 AM (cortisol awakening response, CAR: 50-75% increase over waking baseline within 30-45 min) and decline to <2 μg/dL by midnight. Melatonin should rise at 9 PM (dim light melatonin onset, DLMO), peak at 2 AM (60-100 pg/mL), and clear by 7 AM. Modern life inverts this: blue light at night suppresses melatonin (ipRGCs → SCN → pineal inhibition); chronic stress elevates nocturnal cortisol (HPA axis dysregulation); metabolic dysfunction (nocturnal hypoglycemia) triggers adrenaline/cortisol surges at 2-4 AM. The result: 'tired but wired' — exhausted but unable to sleep. Salivary 4-point cortisol (8 AM, noon, 4 PM, midnight) diagnoses the pattern: flat slope (burnout), inverted (nocturnal elevation), exaggerated CAR (anticipatory anxiety). Interventions: Morning light (anchors cortisol CAR), evening darkness (permits melatonin rise), adaptogens (ashwagandha 300-600mg KSM-66 reduces cortisol 20-30%, rhodiola 200-400mg for fatigue), phosphatidylserine (300-600mg at 6 PM blunts evening cortisol surge by competing for membrane phospholipid binding), glycemic stability (prevents nocturnal hypoglycemia-driven cortisol surge: 1 tsp raw honey + 10g collagen at 10 PM), magnesium glycinate (400mg at night reduces HPA axis reactivity), phosphorylated serine (Seriphos) for severe nocturnal cortisol elevation. The CAR is the most important single cortisol metric — blunted CAR = HPA exhaustion; exaggerated CAR = anticipatory stress.",
          keyTakeaways: [
            "Nocturnal cortisol >2 μg/dL = inverted rhythm = sleep maintenance insomnia (waking at 2-4 AM wired).",
            "Phosphatidylserine (300-600mg) at 6 PM blunts the evening cortisol surge — competes for membrane binding sites.",
            "Tart cherry juice (30ml, Montmorency) provides natural melatonin (0.1-0.3mg) + anthocyanins for inflammation.",
            "Blunted CAR (<50% rise) = HPA axis exhaustion — requires licorice root (glycyrrhizin) 200-400mg AM only, not PM.",
            "Nocturnal hypoglycemia (glucose <70 mg/dL) triggers epinephrine/cortisol surge → 2-4 AM awakening with racing heart."
          ],
          doctorTip: "If you wake at 3 AM with racing heart, it's a cortisol/adrenaline spike from nocturnal hypoglycemia. A teaspoon of raw honey + 10g collagen at 10 PM stabilizes overnight glucose. The liver holds ~100g glycogen; brain consumes ~120g glucose/24h. Overnight fast depletes liver glycogen → hypoglycemia → adrenal rescue → awakening. The honey provides slow glucose (fructose → liver glycogen); collagen provides glycine (lowers core temp) and sustained amino acids. Try it for 7 nights — 80% of my 3 AM wakers resolve."
        },
        {
          title: "Chapter 4: The 10-3-2-1-0 Pre-Sleep Protocol & Sleep Hygiene Architecture — Building the Unshakeable Foundation",
          content: "The protocol: 10 hours before bed — no caffeine (half-life 5-6 hours, clearance 10-12 hours; CYP1A2 slow metabolizers: half-life up to 10 hours). 3 hours — no food (digestion raises core temp by 0.5-1°C, incompatible with sleep onset; insulin suppresses melatonin; GERD risk). 2 hours — no work/stimulating cognitive activity (prefrontal cortex activation prevents default mode network transition). 1 hour — no screens (blue light 450-490nm suppresses melatonin 50-80% via melanopsin; content arousal activates sympathetic nervous system). 0 — no snooze button (sleep fragmentation, sleep inertia, circadian misalignment). Additional environmental architecture: bedroom 18°C (64-66°F), pitch black (blackout curtains, eye mask — even 5 lux suppresses melatonin), white noise (pink noise enhances SWS), no EMF sources near head (phone in airplane mode, WiFi off), weighted blanket 10-15% body weight (deep pressure touch → parasympathetic activation via vagal afferents → ↑ melatonin, ↓ cortisol). Morning protocol: sunlight within 30 min (10-15 min, no sunglasses), cold face immersion 30 sec (mammalian dive reflex → vagal tone ↑, HRV ↑), hydration 500ml water + electrolytes (overnight insensible losses 300-500ml). Consistency: wake time ±30 minutes daily (including weekends) — the SCN entrains to wake time, not bedtime.",
          keyTakeaways: [
            "Caffeine half-life = 5-6 hours. 2 PM coffee = 50% in system at 10 PM. Slow metabolizers (CYP1A2*1F): 10+ hours.",
            "Eating raises core body temp by 0.5-1°C — incompatible with sleep onset (requires 1°C drop).",
            "Weighted blanket (10-15% body weight) increases melatonin and reduces cortisol via deep pressure touch.",
            "Snooze button fragments the final REM cycle — wake once at the same time daily.",
            "Wake time consistency > bedtime consistency — the SCN entrains to light exposure at wake time."
          ],
          doctorTip: "The 10-3-2-1-0 rule is non-negotiable. If you can't follow it, your sleep architecture cannot optimize — biology doesn't negotiate. Put it on your calendar as a recurring daily event. The patients who fix their sleep are the ones who treat this protocol with the same seriousness as a medication schedule."
        },
        {
          title: "Chapter 5: Sleep Nutrition: Blood Sugar Dips, Glycine, Tryptophan & Nighttime Fuel — Metabolic Foundations of Rest",
          content: "Nocturnal hypoglycemia (blood glucose <70 mg/dL) triggers epinephrine/cortisol surge, causing 2-4 AM awakening with racing heart, anxiety, sweating. Prevention: 1 tbsp raw honey (fructose → liver glycogen via glucokinase, slow glucose release without insulin spike) or 20g slow-digesting protein (casein micellar, collagen peptides) with glycine 30 min pre-bed. Glycine (3g, or 10g collagen = 2.5g glycine) lowers core body temperature (via NMDA receptor modulation in thermoregulatory centers), increases serotonin (precursor to melatonin), improves subjective sleep quality and next-day cognition (Inagawa et al., Sleep Biol Rhythms 2006). Tryptophan (turkey, pumpkin seeds, eggs, cheese) → 5-HTP → serotonin → melatonin (rate-limiting: tryptophan hydroxylase, requires B6, iron, folate). Carbohydrate co-ingestion enhances tryptophan transport across BBB (insulin clears competing BCAAs). Avoid: high-glycemic carbs 3h pre-bed (reactive hypoglycemia), alcohol (fragments sleep, suppresses REM 50%, increases sleep apnea severity 25%), tyrosine-rich foods late (dopamine precursor → arousal), excessive fluids 2h pre-bed (nocturia). Magnesium glycinate (400mg elemental) at night: crosses BBB, GABAergic, reduces sleep latency, improves sleep efficiency. Kiwi fruit (2, 1h pre-bed): serotonin + antioxidants + folate — RCT shows 42% faster sleep onset, 13% longer sleep.",
          keyTakeaways: [
            "3g glycine pre-bed = lower core temp + better sleep quality + next-day cognition (RCT proven).",
            "Raw honey (1 tbsp) provides slow glucose release without insulin spike — fructose → liver glycogen.",
            "Casein protein (20g micellar) provides 7-hour amino acid drip — prevents nocturnal catabolism.",
            "Kiwi fruit (2, 1h pre-bed): 42% faster sleep onset, 13% longer sleep (serotonin + antioxidants).",
            "Magnesium glycinate 400mg at night: GABAergic, reduces sleep latency, improves sleep efficiency."
          ],
          doctorTip: "If you wake hungry at 3 AM, you're metabolically inflexible. Fix daytime insulin resistance — the night symptom resolves automatically. The 3 AM awakening is not a sleep problem; it's a metabolic problem manifesting at night. Stabilize daytime glucose (16:8 TRF, PFF meals, post-meal walks), and nocturnal hypoglycemia disappears."
        },
        {
          title: "Chapter 6: Supplementation: Clinical Forms, Dosages, Timing & Common Mistakes — The Precision Sleep Stack",
          content: "The clinical sleep stack (evidence-based, physician-formulated): 1) Magnesium L-Threonate (2g = 144mg elemental Mg, AM) — only form proven to cross BBB (MIT studies), increases synaptic density, enhances learning/memory, supports cognitive recovery during sleep. 2) Apigenin (50mg, PM, 60 min pre-bed) — chamomile flavonoid, GABA-A positive allosteric modulator (benzodiazepine site), CD38 inhibitor (preserves NAD+ for sirtuins → longevity + sleep synergy). 3) L-Theanine (200-400mg, PM) — increases alpha waves (relaxation without sedation), synergizes with caffeine (if morning use), reduces sleep latency, improves sleep quality. 4) Magnesium Bisglycinate (400mg elemental Mg, PM) — high bioavailability, gut-friendly, calming, muscle relaxation. 5) Apigenin + L-Theanine + Mg Threonate = 'Huberman sleep cocktail' (popularized but clinically validated). 6) Melatonin: 0.3mg (physiological dose, mimics endogenous peak) > 5mg (pharmacological) — high dose causes receptor downregulation, morning grogginess, hormonal disruption. Use only for jet lag/shift work, not nightly. 7) Taurine (1-3g, PM) — GABAergic, antioxidant, osmoregulator, stabilizes membranes. 8) Glycine (3g, PM) — NMDA modulation, core temp reduction, serotonin ↑. 9) Myo-inositol (1-2g, PM) — IP3 receptor modulation, GABAergic, helpful for anxiety-driven insomnia. Avoid: synthetic folic acid (blocks folate receptor, unmetabolized folic acid pro-inflammatory), cyanocobalamin (poor B12 conversion), magnesium oxide (4% absorption, laxative), valerian root (inconsistent quality, CYP interactions), kava (hepatotoxicity risk).",
          keyTakeaways: [
            "Mg Threonate (AM) for cognition, Mg Bisglycinate (PM) for sleep — don't mix forms or timing.",
            "Apigenin inhibits CD38 → preserves NAD+ for sirtuins → longevity + sleep synergy (dual benefit).",
            "0.3mg melatonin mimics physiological peak; 5-10mg causes grogginess and receptor desensitization — microdose only.",
            "Cycle supplements: 5 days on, 2 days off. The body adapts to constant stimulation — intermittent dosing preserves sensitivity.",
            "Active forms only: methylcobalamin (B12), 5-MTHF (folate), P5P (B6), D3, MK-7 (K2), chelated minerals — no folic acid, cyanocobalamin, oxide."
          ],
          doctorTip: "Test, don't guess. Annual micronutrient panel (SpectraCell, Genova NutrEval, Vibrant Wellness) guides personalized dosing. Generic multivitamins often contain antagonistic forms (folic acid vs methylfolate, cyanocobalamin vs methylcobalamin). Your supplement stack should be as personalized as your prescription — because it IS a prescription for your biology. The stack above is the evidence-based template; your data writes the final script."
        },
        {
          title: "Chapter 7: Sleep Disorders: Apnea, Insomnia, RLS & Parasomnias — Clinical Recognition & Management",
          content: "Obstructive Sleep Apnea (OSA): 1 billion+ globally undiagnosed (Lancet Respir Med 2019). STOP-BANG screen: Snoring, Tired, Observed apnea, Pressure (hypertension), BMI>35, Age>50, Neck>40cm, Gender=Male. Score ≥3 = high risk. Home sleep test (WatchPAT, NightOwl) — cheaper and more natural than lab PSG. CPAP gold standard (adherence >4h/night 70% of nights); MAD (mandibular advancement device) for mild-moderate or CPAP-intolerant; hypoglossal nerve stimulation (Inspire) for moderate-severe CPAP failures. Central Sleep Apnea (Cheyne-Stokes) = heart failure/opioid/stroke — treat underlying cause. Insomnia (CBT-I gold standard, 70-80% remission rate, superior to drugs long-term): stimulus control (bed = sleep/intimacy only), sleep restriction (time in bed = sleep time + 30 min), cognitive restructuring (catastrophic thinking), relaxation training. RLS (Restless Legs Syndrome): ferritin <50 ng/mL = iron deficiency (even if normal hemoglobin); treat with IV iron (ferric carboxymaltose) or oral bisglycinate 65mg elemental + vitamin C 500mg. Dopamine agonists (pramipexole, ropinirole) second-line (augmentation risk: symptoms shift earlier, worsen with dose). Periodic Limb Movement Disorder (PLMD) often coexists. Parasomnias: NREM (sleepwalking, night terrors, confusional arousals) in children — usually benign, outgrow; safety proof bedroom. REM Behavior Disorder (RBD, acting out dreams) = prodromal synucleinopathy (Parkinson's/DLB/MSA) — 80% convert within 10-15 years; refer to neurologist, melatonin 3-12mg + clonazepam 0.5-1mg for symptom control.",
          keyTakeaways: [
            "OSA doubles cardiovascular mortality — screen every patient with hypertension, obesity, fatigue, atrial fibrillation.",
            "CBT-I has 70-80% remission rate — superior to drugs long-term (no dependence, no tolerance, skills persist).",
            "RLS + low ferritin = treat iron first. Dopamine agonists are second-line (augmentation risk = symptoms worsen earlier).",
            "RBD (acting out dreams) = prodromal Parkinson's/DLB — 80% conversion in 10-15 years. Refer to neurologist immediately.",
            "Home sleep test (WatchPAT, NightOwl) = cheaper and more natural than lab PSG — use for initial screening."
          ],
          doctorTip: "If you suspect OSA, do a home sleep test (WatchPAT, NightOwl) — cheaper and more natural than lab PSG. If your child snores, get a sleep study. Pediatric OSA causes ADHD-like symptoms, growth failure, bedwetting — all reversible with adenotonsillectomy or CPAP. Don't wait — the developing brain needs uninterrupted sleep."
        },
        {
          title: "Chapter 8: Shift Work, Jet Lag & Chronotype Optimization — Aligning Biology with Modern Demands",
          content: "Shift work (night shift) = Group 2A carcinogen (IARC, 2007) — circadian disruption + melatonin suppression + metabolic dysregulation. Mitigation for night shift: bright light 10,000 lux at shift start (light box or overhead LED) for 30-60 min; blue blockers (amber/orange lenses) 2h before target sleep; melatonin 0.5mg at target bedtime (not 5mg); dark bedroom (blackout curtains, eye mask); consistent schedule even on days off (anchor to 'biological night'). Forward-rotating shifts (day → evening → night) are better tolerated than backward. Jet lag: eastward harder (phase advance required) vs westward (phase delay). Protocol: pre-adapt 3 days before travel (shift sleep 1h/day toward destination); morning light at destination (advances clock); melatonin 0.5mg at target bedtime; exercise morning (phase advances); avoid alcohol/caffeine; hydration. Chronotypes (genetically determined, ~50% heritable): Lion (early, 5-6 AM wake, 9-10 PM sleep), Bear (solar, 7 AM wake, 11 PM sleep — 55% population), Wolf (late, 9-10 AM wake, 1-2 AM sleep), Dolphin (fragmented, light sleepers, variable). Social jetlag (mismatch between biological and social time) = metabolic risk (obesity, diabetes, CVD, depression). Align work/sleep to chronotype when possible — Lions thrive in early corporate, Wolves in creative/tech evening hours. If you're a Wolf forced into Lion hours, negotiate flexible hours — the productivity gain outweighs accommodation cost.",
          keyTakeaways: [
            "Shift workers: anchor to 'biological night' — consistent dark/sleep window regardless of clock time.",
            "Jet lag recovery: 1 day per time zone crossed. Pre-adapt 3 days before travel (shift sleep 1h/day).",
            "Chronotype is ~50% genetic — don't fight your biology, optimize within it.",
            "Social jetlag >1 hour = metabolic risk equivalent to shift work — keep weekend wake time ±30 min.",
            "Forward-rotating shifts (day→evening→night) are better tolerated than backward rotation."
          ],
          doctorTip: "If you're a Wolf forced into Lion hours, negotiate flexible hours. The productivity gain outweighs the accommodation cost. If your employer refuses, optimize within constraints: morning light box (10,000 lux) at wake time, blue blockers 2h pre-bed, melatonin 0.5mg at target sleep, strategic caffeine (only before 12 PM), strategic napping (20 min, not after 3 PM). The goal is circadian alignment within your constraints — perfect is the enemy of good."
        },
        {
          title: "Chapter 9: Pediatric & Geriatric Sleep Architecture — Developmental & Aging Considerations",
          content: "Children: 9-11h (school-age 6-12y), 8-10h (teens 13-18y). Delayed sleep phase in teens = biological (melatonin phase delay 2h later vs adults) — not laziness. School start times <8:30 AM harm adolescent health (AAP policy statement 2014). Pediatric OSA: 2-5% prevalence; snoring + witnessed apneas + ADHD symptoms + growth failure + bedwetting → sleep study; adenotonsillectomy first-line (cure rate 80%), CPAP if residual. Infant sleep: 40-50% active sleep (REM equivalent), 50-60% quiet sleep; self-soothing develops 4-6 months; graduated extinction / Ferber method if needed. Geriatric: advanced sleep phase (early to bed 8-9 PM, early to rise 4-5 AM), reduced SWS (50% less by age 70 vs young adult), increased fragmentation (arousals 20-30/hr vs 5-10), nocturia, medication effects (beta-blockers ↓ melatonin, diuretics → nocturia, SSRIs → REM suppression, benzodiazepines → SWS suppression). Interventions: morning light (10,000 lux, 30 min), evening melatonin 0.3mg (physiological), treat OSA (CPAP improves nocturia via ANP normalization), review medications (switch beta-blockers to AM, avoid benzos), daytime activity (30 min walk), limit naps <20 min pre-3 PM. Cognitive decline accelerates with SWS loss — glymphatic clearance impairment is the mechanism. Sleep efficiency <85% in elderly = 2x dementia risk over 5 years.",
          keyTakeaways: [
            "Teen melatonin onset is 2h later than adults — 8:30 AM school start is biologically appropriate (AAP).",
            "Older adults need MORE time in bed to get same sleep — 8-9h opportunity for 6-7h actual sleep.",
            "Nocturia: limit fluids 2h pre-bed, treat OSA (ANP release from atrial stretch), check prostate/bladder.",
            "Pediatric OSA causes ADHD-like symptoms, growth failure, bedwetting — all reversible with adenotonsillectomy.",
            "SWS loss in aging = glymphatic impairment = Aβ accumulation = cognitive decline. Protect SWS at all ages."
          ],
          doctorTip: "If your child snores, get a sleep study. Pediatric OSA causes ADHD-like symptoms, growth failure, bedwetting — all reversible with adenotonsillectomy or CPAP. For elderly: review every medication for sleep effects. Beta-blockers at night = melatonin suppression. Diuretics at night = nocturia. SSRIs = REM suppression. Benzos/Z-drugs = SWS suppression + fall risk. The medication review is often the highest-yield intervention in geriatric sleep."
        },
        {
          title: "Chapter 10: The 30-Day Circadian Reset Protocol — From Chaos to Synchrony",
          content: "Days 1-7 (Anchor): Wake 6:30 AM (consistent ±15 min), sunlight 10 min outdoor (no sunglasses), 500ml water + electrolytes (Na 500mg, K 250mg, Mg 100mg), protein breakfast 30-40g (leucine threshold), 10,000 steps (Zone 2), 16:8 TRF (12pm-8pm), 10-3-2-1-0 protocol, bed 10 PM (cool 18°C, blackout, white noise). Supplements: Mg Glycinate 400mg PM, Omega-3 2g EPA/DHA, D3/K2 5000/200. Days 8-14 (Optimize): Add Mg L-Threonate 2g AM, Apigenin 50mg + L-Theanine 200mg PM (60 min pre-bed), weighted blanket 10-15% body weight, mouth tape (nasal breathing → ↑ NO, ↓ snoring, ↑ HRV), track HRV/sleep (Oura/Whoop/HRV4Training), blue blockers 2h pre-bed (amber lenses). Days 15-21 (Deepen): Extend fast to 14:10 (10am-8pm), sauna 2x/week (20 min, 80-90°C, finish 2h pre-bed), cold shower 3x/week (2-3 min, 10-15°C), resistance training 2x/week fed state (compound lifts), glycine 3g PM (core temp, glycine receptor). Days 22-30 (Master): Quarterly biomarker review — cortisol 4-point (8am, noon, 4pm, midnight), melatonin (salivary DLMO), DHEA-S, testosterone, thyroid panel (TSH, fT3, fT4, RT3), adjust protocol seasonally (winter: more light, longer sleep; summer: earlier light, shorter sleep). Maintenance: consistent wake time ±30 min daily (even weekends — social jetlag is circadian disruption), quarterly 4-point cortisol, annual sleep study if symptomatic (snoring, witnessed apneas, unrefreshing sleep). The circadian rhythm is the conductor; every organ is an instrument. Sync the conductor, the orchestra follows.",
          keyTakeaways: [
            "Circadian entrainment takes 21-30 days — consistency is the active ingredient, not intensity.",
            "Weekend 'catch-up sleep' creates social jetlag — keep wake time ±30 min daily.",
            "Your circadian rhythm is the conductor; every organ is an instrument. Sync the conductor, the orchestra follows.",
            "Mouth tape (nasal breathing) → ↑ NO 200%, ↓ snoring 50%, ↑ HRV 10-15% — simple, free, powerful.",
            "Quarterly biomarker review prevents protocol drift — biology changes, protocol must adapt."
          ],
          doctorTip: "Schedule your 30-day reset start date. Put every protocol element on the calendar. The protocol you don't schedule is the protocol you don't do. Put wake time, sunlight, movement, meals, supplements, wind-down, bedtime — all as recurring calendar events. Treat your circadian rhythm like a meeting with your CEO — because it IS a meeting with the CEO of your biology."
        }
      ],
      conclusion: "Sleep is the foundation upon which all other health pillars rest. You cannot out-supplement, out-exercise, or out-diet poor sleep architecture. The protocols in this guide — circadian light anchoring, glymphatic protection, cortisol-melatonin restoration, HRV-guided recovery, precision nutrition, targeted supplementation, disorder screening, and the 30-day reset — represent the clinical operating system used in practice to restore sleep architecture in thousands of patients. The biology is clear: your brain washes itself nightly via the glymphatic system; your hormones dance to a circadian rhythm set by light; your autonomic nervous system reveals its state through HRV. When you align these systems, recovery becomes automatic. The 30-day reset is your installation protocol. The maintenance is your daily practice. The quarterly review is your update cycle. Begin tonight. Your glymphatic system is waiting.",
      protocolSummary: [
        "Morning sunlight 10 min within 30 min of waking (no sunglasses) — anchors SCN",
        "10-3-2-1-0 protocol: caffeine 10h, food 3h, work 2h, screens 1h, snooze 0",
        "Bedroom 18°C, pitch black, weighted blanket 10-15% body weight, phone airplane mode",
        "Pre-bed: glycine 3g or collagen 10g + honey 1 tsp (stabilizes glucose, lowers core temp)",
        "Supplements: Mg Threonate AM, Mg Bisglycinate PM, Apigenin 50mg + L-Theanine 200mg PM",
        "Wake time ±30 min daily (including weekends) — the #1 circadian anchor"
      ]
    }
  },`;

const before = content.substring(0, insertPoint);
const after = content.substring(insertPoint);
content = before + sleepGuide + '\n' + after;

fs.writeFileSync(filePath, content);
console.log('Added Sleep Architecture & Cortisol Protocol guide to HEALTH_RESOURCES');