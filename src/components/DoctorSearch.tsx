import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Globe,
  Star,
  Building2,
  Phone,
  Check,
  ChevronRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicOrHospital: string;
  area?: string;
  city: string;
  country: string;
  rating?: number;
  phone?: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
}

interface DoctorSearchProps {
  onBookOrVisit?: (doctor: Doctor) => void;
}

const MASTER_DOCTORS_DATABASE: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Ahmed',
    specialty: 'Cardiology',
    clinicOrHospital: 'Aga Khan University Hospital',
    area: 'Clifton',
    city: 'Karachi',
    country: 'Pakistan',
    rating: 4.9,
    phone: '+92 21 111 911 911',
    lat: 24.8607,
    lng: 67.0011
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatology',
    clinicOrHospital: 'Max Super Speciality Hospital',
    area: 'Saket',
    city: 'New Delhi',
    country: 'India',
    rating: 4.8,
    phone: '+91 11 2651 5050',
    lat: 28.5244,
    lng: 77.2188
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrics',
    clinicOrHospital: 'Harley Street Clinic',
    area: 'Marylebone',
    city: 'London',
    country: 'United Kingdom',
    rating: 4.9,
    phone: '+44 20 7935 7700',
    lat: 51.5186,
    lng: -0.1478
  },
  {
    id: 'doc-4',
    name: 'Dr. Muhammad Hassan',
    specialty: 'Neurology',
    clinicOrHospital: 'Shaukat Khanum Hospital',
    area: 'Johar Town',
    city: 'Lahore',
    country: 'Pakistan',
    rating: 4.7,
    phone: '+92 42 3590 5000',
    lat: 31.4697,
    lng: 74.2728
  }
];

