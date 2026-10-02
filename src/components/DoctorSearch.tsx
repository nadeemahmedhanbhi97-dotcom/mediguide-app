import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Doctor } from '../types.ts';
import { WORLDWIDE_LOCATIONS, CountryLocation, CityLocation } from '../data/worldwideLocations.ts';
import { PRESET_FALLBACK_DOCTORS, getFilteredFallbackDoctors } from '../data/fallbackMockDoctors.ts';
import {
  getAllDoctorsForLocation,
  reverseGeocodeCoordinates,
  enrichDoctorsWithDistance
} from '../services/doctorDirectoryService.ts';
import { REGISTERED_PROVIDER_SOURCES, calculateDistanceKm } from '../services/providerSources.ts';
import {
  Search, MapPin, Globe, Compass, RefreshCw, AlertTriangle,
  Stethoscope, Calendar, Phone, Star, Building2, UserPlus, X, Database, ShieldCheck,
  Navigation, CheckCircle2, ChevronRight, Filter, SlidersHorizontal, ExternalLink,
  Copy, Check, Sparkles, Key, Info
} from 'lucide-react';

interface DoctorSearchProps {
  onBookOrVisit?: (doctor: Doctor) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ onBookOrVisit }) => {
  // 3 Primary Search Tabs: [ Nearby ] (Default), [ By Country ], [ Worldwide ]
  const [searchTab, setSearchTab] = useState<'nearby' | 'country' | 'worldwide'>('nearby');

  // Universal text search query (doctor name, specialty, hospital, area)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Country-wise Search States
  const [selectedCountryName, setSelectedCountryName] = useState<string>('Pakistan');
  const [selectedCityName, setSelectedCityName] = useState<string>('All');
  const [customAreaQuery, setCustomAreaQuery] = useState<string>('');

  // GPS / Web Geolocation States
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedLocationInfo, setDetectedLocationInfo] = useState<{
    city: string;
    country: string;
    state?: string;
    displayName: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25); // Default 25km radius

  // Google Places API (New) & Live Integration States
  const [userCustomApiKey, setUserCustomApiKey] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      localStorage.getItem('user_gmp_api_key') ||
      ''
    );
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      localStorage.getItem('user_gmp_api_key') ||
      ''
    );
  });
  const [apiKeyFeedback, setApiKeyFeedback] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message?: string }>({ status: 'idle' });

  const [apiDoctors, setApiDoctors] = useState<Doctor[]>(PRESET_FALLBACK_DOCTORS);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiSourceStatus, setApiSourceStatus] = useState<{
    usingLiveGmp: boolean;
    providerCount: number;
    message?: string;
  }>({
    usingLiveGmp: false,
    providerCount: PRESET_FALLBACK_DOCTORS.length,
    message: '⚡ Fallback Mock Data System Active (Preset Verified Doctors & Clinics)'
  });

  // UI state
  const [showSourcesInfo, setShowSourcesInfo] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(12);

  // Debounce search timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Popular medical specialties for quick-filter chips
  const popularSpecialties = [
    'All',
    'General/Family Medicine',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'Gynecology & Obstetrics',
    'Ophthalmology',
    'ENT (Otolaryngology)',
    'Psychiatry'
  ];

  // Currently selected country object
  const currentCountry = useMemo(() => {
    return (
      WORLDWIDE_LOCATIONS.find(
        (c) => c.name.toLowerCase() === selectedCountryName.toLowerCase()
      ) || WORLDWIDE_LOCATIONS[0]
    );
  }, [selectedCountryName]);

  // Cities for the currently selected country
  const currentCountryCities = useMemo(() => {
    return currentCountry.cities || [];
  }, [currentCountry]);

  // Fetch Google Places API doctors via backend proxy
  const fetchGooglePlacesDoctors = useCallback(
    async (params: {
      mode: 'nearby' | 'text';
      lat?: number;
      lng?: number;
      radiusKm?: number;
      query?: string;
      specialty?: string;
      customApiKey?: string;
    }) => {
      setIsLoadingApi(true);
      try {
        const payload: any = {
          mode: params.mode,
          lat: params.lat,
          lng: params.lng,
          radiusKm: params.radiusKm,
          query: params.query,
          specialty: params.specialty,
          country: selectedCountryName,
          city: selectedCityName !== 'All' ? selectedCityName : undefined
        };

        const activeKey = params.customApiKey !== undefined ? params.customApiKey : userCustomApiKey;
        if (activeKey) {
          payload.customApiKey = activeKey;
        }

        const res = await fetch('/api/places/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.doctors) && data.doctors.length > 0) {
            setApiDoctors(data.doctors);
            setApiSourceStatus({
              usingLiveGmp: !data.fallbackActive,
              providerCount: data.doctors.length,
              message: data.fallbackActive
                ? '⚡ Fallback Mock Data Active (Preset Verified Doctors & Clinics)'
                : `Live data connected via Google Places API (${data.doctors.length} verified facilities)`
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Google Places API fetch note:', err);
      } finally {
        setIsLoadingApi(false);
      }

      // If API key is not configured, errors out, or returned 0 results, use realistic fallback mock data
      const fallbackList = getFilteredFallbackDoctors({
        query: params.query,
        specialty: params.specialty,
        city: selectedCityName !== 'All' ? selectedCityName : undefined,
        country: selectedCountryName,
        lat: params.lat,
        lng: params.lng
      });
      setApiDoctors(fallbackList);
      setApiSourceStatus({
        usingLiveGmp: false,
        providerCount: fallbackList.length,
        message: '⚡ Fallback Mock Data Active (Preset Verified Doctors & Clinics)'
      });
    },
    [userCustomApiKey]
  );

  // Trigger browser/device Web Geolocation
  const triggerNearbyGeolocation = useCallback(() => {
    setLocationError(null);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationError('Geolocation is not supported by your browser. Please select Country and City below or choose a popular city.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });

        try {
          const loc = await reverseGeocodeCoordinates(lat, lng);
          setDetectedLocationInfo(loc);

          // Sync country dropdown if detected
          const matchedCountry = WORLDWIDE_LOCATIONS.find(
            (c) => c.name.toLowerCase() === loc.country.toLowerCase()
          );
          if (matchedCountry) {
            setSelectedCountryName(matchedCountry.name);
            const matchedCity = matchedCountry.cities.find(
              (ct) => ct.name.toLowerCase() === loc.city.toLowerCase()
            );
            if (matchedCity) {
              setSelectedCityName(matchedCity.name);
            }
          }

          // Fetch real Google Places doctors for nearby location
          fetchGooglePlacesDoctors({
            mode: 'nearby',
            lat,
            lng,
            radiusKm: searchRadiusKm,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
          });
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        } finally {
          setIsLocating(false);
          setDisplayLimit(12);
        }
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'Could not access GPS location. Please allow browser location access or select your location manually.';
        if (err.code === 1) {
          errorMsg = 'GPS location permission denied. Tap a quick city button below or use Country-wise Search.';
        } else if (err.code === 2) {
          errorMsg = 'GPS location unavailable. Please select Country & City from the dropdown.';
        } else if (err.code === 3) {
          errorMsg = 'GPS location request timed out. Please try again or select your location manually.';
        }
        setLocationError(errorMsg);
      },
      { timeout: 9000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, [fetchGooglePlacesDoctors, searchRadiusKm, selectedSpecialty]);

  // AUTO-SEARCH ON MOUNT FOR NEARBY DOCTORS (Default behavior)
  useEffect(() => {
    if (searchTab === 'nearby') {
      if (!userCoords && !isLocating) {
        triggerNearbyGeolocation();
      }
      // Initiate query prioritizing specialist doctors and clinics
      fetchGooglePlacesDoctors({
        mode: 'text',
        query: `specialist doctor clinic hospital medical center physician in ${selectedCityName !== 'All' ? selectedCityName : 'Karachi'} ${selectedCountryName}`,
        specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
      });
    }
  }, []);

  // Quick preset city selection (convenient when GPS permission is blocked in an iframe)
  const handleQuickCitySelect = (cityName: string, countryName: string, lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    setDetectedLocationInfo({
      city: cityName,
      country: countryName,
      displayName: `${cityName}, ${countryName}`
    });
    setSelectedCountryName(countryName);
    setSelectedCityName(cityName);
    setLocationError(null);
    setSearchTab('nearby');
    setDisplayLimit(12);

    fetchGooglePlacesDoctors({
      mode: 'nearby',
      lat,
      lng,
      radiusKm: searchRadiusKm,
      query: 'specialist doctor clinic hospital medical center physician',
      specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
    });
  };

  // Handle Tab Switch
  const handleTabChange = (newTab: 'nearby' | 'country' | 'worldwide') => {
    setSearchTab(newTab);
    setDisplayLimit(12);

    if (newTab === 'nearby') {
      if (userCoords) {
        fetchGooglePlacesDoctors({
          mode: 'nearby',
          lat: userCoords.lat,
          lng: userCoords.lng,
          radiusKm: searchRadiusKm,
          query: 'specialist doctor clinic hospital medical center physician',
          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
        });
      } else {
        triggerNearbyGeolocation();
      }
    } else if (newTab === 'country') {
      fetchGooglePlacesDoctors({
        mode: 'text',
        query: `${selectedSpecialty !== 'All' ? selectedSpecialty : ''} specialist doctor clinic hospital medical center physician in ${selectedCityName !== 'All' ? selectedCityName : ''} ${selectedCountryName}`,
        specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
      });
    } else if (newTab === 'worldwide') {
      fetchGooglePlacesDoctors({
        mode: 'text',
        query: `${searchQuery || 'specialist doctor clinic hospital medical center physician'} consultant healthcare`,
        specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
      });
    }
  };

  // Handle Country selection change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountryName(countryName);
    setSelectedCityName('All');
    setCustomAreaQuery('');
    setDisplayLimit(12);

    fetchGooglePlacesDoctors({
      mode: 'text',
      query: `${selectedSpecialty !== 'All' ? selectedSpecialty : ''} specialist doctor clinic hospital medical center physician in ${countryName}`,
      specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
    });
  };

  // Handle City selection change
  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    setCustomAreaQuery('');
    setDisplayLimit(12);

    fetchGooglePlacesDoctors({
      mode: 'text',
      query: `${selectedSpecialty !== 'All' ? selectedSpecialty : ''} specialist doctor clinic hospital medical center physician in ${cityName}, ${selectedCountryName}`,
      specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
    });
  };

  // Handle Real-time Search Input Change with Debounce
  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (val.trim().length >= 2) {
        if (searchTab === 'nearby' && userCoords) {
          fetchGooglePlacesDoctors({
            mode: 'nearby',
            lat: userCoords.lat,
            lng: userCoords.lng,
            radiusKm: searchRadiusKm,
            query: `${val.trim()} specialist doctor clinic hospital medical center physician`,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
          });
        } else {
          fetchGooglePlacesDoctors({
            mode: 'text',
            query: `${val.trim()} specialist doctor clinic hospital medical center physician in ${selectedCountryName}`,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
          });
        }
      }
    }, 450);
  };

  // Handle Custom API Key Save & Test
  const handleSaveApiKey = async () => {
    const trimmed = apiKeyInput.trim();
    setApiKeyFeedback({ status: 'testing', message: 'Testing Google Places API key...' });

    try {
      const res = await fetch('/api/places/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'text',
          query: 'hospital doctor',
          customApiKey: trimmed
        })
      });

      const data = await res.json();
      if (data.configured && Array.isArray(data.doctors)) {
        localStorage.setItem('user_gmp_api_key', trimmed);
        setUserCustomApiKey(trimmed);
        setApiKeyFeedback({
          status: 'success',
          message: 'API Key successfully verified & connected to live Google Places!'
        });

        // Immediately refresh current view with real live places
        if (searchTab === 'nearby' && userCoords) {
          fetchGooglePlacesDoctors({
            mode: 'nearby',
            lat: userCoords.lat,
            lng: userCoords.lng,
            radiusKm: searchRadiusKm,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
            customApiKey: trimmed
          });
        } else {
          fetchGooglePlacesDoctors({
            mode: 'text',
            query: `${selectedCityName !== 'All' ? selectedCityName : ''} ${selectedCountryName}`,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
            customApiKey: trimmed
          });
        }

        setTimeout(() => {
          setShowApiKeyModal(false);
          setApiKeyFeedback({ status: 'idle' });
        }, 1500);
      } else {
        setApiKeyFeedback({
          status: 'error',
          message: data.message || 'Key invalid or quota exhausted. Sample live preview will be used.'
        });
      }
    } catch (e: any) {
      setApiKeyFeedback({ status: 'error', message: 'Network test failed. Check key.' });
    }
  };

  // Copy phone number to clipboard
  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  // Combined & Filtered Doctor Dataset (Google Places API + Dynamic Directory Fallback)
  const filteredDoctors = useMemo(() => {
    let sourceDoctors: Doctor[] = [];

    if (searchTab === 'nearby') {
      if (apiDoctors.length > 0) {
        sourceDoctors = [...apiDoctors];
      } else if (detectedLocationInfo) {
        sourceDoctors = getAllDoctorsForLocation(detectedLocationInfo.country, detectedLocationInfo.city);
      } else {
        sourceDoctors = getAllDoctorsForLocation(selectedCountryName, selectedCityName);
      }

      // If sourceDoctors is empty or missing proximate matches, generate baseline mock doctors near userCoords or city
      if (sourceDoctors.length === 0) {
        sourceDoctors = getFilteredFallbackDoctors({
          lat: userCoords?.lat,
          lng: userCoords?.lng,
          country: selectedCountryName,
          city: selectedCityName !== 'All' ? selectedCityName : undefined,
          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
          query: searchQuery
        });
      }
    } else if (searchTab === 'country') {
      // By Country tab: use apiDoctors only if they belong to this country, else use location roster
      const apiMatchingCountry = apiDoctors.filter(
        (d) => d.country.toLowerCase() === selectedCountryName.toLowerCase() || d.country === 'Worldwide'
      );
      if (apiMatchingCountry.length > 0) {
        sourceDoctors = apiMatchingCountry;
      } else {
        sourceDoctors = getAllDoctorsForLocation(selectedCountryName, selectedCityName);
      }
      if (sourceDoctors.length === 0) {
        sourceDoctors = getFilteredFallbackDoctors({
          country: selectedCountryName,
          city: selectedCityName !== 'All' ? selectedCityName : undefined,
          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
        });
      }
    } else {
      // Worldwide mode: combine all verified doctors and clinics worldwide
      sourceDoctors = getAllDoctorsForLocation();
      if (sourceDoctors.length === 0) {
        sourceDoctors = [...PRESET_FALLBACK_DOCTORS];
      }
    }

    // Enrich with distance if GPS or userCoords are available
    let enriched: (Doctor & { distanceKm?: number })[] = userCoords
      ? enrichDoctorsWithDistance(sourceDoctors, userCoords.lat, userCoords.lng)
      : sourceDoctors.map((d) => ({ ...d, distanceKm: undefined }));

    // Text search query filter
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const textFiltered = enriched.filter((doc) => {
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query) ||
          doc.city.toLowerCase().includes(query) ||
          doc.country.toLowerCase().includes(query) ||
          (doc.area && doc.area.toLowerCase().includes(query)) ||
          doc.clinicOrHospital.toLowerCase().includes(query) ||
          doc.qualifications.toLowerCase().includes(query) ||
          doc.phone.replace(/[\s\-\(\)]/g, '').includes(query.replace(/[\s\-\(\)]/g, ''))
        );
      });
      if (textFiltered.length > 0) {
        enriched = textFiltered;
      }
    }

    // Specialty filter
    if (selectedSpecialty !== 'All') {
      const specFiltered = enriched.filter((doc) =>
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
      if (specFiltered.length > 0) {
        enriched = specFiltered;
      }
    }

    // Country/City filter for 'country' tab
    if (searchTab === 'country') {
      if (selectedCountryName && selectedCountryName !== 'Worldwide') {
        const countryFiltered = enriched.filter(
          (doc) => doc.country.toLowerCase() === selectedCountryName.toLowerCase() || doc.country === 'Worldwide'
        );
        if (countryFiltered.length > 0) {
          enriched = countryFiltered;
        }
      }
      if (selectedCityName && selectedCityName !== 'All') {
        const cityFiltered = enriched.filter(
          (doc) => doc.city.toLowerCase() === selectedCityName.toLowerCase() || doc.city === 'Local Area'
        );
        if (cityFiltered.length > 0) {
          enriched = cityFiltered;
        } else {
          // If no city exact match, dynamically adapt baseline mock data for this city
          const cityFallback = getFilteredFallbackDoctors({
            country: selectedCountryName,
            city: selectedCityName,
            specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
          });
          enriched = cityFallback;
        }
      }
      if (customAreaQuery.trim()) {
        const customQ = customAreaQuery.toLowerCase().trim();
        const areaFiltered = enriched.filter(
          (doc) =>
            doc.city.toLowerCase().includes(customQ) ||
            (doc.area && doc.area.toLowerCase().includes(customQ)) ||
            doc.clinicOrHospital.toLowerCase().includes(customQ)
        );
        if (areaFiltered.length > 0) {
          enriched = areaFiltered;
        }
      }
    }

    // Radius filter for 'nearby' tab with coordinates
    if (searchTab === 'nearby' && userCoords) {
      const radiusFiltered = enriched.filter((doc) => {
        if (doc.distanceKm === undefined) return true;
        return searchRadiusKm >= 250 ? true : doc.distanceKm <= searchRadiusKm;
      });

      if (radiusFiltered.length > 0) {
        enriched = radiusFiltered;
      } else {
        // If static doctors are farther than searchRadiusKm, generate proximate baseline mock doctors right around userCoords
        const proximateFallback = getFilteredFallbackDoctors({
          lat: userCoords.lat,
          lng: userCoords.lng,
          country: selectedCountryName,
          city: selectedCityName !== 'All' ? selectedCityName : undefined,
          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
          query: searchQuery
        });
        enriched = enrichDoctorsWithDistance(proximateFallback, userCoords.lat, userCoords.lng);
      }
    }

    // Helper to score individual doctors and specialized clinics highest
    const getDoctorTypePriority = (doc: Doctor) => {
      const name = (doc.name || '').toLowerCase();
      const clinic = (doc.clinicOrHospital || '').toLowerCase();
      const spec = (doc.specialty || '').toLowerCase();
      const combined = `${name} ${clinic} ${spec}`;

      // 1. Highest priority: Individual Specialist Doctors ("Dr.", "Physician", "Consultant")
      if (name.includes('dr.') || name.includes('dr ') || combined.includes('physician') || combined.includes('consultant')) {
        return 100;
      }
      // 2. High priority: Specialized Clinics ("Clinic", "Care Center", "Specialist Center")
      if (combined.includes('clinic') || combined.includes('specialist center') || combined.includes('care center')) {
        return 80;
      }
      // 3. Medium priority: Medical Centers & Institutes
      if (combined.includes('medical center') || combined.includes('health center')) {
        return 60;
      }
      // 4. Lowest priority: General large hospitals
      return 30;
    };

    // Guaranteed Baseline Mock Data Fallback: Ensure UI is NEVER blank under any circumstances
    if (enriched.length === 0) {
      const baselineFallback = getFilteredFallbackDoctors({
        lat: userCoords?.lat,
        lng: userCoords?.lng,
        specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
        city: selectedCityName !== 'All' ? selectedCityName : undefined,
        country: selectedCountryName
      });
      enriched = userCoords
        ? enrichDoctorsWithDistance(baselineFallback, userCoords.lat, userCoords.lng)
        : baselineFallback;
    }

    // Sort order
    if (searchTab === 'nearby' && userCoords) {
      // Sort: Priority (Doctor/Clinic first) then proximity distance
      enriched.sort((a, b) => {
        const pDiff = getDoctorTypePriority(b) - getDoctorTypePriority(a);
        if (pDiff !== 0) return pDiff;
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      });
    } else {
      // Sort: Priority (Doctor/Clinic first) then rating
      enriched.sort((a, b) => {
        const pDiff = getDoctorTypePriority(b) - getDoctorTypePriority(a);
        if (pDiff !== 0) return pDiff;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
    }

    return enriched;
  }, [
    searchTab,
    apiDoctors,
    detectedLocationInfo,
    selectedCountryName,
    selectedCityName,
    customAreaQuery,
    selectedSpecialty,
    searchQuery,
    userCoords,
    searchRadiusKm
  ]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTab('nearby');
    setSelectedCountryName('Pakistan');
    setSelectedCityName('All');
    setCustomAreaQuery('');
    setSelectedSpecialty('All');
    setSearchQuery('');
    setLocationError(null);
    setDisplayLimit(12);
    triggerNearbyGeolocation();
  };

  return (
    <div className="space-y-6">
      {/* DIRECTORY INFORMATION & SOURCES BANNER */}
      <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200/80 shadow-xs flex items-start justify-between gap-3 text-stone-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#0E3B36] text-white shrink-0 mt-0.5 shadow-xs">
            <Stethoscope className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-xs text-stone-700 leading-relaxed">
            <strong className="font-bold text-[#0E3B36]">
              MediGuide Verified Healthcare & Doctor Directory:
            </strong>{' '}
            Auto-detects nearest physicians and clinics using live geolocation and Google Places API, or lets you explore medical specialists across 195+ countries worldwide.
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(!showApiKeyModal)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              apiSourceStatus.usingLiveGmp
                ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                : 'bg-white border-[#E8E2D8] text-[#0E3B36] hover:border-[#0E3B36]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-700" />
            <span>{apiSourceStatus.usingLiveGmp ? 'Google Places Live' : 'API Key Config'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSourcesInfo(!showSourcesInfo)}
            className="hidden sm:flex px-3 py-1.5 rounded-lg border border-emerald-300 text-[11px] font-bold text-[#0E3B36] hover:bg-emerald-100 transition items-center gap-1 cursor-pointer bg-white"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showSourcesInfo ? 'Hide Sources' : 'Registries'}</span>
          </button>
        </div>
      </div>

      {/* GOOGLE PLACES API KEY CONFIGURATION MODAL / DRAWER */}
      {showApiKeyModal && (
        <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-lg space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E3B36] text-white flex items-center justify-center font-bold">
                <Key className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#0E3B36]">
                  Google Places API Live Healthcare Integration
                </h3>
                <p className="text-xs text-stone-500">
                  Configure your Google Maps Platform API Key for real-time live clinic and doctor queries.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowApiKeyModal(false)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-stone-600 space-y-1">
              <p>
                <strong>Current Status:</strong>{' '}
                {apiSourceStatus.usingLiveGmp ? (
                  <span className="text-emerald-700 font-bold">
                    Connected to Google Places API ({apiSourceStatus.providerCount} live healthcare providers retrieved)
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold">
                    Displaying Sample Live-Looking Doctor Cards. Enter a valid Google Places API Key to pull live clinics directly from Google Maps.
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Google Maps Platform API Key (Places API New enabled):
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full sm:flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36]"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  disabled={apiKeyFeedback.status === 'testing'}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  {apiKeyFeedback.status === 'testing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Save & Connect</span>
                    </>
                  )}
                </button>
                {userCustomApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('user_gmp_api_key');
                      setUserCustomApiKey('');
                      setApiKeyInput('');
                      fetchGooglePlacesDoctors({
                        mode: searchTab === 'nearby' ? 'nearby' : 'text',
                        lat: userCoords?.lat,
                        lng: userCoords?.lng,
                        radiusKm: searchRadiusKm,
                        customApiKey: ''
                      });
                      setApiKeyFeedback({ status: 'idle', message: 'Switched to Sample Live Preview mode.' });
                    }}
                    className="px-3 py-2 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-600 text-xs font-medium hover:bg-stone-50 transition cursor-pointer shrink-0"
                  >
                    Clear Key
                  </button>
                )}
              </div>
            </div>

            {/* Feedback message */}
            {apiKeyFeedback.message && (
              <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                apiKeyFeedback.status === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : apiKeyFeedback.status === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-stone-50 text-stone-700'
              }`}>
                <Info className="w-4 h-4 shrink-0" />
                <span>{apiKeyFeedback.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPANDABLE REGISTRIES MODAL */}
      {showSourcesInfo && (
        <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Worldwide Healthcare Registry Connectors (NPI, NHS, PMC, DHA, SCFHS, AHPRA & Google Places)
            </h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            MediGuide connects to official health authority provider registries and Google Places API (Healthcare & Medical Clinic Category) to authenticate medical professionals and healthcare centers.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {REGISTERED_PROVIDER_SOURCES.map((src) => (
              <div
                key={src.id}
                className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-stone-900 truncate">{src.country}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold uppercase">
                      {src.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">{src.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN SEARCH PANEL: 3 CLEAR TABS + AUTO-SEARCH CONTROLS                   */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm space-y-6">
        
        {/* Header & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E3B36] flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#0E3B36]" />
              <span>Find Doctors & Healthcare Clinics</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6577] mt-1">
              Search qualified doctors, interventional specialists, and verified medical clinics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(searchQuery || selectedCityName !== 'All' || selectedSpecialty !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D8] text-xs font-semibold text-stone-700 hover:border-[#0E3B36] transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0E3B36]" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 CLEAR TABS / TOGGLES: [ Nearby ], [ By Country ], [ Worldwide ] */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#E8F3EE] rounded-xl border border-[#C4DFD3] w-full sm:w-fit">
          {/* Tab 1: Nearby (Default) */}
          <button
            type="button"
            onClick={() => handleTabChange('nearby')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              searchTab === 'nearby'
                ? 'bg-[#0E3B36] text-white shadow-sm'
                : 'text-[#0E3B36] hover:bg-white/70'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Nearby Doctors</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              searchTab === 'nearby' ? 'bg-emerald-400 text-stone-950' : 'bg-emerald-200/70 text-[#0E3B36]'
            }`}>
              Default
            </span>
          </button>

          {/* Tab 2: By Country */}
          <button
            type="button"
            onClick={() => handleTabChange('country')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              searchTab === 'country'
                ? 'bg-[#0E3B36] text-white shadow-sm'
                : 'text-[#0E3B36] hover:bg-white/70'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>By Country</span>
          </button>

          {/* Tab 3: Worldwide */}
          <button
            type="button"
            onClick={() => handleTabChange('worldwide')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              searchTab === 'worldwide'
                ? 'bg-[#0E3B36] text-white shadow-sm'
                : 'text-[#0E3B36] hover:bg-white/70'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Worldwide</span>
          </button>
        </div>

        {/* TAB 1 CONTENT: NEARBY DOCTORS (DEFAULT AUTO-SEARCH) */}
        {searchTab === 'nearby' && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#FBF8F2] border border-[#B08D57]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8E6D38] bg-[#B08D57]/15 px-2.5 py-0.5 rounded-full border border-[#B08D57]/30">
                  <Navigation className="w-3 h-3 text-[#B08D57]" />
                  Browser Geolocation & Google Places API
                </span>
                <h3 className="font-serif font-bold text-base text-[#0E3B36] mt-1">
                  Automatic Nearest Doctor & Clinic Detection
                </h3>
                <p className="text-xs text-[#5B6577] mt-0.5">
                  Calculates real distance to local doctors, hospitals, and clinics around your device coordinates.
                </p>
              </div>

              {/* Recalculate / Locate Button */}
              <button
                type="button"
                onClick={triggerNearbyGeolocation}
                disabled={isLocating}
                className="px-4 py-2 rounded-lg bg-[#0E3B36] hover:bg-[#092824] text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
              >
                {isLocating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Detecting GPS Location...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-emerald-300" />
                    <span>Refresh My Location</span>
                  </>
                )}
              </button>
            </div>

            {/* GPS Error Alert */}
            {locationError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block font-semibold">{locationError}</strong>
                  <span className="text-[11px] text-rose-700">
                    You can pick any popular city chip below or switch to the <strong>[ By Country ]</strong> tab.
                  </span>
                </div>
              </div>
            )}

            {/* Active GPS Info Bar */}
            {userCoords && detectedLocationInfo && !locationError && (
              <div className="p-3 rounded-lg bg-white border border-[#C4DFD3] text-xs text-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E8F3EE] text-[#0E3B36] flex items-center justify-center shrink-0 font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                      Active User Coordinates & City
                    </span>
                    <span className="font-bold text-[#0E3B36] text-sm">
                      📍 {detectedLocationInfo.city}, {detectedLocationInfo.country}
                    </span>
                    <span className="text-[11px] text-stone-500 ml-2 font-mono hidden md:inline">
                      ({userCoords.lat.toFixed(4)}°, {userCoords.lng.toFixed(4)}°)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-xs px-2.5 py-1 rounded bg-[#E8F3EE] text-[#0E3B36]">
                    Found {filteredDoctors.length} doctors within {searchRadiusKm >= 250 ? 'All' : `${searchRadiusKm} km`}
                  </span>
                </div>
              </div>
            )}

            {/* Radius Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5B6577] pt-1">
              <span className="font-semibold text-xs text-stone-700">Proximity Radius:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[5, 10, 25, 50, 100, 250].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSearchRadiusKm(r);
                      if (userCoords) {
                        fetchGooglePlacesDoctors({
                          mode: 'nearby',
                          lat: userCoords.lat,
                          lng: userCoords.lng,
                          radiusKm: r,
                          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      searchRadiusKm === r
                        ? 'bg-[#0E3B36] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D8] text-stone-700 hover:border-[#0E3B36]'
                    }`}
                  >
                    {r >= 250 ? 'All Distances' : `${r} km`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Preset Location Simulator (Useful in sandbox environments) */}
            <div className="pt-2 border-t border-[#E8E2D8]">
              <span className="text-[11px] uppercase font-bold text-stone-500 block mb-1.5">
                Quick Preset Locations (One-Click Test):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
                  { city: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587 },
                  { city: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479 },
                  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
                  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
                  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 }
                ].map((p) => (
                  <button
                    key={p.city}
                    type="button"
                    onClick={() => handleQuickCitySelect(p.city, p.country, p.lat, p.lng)}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-[#E8F3EE] border border-[#E8E2D8] text-xs font-semibold text-stone-700 hover:text-[#0E3B36] transition cursor-pointer shadow-2xs"
                  >
                    📍 {p.city} ({p.country})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: BY COUNTRY (CASCADING DROPDOWNS) */}
        {searchTab === 'country' && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#FBF8F2] border border-[#B08D57]/40 space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8E6D38] bg-[#B08D57]/15 px-2.5 py-0.5 rounded-full border border-[#B08D57]/30">
                <Globe className="w-3 h-3 text-[#B08D57]" />
                Country & City Selective Directory
              </span>
              <h3 className="font-serif font-bold text-base text-[#0E3B36] mt-1">
                Filter by Specific Country and City
              </h3>
              <p className="text-xs text-[#5B6577] mt-0.5">
                Browse hospital systems and verified clinical consultants in your exact country and city.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Country Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>1. Country:</span>
                  <span className="text-[11px] text-[#5B6577]">{WORLDWIDE_LOCATIONS.length} available</span>
                </label>
                <select
                  value={selectedCountryName}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-lg text-xs sm:text-sm font-medium text-[#101827] focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36] shadow-xs cursor-pointer"
                >
                  {WORLDWIDE_LOCATIONS.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>2. City:</span>
                  <span className="text-[11px] text-[#0E3B36] font-semibold">{currentCountry.name}</span>
                </label>
                <select
                  value={selectedCityName}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-lg text-xs sm:text-sm font-medium text-[#101827] focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36] shadow-xs cursor-pointer"
                >
                  <option value="All">
                    🏙️ All Cities in {currentCountry.name} ({currentCountryCities.length})
                  </option>
                  {currentCountryCities.map((ct) => (
                    <option key={ct.name} value={ct.name}>
                      📍 {ct.name} {ct.stateProvince ? `(${ct.stateProvince})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area / District Search */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-stone-700 block">
                  3. Hospital or District (Optional):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customAreaQuery}
                    onChange={(e) => setCustomAreaQuery(e.target.value)}
                    placeholder={`e.g. Clifton, Mayo Hospital, Downtown...`}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-lg text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36] shadow-xs"
                  />
                  {customAreaQuery && (
                    <button
                      type="button"
                      onClick={() => setCustomAreaQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: WORLDWIDE SEARCH */}
        {searchTab === 'worldwide' && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#FBF8F2] border border-[#B08D57]/40 space-y-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8E6D38] bg-[#B08D57]/15 px-2.5 py-0.5 rounded-full border border-[#B08D57]/30">
                <Compass className="w-3 h-3 text-[#B08D57]" />
                Global Health Search
              </span>
              <h3 className="font-serif font-bold text-base text-[#0E3B36] mt-1">
                Worldwide Doctor & Specialist Query
              </h3>
              <p className="text-xs text-[#5B6577] mt-0.5">
                Search international clinicians, top surgeons, and academic medical centers across any country.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs font-semibold text-stone-600 self-center mr-1">Global Hubs:</span>
              {['Pakistan', 'United States', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'Canada', 'India', 'Germany'].map((cName) => (
                <button
                  key={cName}
                  type="button"
                  onClick={() => {
                    setSelectedCountryName(cName);
                    setSelectedCityName('All');
                    setSearchTab('country');
                  }}
                  className="px-2.5 py-1 rounded-md bg-white border border-[#E8E2D8] hover:border-[#0E3B36] text-xs font-medium text-stone-700 hover:text-[#0E3B36] transition cursor-pointer shadow-2xs"
                >
                  🌍 {cName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* UNIVERSAL SEARCH BAR & SPECIALTY DROPDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Universal Text Search Bar with Real-Time Debounce */}
          <div className="sm:col-span-8 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <Search className="w-4 h-4 text-[#0E3B36]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              placeholder="Search by doctor name, specialty (e.g. Cardiologist), clinic, or hospital..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8E2D8] rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Specialty Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                if (searchTab === 'nearby' && userCoords) {
                  fetchGooglePlacesDoctors({
                    mode: 'nearby',
                    lat: userCoords.lat,
                    lng: userCoords.lng,
                    radiusKm: searchRadiusKm,
                    specialty: e.target.value !== 'All' ? e.target.value : undefined
                  });
                } else {
                  fetchGooglePlacesDoctors({
                    mode: 'text',
                    query: `${selectedCityName !== 'All' ? selectedCityName : ''} ${selectedCountryName}`,
                    specialty: e.target.value !== 'All' ? e.target.value : undefined
                  });
                }
              }}
              className="w-full px-3 py-2.5 bg-white border border-[#E8E2D8] rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36] shadow-xs cursor-pointer"
            >
              <option value="All">All Medical Specialties</option>
              {popularSpecialties
                .filter((s) => s !== 'All')
                .map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quick Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            Specialties:
          </span>
          {popularSpecialties.map((spec) => {
            const isSelected = selectedSpecialty.toLowerCase() === spec.toLowerCase();
            return (
              <button
                key={spec}
                type="button"
                onClick={() => {
                  setSelectedSpecialty(spec);
                  if (searchTab === 'nearby' && userCoords) {
                    fetchGooglePlacesDoctors({
                      mode: 'nearby',
                      lat: userCoords.lat,
                      lng: userCoords.lng,
                      radiusKm: searchRadiusKm,
                      specialty: spec !== 'All' ? spec : undefined
                    });
                  } else {
                    fetchGooglePlacesDoctors({
                      mode: 'text',
                      query: `${selectedCityName !== 'All' ? selectedCityName : ''} ${selectedCountryName}`,
                      specialty: spec !== 'All' ? spec : undefined
                    });
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0E3B36] text-white shadow-xs'
                    : 'bg-[#FBF8F2] border border-[#E8E2D8] text-stone-700 hover:border-[#0E3B36]'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEARCH RESULTS HEADER & API STATUS                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600">
          <span className="font-bold uppercase tracking-wider text-stone-900 text-xs">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor Available' : 'Doctors Available'}
          </span>

          {searchTab === 'nearby' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#0E3B36] font-semibold text-xs border border-[#C4DFD3]">
              <Navigation className="w-3 h-3 text-[#0E3B36]" />
              Nearby Mode ({searchRadiusKm >= 250 ? 'All' : `${searchRadiusKm} km`})
            </span>
          )}

          {searchTab === 'country' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs border border-stone-200">
              <Globe className="w-3 h-3 text-stone-500" />
              {currentCountry.flag} {selectedCountryName}
              {selectedCityName !== 'All' ? ` • ${selectedCityName}` : ' (All Cities)'}
            </span>
          )}

          {searchTab === 'worldwide' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold text-xs border border-amber-200">
              <Compass className="w-3 h-3 text-amber-700" />
              Worldwide Search
            </span>
          )}

          {selectedSpecialty !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-semibold text-xs border border-emerald-200">
              <Stethoscope className="w-3 h-3 text-emerald-700" />
              {selectedSpecialty}
            </span>
          )}
        </div>

        {/* Data Source Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500">
          {isLoadingApi ? (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Querying Google Places...
            </span>
          ) : apiSourceStatus.usingLiveGmp ? (
            <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Google Places Live API Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-stone-700 font-bold bg-[#E8F3EE] px-2.5 py-0.5 rounded-full border border-[#C4DFD3]">
              <Sparkles className="w-3 h-3 text-[#0E3B36]" />
              <span>⚡ Fallback Mock Data Active</span>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(true)}
                className="text-[#0E3B36] font-bold underline hover:text-[#B08D57] ml-0.5 cursor-pointer text-[10px]"
              >
                (Connect Live Key)
              </button>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DOCTORS CARDS GRID LISTING                                                */}
      {/* ========================================================================= */}
      {filteredDoctors.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredDoctors.slice(0, displayLimit).map((doc) => {
              const hasDistance = doc.distanceKm !== undefined && doc.distanceKm !== null;
              const isCopied = copiedPhoneId === doc.id;
              const isLiveGmp = doc.source === 'Google Places API';
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${doc.name} ${doc.clinicOrHospital} ${doc.address || doc.city}`
              )}`;

              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#0E3B36] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 inset-x-0 h-1 ${
                    isLiveGmp ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500/40 via-[#B08D57]/40 to-emerald-500/40'
                  }`} />

                  <div className="space-y-3 pt-1">
                    {/* Specialty & Proximity Distance Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#0E3B36] border border-[#C4DFD3] truncate max-w-[65%]">
                        {doc.specialty}
                      </span>

                      {hasDistance ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/50 shrink-0">
                          <Navigation className="w-3 h-3 text-emerald-700" />
                          ~{doc.distanceKm} km away
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FBF8F2] text-stone-700 border border-[#E8E2D8] shrink-0">
                          {doc.city}
                        </span>
                      )}
                    </div>

                    {/* Doctor Name & Qualifications */}
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E3B36] group-hover:text-[#B08D57] transition leading-snug">
                          {doc.name}
                        </h3>
                        {isLiveGmp ? (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded shrink-0">
                            Google Live
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
                            Sample Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5B6577] mt-0.5 line-clamp-1">
                        {doc.qualifications} • {doc.experienceYears} yrs clinical experience
                      </p>
                    </div>

                    {/* Clinic, Address, Phone & Schedule */}
                    <div className="space-y-2 text-xs text-stone-600 pt-1">
                      {/* Clinic or Hospital */}
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-[#0E3B36] shrink-0 mt-0.5" />
                        <span className="font-semibold text-stone-900 line-clamp-1">
                          {doc.clinicOrHospital}
                        </span>
                      </div>

                      {/* Address / Location */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-stone-700">
                          {doc.address ? `${doc.address}` : `${doc.area ? `${doc.area}, ` : ''}${doc.city}, ${doc.country}`}
                        </span>
                      </div>

                      {/* Phone Contact with Click & Copy */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a
                            href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                            className="font-mono font-semibold text-[#0E3B36] hover:underline"
                          >
                            {doc.phone}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(doc.id, doc.phone)}
                          title="Copy phone number"
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Available Days */}
                      <div className="flex items-center gap-2 text-stone-500">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Available: {doc.availableDays ? doc.availableDays.join(', ') : 'Daily'}</span>
                      </div>
                    </div>

                    {/* Consultation Fee & Star Rating */}
                    <div className="pt-2.5 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-stone-400 block font-semibold">Consultation</span>
                        <span className="font-bold text-[#101827]">{doc.consultationFee}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#B08D57] font-bold">
                        <Star className="w-4 h-4 fill-current text-[#B08D57]" />
                        <span>{doc.rating}</span>
                        <span className="text-[11px] text-stone-400 font-normal">({doc.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Book / Record Visit & Google Maps Directions */}
                  <div className="mt-4 pt-3 border-t border-[#E8E2D8] grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onBookOrVisit && onBookOrVisit(doc)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Record Visit</span>
                    </button>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white border border-[#E8E2D8] hover:border-[#0E3B36] text-[#0E3B36] text-xs font-bold shadow-2xs hover:shadow-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Pagination */}
          {displayLimit < filteredDoctors.length && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 12)}
                className="px-6 py-2.5 rounded-lg bg-white border border-[#E8E2D8] hover:border-[#0E3B36] text-xs sm:text-sm font-bold text-[#0E3B36] hover:bg-[#E8F3EE] transition shadow-xs cursor-pointer"
              >
                Load More Doctors ({filteredDoctors.length - displayLimit} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E2D8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-[#0E3B36] flex items-center justify-center mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            No Doctors Found Matching Your Criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try expanding your search radius, selecting a different city or country, or resetting the filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B36] text-white text-xs font-bold shadow-xs hover:bg-[#092824] transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Search Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
