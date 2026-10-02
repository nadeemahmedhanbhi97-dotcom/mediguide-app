import { FormulaItem } from '../types.ts';

export const SEED_FORMULAS: FormulaItem[] = [
  {
    id: 'form-paracetamol',
    name: 'Paracetamol / Acetaminophen',
    chemicalFormula: 'C8H9NO2',
    category: 'Analgesic / Antipyretic',
    molecularWeight: '151.16 g/mol',
    description: 'N-(4-hydroxyphenyl)acetamide. Centrally active analgesic and antipyretic compound widely used globally for pain and fever relief.',
    mechanismOfAction: 'Inhibits central nervous system prostaglandin synthesis, primarily via peroxidase-mediated inhibition of cyclooxygenase enzymes (COX-1, COX-2, and putative COX-3 variants) with minimal peripheral anti-inflammatory action. Activates descending serotonergic inhibitory pathways and transient receptor potential vanilloid-1 (TRPV1).',
    commonUses: [
      'Tension headaches, migraines, dental pain',
      'Fever management in adults and pediatric populations',
      'Mild to moderate somatic pain and post-surgical analgesia'
    ],
    safetyWarnings: [
      'Metabolized in liver by CYP2E1 into toxic N-acetyl-p-benzoquinone imine (NAPQI).',
      'Normal doses safely detoxified by glutathione. Overdose exhausts glutathione, causing centrilobular liver necrosis.',
      'Antidote for acute overdose is N-acetylcysteine (NAC) administered promptly within 8–10 hours.'
    ]
  },
  {
    id: 'form-amoxicillin',
    name: 'Amoxicillin Trihydrate',
    chemicalFormula: 'C16H19N3O5S',
    category: 'Beta-Lactam Antibiotic (Aminopenicillin)',
    molecularWeight: '365.40 g/mol',
    description: '(2S,5R,6R)-6-[[(2R)-2-amino-2-(4-hydroxyphenyl)acetyl]amino]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid.',
    mechanismOfAction: 'Bactericidal antibiotic that binds to and inactivates specific penicillin-binding proteins (PBPs) located within the inner bacterial cell wall. This arrests third and final cross-linking stage of bacterial peptidoglycan synthesis, resulting in osmotic lysis and cell wall degradation.',
    commonUses: [
      'Upper and lower respiratory tract bacterial infections',
      'Acute otitis media, bacterial pharyngitis, sinusitis',
      'In combination with Clavulanic acid or PPIs for H. pylori eradication'
    ],
    safetyWarnings: [
      'Susceptible to degradation by bacterial beta-lactamase enzymes.',
      'Contraindicated in individuals with type 1 immediate IgE-mediated hypersensitivity to penicillins.',
      'Risk of amoxicillin rash in patients with Epstein-Barr infectious mononucleosis.'
    ]
  },
  {
    id: 'form-metformin',
    name: 'Metformin Hydrochloride',
    chemicalFormula: 'C4H11N5·HCl',
    category: 'Biguanide Antidiabetic',
    molecularWeight: '165.62 g/mol',
    description: '1,1-Dimethylbiguanide hydrochloride. First-line oral hypoglycemic drug for glycemic management in Type 2 Diabetes.',
    mechanismOfAction: 'Activates adenosine monophosphate-activated protein kinase (AMPK) in the liver, suppressing gluconeogenesis and glycogenolysis. Enhances peripheral insulin-stimulated glucose uptake in skeletal muscle and decreases intestinal glucose absorption without stimulating pancreatic beta-cell insulin secretion.',
    commonUses: [
      'Glycemic control in Type 2 Diabetes Mellitus',
      'Polycystic Ovary Syndrome (PCOS) insulin sensitizer',
      'Prediabetes metabolic progression prevention'
    ],
    safetyWarnings: [
      'Excreted unchanged by renal tubular secretion; accumulates in renal failure.',
      'Black box warning: Lactic acidosis risk in tissue hypoperfusion or renal impairment (eGFR < 30).',
      'Requires temporary withdrawal prior to iodinated contrast radiological exams.'
    ]
  },
  {
    id: 'form-ibuprofen',
    name: 'Ibuprofen',
    chemicalFormula: 'C13H18O2',
    category: 'NSAID (Propionic Acid Derivative)',
    molecularWeight: '206.29 g/mol',
    description: '(RS)-2-(4-(2-methylpropyl)phenyl)propanoic acid. Non-selective cyclooxygenase (COX) inhibitor with analgesic, anti-inflammatory, and antipyretic actions.',
    mechanismOfAction: 'Reversibly inhibits cyclooxygenase enzymes COX-1 and COX-2, preventing conversion of arachidonic acid to pro-inflammatory prostaglandins, prostacyclin, and thromboxane A2.',
    commonUses: [
      'Rheumatoid arthritis, osteoarthritis, ankylosing spondylitis',
      'Primary dysmenorrhea, dental pain, headache, acute sports injuries',
      'Closure of patent ductus arteriosus in premature infants'
    ],
    safetyWarnings: [
      'COX-1 inhibition diminishes cytoprotective gastric prostaglandins, predisposing to peptic ulcers and gastric bleeding.',
      'Decreases renal blood flow and glomerular filtration in patients with volume depletion or heart failure.',
      'Interferes with antiplatelet cardioprotective action of aspirin if taken simultaneously.'
    ]
  },
  {
    id: 'form-omeprazole',
    name: 'Omeprazole',
    chemicalFormula: 'C17H19N3O3S',
    category: 'Proton Pump Inhibitor (PPI)',
    molecularWeight: '345.42 g/mol',
    description: '5-methoxy-2-[[(4-methoxy-3,5-dimethylpyridin-2-yl)methyl]sulfinyl]-1H-benzimidazole. Acid-activated prodrug that suppresses gastric acid secretion.',
    mechanismOfAction: 'Accumulates selectively in the acidic secretory canaliculi of gastric parietal cells where it is protonated into active sulfenamide. This covalently binds to cysteine residues of H+/K+-ATPase (the gastric proton pump), irreversibly inactivating gastric acid secretion.',
    commonUses: [
      'Gastroesophageal reflux disease (GERD) and erosive esophagitis',
      'Gastric and duodenal ulcer healing and maintenance',
      'Helicobacter pylori triple eradication regimens'
    ],
    safetyWarnings: [
      'Competitive inhibitor of hepatic CYP2C19: can inhibit bioactivation of clopidogrel.',
      'Prolonged hypochlorhydria can impair intestinal absorption of calcium, magnesium, and Vitamin B12.',
      'Increased susceptibility to enteric pathogens including Clostridioides difficile.'
    ]
  },
  {
    id: 'form-salbutamol',
    name: 'Salbutamol / Albuterol',
    chemicalFormula: 'C13H21NO3',
    category: 'Short-Acting Beta-2 Agonist (SABA)',
    molecularWeight: '239.31 g/mol',
    description: '4-[2-(tert-butylamino)-1-hydroxyethyl]-2-(hydroxymethyl)phenol. Rapid-onset selective beta-2 adrenoceptor agonist.',
    mechanismOfAction: 'Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, activating intracellular adenylyl cyclase which increases cyclic adenosine monophosphate (cAMP). High cAMP activates protein kinase A, lowering intracellular ionic calcium and leading to rapid bronchial smooth muscle relaxation.',
    commonUses: [
      'Acute relief of bronchospasm in bronchial asthma and COPD exacerbations',
      'Pre-exercise prophylaxis against exercise-induced bronchoconstriction',
      'Temporary emergency shift of extracellular potassium into cells in severe hyperkalemia'
    ],
    safetyWarnings: [
      'Beta-1 adrenoceptor stimulation at high doses can cause tachycardia, tremor, and palpitations.',
      'Intravenous or high inhaled doses may trigger transient hypokalemia.',
      'Patients must not rely solely on short-acting bronchodilators without background anti-inflammatory therapy.'
    ]
  },
  {
    id: 'form-aspirin',
    name: 'Aspirin (Acetylsalicylic Acid)',
    chemicalFormula: 'C9H8O4',
    category: 'Salicylate / Irreversible Antiplatelet & NSAID',
    molecularWeight: '180.16 g/mol',
    description: '2-acetyloxybenzoic acid. Unique among NSAIDs for its irreversible acetylation of cyclooxygenase enzymes.',
    mechanismOfAction: 'Irreversibly acetylates Serine 529 of cyclooxygenase-1 (COX-1) and Serine 516 of COX-2. Because platelets lack nuclei and protein synthesis machinery, COX-1 inhibition persists for the entire platelet lifespan (7–10 days), preventing synthesis of Thromboxane A2 and halting platelet aggregation.',
    commonUses: [
      'Secondary prevention of ischemic stroke, transient ischemic attack (TIA), and myocardial infarction',
      'Acute coronary syndromes and post-coronary stenting',
      'Analgesia and antipyresis at higher dosages (325–650 mg)'
    ],
    safetyWarnings: [
      'High risk of upper gastrointestinal hemorrhage and erosive gastritis.',
      'Absolute contraindication in children and teenagers with viral illness due to fatal Reye syndrome.',
      'May trigger severe bronchospasm in aspirin-exacerbated respiratory disease (AERD).'
    ]
  },
  {
    id: 'form-atorvastatin',
    name: 'Atorvastatin',
    chemicalFormula: 'C33H35FN2O5 (Anhydrous)',
    category: 'Statin / HMG-CoA Reductase Inhibitor',
    molecularWeight: '558.64 g/mol',
    description: '(3R,5R)-7-[2-(4-fluorophenyl)-3-phenyl-4-(phenylcarbamoyl)-5-propan-2-ylpyrrol-1-yl]-3,5-dihydroxyheptanoic acid.',
    mechanismOfAction: 'Competitively inhibits 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, the rate-limiting enzyme converting HMG-CoA to mevalonate in hepatic cholesterol biosynthesis. Reduced intracellular cholesterol upregulates hepatic LDL receptors, clearing atherogenic circulating LDL and VLDL particles.',
    commonUses: [
      'Primary and secondary hypercholesterolemia and mixed dyslipidemia',
      'Atherosclerotic cardiovascular disease (ASCVD) risk reduction',
      'Plaque stabilization following acute coronary events'
    ],
    safetyWarnings: [
      'Metabolized extensively by CYP3A4: inhibitors (macrolides, azoles) increase systemic toxicity.',
      'Statin-associated myopathy and life-threatening rhabdomyolysis.',
      'Absolute contraindication in active liver failure, pregnancy, and breastfeeding.'
    ]
  }
];