const WORLDWIDE_LOCATIONS = [
  { name: 'Pakistan', cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'] },
  { name: 'India', cities: ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai'] },
  { name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham'] },
  { name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago'] }
];

const POPULAR_SPECIALTIES = [
  'All',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'General Physician'
];

const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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
  return R * c;
};

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ onBookOrVisit }) => {
  const [searchTab, setSearchTab] = useState<'nearby' | 'country' | 'worldwide'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(50);

  const [selectedCountryName, setSelectedCountryName] = useState('Pakistan');
  const [selectedCityName, setSelectedCityName] = useState('All');
  const [customAreaQuery, setCustomAreaQuery] = useState('');

  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [allDoctors] = useState<Doctor[]>(MASTER_DOCTORS_DATABASE);

  useEffect(() => {
    triggerNearbyGeolocation();
  }, []);

  const triggerNearbyGeolocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      () => {
        setLocationError('Unable to fetch live GPS location. Showing standard results.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const doctorsWithDistance = useMemo(() => {
    if (!userCoords) return allDoctors;

    return allDoctors.map((doc) => {
      if (doc.lat && doc.lng) {
        const dist = calculateHaversineDistance(userCoords.lat, userCoords.lng, doc.lat, doc.lng);
        return { ...doc, distanceKm: dist };
      }
      return doc;
    });
  }, [allDoctors, userCoords]);

  const filteredDoctors = useMemo(() => {
    return doctorsWithDistance.filter((doc) => {
      const matchesQuery =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clinicOrHospital.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      if (searchTab === 'nearby') {
        const matchesRadius = doc.distanceKm !== undefined ? doc.distanceKm <= searchRadiusKm : true;
        return matchesQuery && matchesSpecialty && matchesRadius;
      }

      if (searchTab === 'country') {
        const matchesCountry = doc.country.toLowerCase() === selectedCountryName.toLowerCase();
        const matchesCity =
          selectedCityName === 'All' ||
          doc.city.toLowerCase() === selectedCityName.toLowerCase();
        const matchesArea =
          !customAreaQuery ||
          (doc.area && doc.area.toLowerCase().includes(customAreaQuery.toLowerCase()));

        return matchesQuery && matchesSpecialty && matchesCountry && matchesCity && matchesArea;
      }

      if (searchTab === 'worldwide') {
        return matchesQuery && matchesSpecialty;
      }

      return matchesQuery && matchesSpecialty;
    }).sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  }, [
    doctorsWithDistance,
    searchQuery,
    selectedSpecialty,
    searchTab,
    searchRadiusKm,
    selectedCountryName,
    selectedCityName,
    customAreaQuery
  ]);

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setSelectedCityName('All');
    setCustomAreaQuery('');
    setSearchRadiusKm(50);
  };

  const currentCountryCities =
    WORLDWIDE_LOCATIONS.find((c) => c.name === selectedCountryName)?.cities || [];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E3B36]">
          Find & Book Doctors Worldwide
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Search verified medical practitioners near your location, by city, country, or globally.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm space-y-5">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4">
          <button
            type="button"
            onClick={() => setSearchTab('nearby')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              searchTab === 'nearby'
                ? 'bg-[#0E3B36] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Nearby GPS Search</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchTab('country')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              searchTab === 'country'
                ? 'bg-[#0E3B36] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>By Country & City</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchTab('worldwide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              searchTab === 'worldwide'
                ? 'bg-[#0E3B36] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Directory</span>
          </button>
        </div>

        {searchTab === 'nearby' && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <MapPin className="w-4 h-4 text-[#0E3B36]" />
                <span>
                  <strong>Location:</strong>{' '}
                  {userCoords
                    ? `Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}`
                    : 'Location not set'}
                </span>
              </div>

              <button
                type="button"
                onClick={triggerNearbyGeolocation}
                disabled={isLocating}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-[#0E3B36] text-[#0E3B36] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-stone-200/60">
              <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Radius:</span>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={searchRadiusKm}
                onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
                className="w-full accent-[#0E3B36] cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-[#0E3B36] min-w-[50px]">
                {searchRadiusKm} km
              </span>
            </div>

            {locationError && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        )}

        {searchTab === 'country' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Country:</label>
              <select
                value={selectedCountryName}
                onChange={(e) => {
                  setSelectedCountryName(e.target.value);
                  setSelectedCityName('All');
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
              >
                {WORLDWIDE_LOCATIONS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">City:</label>
              <select
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
              >
                <option value="All">All Cities</option>
                {currentCountryCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Area / Hospital:</label>
              <input
                type="text"
                value={customAreaQuery}
                onChange={(e) => setCustomAreaQuery(e.target.value)}
                placeholder="e.g. Clifton, Johar Town..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Doctor Name, Specialty, Clinic or Hospital..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {POPULAR_SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedSpecialty === spec
                    ? 'bg-[#0E3B36] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#0E3B36] flex items-center gap-2">
            <span>Verified Doctors</span>
            <span className="text-xs font-sans font-normal text-stone-500">
              ({filteredDoctors.length} results)
            </span>
          </h3>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-[#0E3B36] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-stone-800">No matching doctors found</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try increasing your radius slider or clearing search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.slice(0, displayLimit).map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-white border border-[#E8E2D8] transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0E3B36] leading-snug">{doc.name}</h4>
                      <p className="text-xs font-semibold text-emerald-700">{doc.specialty}</p>
                    </div>
                    {doc.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-800 text-[11px] font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{doc.clinicOrHospital}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">
                        {doc.area ? `${doc.area}, ` : ''}{doc.city}, {doc.country}
                      </span>
                    </div>

                    {doc.distanceKm !== undefined && (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium pt-1">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{doc.distanceKm.toFixed(1)} km away</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {doc.phone && (
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(doc.id, doc.phone!)}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                      title="Copy Phone Number"
                    >
                      {copiedPhoneId === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Phone className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onBookOrVisit?.(doc)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDoctors.length > displayLimit && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
              className="px-6 py-2.5 rounded-xl border border-stone-300 text-[#0E3B36] text-xs font-bold transition cursor-pointer bg-white"
            >
              Load More Doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
