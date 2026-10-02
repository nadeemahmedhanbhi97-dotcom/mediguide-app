import { Doctor } from '../types.ts';
import { SEED_DOCTORS } from '../data/seedDoctors.ts';

export interface ProviderSource {
  id: string;
  name: string;
  country: string;
  type: 'demo_seed' | 'government_registry' | 'hospital_api' | 'official_association';
  description: string;
  isDemo: boolean;
  status: 'active' | 'configured' | 'adapter_ready' | 'pending_credentials';
  officialRegistryUrl?: string;
  licenseTerms?: string;
}

/**
 * Registry of provider data sources.
 * Demonstrates a scalable multi-country architecture where real provider APIs
 * can be plugged in alongside verified simulation seed datasets.
 */
export const REGISTERED_PROVIDER_SOURCES: ProviderSource[] = [
  {
    id: 'src-pk-pmc-sim',
    name: 'Pakistan Healthcare Provider Directory (Demo)',
    country: 'Pakistan',
    type: 'demo_seed',
    description: 'Seed directory of general physicians, cardiologists, pediatricians, and specialists across major Pakistani cities.',
    isDemo: true,
    status: 'active',
    officialRegistryUrl: 'https://pmc.gov.pk',
    licenseTerms: 'Fictional demo dataset for testing directory search and UI rendering.'
  },
  {
    id: 'src-us-npi-connector',
    name: 'US National Provider Identifier (NPI / NPPES Adapter)',
    country: 'United States',
    type: 'government_registry',
    description: 'Adapter connector for CMS NPPES NPI Registry API.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://npiregistry.cms.hhs.gov',
    licenseTerms: 'Public domain healthcare provider database from CMS.'
  },
  {
    id: 'src-uk-nhs-connector',
    name: 'UK NHS Digital ODS & Practitioner Registry',
    country: 'United Kingdom',
    type: 'official_association',
    description: 'NHS Organisation Data Service (ODS) and GMC verified specialist register.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://www.gmc-uk.org',
    licenseTerms: 'Open Government Licence v3.0.'
  },
  {
    id: 'src-tr-saglik-connector',
    name: 'Türkiye Sağlık Bakanlığı Directory Connector',
    country: 'Türkiye',
    type: 'government_registry',
    description: 'Ministry of Health public practitioner and hospital specialist directory.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://saglik.gov.tr',
    licenseTerms: 'Public information registry.'
  },
  {
    id: 'src-uae-dha-connector',
    name: 'UAE Dubai Health Authority (DHA / MOHAP) Registry',
    country: 'UAE',
    type: 'government_registry',
    description: 'DHA Sheryan and MOHAP licensed medical professionals directory.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://dha.gov.ae',
    licenseTerms: 'Public health licensing registry.'
  },
  {
    id: 'src-sa-scfhs-connector',
    name: 'Saudi Commission for Health Specialties (SCFHS)',
    country: 'Saudi Arabia',
    type: 'official_association',
    description: 'Mumaris Plus and SCFHS verified classification directory.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://scfhs.org.sa',
    licenseTerms: 'Official practitioner registry.'
  },
  {
    id: 'src-ca-cma-connector',
    name: 'Canada Medical Directory (CMA / CPSO Adapter)',
    country: 'Canada',
    type: 'official_association',
    description: 'Provincial college registers (CPSO, CPSBC, CPSA) practitioner connector.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://www.cpso.on.ca',
    licenseTerms: 'Public register of medical doctors.'
  },
  {
    id: 'src-au-ahpra-connector',
    name: 'Australia AHPRA Medical Board Register',
    country: 'Australia',
    type: 'government_registry',
    description: 'AHPRA public register of practitioners across NSW, Victoria, Queensland.',
    isDemo: true,
    status: 'adapter_ready',
    officialRegistryUrl: 'https://www.ahpra.gov.au',
    licenseTerms: 'AHPRA public register terms.'
  }
];

export interface SearchDoctorQuery {
  query?: string;
  country?: string;
  city?: string;
  area?: string;
  specialty?: string;
  userCoords?: { lat: number; lng: number };
  radiusKm?: number;
}

/**
 * Distance calculation utility
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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
