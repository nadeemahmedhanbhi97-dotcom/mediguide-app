import React, { useState, useMemo, useEffect } from 'react';
import { Pharmacy } from '../types.ts';
import { SEED_PHARMACIES } from '../data/seedPharmacies.ts';
import {
  Building2, Search, MapPin, Compass, Globe, Phone, Clock,
  AlertTriangle, ShieldAlert, RefreshCw, X, ExternalLink, Navigation
} from 'lucide-react';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const PharmacySearch: React.FC = () => {
  const [scopeMode, setScopeMode] = useState<'worldwide' | 'country' | 'near_me'>('worldwide');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('Pakistan');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Near Me Geo State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(50);

  // Pagination / Load More state
  const [displayCount, setDisplayCount] = useState<number>(12);

  // Available unique countries
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    SEED_PHARMACIES.forEach((p) => set.add(p.country));
    return Array.from(set).sort();
  }, []);

  // Available cities based on selected country
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    SEED_PHARMACIES.forEach((p) => {
      if (scopeMode === 'worldwide' || p.country === selectedCountry) {
        set.add(p.city);
      }
    });
    return ['All', ...Array.from(set).sort()];
  }, [scopeMode, selectedCountry]);

  // Available areas based on selected country and city
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    SEED_PHARMACIES.forEach((p) => {
      const matchCountry = scopeMode === 'worldwide' || p.country === selectedCountry;
      const matchCity = selectedCity === 'All' || p.city.toLowerCase() === selectedCity.toLowerCase();
      if (matchCountry && matchCity && p.area) {
        set.add(p.area);
      }
    });
    return ['All', ...Array.from(set).sort()];
  }, [scopeMode, selectedCountry, selectedCity]);

  // Available categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    SEED_PHARMACIES.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Request browser geolocation
  const requestUserLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser or environment. Please select a country and city manually.');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationLoading(false);
        setLocationError(null);
      },
      (err) => {
        setLocationLoading(false);
        const msg = 'Location access is unavailable. Please select a country and city manually.';
        setLocationError(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    if (scopeMode === 'near_me' && !userLocation && !locationLoading) {
      requestUserLocation();
    }
  }, [scopeMode]);

  // Reset pagination on filter changes
  useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery, selectedCountry, selectedCity, selectedArea, selectedCategory, scopeMode, searchRadiusKm]);

  // Combined Search & Filter Logic
  const filteredPharmacies = useMemo(() => {
    let list: (Pharmacy & { distanceKm?: number })[] = SEED_PHARMACIES.map((p) => {
      if (userLocation) {
        return {
          ...p,
          distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
        };
      }
      return { ...p };
    });

    // 1. Scope: Worldwide vs Country vs Near Me
    if (scopeMode === 'country') {
      list = list.filter((p) => p.country === selectedCountry);
    } else if (scopeMode === 'near_me') {
      if (userLocation) {
        list = list
          .filter((p) => (p.distanceKm !== undefined ? p.distanceKm <= searchRadiusKm : false))
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }
    }

    // 2. City Filter
    if (selectedCity !== 'All') {
      list = list.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // 3. Area Filter
    if (selectedArea !== 'All') {
      list = list.filter((p) => p.area.toLowerCase() === selectedArea.toLowerCase());
    }

    // 4. Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 5. Text Query (Name, Phone, City, Area, Address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inPhone = p.phone.toLowerCase().includes(q);
        const inCity = p.city.toLowerCase().includes(q);
        const inArea = p.area.toLowerCase().includes(q);
        const inAddress = p.address.toLowerCase().includes(q);
        const inCountry = p.country.toLowerCase().includes(q);
        return inName || inPhone || inCity || inArea || inAddress || inCountry;
      });
    }

    return list;
  }, [scopeMode, selectedCountry, selectedCity, selectedArea, selectedCategory, searchQuery, userLocation, searchRadiusKm]);

  const visiblePharmacies = useMemo(() => {
    return filteredPharmacies.slice(0, displayCount);
  }, [filteredPharmacies, displayCount]);

  const resetFilters = () => {
    setScopeMode('worldwide');
    setSearchQuery('');
    setSelectedCountry('Pakistan');
    setSelectedCity('All');
    setSelectedArea('All');
    setSelectedCategory('All');
    setLocationError(null);
  };

  return (
    <div className="space-y-6">
      {/* CRITICAL MEDICINE AVAILABILITY & DEMO NOTICE */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 shadow-sm space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
            <strong className="font-bold block sm:inline">
              CRITICAL AVAILABILITY & SAFETY DISCLAIMER:
            </strong>{' '}
            <span className="font-semibold underline">Medicine availability is not verified.</span>{' '}
            MediGuide does not claim medicines are currently in stock or available at any pharmacy listed below. Always call the dispensary directly before traveling. All pharmacy profiles shown are unverified seed simulation records for directory demonstration.
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS (SINGLE CLEAN UI - NO DUPLICATION) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              <span>Medical Stores / Pharmacies</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find retail chemists, 24/7 hospital dispensaries, and compounding pharmacies near you or worldwide.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Search</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Text Search Box */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by store name, phone number, country, city, or area..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Scope Buttons: Worldwide | Country | Near Me */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Search Mode:
          </span>

          <button
            type="button"
            onClick={() => setScopeMode('worldwide')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              scopeMode === 'worldwide'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide ({SEED_PHARMACIES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setScopeMode('country')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              scopeMode === 'country'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>By Country</span>
          </button>

          <button
            type="button"
            onClick={() => setScopeMode('near_me')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              scopeMode === 'near_me'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Near Me (GPS)</span>
          </button>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {scopeMode === 'country' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Select Country:
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity('All');
                  setSelectedArea('All');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                {availableCountries.map((c) => (
                  <option key={c} value={c}>
                    {c} ({SEED_PHARMACIES.filter((p) => p.country === c).length} demo stores)
                  </option>
                ))}
              </select>
            </div>
          )}

          {scopeMode === 'near_me' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Search Radius: {searchRadiusKm} km
                </label>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  disabled={locationLoading}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold rounded-lg hover:bg-slate-200 transition shrink-0"
                >
                  {locationLoading ? 'Locating...' : 'Refresh GPS'}
                </button>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[5, 10, 25, 50, 100].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSearchRadiusKm(r)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                      searchRadiusKm === r
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              City / Municipality:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedArea('All');
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Area / Location:
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Store Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Near Me Status Banner */}
        {scopeMode === 'near_me' && (
          <div className="pt-2">
            {locationError ? (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{locationError}</span>
                  <span className="text-[11px] text-rose-700 dark:text-rose-400">
                    Switch to &quot;Worldwide&quot; or select &quot;By Country&quot; to browse all available seeded pharmacies.
                  </span>
                </div>
              </div>
            ) : userLocation ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>
                    Location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} (Radius: {searchRadiusKm} km)
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  {filteredPharmacies.length} pharmacies within range
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                <span>Requesting GPS location from browser...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RESULT COUNT BANNER */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Showing {visiblePharmacies.length} of {filteredPharmacies.length} {filteredPharmacies.length === 1 ? 'Pharmacy' : 'Pharmacies'}
          {scopeMode === 'country' && ` in ${selectedCountry}`}
          {selectedCity !== 'All' && ` • City: ${selectedCity}`}
          {selectedArea !== 'All' && ` • Area: ${selectedArea}`}
          {selectedCategory !== 'All' && ` • ${selectedCategory}`}
        </span>
      </div>

      {/* PHARMACIES GRID */}
      {visiblePharmacies.length > 0 ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePharmacies.map((pharm) => (
              <div
                key={pharm.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/60 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-stone-900 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40">
                      {pharm.category}
                    </span>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      DEMO / UNVERIFIED
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {pharm.name}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        {pharm.area}, {pharm.city}, {pharm.country}
                      </span>
                      {pharm.distanceKm !== undefined && (
                        <span className="ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-stone-900 text-amber-800 dark:text-amber-300 font-semibold shrink-0">
                          ~{pharm.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pharm.openingHours}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{pharm.phone}</span>
                    </div>
                  </div>

                  {/* Availability notice on every single card */}
                  <div className="mt-3 p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 inline mr-1 -mt-0.5" />
                    <span>Medicine availability is not verified. Contact store directly.</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${pharm.name} ${pharm.city} ${pharm.country}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Map / Location</span>
                  </a>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {pharm.is24Hours ? '24/7 Open' : 'Day Service'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visiblePharmacies.length < filteredPharmacies.length && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 12)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shadow-xs"
              >
                Load More Pharmacies ({filteredPharmacies.length - visiblePharmacies.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No matching medical stores/pharmacies found.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {scopeMode === 'near_me'
              ? `No demo pharmacies found within ${searchRadiusKm} km of your detected location. Try expanding the radius or search by country.`
              : 'No medical store matching your search criteria was found in the demo dataset.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2.5 flex-wrap">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
