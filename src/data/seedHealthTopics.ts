import { HealthTopic } from '../types.ts';

export const SEED_HEALTH_TOPICS: HealthTopic[] = [
  {
    id: 'topic-hypertension',
    title: 'High Blood Pressure (Hypertension)',
    urduTitle: 'بلڈ پریشر کی زیادتی (ہائپر ٹینشن)',
    category: 'Cardiovascular',
    overview: 'Hypertension is a chronic medical condition in which systemic arterial blood pressure is persistently elevated (≥ 130/80 mmHg). Often referred to as a "silent killer" because it typically produces no noticeable symptoms until organ damage occurs.',
    symptoms: [
      'Often completely asymptomatic in early and moderate stages',
      'Occipital morning headaches or head throbbing',
      'Dizziness, lightheadedness, or unsteadiness',
      'Episodes of epistaxis (nosebleeds) in acute surges',
      'Visual blurriness or seeing spots'
    ],
    prevention: [
      'Reduce dietary sodium intake to under 2,000 mg (1 teaspoon salt) per day',
      'Adopt the DASH diet (rich in fruits, vegetables, potassium, and low-fat dairy)',
      'Engage in 150 minutes of moderate aerobic exercise weekly',
      'Maintain a healthy body mass index (BMI 18.5 - 24.9)',
      'Limit alcohol consumption and completely avoid tobacco smoking'
    ],
    whenToSeeDoctor: [
      'Persistent blood pressure readings above 130/80 mmHg on separate occasions',
      'Prescribed blood pressure medications causing side effects like ankle swelling or persistent dry cough',
      'History of hypertension with new-onset persistent headaches or dizziness'
    ],
    emergencySigns: [
      'Blood pressure reading ≥ 180/120 mmHg (Hypertensive Crisis)',
      'Crushing central chest pain or radiation to left arm/jaw',
      'Sudden severe shortness of breath or pulmonary edema symptoms',
      'Sudden facial drooping, speech difficulty, or arm weakness (Stroke signs)'
    ]
  },
  {
    id: 'topic-diabetes',
    title: 'Type 2 Diabetes Mellitus',
    urduTitle: 'ذیابیطس ٹائپ 2 (شوگر کی بیماری)',
    category: 'Endocrinology & Metabolic',
    overview: 'A metabolic disorder characterized by high blood glucose levels caused by progressive insulin resistance combined with insufficient compensatory insulin secretion by pancreatic beta cells.',
    symptoms: [
      'Polydipsia: Persistent excessive thirst and dry mouth',
      'Polyuria: Increased frequency of urination, especially nocturia',
      'Polyphagia: Increased hunger despite adequate food intake',
      'Unexplained weight loss and chronic fatigue',
      'Slow-healing cuts, recurrent skin boils, or fungal infections',
      'Tingling, numbness, or burning sensations in feet (Peripheral neuropathy)'
    ],
    prevention: [
      'Maintain balanced carbohydrate intake with low glycemic index whole foods',
      'Engage in post-meal walking (15–20 minutes) to improve insulin sensitivity',
      'Target 5–10% body weight loss if currently overweight or obese',
      'Routine annual screening of fasting blood glucose and HbA1c for adults over 35'
    ],
    whenToSeeDoctor: [
      'Fasting blood glucose consistently ≥ 126 mg/dL or random ≥ 200 mg/dL',
      'HbA1c level ≥ 6.5%',
      'Development of foot ulcers, numbness, or burning pain in lower extremities'
    ],
    emergencySigns: [
      'Blood sugar > 300 mg/dL accompanied by nausea, vomiting, or fruity breath odor (DKA / HHS)',
      'Severe hypoglycemia (< 55 mg/dL) with confusion, tremors, diaphoresis, or loss of consciousness',
      'Infected foot ulcer with redness, swelling, or foul discharge'
    ]
  },
  {
    id: 'topic-asthma',
    title: 'Bronchial Asthma',
    urduTitle: 'دمہ اور سانس کی الرجی',
    category: 'Respiratory',
    overview: 'A chronic inflammatory disorder of the airways leading to recurrent episodes of wheezing, breathlessness, chest tightness, and coughing, particularly at night or in the early morning.',
    symptoms: [
      'Expiratory wheezing (musical whistling sound when exhaling)',
      'Sudden bouts of breathlessness or air hunger',
      'Tightness across the chest as if banded',
      'Dry or non-productive cough, especially during cold weather or exercise'
    ],
    prevention: [
      'Identify and minimize exposure to allergic triggers (dust mites, pollen, pet dander, mold)',
      'Avoid active smoking and secondhand tobacco smoke',
      'Adhere strictly to daily inhaled corticosteroid preventer medications even when symptom-free',
      'Receive annual influenza and pneumococcal immunizations'
    ],
    whenToSeeDoctor: [
      'Needing to use fast-acting rescue inhaler (Salbutamol) more than twice a week',
      'Asthma symptoms waking you from sleep at night',
      'Exercise intolerance due to shortness of breath'
    ],
    emergencySigns: [
      'Severe breathlessness unable to speak full sentences in one breath',
      'Straining chest muscles or intercostal retractions while breathing',
      'Rescue inhaler provides no relief or lasts less than 1 hour',
      'Bluish discoloration of lips, fingernails, or tongue (Cyanosis)'
    ]
  },
  {
    id: 'topic-migraine',
    title: 'Migraine Headaches',
    urduTitle: 'درد شقیقہ (آدھے سر کا درد)',
    category: 'Neurology',
    overview: 'A neurovascular disorder characterized by recurrent, severe pulsating headache attacks typically unilateral, lasting 4 to 72 hours, often accompanied by nausea, photophobia, and phonophobia.',
    symptoms: [
      'Unilateral throbbing or pounding pain of moderate to severe intensity',
      'Sensory aura (zigzag flashing lights, blind spots, tingling in fingers/face 20-60 mins prior)',
      'Extreme sensitivity to light (photophobia) and sound (phonophobia)',
      'Nausea, vomiting, and dizziness'
    ],
    prevention: [
      'Identify food triggers (aged cheeses, MSG, nitrates, artificial sweeteners, red wine)',
      'Maintain regular sleep schedules and avoid sleep deprivation',
      'Stay consistently hydrated and do not skip meals',
      'Practice stress management techniques and progressive muscle relaxation'
    ],
    whenToSeeDoctor: [
      'Headaches occurring more than 3 to 4 times per month requiring frequent analgesic use',
      'Over-the-counter pain medications no longer provide headache relief',
      'Headache frequency or pattern changes noticeably'
    ],
    emergencySigns: [
      'Sudden onset "thunderclap" headache reaching maximum intensity in seconds (Subarachnoid Hemorrhage)',
      'Headache accompanied by high fever, stiff neck, and confusion (Meningitis)',
      'Headache following a head trauma or associated with weakness on one side of the body'
    ]
  },
  {
    id: 'topic-gerd',
    title: 'Gastroesophageal Reflux Disease (GERD)',
    urduTitle: 'معدے کی تیزابیت اور جلن',
    category: 'Gastroenterology',
    overview: 'A digestive disorder that occurs when acidic stomach contents repeatedly flow back up into the esophagus, irritating the delicate esophageal lining and causing mucosal inflammation.',
    symptoms: [
      'Pyrosis: Burning pain in the chest (heartburn), usually after eating, worse at night',
      'Regurgitation of food or sour acidic liquid into mouth or throat',
      'Globus sensation: Feeling of a persistent lump in the throat',
      'Chronic dry cough or morning hoarseness'
    ],
    prevention: [
      'Avoid lying down for at least 2 to 3 hours following a meal',
      'Elevate the head of your bed by 6 to 9 inches (15–20 cm)',
      'Avoid trigger foods: fried or fatty foods, mint, chocolate, caffeine, citrus, and spicy dishes',
      'Eat smaller, more frequent meals rather than large heavy dinners',
      'Avoid tight-fitting belts and clothing around the abdomen'
    ],
    whenToSeeDoctor: [
      'Heartburn symptoms occurring more than twice a week for over a month',
      'Symptoms fail to respond to over-the-counter antacids or H2 blockers',
      'Persistent unexplained nausea or regurgitation'
    ],
    emergencySigns: [
      'Dysphagia: Difficulty or pain when swallowing food (food sticking in esophagus)',
      'Hematemesis: Vomiting blood or coffee-ground material',
      'Melena: Black, tarry stools indicating upper GI bleeding',
      'Chest pain radiating to neck, back, or shoulder (always rule out cardiac causes first)'
    ]
  },
  {
    id: 'topic-dengue',
    title: 'Dengue Fever',
    urduTitle: 'ڈینگی بخار کی علامات اور احتیاط',
    category: 'Infectious Diseases',
    overview: 'A mosquito-borne tropical disease caused by the dengue virus and transmitted by female Aedes aegypti mosquitoes. Characterized by sudden high fever and severe musculoskeletal pain ("breakbone fever").',
    symptoms: [
      'Sudden high fever (up to 40°C / 104°F)',
      'Severe retro-orbital pain (pain behind the eyes, exacerbated by eye movement)',
      'Severe muscular, bone, and joint aches',
      'Maculopapular rash appearing 2 to 5 days after onset of fever',
      'Mild bleeding tendencies (petechiae, easy bruising, bleeding gums)'
    ],
    prevention: [
      'Eliminate stagnant water from discarded containers, flower pots, tires, and water coolers',
      'Apply DEET or picaridin insect repellents to exposed skin',
      'Wear long-sleeved shirts, full pants, and socks during early morning and late afternoon',
      'Install fine mesh screens on doors and windows'
    ],
    whenToSeeDoctor: [
      'High fever persisting beyond 48 hours during peak dengue transmission seasons',
      'Complete blood count (CBC) shows declining platelet count (< 100,000/μL) or rising hematocrit'
    ],
    emergencySigns: [
      'Severe abdominal pain or persistent vomiting (warning sign of Severe Dengue)',
      'Bleeding from mucous membranes (nosebleeds, vomiting blood, black stools)',
      'Lethargy, extreme restlessness, cold clammy extremities, or hypotension (Dengue Shock Syndrome)',
      'Platelet count crashing below 20,000/μL'
    ]
  }
];
