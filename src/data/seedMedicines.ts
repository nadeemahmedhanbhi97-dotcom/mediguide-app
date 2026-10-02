import { Medicine } from '../types.ts';

export const SEED_MEDICINES: Medicine[] = [
  {
    id: 'med-panadol',
    name: 'Panadol (Paracetamol)',
    genericName: 'Paracetamol / Acetaminophen',
    brandNames: ['Panadol', 'Calpol', 'Tylenol', 'Disprol', 'Febrol'],
    ingredients: ['Paracetamol 500mg'],
    category: 'Analgesics & Antipyretics',
    strength: '500 mg',
    form: 'Tablet',
    manufacturer: 'GSK Consumer Healthcare',
    uses: [
      'Relief of mild to moderate pain (headache, toothache, muscle ache)',
      'Reduction of fever in colds, influenza, and post-vaccination',
      'Symptomatic relief of osteoarthritis discomfort'
    ],
    sideEffects: [
      'Nausea (uncommon)',
      'Allergic skin rashes (rare)',
      'Mild stomach upset'
    ],
    seriousWarnings: [
      'Hepatotoxicity: Do not exceed 4,000 mg (8 tablets) in 24 hours. Overdose causes severe liver damage.',
      'Do not combine with other paracetamol-containing combination medicines.',
      'Caution in chronic alcoholism or pre-existing liver impairment.'
    ],
    interactions: [
      'Warfarin: Prolonged regular use may enhance anticoagulant effect',
      'Metoclopramide: Increases absorption rate of paracetamol',
      'Cholestyramine: Reduces absorption if taken within 1 hour'
    ],
    dosage: 'Adults: 500 mg to 1,000 mg every 4–6 hours as needed. Maximum 4,000 mg per 24 hours.',
    contraindications: ['Known hypersensitivity to paracetamol', 'Severe active hepatocellular insufficiency'],
    pregnancySafety: 'Category B - Generally considered safe under medical direction during all trimesters.',
    storage: 'Store below 25°C in a dry place protected from direct sunlight.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-15'
  },
  {
    id: 'med-augmentin',
    name: 'Augmentin (Amoxicillin + Clavulanate)',
    genericName: 'Amoxicillin + Clavulanic Acid',
    brandNames: ['Augmentin', 'Curam', 'Clavam', 'Amoksiklav'],
    ingredients: ['Amoxicillin 500mg', 'Clavulanic Acid 125mg (as Potassium Clavulanate)'],
    category: 'Antibiotics (Penicillins)',
    strength: '625 mg (500mg/125mg)',
    form: 'Film-coated Tablet',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals',
    uses: [
      'Bacterial sinusitis and acute otitis media',
      'Community-acquired pneumonia and exacerbations of chronic bronchitis',
      'Skin, soft tissue, and urinary tract infections'
    ],
    sideEffects: [
      'Diarrhea and loose stools',
      'Nausea and abdominal discomfort',
      'Candidiasis (oral or vaginal thrush)'
    ],
    seriousWarnings: [
      'Severe anaphylactic hypersensitivity in patients with penicillin allergy.',
      'Antibiotic-associated pseudomembranous colitis (Clostridioides difficile).',
      'Hepatic dysfunction and cholestatic jaundice have been reported.'
    ],
    interactions: [
      'Methotrexate: Penicillins may reduce excretion, increasing toxicity risk',
      'Oral anticoagulants: Prothrombin time / INR may be prolonged',
      'Allopurinol: Concomitant use increases incidence of skin rashes'
    ],
    dosage: 'Adults: 625 mg every 8 hours or 1,000 mg every 12 hours depending on infection severity.',
    contraindications: ['History of penicillin/beta-lactam anaphylaxis', 'History of Augmentin-associated jaundice'],
    pregnancySafety: 'Category B - Used when clinically indicated under physician supervision.',
    storage: 'Store in original packaging below 25°C away from moisture.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-05-20'
  },
  {
    id: 'med-brufen',
    name: 'Brufen (Ibuprofen)',
    genericName: 'Ibuprofen',
    brandNames: ['Brufen', 'Advil', 'Motrin', 'Nurofen'],
    ingredients: ['Ibuprofen 400mg'],
    category: 'NSAIDs (Nonsteroidal Anti-inflammatory)',
    strength: '400 mg',
    form: 'Tablet',
    manufacturer: 'Abbott Laboratories',
    uses: [
      'Inflammatory conditions including rheumatoid arthritis and osteoarthritis',
      'Dysmenorrhea (menstrual cramps)',
      'Musculoskeletal sprains, dental pain, and acute inflammatory pain'
    ],
    sideEffects: [
      'Dyspepsia, heartburn, and stomach pain',
      'Dizziness or mild headache',
      'Fluid retention or mild peripheral edema'
    ],
    seriousWarnings: [
      'Gastrointestinal ulceration, bleeding, or perforation without prior warning.',
      'Cardiovascular thrombotic risk with long-term high-dose therapy.',
      'Renal papillary necrosis and impairment in dehydrated or elderly individuals.'
    ],
    interactions: [
      'Aspirin / Anticoagulants: Significantly increases bleeding danger',
      'ACE Inhibitors / ARBs: Reduces antihypertensive effect and increases acute renal failure risk',
      'Lithium: Decreases lithium clearance, increasing blood lithium levels'
    ],
    dosage: 'Adults: 400 mg every 4–6 hours with food. Maximum 1,200 mg OTC or 2,400 mg under prescription.',
    contraindications: ['Active peptic ulcer or GI bleeding history', 'Severe heart failure', 'Third trimester of pregnancy'],
    pregnancySafety: 'Category D in 3rd trimester (contraindicated due to premature ductus arteriosus closure).',
    storage: 'Store below 30°C in a dry place.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-01'
  },
  {
    id: 'med-glucophage',
    name: 'Glucophage (Metformin)',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Riomet', 'Neodipar'],
    ingredients: ['Metformin HCl 500mg'],
    category: 'Antidiabetic (Biguanide)',
    strength: '500 mg',
    form: 'Tablet',
    manufacturer: 'Merck Healthcare',
    uses: [
      'First-line treatment of Type 2 Diabetes Mellitus',
      'Management of insulin resistance in Polycystic Ovary Syndrome (PCOS)'
    ],
    sideEffects: [
      'Metallic taste in mouth',
      'Nausea, diarrhea, abdominal bloating (mitigated by taking with meals)',
      'Decreased Vitamin B12 absorption with prolonged usage'
    ],
    seriousWarnings: [
      'Lactic Acidosis: Rare but life-threatening emergency, heightened in renal/hepatic failure or sepsis.',
      'Discontinue 48 hours before and after iodinated radiocontrast procedures.',
      'Monitor renal function (eGFR) prior to initiation and periodically.'
    ],
    interactions: [
      'Iodinated contrast media: Risk of contrast-induced nephropathy leading to lactic acidosis',
      'Cimetidine: Competes for renal tubular secretion, increasing metformin levels',
      'Alcohol: Potentiates effect of metformin on lactate metabolism'
    ],
    dosage: 'Initial: 500 mg twice daily or 850 mg once daily taken with meals. Titrated gradually.',
    contraindications: ['Severe renal impairment (eGFR < 30 mL/min/1.73m²)', 'Metabolic acidosis or diabetic ketoacidosis'],
    pregnancySafety: 'Category B - Frequently prescribed under specialist endocrinology guidance.',
    storage: 'Store at 20°C to 25°C away from heat and light.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-08-10'
  },
  {
    id: 'med-lipitor',
    name: 'Lipitor (Atorvastatin)',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor', 'Atorva', 'Torvast', 'Sortis'],
    ingredients: ['Atorvastatin 20mg'],
    category: 'Cardiovascular (Statin / HMG-CoA Reductase Inhibitor)',
    strength: '20 mg',
    form: 'Film-coated Tablet',
    manufacturer: 'Pfizer Inc.',
    uses: [
      'Primary and secondary hypercholesterolemia and mixed dyslipidemia',
      'Reduction of cardiovascular events (myocardial infarction, stroke) in high-risk patients'
    ],
    sideEffects: [
      'Myalgia (muscle pain or tenderness)',
      'Elevated liver transaminases (ALT/AST)',
      'Constipation or flatulence'
    ],
    seriousWarnings: [
      'Rhabdomyolysis: Severe myopathy with acute renal failure secondary to myoglobinuria.',
      'Report unexplained muscle tenderness, weakness, or dark tea-colored urine promptly.',
      'Contraindicated in active liver disease or unexplained persistent transaminase elevations.'
    ],
    interactions: [
      'CYP3A4 Inhibitors (Clarithromycin, Itraconazole): Substantially increases atorvastatin exposure',
      'Grapefruit Juice: Consuming > 1 liter daily increases plasma concentrations',
      'Fibrates (Gemfibrozil): Synergistically increases myopathy risk'
    ],
    dosage: 'Adults: 10 mg to 80 mg once daily taken orally at any time of day, with or without food.',
    contraindications: ['Active liver disease', 'Pregnancy and lactation', 'Unexplained persistent ALT/AST elevation'],
    pregnancySafety: 'Category X - Strictly contraindicated in pregnancy due to essential role of cholesterol in fetal development.',
    storage: 'Store between 20°C and 25°C in tight container.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-04-12'
  },
  {
    id: 'med-concor',
    name: 'Concor (Bisoprolol)',
    genericName: 'Bisoprolol Fumarate',
    brandNames: ['Concor', 'Zebeta', 'Cardicor', 'Bisotens'],
    ingredients: ['Bisoprolol Fumarate 5mg'],
    category: 'Cardiovascular (Beta-1 Selective Blocker)',
    strength: '5 mg',
    form: 'Film-coated Tablet',
    manufacturer: 'Merck KGaA',
    uses: [
      'Essential arterial hypertension',
      'Stable chronic heart failure with reduced systolic left ventricular function',
      'Ischemic heart disease / angina pectoris prophylaxis'
    ],
    sideEffects: [
      'Bradycardia (slow heart rate)',
      'Cold extremities (Raynaud phenomenon)',
      'Fatigue and dizziness upon standing'
    ],
    seriousWarnings: [
      'Never abruptly discontinue therapy; sudden cessation can trigger severe rebound angina or myocardial infarction.',
      'May mask hypoglycemic tachycardia in diabetic patients.',
      'May exacerbate bronchospasm in susceptible asthma patients at higher non-selective doses.'
    ],
    interactions: [
      'Non-dihydropyridine Calcium Antagonists (Verapamil, Diltiazem): Severe bradycardia and AV block risk',
      'Digitalis Glycosides (Digoxin): Increases atrioventricular conduction time',
      'Clonidine: Risk of paradoxical hypertension if bisoprolol is stopped'
    ],
    dosage: 'Hypertension/Angina: 5 mg once daily, max 20 mg. Heart failure: initiated at 1.25 mg with careful upward titration.',
    contraindications: ['Acute heart failure / cardiogenic shock', 'Second or third-degree AV block', 'Severe bradycardia (< 50 bpm)'],
    pregnancySafety: 'Category C - May cause intrauterine growth retardation. Use only if benefits outweigh risks.',
    storage: 'Store below 25°C away from excessive moisture.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-22'
  },
  {
    id: 'med-norvasc',
    name: 'Norvasc (Amlodipine)',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Norvasc', 'Amlo', 'Amlopres', 'Istin'],
    ingredients: ['Amlodipine 5mg (as Besylate)'],
    category: 'Cardiovascular (Dihydropyridine Calcium Channel Blocker)',
    strength: '5 mg',
    form: 'Tablet',
    manufacturer: 'Pfizer Inc.',
    uses: [
      'Essential hypertension (monotherapy or combined)',
      'Chronic stable angina and vasospastic (Prinzmetal) angina'
    ],
    sideEffects: [
      'Peripheral edema (ankle swelling)',
      'Flushing and warmth',
      'Headache and dizziness'
    ],
    seriousWarnings: [
      'Peripheral edema is common due to precapillary vasodilation (not systemic fluid retention).',
      'Severe obstructive coronary disease: rarely increased frequency or severity of angina during initiation.',
      'Titrate cautiously in patients with severe hepatic impairment.'
    ],
    interactions: [
      'Simvastatin: Amlodipine increases simvastatin exposure; limit simvastatin dose to 20 mg/day',
      'CYP3A4 Inhibitors (Ketoconazole, Diltiazem): Increases amlodipine levels',
      'Cyclosporine / Tacrolimus: Amlodipine may raise immunosuppressant concentrations'
    ],
    dosage: 'Initial dose 5 mg once daily; may be increased to maximum 10 mg once daily after 7–14 days.',
    contraindications: ['Severe hypotension', 'Cardiogenic shock', 'Clinically significant aortic stenosis'],
    pregnancySafety: 'Category C - Use during pregnancy only if clearly needed under maternal-fetal medical supervision.',
    storage: 'Store at 15°C to 30°C in light-resistant container.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-03-30'
  },
  {
    id: 'med-losec',
    name: 'Losec / Risek (Omeprazole)',
    genericName: 'Omeprazole',
    brandNames: ['Losec', 'Risek', 'Prilosec', 'Omez'],
    ingredients: ['Omeprazole 20mg'],
    category: 'Gastrointestinal (Proton Pump Inhibitor)',
    strength: '20 mg',
    form: 'Capsule',
    manufacturer: 'AstraZeneca / Getz Pharma',
    uses: [
      'Gastroesophageal reflux disease (GERD) and erosive esophagitis',
      'Duodenal and gastric ulcers',
      'Eradication of Helicobacter pylori in triple therapy regimens'
    ],
    sideEffects: [
      'Headache',
      'Diarrhea, constipation, or abdominal gas',
      'Nausea'
    ],
    seriousWarnings: [
      'Clostridioides difficile-associated diarrhea with extended PPI courses.',
      'Bone fractures (hip, wrist, spine) with long-term high-dose therapy.',
      'Hypomagnesemia and Vitamin B12 deficiency on chronic therapy (> 1 year).'
    ],
    interactions: [
      'Clopidogrel: Omeprazole inhibits CYP2C19 activation of clopidogrel, reducing antiplatelet effect',
      'Digoxin: Increased absorption due to elevated gastric pH',
      'Atazanavir: Marked reduction in antiretroviral plasma concentration'
    ],
    dosage: 'Take 20 mg to 40 mg once daily in the morning, 30–60 minutes before breakfast.',
    contraindications: ['Known hypersensitivity to substituted benzimidazoles', 'Co-administration with rilpivirine'],
    pregnancySafety: 'Category C - Epidemiological studies show no clear malformation risk.',
    storage: 'Store in airtight blister below 25°C protected from moisture.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-18'
  },
  {
    id: 'med-ventolin',
    name: 'Ventolin (Salbutamol)',
    genericName: 'Salbutamol / Albuterol Sulfate',
    brandNames: ['Ventolin', 'ProAir', 'Proventil', 'Asthalin'],
    ingredients: ['Salbutamol Sulfate 100mcg per actuation'],
    category: 'Respiratory (Short-Acting Beta-2 Agonist Bronchodilator)',
    strength: '100 mcg / dose',
    form: 'Metered Dose Inhaler (MDI)',
    manufacturer: 'GlaxoSmithKline',
    uses: [
      'Relief of acute bronchospasm in bronchial asthma and COPD',
      'Prevention of exercise-induced bronchospasm'
    ],
    sideEffects: [
      'Fine skeletal muscle tremor (especially hands)',
      'Palpitations and tachycardia',
      'Transient headache or nervousness'
    ],
    seriousWarnings: [
      'Paradoxical bronchospasm: Life-threatening worsening of wheezing requiring immediate alternate bronchodilator.',
      'Overreliance on SABA without inhaled corticosteroid indicates poorly controlled asthma.',
      'Hypokalemia at high doses; caution in cardiovascular disease.'
    ],
    interactions: [
      'Beta-blockers (e.g. Propranolol): Antagonize bronchodilatory action and may provoke severe bronchospasm',
      'Diuretics (Furosemide, Thiazides): Concomitant use may potentiate hypokalemia',
      'Monoamine Oxidase Inhibitors: Extreme hypertensive reaction potential'
    ],
    dosage: 'Acute relief: 1 to 2 puffs (100–200 mcg) as needed. Prevention: 2 puffs 15 minutes before exercise.',
    contraindications: ['Hypersensitivity to salbutamol', 'Non-MDI oral forms contraindicated in threatened abortion'],
    pregnancySafety: 'Category C - First-line rescue inhaler of choice during pregnancy in asthma guidelines.',
    storage: 'Store canister below 30°C away from heat and direct sunlight. Do not puncture or freeze.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-08-01'
  },
  {
    id: 'med-zithromax',
    name: 'Zithromax (Azithromycin)',
    genericName: 'Azithromycin Monohydrate',
    brandNames: ['Zithromax', 'Azomax', 'Azee', 'Z-Pak'],
    ingredients: ['Azithromycin 500mg'],
    category: 'Antibiotics (Macrolide / Azalide)',
    strength: '500 mg',
    form: 'Tablet',
    manufacturer: 'Pfizer Inc.',
    uses: [
      'Atypical pneumonia and community-acquired respiratory tract infections',
      'Acute bacterial exacerbation of chronic bronchitis and pharyngitis/tonsillitis',
      'Chlamydial urethritis and cervicitis'
    ],
    sideEffects: [
      'Diarrhea and loose stools',
      'Nausea and abdominal cramping',
      'Temporary taste alteration or loss of appetite'
    ],
    seriousWarnings: [
      'QT Prolongation: Risk of Torsades de Pointes and fatal cardiac arrhythmias in patients with underlying cardiac risk.',
      'Hepatotoxicity: Abnormal liver function, hepatitis, and cholestatic jaundice.',
      'Clostridioides difficile colitis.'
    ],
    interactions: [
      'Warfarin: Potential enhancement of anticoagulant effects, monitor INR',
      'Antacids with aluminum/magnesium: Reduces peak serum concentrations',
      'Antiarrhythmic agents (Amiodarone, Sotalol): Additive QT interval prolongation danger'
    ],
    dosage: 'Adults: 500 mg once daily for 3 days, or 500 mg Day 1 followed by 250 mg once daily on Days 2–5.',
    contraindications: ['Known hypersensitivity to macrolides/ketolides', 'History of cholestatic jaundice with azithromycin'],
    pregnancySafety: 'Category B - Second-line option when beta-lactams are unsuitable.',
    storage: 'Store below 30°C in dry conditions.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-05-14'
  },
  {
    id: 'med-disprin',
    name: 'Disprin (Aspirin)',
    genericName: 'Acetylsalicylic Acid',
    brandNames: ['Disprin', 'Bayer Aspirin', 'Ecosprin', 'Ascard'],
    ingredients: ['Aspirin 300mg'],
    category: 'Analgesic, Antiplatelet & NSAID',
    strength: '300 mg',
    form: 'Soluble / Effervescent Tablet',
    manufacturer: 'Reckitt Benckiser',
    uses: [
      'Relief of acute headache, migraine, toothache, and fever',
      'Cardiovascular prophylaxis (at lower 75–100mg doses)'
    ],
    sideEffects: [
      'Gastric irritation, heartburn, dyspepsia',
      'Increased bleeding tendency and bruising',
      'Tinnitus with excessive doses'
    ],
    seriousWarnings: [
      "Reye's Syndrome: NEVER administer to children or adolescents under 16 years with viral fever or chickenpox.",
      'Severe gastrointestinal hemorrhage and peptic ulceration.',
      'Aspirin-exacerbated respiratory disease (Samter triad: asthma, nasal polyps, aspirin allergy).'
    ],
    interactions: [
      'Anticoagulants (Heparin, Warfarin): Dramatically amplifies severe hemorrhage risk',
      'Methotrexate: Reduces renal clearance, substantially raising bone marrow toxicity',
      'Corticosteroids: Multiplies risk of gastrointestinal ulcers'
    ],
    dosage: 'Analgesic: 300 mg to 600 mg dissolved in water every 4 hours. Maximum 4,000 mg in 24 hours.',
    contraindications: ['Children < 16 years with febrile illness', 'Active peptic ulceration', 'Hemophilia / bleeding disorders'],
    pregnancySafety: 'Category D in third trimester. Low-dose (81mg) only used when prescribed for preeclampsia prevention.',
    storage: 'Keep container tightly closed in dry location below 25°C.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-25'
  },
  {
    id: 'med-ciproxin',
    name: 'Ciproxin (Ciprofloxacin)',
    genericName: 'Ciprofloxacin Hydrochloride',
    brandNames: ['Ciproxin', 'Cipro', 'Ciprobay', 'Mercip'],
    ingredients: ['Ciprofloxacin 500mg'],
    category: 'Antibiotics (Fluoroquinolone)',
    strength: '500 mg',
    form: 'Film-coated Tablet',
    manufacturer: 'Bayer AG',
    uses: [
      'Complicated and uncomplicated urinary tract infections (pyelonephritis)',
      'Bacterial gastroenteritis, typhoid fever, and infectious diarrhea',
      'Infections of bone, joints, and intra-abdominal cavity'
    ],
    sideEffects: [
      'Nausea, diarrhea, abdominal discomfort',
      'Headache, dizziness, sleep disturbances',
      'Skin photosensitivity (increased sunburn risk)'
    ],
    seriousWarnings: [
      'Tendinitis and Tendon Rupture: Particularly Achilles tendon, heightened in elderly and steroid users.',
      'Peripheral neuropathy and irreversible central nervous system effects (anxiety, hallucinations).',
      'QT prolongation and exacerbation of myasthenia gravis.'
    ],
    interactions: [
      'Multivalent cations (Antacids, Calcium, Iron supplements): Chelate ciprofloxacin and prevent absorption',
      'Theophylline: Ciprofloxacin inhibits theophylline clearance, risking seizures',
      'NSAIDs: Increases risk of CNS stimulation and convulsive seizures'
    ],
    dosage: '250 mg to 750 mg every 12 hours depending on infection site and microbiological severity.',
    contraindications: ['Hypersensitivity to fluoroquinolones', 'Concurrent administration with tizanidine'],
    pregnancySafety: 'Category C - Generally avoided due to cartilage damage observed in juvenile animal studies.',
    storage: 'Store below 25°C protected from light.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-15'
  },
  {
    id: 'med-softin',
    name: 'Softin (Loratadine)',
    genericName: 'Loratadine',
    brandNames: ['Softin', 'Claritin', 'Alavert', 'Lorfast'],
    ingredients: ['Loratadine 10mg'],
    category: 'Antihistamines (Second Generation / Non-Sedating)',
    strength: '10 mg',
    form: 'Tablet',
    manufacturer: 'Schering-Plough / Bayer',
    uses: [
      'Allergic rhinitis (hay fever, seasonal allergies: sneezing, rhinorrhea, nasal itching)',
      'Chronic idiopathic urticaria (hives, allergic skin itching)'
    ],
    sideEffects: [
      'Fatigue (low frequency compared to 1st gen antihistamines)',
      'Headache',
      'Dry mouth'
    ],
    seriousWarnings: [
      'Dose adjustment required in severe hepatic impairment (start at 10mg every other day).',
      'Stop antihistamines 48 hours prior to diagnostic skin prick allergy tests.'
    ],
    interactions: [
      'Ketoconazole, Erythromycin: May increase plasma concentrations of loratadine without significant ECG changes'
    ],
    dosage: 'Adults and children over 12 years: 10 mg once daily with water.',
    contraindications: ['Known hypersensitivity to loratadine or desloratadine'],
    pregnancySafety: 'Category B - Widely used and considered safe under physician oversight.',
    storage: 'Store between 15°C and 30°C in a dry environment.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-05-18'
  },
  {
    id: 'med-flagyl',
    name: 'Flagyl (Metronidazole)',
    genericName: 'Metronidazole',
    brandNames: ['Flagyl', 'Metrogyl', 'Protostat', 'Dumozol'],
    ingredients: ['Metronidazole 400mg'],
    category: 'Antiprotozoal & Anaerobic Antibacterial',
    strength: '400 mg',
    form: 'Film-coated Tablet',
    manufacturer: 'Sanofi-Aventis',
    uses: [
      'Amebiasis, Giardiasis, and Trichomoniasis protozoal infections',
      'Anaerobic bacterial infections (intra-abdominal, dental abscesses, pelvic)',
      'Bacterial vaginosis'
    ],
    sideEffects: [
      'Unpleasant bitter metallic taste in mouth',
      'Nausea, anorexia, epigastric distress',
      'Darkened reddish-brown urine (harmless metabolite)'
    ],
    seriousWarnings: [
      'DISULFIRAM-LIKE ETHANOL REACTION: Strict abstinence from alcohol during treatment and for 48 hours afterward (causes severe flushing, vomiting, tachycardia, hypotension).',
      'Peripheral neuropathy and encephalopathy on prolonged or high-dose courses.',
      'Potential carcinogenic concerns in animal models; use only for approved indications.'
    ],
    interactions: [
      'Alcohol & Propylene Glycol: Severe disulfiram-like vomiting and flushing reaction',
      'Warfarin: Potentiates anticoagulant action, markedly elevating INR',
      'Lithium: Increases serum lithium levels and risk of lithium intoxication'
    ],
    dosage: '400 mg to 500 mg every 8 hours for 5–10 days depending on the underlying parasitic/bacterial etiology.',
    contraindications: ['First trimester of pregnancy in trichomoniasis', 'Hypersensitivity to nitroimidazoles', 'Recent disulfiram usage'],
    pregnancySafety: 'Category B - Avoid in 1st trimester; consult doctor for risk-benefit balance.',
    storage: 'Store below 25°C protected from light.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-08-20'
  },
  {
    id: 'med-lasix',
    name: 'Lasix (Furosemide)',
    genericName: 'Furosemide',
    brandNames: ['Lasix', 'Frusid', 'Furocot'],
    ingredients: ['Furosemide 40mg'],
    category: 'Cardiovascular / Renal (Loop Diuretic)',
    strength: '40 mg',
    form: 'Tablet',
    manufacturer: 'Sanofi',
    uses: [
      'Edema associated with congestive heart failure, hepatic cirrhosis, and renal disease',
      'Hypertensive crisis and refractory chronic hypertension'
    ],
    sideEffects: [
      'Frequent urgent urination',
      'Electrolyte depletion (hypokalemia, hyponatremia, hypomagnesemia)',
      'Orthostatic hypotension and dizziness'
    ],
    seriousWarnings: [
      'Profound diuresis with water and electrolyte depletion. Regular potassium and creatinine monitoring is mandatory.',
      'Ototoxicity (tinnitus, hearing loss), especially with rapid IV administration or concomitant aminoglycosides.',
      'Hyperuricemia: May precipitate acute gout attacks.'
    ],
    interactions: [
      'Digoxin: Hypokalemia induced by furosemide drastically increases digoxin cardiac toxicity',
      'Aminoglycosides (Gentamicin): Synergistic ototoxicity and nephrotoxicity',
      'NSAIDs: Inhibit renal prostaglandins, blunting diuretic and natriuretic response'
    ],
    dosage: 'Initial 20 mg to 80 mg as single morning dose; adjust based on weight loss and fluid response.',
    contraindications: ['Anuria / complete renal shutdown', 'Severe uncorrected hypokalemia and hyponatremia', 'Hepatic coma'],
    pregnancySafety: 'Category C - Crosses placental barrier; requires close specialist supervision.',
    storage: 'Store in light-resistant packaging below 25°C.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-05'
  },
  {
    id: 'med-zoloft',
    name: 'Zoloft (Sertraline)',
    genericName: 'Sertraline Hydrochloride',
    brandNames: ['Zoloft', 'Lustral', 'Sertra', 'Aremis'],
    ingredients: ['Sertraline HCl 50mg'],
    category: 'Psychiatry (SSRI - Selective Serotonin Reuptake Inhibitor)',
    strength: '50 mg',
    form: 'Film-coated Tablet',
    manufacturer: 'Viatris / Pfizer',
    uses: [
      'Major depressive disorder (MDD)',
      'Obsessive-compulsive disorder (OCD)',
      'Panic disorder, social anxiety disorder, and post-traumatic stress disorder (PTSD)'
    ],
    sideEffects: [
      'Nausea and loose stools',
      'Insomnia or somnolence',
      'Sexual dysfunction (delayed ejaculation, decreased libido)'
    ],
    seriousWarnings: [
      'Black Box Warning: Increased risk of suicidal thoughts and behaviors in children, adolescents, and young adults under 24 during initial weeks.',
      'Serotonin Syndrome: Life-threatening hyperpyrexia, rigidity, and autonomic instability when combined with other serotonergic agents.',
      'Hyponatremia / SIADH, especially in elderly patients.'
    ],
    interactions: [
      'MAO Inhibitors: Fatal serotonin syndrome; minimum 14-day washout period required',
      'NSAIDs / Antiplatelets: Increased risk of upper gastrointestinal bleeding',
      'Pimozide: Contraindicated due to risk of fatal cardiac arrhythmias'
    ],
    dosage: 'Starting dose 50 mg once daily, morning or evening. Titrate in 50mg increments at weekly intervals (max 200mg/day).',
    contraindications: ['Concomitant MAOI use', 'Concomitant pimozide therapy', 'Known hypersensitivity to sertraline'],
    pregnancySafety: 'Category C - Risk-benefit assessment required; risk of persistent pulmonary hypertension in newborn (PPHN).',
    storage: 'Store at 20°C to 25°C away from humidity.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-08'
  },
  {
    id: 'med-zestril',
    name: 'Zestril (Lisinopril)',
    genericName: 'Lisinopril Dihydrate',
    brandNames: ['Zestril', 'Prinivil', 'Lisopril'],
    ingredients: ['Lisinopril 10mg'],
    category: 'Cardiovascular (ACE Inhibitor)',
    strength: '10 mg',
    form: 'Tablet',
    manufacturer: 'AstraZeneca',
    uses: [
      'Hypertension (monotherapy or combined with thiazide diuretics)',
      'Adjunctive therapy in heart failure',
      'Hemodynamic improvement following acute myocardial infarction'
    ],
    sideEffects: [
      'Persistent dry hacking cough (bradykinin accumulation)',
      'Dizziness and lightheadedness',
      'Hyperkalemia'
    ],
    seriousWarnings: [
      'Black Box Warning: Fetotoxicity - Exposure to ACE inhibitors during 2nd and 3rd trimesters causes severe fetal renal failure, skull hypoplasia, and oligohydramnios.',
      'Angioedema: Swelling of face, lips, tongue, and glottis causing airway obstruction. Immediate emergency.',
      'Acute renal failure in patients with bilateral renal artery stenosis.'
    ],
    interactions: [
      'Potassium Supplements / Potassium-sparing diuretics (Spironolactone): Severe hyperkalemia risk',
      'NSAIDs: Impairs renal autoregulation and diminishes antihypertensive effectiveness',
      'Lithium: Reduces renal lithium clearance, causing lithium toxicity'
    ],
    dosage: 'Hypertension: Initial 10 mg once daily. Maintenance 20 mg to 40 mg daily as single dose.',
    contraindications: ['History of ACE-inhibitor associated angioedema', 'Pregnancy (all trimesters)', 'Concomitant aliskiren in diabetes'],
    pregnancySafety: 'Category D - Contraindicated in pregnancy; causes fetal injury and mortality.',
    storage: 'Store below 30°C in moisture-proof container.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-04-18'
  },
  {
    id: 'med-arinac',
    name: 'Arinac (Ibuprofen + Pseudoephedrine)',
    genericName: 'Ibuprofen + Pseudoephedrine Hydrochloride',
    brandNames: ['Arinac', 'Advil Cold & Sinus', 'Sudafed Sinus 12hr'],
    ingredients: ['Ibuprofen 200mg', 'Pseudoephedrine HCl 30mg'],
    category: 'Respiratory / Analgesic & Decongestant',
    strength: '200 mg / 30 mg',
    form: 'Tablet',
    manufacturer: 'Abbott Laboratories',
    uses: [
      'Relief of nasal and sinus congestion accompanied by headache, fever, and facial pain',
      'Symptomatic relief of common cold and acute allergic rhinosinusitis'
    ],
    sideEffects: [
      'Nervousness, restlessness, and insomnia',
      'Dry mouth',
      'Mild stomach irritation'
    ],
    seriousWarnings: [
      'Pseudoephedrine causes vasoconstriction: contraindicated in severe hypertension or uncontrolled coronary artery disease.',
      'May trigger urinary retention in patients with benign prostatic hyperplasia (BPH).',
      'Do not take with other NSAIDs or within 14 days of MAO inhibitors.'
    ],
    interactions: [
      'MAO Inhibitors: Danger of hypertensive crisis and hyperpyrexia',
      'Antihypertensive drugs: Pseudoephedrine blunts blood pressure control',
      'Anticoagulants: Increased hemorrhage risk from ibuprofen component'
    ],
    dosage: 'Adults: 1 to 2 tablets every 4 to 6 hours as needed. Do not exceed 6 tablets in 24 hours.',
    contraindications: ['Severe hypertension', 'Severe coronary artery disease', 'Closed-angle glaucoma', 'Concurrent MAOI'],
    pregnancySafety: 'Category C (Category D in 3rd trimester) - Avoid without strict medical authorization.',
    storage: 'Store below 25°C away from direct moisture.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-28'
  },
  {
    id: 'med-gravinate',
    name: 'Gravinate (Dimenhydrinate)',
    genericName: 'Dimenhydrinate',
    brandNames: ['Gravinate', 'Dramamine', 'Gravol'],
    ingredients: ['Dimenhydrinate 50mg'],
    category: 'Gastrointestinal & Antiemetic (H1 Antihistamine)',
    strength: '50 mg',
    form: 'Tablet',
    manufacturer: 'Searle Company Limited',
    uses: [
      'Prevention and treatment of nausea, vomiting, or vertigo of motion sickness',
      'Symptomatic relief of labyrinthine vestibular disorders (Ménière disease)'
    ],
    sideEffects: [
      'Drowsiness and sedation (significant)',
      'Dry mouth and blurred vision (anticholinergic)',
      'Urinary hesitation'
    ],
    seriousWarnings: [
      'Substantial central nervous system sedation; do not drive or operate machinery.',
      'Anticholinergic effects: caution in patients with closed-angle glaucoma or prostatic hypertrophy.',
      'May mask symptoms of ototoxicity from aminoglycosides.'
    ],
    interactions: [
      'Alcohol & CNS Depressants: Pronounced additive sedative and respiratory depression effects',
      'Anticholinergic drugs (Atropine, TCAs): Multiplies dry mouth, constipation, and urinary retention'
    ],
    dosage: '50 mg to 100 mg every 4 to 6 hours as needed. For motion sickness: take 30–60 minutes before departure.',
    contraindications: ['Known hypersensitivity to dimenhydrinate', 'Acute narrow-angle glaucoma', 'Neonates and premature infants'],
    pregnancySafety: 'Category B - Frequently prescribed for severe nausea/vomiting of pregnancy (hyperemesis gravidarum).',
    storage: 'Store at 15°C to 25°C.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-30'
  },
  {
    id: 'med-ponstan',
    name: 'Ponstan (Mefenamic Acid)',
    genericName: 'Mefenamic Acid',
    brandNames: ['Ponstan', 'Ponstel', 'Mefanac'],
    ingredients: ['Mefenamic Acid 500mg'],
    category: 'NSAIDs (Fenamate class)',
    strength: '500 mg',
    form: 'Film-coated Tablet / Capsule',
    manufacturer: 'Pfizer Inc.',
    uses: [
      'Relief of moderate pain associated with primary dysmenorrhea',
      'Short-term management of mild to moderate acute pain (toothache, post-operative, arthritis)'
    ],
    sideEffects: [
      'Diarrhea (frequent fenamate side effect; if severe, drug must be stopped)',
      'Epigastric discomfort and nausea',
      'Dizziness'
    ],
    seriousWarnings: [
      'Severe diarrhea is a known class effect; discontinue immediately if severe diarrhea develops.',
      'GI bleeding, ulceration, and perforation warning identical to systemic NSAIDs.',
      'Do not use continuously for longer than 7 consecutive days for acute pain.'
    ],
    interactions: [
      'Anticoagulants / Antiplatelets: Markedly elevated GI bleeding danger',
      'Antihypertensives: Reduction in blood pressure control',
      'Lithium: Decreased renal elimination of lithium'
    ],
    dosage: 'Initial 500 mg, followed by 250 mg every 6 hours with food. Not recommended for more than 7 days.',
    contraindications: ['Active gastrointestinal ulceration/bleeding', 'Severe renal or hepatic failure', 'Pre-existing intestinal disease'],
    pregnancySafety: 'Category D in 3rd trimester - Avoid late in pregnancy due to fetal cardiovascular risks.',
    storage: 'Store below 30°C in a dry place.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-05-28'
  },
  {
    id: 'med-surbex-z',
    name: 'Surbex Z (High Potency B-Complex + Zinc)',
    genericName: 'Vitamin B-Complex + Vitamin C + Vitamin E + Zinc + Folic Acid',
    brandNames: ['Surbex Z', 'Becozinc', 'Zincovit'],
    ingredients: ['Zinc Sulfate 22.5mg', 'Vitamin C 500mg', 'Vitamin E 30IU', 'B-Complex Vitamins (B1, B2, B6, B12, Niacinamide, Pantothenic acid)'],
    category: 'Nutritional / Multivitamins & Minerals',
    strength: 'High Potency Combination',
    form: 'Film-coated Tablet',
    manufacturer: 'Abbott Laboratories',
    uses: [
      'Prevention and treatment of Vitamin B-complex, Vitamin C, and Zinc deficiencies',
      'Supportive nutritional therapy during convalescence, chronic illness, and wound healing'
    ],
    sideEffects: [
      'Mild stomach upset or nausea if taken on an empty stomach',
      'Harmless bright yellow discoloration of urine (due to Riboflavin/Vitamin B2)'
    ],
    seriousWarnings: [
      'Do not exceed recommended daily allowance to prevent zinc toxicity.',
      'Excessive zinc intake over long periods can induce copper deficiency and microcytic anemia.'
    ],
    interactions: [
      'Tetracyclines & Quinolones: Zinc chelates these antibiotics; separate administration by at least 2 hours'
    ],
    dosage: 'Adults: One tablet once daily after a main meal.',
    contraindications: ['Known hypersensitivity to any constituent'],
    pregnancySafety: 'Generally safe at standard RDA nutritional dosages. Consult obstetrician.',
    storage: 'Store below 25°C protected from moisture and direct sunlight.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-06-10'
  },
  {
    id: 'med-cecon',
    name: 'Cecon (Vitamin C / Ascorbic Acid)',
    genericName: 'Ascorbic Acid + Sodium Ascorbate',
    brandNames: ['Cecon', 'Redoxon', 'Celin', 'Chewcee'],
    ingredients: ['Vitamin C 500mg'],
    category: 'Vitamins & Antioxidants',
    strength: '500 mg',
    form: 'Chewable Tablet',
    manufacturer: 'Abbott Laboratories',
    uses: [
      'Treatment and prophylaxis of Vitamin C deficiency (Scurvy)',
      'Enhancement of dietary iron absorption in iron deficiency anemia',
      'Antioxidant support during acute viral infections'
    ],
    sideEffects: [
      'Diarrhea and abdominal cramps at massive mega-doses (> 2,000 mg/day)',
      'Heartburn'
    ],
    seriousWarnings: [
      'High doses (> 1,000 mg/day) increase urinary oxalate excretion and risk of calcium oxalate renal calculi.',
      'Caution in patients with Glucose-6-Phosphate Dehydrogenase (G6PD) deficiency: high doses can precipitate hemolysis.'
    ],
    interactions: [
      'Oral Iron supplements: Ascorbic acid significantly enhances intestinal non-heme iron absorption',
      'Warfarin: High doses of Vitamin C may marginally shorten prothrombin time'
    ],
    dosage: 'Prophylaxis: 500 mg daily chewed after meals. Deficiency: 500 mg to 1,000 mg daily.',
    contraindications: ['Known hyperoxaluria', 'G6PD deficiency with high parenteral doses'],
    pregnancySafety: 'Category A/C - Safe at recommended dietary allowances.',
    storage: 'Keep container tightly closed. Protect from heat and light.',
    verificationStatus: 'VERIFIED_PHARMA_REF',
    lastReviewed: '2026-07-11'
  }
];
