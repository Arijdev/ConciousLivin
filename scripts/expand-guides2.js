const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/healthData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Find the cardiovascular guide fullContent section and replace its chapters
const cardioFullContentStart = content.indexOf('fullContent: {\n      introduction: "Your cardiovascular system comprises over 60,000 miles');
if (cardioFullContentStart !== -1) {
  const chaptersStart = content.indexOf('chapters: [', cardioFullContentStart);
  // Find the end of the chapters array - look for the closing ] followed by conclusion
  let bracketCount = 0;
  let i = chaptersStart + 10; // after 'chapters: ['
  let chaptersEnd = -1;
  for (; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    else if (content[i] === ']') {
      if (bracketCount === 0) {
        chaptersEnd = i;
        break;
      }
      bracketCount--;
    }
  }
  
  if (chaptersEnd !== -1) {
    // Find the cardio chapters replacement
    const cardioChapters = `
        {
          title: "Chapter 1: The Endothelium: The Single Cell Layer That Protects Your Life",
          content: "The endothelium is not just a passive barrier — it's a metabolically active organ spanning 60,000 miles of blood vessels, producing nitric oxide (NO), prostacyclin, and endothelin-1. eNOS (endothelial nitric oxide synthase) converts L-arginine to NO, which diffuses to vascular smooth muscle, activating guanylate cyclase → cGMP → vasodilation. Endothelial dysfunction (reduced NO bioavailability) is the earliest detectable stage of atherosclerosis — decades before plaque appears on imaging. Causes: oxidative stress (uncoupled eNOS from BH4 depletion), inflammation (TNF-α, IL-6 suppressing eNOS expression), hyperglycemia (AGE-RAGE axis, PKC activation), disturbed shear stress (oscillatory flow at bifurcations), and mitochondrial ROS. The endothelium also regulates coagulation (tPA/PAI-1 balance), immune cell adhesion (VCAM-1, ICAM-1, E-selectin), and vascular permeability. When NO drops, platelets adhere, monocytes infiltrate, and smooth muscle proliferates — the atherogenic triad. Restoring endothelial function requires addressing all upstream drivers simultaneously: glycemic control, oxidative stress reduction, shear stress normalization (exercise), and eNOS cofactor repletion (BH4, L-arginine, folate, BH3).",
          keyTakeaways: [
            "Endothelial dysfunction precedes structural plaque by 20-30 years — it's the reversible precursor.",
            "Flow-mediated dilation (FMD) is the gold standard non-invasive endothelial function test; <6% = dysfunction.",
            "Every cardiovascular risk factor (smoking, diabetes, hypertension, dyslipidemia, obesity, inactivity) converges on endothelial NO deficiency.",
            "eNOS uncoupling (from BH4 oxidation) converts eNOS from NO producer to superoxide generator — a vicious cycle.",
            "Shear stress from exercise is the most potent physiological eNOS activator — 30 min Zone 2 daily upregulates eNOS expression by 40%."
          ],
          doctorTip: "Your endothelium renews every 3-5 days. Daily choices (food, movement, sleep) determine whether new cells are functional or dysfunctional. The single most impactful habit: 30 minutes of Zone 2 aerobic exercise daily — it increases eNOS expression by 40% and NO production by 60%."
        },
        {
          title: "Chapter 2: Rethinking Heart Disease: Glycation, Oxidation & Endothelial Injury",
          content: "The 'cholesterol hypothesis' is incomplete. LDL cholesterol only becomes atherogenic when modified — oxidized (oxLDL), glycated (glycLDL), or aggregated. oxLDL is taken up by macrophages via scavenger receptors (CD36, SR-A, LOX-1), forming foam cells — the hallmark of early fatty streaks. Glycation (non-enzymatic glucose attachment to apoB lysine residues) impairs LDL receptor clearance, prolonging circulation time 3-5x and increasing arterial retention. Advanced Glycation End-products (AGEs) from high-heat cooking (grilling, frying, roasting) and endogenous formation (methylglyoxal pathway) cross-link collagen and elastin in the vascular media, causing arterial stiffening independent of plaque. AGE-RAGE signaling activates NF-κB → VCAM-1/ICAM-1 → monocyte adhesion. The real drivers of atherosclerosis: postprandial hyperglycemia (1-hr post-meal glucose >140 mg/dL), oxidative stress (myeloperoxidase, NADPH oxidase), inflammation (hs-CRP >1 mg/L), and disturbed hemodynamics — not total LDL alone. The MESA study showed coronary artery calcium (CAC) progression correlates more strongly with HbA1c and insulin resistance than LDL-C.",
          keyTakeaways: [
            "ApoB particle count > LDL-C concentration for risk prediction — each particle carries one apoB molecule.",
            "HbA1c >5.3% indicates glycation damage to vascular proteins; >5.7% = prediabetes with active endothelial injury.",
            "Cooking method matters: steam, poach, stew > grill, fry, roast (AGEs). Marinating in acid (lemon, vinegar) reduces AGE formation by 50%.",
            "Methylglyoxal (from glycolysis) is the primary endogenous AGE precursor — reduced by benfotiamine (fat-soluble B1) 300mg/day.",
            "Postprandial 1-hr glucose >140 mg/dL generates more oxidative stress than fasting glucose — test after meals."
          ],
          doctorTip: "Your HbA1c is a vascular aging clock. Every 0.1% reduction = measurable arterial stiffness improvement (pulse wave velocity). Target HbA1c <5.0% for optimal vascular health. If your fasting glucose is normal but postprandial spikes occur, you have 'hidden' glycation damage — use a CGM to identify trigger foods."
        },
        {
          title: "Chapter 3: The Complete Cardiac Lab Blueprint: What to Ask Your Physician",
          content: "Standard lipid panel (Total, LDL, HDL, Triglycerides) misses 50% of cardiovascular risk. Essential advanced panel: 1) ApoB (atherogenic particle count — target <60 mg/dL primary prevention, <40 mg/dL secondary) — each VLDL, IDL, LDL, and Lp(a) particle carries one apoB molecule, making it the direct count of atherogenic particles. 2) Lp(a) (genetic, atherothrombotic — >50 nmol/L = high risk; >125 nmol/L = very high; measured once in lifetime). 3) hs-CRP (vascular inflammation — target <0.5 mg/L optimal, <1 mg/L good, >3 mg/L high). 4) Fasting insulin (target <6 μIU/mL optimal, <10 acceptable) — hyperinsulinemia precedes hyperglycemia by 10-15 years. 5) HbA1c (target <5.3% optimal, <5.7% normal). 6) Homocysteine (target <7 μmol/L; >10 = methylation/B-vitamin deficiency). 7) Omega-3 Index (target >8% RBC EPA+DHA; <4% = high risk). 8) Vitamin D 25-OH (target 60-80 ng/mL; <40 = insufficient for vascular immune function). 9) Coronary Artery Calcium (CAC) score (0 = 15-year very low risk warranty; 1-99 = mild; 100-399 = moderate; >400 = high). 10) Carotid Intima-Media Thickness (CIMT) for early plaque detection in CAC=0 patients. 11) Fasting glucose + 1-hr postprandial glucose (OGTT or CGM). 12) Uric acid (target <5.5 mg/dL men, <4.5 women; >6 = endothelial dysfunction via xanthine oxidase).",
          keyTakeaways: [
            "ApoB is the single best lipid risk marker — each particle = one atherogenic event waiting to happen. Target <60 mg/dL.",
            "Lp(a) is genetic — if elevated, screen family members. No drug lowers it significantly yet (antisense oligonucleotides pelacarsen in Phase 3 trials).",
            "CAC = 0 gives 15-year warranty against events; CAC >100 = statin indicated regardless of LDL-C per ACC/AHA guidelines.",
            "Fasting insulin is the earliest marker of metabolic dysfunction — elevated 10-15 years before glucose rises.",
            "Omega-3 Index >8% reduces sudden cardiac death by 90% (GISSI-Prevenzione). Test annually."
          ],
          doctorTip: "If your doctor refuses advanced testing, order it yourself (Quest, LabCorp, Cleveland HeartLab, Vibrant Wellness). Knowledge is the prerequisite for prevention. At minimum: ApoB, Lp(a), hs-CRP, fasting insulin, HbA1c, Omega-3 Index, Vitamin D, Homocysteine. Cost: ~$200-300 out-of-pocket — the best investment in your cardiovascular future."
        },
        {
          title: "Chapter 4: Nitric Oxide: The Master Vasodilator & How to Supercharge It",
          content: "NO is a gas with a half-life of <1 second, yet it regulates every aspect of vascular health: vasodilation, platelet inhibition, leukocyte adhesion suppression, smooth muscle proliferation inhibition, and mitochondrial biogenesis. Three NOS isoforms: eNOS (endothelial, constitutive, calcium-dependent), nNOS (neuronal), iNOS (inflammatory, inducible, produces high-output NO for host defense). eNOS requires: L-arginine (substrate), BH4/tetrahydrobiopterin (essential cofactor), oxygen, NADPH, calcium/calmodulin, and Hsp90. BH4 oxidation by superoxide (from NADPH oxidase, uncoupled eNOS, mitochondria) causes eNOS uncoupling — the enzyme produces superoxide instead of NO, creating a vicious oxidative cycle. Dietary nitrates (leafy greens, beets, arugula, spinach) → enterosalivary circuit (oral bacteria reduce nitrate to nitrite) → gastric nitrite → NO (independent of eNOS, works even with endothelial dysfunction). Citrulline (watermelon, supplements) → kidney converts to arginine → NO (bypasses hepatic first-pass metabolism of arginine). Sunlight UVA (320-400nm) mobilizes cutaneous NO stores from nitrosothiols and nitrate, causing systemic vasodilation. Polyphenols (cocoa flavanols, pomegranate, green tea) activate eNOS via PI3K/Akt phosphorylation and increase BH4 availability.",
          keyTakeaways: [
            "Never use antiseptic antibacterial mouthwashes (chlorhexidine, alcohol-based) — they destroy the oral bacteria that convert nitrate into nitrite, abolishing the enterosalivary NO pathway!",
            "Eat 1 cup of arugula or cooked beetroots daily for dietary nitrates (300-400mg nitrate). Chew thoroughly to mix with oral bacteria.",
            "L-Citrulline (3-6g daily, split dose) increases plasma L-Arginine and NO more effectively than direct L-Arginine (poor bioavailability).",
            "Cocoa flavanols (500-1000mg epicatechin/day) activate eNOS via PI3K/Akt — 90% dark chocolate or cacao powder.",
            "Pomegranate juice (8oz/day) increases paraoxonase-1 (PON1), protecting HDL and eNOS from oxidation."
          ],
          doctorTip: "Getting 15 minutes of natural morning sunlight on your skin (not through glass) triggers systemic nitric oxide mobilization from subcutaneous stores, naturally lowering systolic BP by 5-8 mmHg. Combine with 1 cup arugula + 3g citrulline pre-workout for maximal NO synergy. Your blood pressure will thank you."
        },
        {
          title: "Chapter 5: Dietary Cardiology: Mediterranean vs Ketogenic vs Plant-Rich — Evidence-Based Comparison",
          content: "PREDIMED: Mediterranean diet (EVOO 50ml/day or nuts 30g/day + fish 3x/week + vegetables + legumes + whole grains) reduced major CV events by 30% vs low-fat control (NNT=61 over 4.8 years). Plant-rich (Ornish, Esselstyn) reverses angiographic stenosis: Ornish Lifestyle Heart Trial showed 4.5% stenosis regression at 1 year, 7.9% at 5 years vs 28% progression in controls. Ketogenic improves triglycerides (-50%), HDL (+15%), insulin sensitivity, HbA1c — but may raise LDL-C and ApoB 20-50% in lean-mass hyper-responders (Dave Feldman's 'Lipid Energy Model'). The common thread across all successful dietary patterns: whole foods, no refined industrial seed oils/sugars, high phytonutrient density, adequate protein. For most: Mediterranean + low-glycemic + time-restricted eating (16:8) is the sustainable sweet spot. Key foods with mechanistic evidence: EVOO (30ml/day — oleocanthal inhibits COX-1/2 like ibuprofen, oleuropein activates eNOS), wild fish 3x/week (EPA/DHA incorporate into vascular phospholipids, reduce inflammation, improve compliance), nuts 30g/day (PREDIMED: 30% CV reduction), greens 2 cups/day (dietary nitrates → NO), berries 1 cup/day (anthocyanins → eNOS activation, reduced oxLDL), legumes 1 cup/day (fiber, magnesium, potassium, plant sterols), garlic 2-4 cloves/day (allicin → H2S → vasodilation, ACE inhibition).",
          keyTakeaways: [
            "EVOO polyphenols (oleocanthal) inhibit COX enzymes like ibuprofen — but safely and chronically. 30ml/day = therapeutic dose.",
            "If ApoB rises on keto, add 15g psyllium husk + 2g plant sterols + shift to Mediterranean fats (EVOO, avocado, nuts).",
            "Plant sterols (2g/day, fortified foods or supplements) block intestinal cholesterol absorption by 10-15% — additive to statins.",
            "Soy protein (25g/day) reduces LDL-C 3-5% via LDL receptor upregulation — FDA heart health claim.",
            "Hibiscus tea (3 cups/day) acts as natural ACE inhibitor — lowers systolic BP 7-10 mmHg in prehypertension."
          ],
          doctorTip: "There is no 'perfect' diet — only the one you'll sustain that optimizes YOUR biomarkers. Test, track, adjust. Start with Mediterranean + 16:8 TRF + 30g nuts + 30ml EVOO + 3x/week fatty fish. If ApoB >80 after 3 months, add plant sterols, psyllium, and consider moderate carb reduction. If triglycerides >150, reduce refined carbs/alcohol, add omega-3 2-4g EPA/DHA. Personalization beats dogma."
        },
        {
          title: "Chapter 6: Reversing Arterial Stiffness: K2, Magnesium, Omega-3 & The Vascular Compliance Protocol",
          content: "Arterial stiffness (pulse wave velocity, PWV) predicts cardiovascular events independent of blood pressure — it's the integration of all vascular insults over a lifetime. Calcium deposits in the media (Mönckeberg's sclerosis) and intima (atherosclerotic calcification) reduce compliance. Vitamin K2 MK-7 (menaquinone-7) activates Matrix Gla Protein (MGP) — the most potent calcification inhibitor in the vasculature. Without K2, MGP remains inactive (under-carboxylated), allowing calcium-phosphate crystals to deposit in elastic lamellae. The Rotterdam Study: highest K2 intake (>32 mcg/day) vs lowest (<21 mcg) = 57% lower coronary calcification, 52% lower severe aortic calcification, 57% lower CV mortality. Magnesium is nature's calcium channel blocker — it competes with calcium at vascular smooth muscle, reducing tone and improving compliance. Mg deficiency (>50% of adults) = endothelial dysfunction, inflammation, insulin resistance. Mg Glycinate/Taurate have superior vascular absorption vs oxide/citrate. Omega-3 (EPA/DHA) incorporates into vascular phospholipids, reducing inflammation (resolvins, protectins), improving endothelial function, and reducing PWV. The JELIS trial: EPA 1.8g + statin vs statin alone = 19% relative risk reduction in major coronary events. Dosing: K2 MK-7 (180-360 mcg with fat-containing meal), Mg Glycinate (400mg elemental Mg at night), EPA/DHA (2-4g combined, high EPA >60%), Vitamin D3 (5000-10000 IU with K2 for synergy — D3 increases MGP expression, K2 activates it).",
          keyTakeaways: [
            "Vitamin K2 MK-7 (not K1 or MK-4) is the form that activates vascular MGP. Natto (fermented soy) is the only food source with significant MK-7.",
            "Magnesium Glycinate/Taurate > Oxide/Citrate for vascular absorption and GI tolerance. Target RBC Mg >6.5 mg/dL.",
            "High EPA (>60%) Omega-3 reduces plaque inflammation more than DHA — EPA competes with arachidonic acid for COX/LOX.",
            "PWV <7 m/s = normal; 7-10 = increased; >10 = high stiffness. Measured by carotid-femoral tonometry.",
            "Vitamin D3 and K2 must be taken together — D3 upregulates MGP transcription, K2 carboxylates/activates it."
          ],
          doctorTip: "One medium avocado contains nearly 1,000mg of bioavailable potassium, making it a true cardiac superfood — potassium is the primary vasodilatory electrolyte. Combine daily: 1 avocado + 1 cup arugula + 30ml EVOO + 30g walnuts + wild salmon. This single meal delivers K2 (from natto if included), Mg, EPA/DHA, nitrates, polyphenols, potassium, fiber — the complete vascular compliance protocol on a plate."
        },
        {
          title: "Chapter 7: Heart Rate Variability (HRV) & Vagal Tone Masterclass — The Autonomic Window to Cardiovascular Health",
          content: "HRV (beat-to-beat interval variation) is the non-invasive window into autonomic balance — the only clinical measure of parasympathetic (vagal) tone. High HRV = parasympathetic dominance (recovery, adaptability, anti-inflammatory via cholinergic anti-inflammatory pathway: vagus → acetylcholine → α7nAChR on macrophages → NF-κB inhibition). Low HRV = sympathetic dominance (stress, inflammation, insulin resistance, mortality risk). HRV drops 1-2ms per year after age 30; <20ms RMSSD = 3-4x mortality risk. The cholinergic anti-inflammatory pathway is the mechanism by which vagal activation reduces systemic inflammation — this is why HRV correlates with hs-CRP, IL-6, and outcomes. Interventions with evidence: Zone 2 aerobic training (↑ HRV 10-20% in 8-12 weeks via increased vagal tone and baroreflex sensitivity), slow breathing 4-6 breaths/min (resonance frequency breathing maximizes RSA — respiratory sinus arrhythmia), cold face immersion (mammalian dive reflex → vagal surge), meditation/yoga (↑ HRV 15-30%), sleep quality (1 hour sleep loss = 5-10% HRV drop), alcohol avoidance (acute alcohol reduces HRV 20-40% for 24-48 hours). HRV-guided training: train hard when morning HRV > baseline +5%, recover when < baseline -5%. Morning HRV (5-min supine, RMSSD) is the gold standard. Devices: Oura Ring, Whoop, Garmin, HRV4Training (camera-based), Polar H10 chest strap (ECG accuracy).",
          keyTakeaways: [
            "HRV is the single best non-invasive marker of autonomic and cardiovascular resilience — it reflects the cholinergic anti-inflammatory pathway.",
            "Alcohol reduces HRV by 20-40% for 24-48 hours — the most reliable HRV suppressor. Even 1 drink measurably impacts next-morning HRV.",
            "Target: HRV >50ms (RMSSD) for age 40+, >70ms for age <40. Elite endurance athletes: 80-120ms.",
            "Resonance frequency breathing (4.5-6 breaths/min) maximizes HRV acutely — practice 10 min twice daily.",
            "HRV drops precede illness by 24-48 hours — track daily to detect early immune activation."
          ],
          doctorTip: "Track HRV daily (Oura, Whoop, Garmin, HRV4Training). If 3-day rolling average drops >10% below your baseline, prioritize recovery — you're overreaching. The autonomic nervous system doesn't lie: HRV is the earliest signal of cardiovascular stress, before BP, labs, or symptoms. Use it to guide training intensity, stress management, and recovery."
        },
        {
          title: "Chapter 8: Advanced Lipid Testing: ApoB, Lp(a), sdLDL, Lp-PLA2 & CAC Scoring — Beyond LDL-C",
          content: "LDL-C is a calculated estimate (Friedewald: LDL = Total - HDL - TG/5) — inaccurate when triglycerides >150 or <50 (common in insulin resistance). Direct ApoB measurement counts atherogenic particles (each VLDL, IDL, LDL, Lp(a) has one ApoB molecule) — it's the direct count of particles capable of entering the arterial intima. Small dense LDL (sdLDL, phenotype B) penetrates endothelium 3x more readily than large buoyant LDL, has longer plasma half-life (reduced LDL receptor affinity), and is more susceptible to oxidation. Lp(a) is a LDL-like particle with apo(a) attached via disulfide bond to apoB — promotes thrombosis (apo(a) homology with plasminogen inhibits fibrinolysis) and foam cell formation (oxidized phospholipids on apo(a)). CAC score (non-contrast CT, Agatston units) quantifies calcified plaque burden: 0 (15-year very low risk warranty), 1-99 (mild, 10-year risk 2-5%), 100-399 (moderate, 10-year risk 10-20%), ≥400 (high, 10-year risk >20%). CAC >0 reclassifies risk upward in all guidelines. Lp-PLA2 (PLAC test) measures vascular-specific inflammation — enzyme on LDL that generates inflammatory oxidized phospholipids; >200 ng/mL = high risk. Remnant cholesterol (non-HDL-C - LDL-C = VLDL + IDL) reflects triglyceride-rich lipoprotein burden — target <20 mg/dL. The CONFIRM registry: CAC=0 has 0.1% annual event rate regardless of risk factors; CAC>1000 has 2.5% annual event rate.",
          keyTakeaways: [
            "ApoB <60 mg/dL = optimal primary prevention. <40 mg/dL = optimal secondary prevention/very high risk. 60-80 = moderate. >80 = high risk regardless of LDL-C.",
            "Lp(a) >50 nmol/L (125 nmol/L in some assays) = independent risk factor — screen relatives. If >180 nmol/L, consider lipoprotein apheresis.",
            "CAC = 0 provides 15-year very low risk warranty — statin rarely needed even with elevated LDL-C.",
            "sdLDL (phenotype B) = triglyceride >150 + HDL <40 (men) / <50 (women). NMR or ion mobility for particle sizing.",
            "Lp-PLA2 >200 ng/mL = active vascular inflammation — consider intensified therapy even if lipids at goal."
          ],
          doctorTip: "If ApoB and LDL-C are discordant (high ApoB, normal LDL-C), treat to ApoB target. Discordance is common in insulin resistance and high triglycerides (TG >150). The discordance means you have more particles (high ApoB) each carrying less cholesterol (low LDL-C) — the particle number is what drives atherosclerosis. Order NMR LipoProfile or ion mobility for full particle analysis."
        },
        {
          title: "Chapter 9: Statin Decision Framework: Risks, Benefits, Alternatives & Personalized Prescribing",
          content: "Statins reduce LDL-C 30-50% (intensity-dependent) and major vascular events 20-25% per 1 mmol/L LDL-C reduction (CTT meta-analysis, 170,000 patients). NNT (Number Needed to Treat) for 5 years: primary prevention ~50-100 (depending on baseline risk), secondary prevention ~20-30. Side effects: myopathy (5-10% clinical, 0.1% rhabdomyolysis), new-onset diabetes (9-12% relative increase, absolute ~0.5-1% over 5 years, highest with high-intensity in metabolic syndrome), cognitive complaints (rare, reversible), hepatic transaminase elevation (1-2%). Risk factors for myopathy: SLCO1B1*5 polymorphism, hypothyroidism, age >80, polypharmacy (CYP3A4 inhibitors), vitamin D deficiency. Alternatives with outcome data: Ezetimibe (IMPROVE-IT: added to simvastatin vs simvastatin alone = 6.4% relative risk reduction, LDL-C ↓15-20%, safe), Bempedoic acid (CLEAR Outcomes: primary prevention statin-intolerant = 13% MACE reduction, LDL-C ↓15-20%, no myopathy, ↑uric acid/gout), PCSK9 inhibitors — evolocumab (FOURIER: secondary prevention, LDL-C ↓59%, MACE ↓15%), alirocumab (ODYSSEY: similar), injectable, expensive ($5000-6000/year), Inclisiran (ORION: siRNA, twice-yearly dosing, LDL-C ↓50%), Lp(a)-targeted: pelacarsen (antisense, Phase 3). Natural/adjunctive: Bergamot polyphenols (↓ LDL-C 20-30%, ↓ TG, ↑ HDL), Red yeast rice (lovastatin analog — variable potency, citrinin contamination risk), Plant sterols (↓ LDL-C 10-15%), Psyllium (↓ LDL-C 5-10%), Garlic extract (↓ LDL-C 8-15%), Amla (Indian gooseberry, ↓ LDL-C 15-20%).",
          keyTakeaways: [
            "Statin intolerance is real — try rosuvastatin 5mg alternate days (or 2.5mg daily) before abandoning the class. Low-dose rosuvastatin retains 70% efficacy with 90% fewer side effects.",
            "PCSK9 inhibitors achieve LDL-C <40 mg/dL — essential for FH, very high risk, or statin intolerance with high residual risk.",
            "Always combine pharmacotherapy with lifestyle — drugs lower numbers, lifestyle fixes roots. Statin + Mediterranean diet = synergistic event reduction.",
            "Test SLCO1B1 genotype if myopathy history — guides statin selection (avoid simvastatin if *5 carrier).",
            "CoQ10 200mg (ubiquinol) mitigates statin-induced mitochondrial depletion — statins block HMG-CoA reductase, also reducing CoQ10 synthesis by 40%."
          ],
          doctorTip: "If prescribed statin, take CoQ10 200mg (ubiquinol) to mitigate mitochondrial depletion. Monitor LFTs and CK at baseline, 12 weeks, then annually. If LDL-C >190 or CAC >100 with LDL-C >100, statin is guideline-indicated regardless of risk calculator. The risk calculator (ASCVD Pooled Cohort Equations) underestimates risk in South Asians, family history of premature CAD, Lp(a) elevation, and inflammatory conditions — use CAC scoring to reclassify."
        },
        {
          title: "Chapter 10: 60-Day Cardiovascular Rejuvenation Roadmap — From Endothelial Dysfunction to Vascular Resilience",
          content: "This protocol addresses the root causes of endothelial dysfunction and arterial stiffness through a structured 60-day program. Days 1-7 (Foundation): Baseline labs — ApoB, Lp(a), hs-CRP, fasting insulin, HbA1c, homocysteine, Omega-3 Index, Vitamin D, uric acid, CAC if indicated (men >40, women >50, or any risk factors). Begin daily: EVOO 30ml (with meals), arugula 1 cup (nitrates), beetroot 1 cup or 300mg nitrate, wild fish 3x/week (EPA/DHA), nuts 30g (walnuts/almonds), berries 1 cup (anthocyanins), 10,000 steps, Zone 2 aerobic 3x/week (30-45 min), 16:8 time-restricted eating (12pm-8pm), Mg Glycinate 400mg night, D3 5000 IU + K2 MK-7 200mcg (with fat), Omega-3 2g EPA/DHA (high EPA >60%), Citrulline 3g pre-workout. Days 8-30 (Optimization): Add resistance training 2x/week (compound movements: squat, deadlift, press, row), HRV tracking daily (morning supine), sauna 2x/week (20 min, 80-90°C), cold shower 3x/week (2-3 min, 10-15°C), garlic 2-4 cloves/day, hibiscus tea 3 cups/day, pomegranate 8oz or 500mg ellagitannins. Monitor: BP daily (target <120/80), fasting glucose weekly, weight weekly. Days 31-60 (Intensification & Testing): Retest hs-CRP, fasting insulin, lipid panel with ApoB, BP, HRV. Targets: hs-CRP <1 mg/L (optimal <0.5), fasting insulin <8 μIU/mL (optimal <6), systolic BP ↓10-15 mmHg from baseline, HRV ↑20% from baseline, ApoB <60 mg/dL (or ↓20% from baseline). Adjust: If ApoB >80 despite lifestyle, add ezetimibe 10mg or consider PCSK9i. If Lp(a) >125 nmol/L, consider lipoprotein apheresis or clinical trial enrollment. If hs-CRP >2, intensify anti-inflammatory: curcumin 1g (liposomal), omega-3 4g EPA/DHA, eliminate remaining inflammatory foods. Maintenance (Day 60+): Quarterly lab retest, annual CAC if >0, continue daily protocol. The vascular endothelium renews every 3-5 days — 60 days = 12-20 renewal cycles. Consistency compounds: daily 1% improvements = 37x annual improvement.",
          keyTakeaways: [
            "60 days is the minimum to see measurable vascular remodeling (FMD, PWV, HRV) — endothelial turnover is 3-5 days.",
            "Lifestyle + targeted supplements = 80% of benefit. Drugs fill the remaining 20% for high-risk patients.",
            "Consistency compounds: daily 1% improvements = 37x annual improvement (1.01^365 = 37.8).",
            "Track: ApoB, hs-CRP, fasting insulin, BP, HRV, Omega-3 Index quarterly. Adjust protocol based on data.",
            "The protocol works at any age — vascular plasticity persists throughout life. Start today."
          ],
          doctorTip: "Schedule your 60-day retest on Day 1. Put it on the calendar. Accountability + data = results. The roadmap is useless without execution. Your cardiovascular system is waiting for the signal to regenerate — give it the right inputs daily, and it will respond. The endothelium you have in 60 days is built by the choices you make today."
        }
`;

    const before = content.substring(0, chaptersStart + 10);
    const after = content.substring(chaptersEnd);
    content = before + cardioChapters + '\n      ],' + after;
  }
}

