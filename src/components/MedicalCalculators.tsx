import React, { useState } from 'react';
import {
  Calculator, Calendar, Scale, Thermometer, ArrowRightLeft,
  Info, CheckCircle2, AlertTriangle
} from 'lucide-react';

export const MedicalCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'age' | 'units' | 'temperature'>('bmi');

  // --- BMI STATE ---
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number | ''>(70);
  const [heightCm, setHeightCm] = useState<number | ''>(172);
  const [weightLbs, setWeightLbs] = useState<number | ''>(154);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(8);

  const bmiResult = React.useMemo(() => {
    let weight = 0;
    let heightM = 0;

    if (bmiUnit === 'metric') {
      if (!weightKg || !heightCm) return null;
      weight = Number(weightKg);
      heightM = Number(heightCm) / 100;
    } else {
      if (!weightLbs || heightFt === '') return null;
      weight = Number(weightLbs) * 0.453592;
      const totalInches = Number(heightFt) * 12 + Number(heightIn || 0);
      heightM = totalInches * 0.0254;
    }

    if (heightM <= 0 || weight <= 0) return null;
    const bmi = weight / (heightM * heightM);
    const rounded = Math.round(bmi * 10) / 10;

    let category = '';
    let color = '';
    let advice = '';

    if (rounded < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200';
      advice = 'Consider nutritional assessment with a registered dietitian to achieve adequate caloric and micronutrient intake.';
    } else if (rounded <= 24.9) {
      category = 'Healthy Weight (Normal)';
      color = 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-stone-900 border-amber-200';
      advice = 'Maintain current balanced dietary pattern and 150 minutes of weekly aerobic exercise.';
    } else if (rounded <= 29.9) {
      category = 'Overweight';
      color = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
      advice = 'Adopting a caloric-deficit whole food diet and regular resistance training reduces cardiovascular risk.';
    } else if (rounded <= 34.9) {
      category = 'Obesity Class I';
      color = 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200';
      advice = 'Clinical consultation recommended for structured lifestyle, metabolic, and glycemic monitoring.';
    } else {
      category = 'Obesity Class II+ (Severe)';
      color = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200';
      advice = 'High clinical risk for cardiovascular disease, hypertension, and diabetes. Multidisciplinary medical support recommended.';
    }

    const minHealthyKg = Math.round(18.5 * heightM * heightM * 10) / 10;
    const maxHealthyKg = Math.round(24.9 * heightM * heightM * 10) / 10;

    return {
      score: rounded,
      category,
      color,
      advice,
      healthyRangeKg: `${minHealthyKg} - ${maxHealthyKg} kg`
    };
  }, [bmiUnit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  // --- AGE STATE ---
  const [dob, setDob] = useState<string>('1996-05-15');

  const ageResult = React.useMemo(() => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) return null;

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Next Birthday calculation
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const dayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      years,
      months,
      days,
      totalDays,
      daysToNext,
      dayOfWeek
    };
  }, [dob]);

  // --- UNIT CONVERTER STATE ---
  const [unitCategory, setUnitCategory] = useState<'mass' | 'volume'>('mass');
  const [fromValue, setFromValue] = useState<number | ''>(500);
  const [fromUnit, setFromUnit] = useState<string>('mg');
  const [toUnit, setToUnit] = useState<string>('g');

  const convertedValue = React.useMemo(() => {
    if (fromValue === '' || isNaN(Number(fromValue))) return '';
    const val = Number(fromValue);

    if (unitCategory === 'mass') {
      // Base: mg
      let baseMg = 0;
      if (fromUnit === 'mg') baseMg = val;
      else if (fromUnit === 'g') baseMg = val * 1000;
      else if (fromUnit === 'mcg') baseMg = val / 1000;
      else if (fromUnit === 'kg') baseMg = val * 1000000;
      else if (fromUnit === 'lbs') baseMg = val * 453592.37;

      if (toUnit === 'mg') return baseMg;
      if (toUnit === 'g') return baseMg / 1000;
      if (toUnit === 'mcg') return baseMg * 1000;
      if (toUnit === 'kg') return baseMg / 1000000;
      if (toUnit === 'lbs') return baseMg / 453592.37;
    } else {
      // Base: ml
      let baseMl = 0;
      if (fromUnit === 'ml') baseMl = val;
      else if (fromUnit === 'l') baseMl = val * 1000;
      else if (fromUnit === 'tsp') baseMl = val * 4.92892;
      else if (fromUnit === 'tbsp') baseMl = val * 14.7868;
      else if (fromUnit === 'fl_oz') baseMl = val * 29.5735;

      if (toUnit === 'ml') return baseMl;
      if (toUnit === 'l') return baseMl / 1000;
      if (toUnit === 'tsp') return baseMl / 4.92892;
      if (toUnit === 'tbsp') return baseMl / 14.7868;
      if (toUnit === 'fl_oz') return baseMl / 29.5735;
    }
    return '';
  }, [unitCategory, fromValue, fromUnit, toUnit]);

  // --- TEMPERATURE CONVERTER STATE ---
  const [tempVal, setTempVal] = useState<number | ''>(37);
  const [tempScale, setTempScale] = useState<'C' | 'F' | 'K'>('C');

  const temperatureData = React.useMemo(() => {
    if (tempVal === '' || isNaN(Number(tempVal))) return null;
    const v = Number(tempVal);

    let c = 0;
    if (tempScale === 'C') c = v;
    else if (tempScale === 'F') c = (v - 32) * (5 / 9);
    else if (tempScale === 'K') c = v - 273.15;

    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;

    let feverClass = '';
    let feverColor = '';
    let recommendation = '';

    if (c < 35.0) {
      feverClass = 'Hypothermia (< 35.0°C)';
      feverColor = 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
      recommendation = 'Dangerously low body temperature. Immediate warm blankets and clinical attention required.';
    } else if (c <= 37.5) {
      feverClass = 'Normal Body Temperature (36.5°C - 37.5°C)';
      feverColor = 'text-amber-800 bg-amber-50 border-amber-200 dark:bg-stone-900 dark:text-amber-300';
      recommendation = 'Physiological norm. No fever present.';
    } else if (c <= 38.3) {
      feverClass = 'Low-Grade Pyrexia (37.6°C - 38.3°C)';
      feverColor = 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      recommendation = 'Mild temperature elevation. Stay hydrated and monitor. Antipyretics usually not essential unless uncomfortable.';
    } else if (c <= 39.4) {
      feverClass = 'Moderate Clinical Fever (38.4°C - 39.4°C)';
      feverColor = 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300';
      recommendation = 'Significant fever indicating active immune response or infection. Oral hydration and paracetamol if indicated.';
    } else if (c <= 40.9) {
      feverClass = 'High Fever (39.5°C - 40.9°C)';
      feverColor = 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
      recommendation = 'High pyrexia. Seek clinical evaluation, especially in young children or elderly individuals.';
    } else {
      feverClass = 'Hyperpyrexia (≥ 41.0°C)';
      feverColor = 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
      recommendation = 'Medical emergency. High risk of febrile convulsions or neurological injury. Immediate emergency care.';
    }

    return {
      celsius: Math.round(c * 10) / 10,
      fahrenheit: Math.round(f * 10) / 10,
      kelvin: Math.round(k * 10) / 10,
      feverClass,
      feverColor,
      recommendation
    };
  }, [tempVal, tempScale]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-700 dark:text-amber-300" />
          <span>Clinical Calculators & Converters</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evidence-based health calculators: Body Mass Index, chronological age, pharmaceutical units, and fever classification.
        </p>

        {/* Calculator Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'bmi'
                ? 'border-amber-600 text-amber-700 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>BMI Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('age')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'age'
                ? 'border-amber-600 text-amber-700 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Chronological Age</span>
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'units'
                ? 'border-amber-600 text-amber-700 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('temperature')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'temperature'
                ? 'border-amber-600 text-amber-700 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Temperature & Fever</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: BMI CALCULATOR --- */}
      {activeTab === 'bmi' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Enter Biometric Measurements
              </h3>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBmiUnit('metric')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    bmiUnit === 'metric' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  type="button"
                  onClick={() => setBmiUnit('imperial')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    bmiUnit === 'imperial' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>
            </div>

            {bmiUnit === 'metric' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-bold text-slate-700 dark:text-slate-300">
                    <span>Weight (kg)</span>
                    <span className="font-mono text-amber-700">{weightKg || 0} kg</span>
                  </div>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-bold text-slate-700 dark:text-slate-300">
                    <span>Height (cm)</span>
                    <span className="font-mono text-amber-700">{heightCm || 0} cm</span>
                  </div>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-bold text-slate-700 dark:text-slate-300">
                    <span>Weight (lbs)</span>
                    <span className="font-mono text-amber-700">{weightLbs || 0} lbs</span>
                  </div>
                  <input
                    type="number"
                    min="40"
                    max="600"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Feet (ft)
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Inches (in)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BMI Result Card */}
          {bmiResult ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Computed Body Mass Index
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                    {bmiResult.score}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">kg/m²</span>
                </div>

                <div className={`mt-3 p-3 rounded-xl border text-xs font-semibold ${bmiResult.color}`}>
                  Category: {bmiResult.category}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                  {bmiResult.advice}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Estimated Healthy Weight Target for this Height:</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 ml-1">
                  {bmiResult.healthyRangeKg}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400">
              Enter height and weight to calculate BMI.
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: AGE CALCULATOR --- */}
      {activeTab === 'age' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Select Date of Birth
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Date of Birth (YYYY-MM-DD):
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>
          </div>

          {ageResult && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Precise Chronological Age
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {ageResult.years} <span className="text-xs font-semibold text-slate-400">years</span>,{' '}
                {ageResult.months} <span className="text-xs font-semibold text-slate-400">months</span>,{' '}
                {ageResult.days} <span className="text-xs font-semibold text-slate-400">days</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Days Lived</span>
                  <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-200">
                    {ageResult.totalDays.toLocaleString()} days
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Next Birthday</span>
                  <span className="font-mono text-base font-bold text-amber-700 dark:text-amber-300">
                    in {ageResult.daysToNext} days
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">({ageResult.dayOfWeek})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: UNIT CONVERTER --- */}
      {activeTab === 'units' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUnitCategory('mass');
                setFromUnit('mg');
                setToUnit('g');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                unitCategory === 'mass' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Pharmaceutical Mass (mg, g, mcg)
            </button>
            <button
              onClick={() => {
                setUnitCategory('volume');
                setFromUnit('ml');
                setToUnit('tsp');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                unitCategory === 'volume' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Liquid Volume (ml, tsp, tbsp)
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Value to Convert
              </label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                From Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold"
              >
                {unitCategory === 'mass' ? (
                  <>
                    <option value="mcg">Micrograms (mcg)</option>
                    <option value="mg">Milligrams (mg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </>
                ) : (
                  <>
                    <option value="ml">Milliliters (mL)</option>
                    <option value="l">Liters (L)</option>
                    <option value="tsp">Teaspoons (tsp ~5mL)</option>
                    <option value="tbsp">Tablespoons (tbsp ~15mL)</option>
                    <option value="fl_oz">Fluid Ounces (fl oz)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                To Unit
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold"
              >
                {unitCategory === 'mass' ? (
                  <>
                    <option value="mcg">Micrograms (mcg)</option>
                    <option value="mg">Milligrams (mg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </>
                ) : (
                  <>
                    <option value="ml">Milliliters (mL)</option>
                    <option value="l">Liters (L)</option>
                    <option value="tsp">Teaspoons (tsp ~5mL)</option>
                    <option value="tbsp">Tablespoons (tbsp ~15mL)</option>
                    <option value="fl_oz">Fluid Ounces (fl oz)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-amber-300">
              Equivalent Value:
            </span>
            <span className="text-lg sm:text-xl font-mono font-black text-amber-800 dark:text-amber-300">
              {convertedValue} {toUnit}
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 4: TEMPERATURE CONVERTER --- */}
      {activeTab === 'temperature' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Temperature & Fever Classifier
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Temperature Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tempVal}
                  onChange={(e) => setTempVal(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scale
                </label>
                <select
                  value={tempScale}
                  onChange={(e) => setTempScale(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              </div>
            </div>
          </div>

          {temperatureData && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Celsius</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{temperatureData.celsius}°C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Fahrenheit</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{temperatureData.fahrenheit}°F</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Kelvin</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{temperatureData.kelvin} K</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs font-bold ${temperatureData.feverColor}`}>
                {temperatureData.feverClass}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {temperatureData.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