// Now do the same for sleep guide
const sleepFullContentStart = content.indexOf('fullContent: {\n      introduction: "Sleep is not passive downtime');
if (sleepFullContentStart !== -1) {
  const chaptersStart = content.indexOf('chapters: [', sleepFullContentStart);
  let bracketCount = 0;
  let i = chaptersStart + 10;
  let chaptersEnd = -1;
  for (; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    else if (content[i] === ']') {
      if (bracketCount === 0) {
        chaptersEnd = i;
        break;
      }
      bracketCount--;
    }
  }
  
  if (chaptersEnd !== -1) {
    const sleepChapters = `
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
`;

    const before = content.substring(0, chaptersStart + 10);
    const after = content.substring(chaptersEnd);
    content = before + sleepChapters + '\n      ],' + after;
  }
}

// Update page counts and reading times
content = content.replace(
  /id: "cardiovascular-vitality",[\s\S]*?pages: 3,\s*readingTime: "0.1 hours"/,
  'id: "cardiovascular-vitality",\n    title: "Cardiovascular Vitality & Blood Pressure Reset",\n    subtitle: "A Complete Clinical Guide to Endothelial Health, Lipid Optimization, Plaque Reversal & Natural Arterial Elasticity",\n    category: "heart",\n    isFree: false,\n    price: 32.50,\n    originalPrice: 65.00,\n    rating: 4.99,\n    reviewCount: 1620,\n    pages: 18,\n    readingTime: "4.5 hours"'
);

content = content.replace(
  /id: "sleep-architecture-cortisol",[\s\S]*?pages: 3,\s*readingTime: "0.1 hours"/,
  'id: "sleep-architecture-cortisol",\n    title: "Sleep Architecture & Cortisol Protocol",\n    subtitle: "A Clinical Guide to Resetting the Circadian Clock, Regulating the HPA Axis, and Unlocking Deep Stage 4 Recovery",\n    category: "biohacking",\n    isFree: false,\n    price: 27.50,\n    originalPrice: 55.00,\n    rating: 4.97,\n    reviewCount: 1290,\n    pages: 18,\n    readingTime: "4.5 hours"'
);

// Write back
fs.writeFileSync(filePath, content);
console.log('Updated both guides with expanded content and page counts');