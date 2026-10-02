export interface CityLocation {
  name: string;
  stateProvince?: string;
  lat: number;
  lng: number;
  popularDistricts?: string[];
}

export interface CountryLocation {
  name: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultLat: number;
  defaultLng: number;
  cities: CityLocation[];
}

export const WORLDWIDE_LOCATIONS: CountryLocation[] = [
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    defaultLat: 30.3753,
    defaultLng: 69.3451,
    cities: [
      { name: 'Lahore', stateProvince: 'Punjab', lat: 31.5204, lng: 74.3587, popularDistricts: ['Gulberg', 'DHA', 'Johar Town', 'Model Town', 'Shadman', 'Faisal Town'] },
      { name: 'Karachi', stateProvince: 'Sindh', lat: 24.8607, lng: 67.0011, popularDistricts: ['Clifton', 'DHA', 'Gulshan-e-Iqbal', 'Saddar', 'North Nazimabad', 'PECHS'] },
      { name: 'Islamabad', stateProvince: 'Federal', lat: 33.6844, lng: 73.0479, popularDistricts: ['Blue Area', 'F-8', 'G-11', 'F-10', 'E-11', 'I-8'] },
      { name: 'Rawalpindi', stateProvince: 'Punjab', lat: 33.5651, lng: 73.0169, popularDistricts: ['Saddar', 'Satellite Town', 'Bahria Town', 'Westridge'] },
      { name: 'Peshawar', stateProvince: 'Khyber Pakhtunkhwa', lat: 34.0151, lng: 71.5249, popularDistricts: ['Hayatabad', 'University Town', 'Saddar', 'Dabgari Gardens'] },
      { name: 'Quetta', stateProvince: 'Balochistan', lat: 30.1798, lng: 66.9750, popularDistricts: ['Cantonment', 'Jinnah Road', 'Zarghoon Road', 'Satellite Town'] },
      { name: 'Multan', stateProvince: 'Punjab', lat: 30.1575, lng: 71.5249, popularDistricts: ['Gulgasht Colony', 'Cantonment', 'Nishtar Road', 'Bosan Road'] },
      { name: 'Faisalabad', stateProvince: 'Punjab', lat: 31.4504, lng: 73.1350, popularDistricts: ['Civil Lines', 'Peoples Colony', 'Madina Town', 'D Ground'] },
      { name: 'Sibi', stateProvince: 'Balochistan', lat: 29.5448, lng: 67.8764, popularDistricts: ['City Center', 'Station Road', 'Hospital Road'] },
      { name: 'Hyderabad', stateProvince: 'Sindh', lat: 25.3960, lng: 68.3578, popularDistricts: ['Latifabad', 'Qasimabad', 'Saddar'] },
      { name: 'Gujranwala', stateProvince: 'Punjab', lat: 32.1877, lng: 74.1945, popularDistricts: ['Model Town', 'DC Colony', 'Wapda Town'] },
      { name: 'Sialkot', stateProvince: 'Punjab', lat: 32.4945, lng: 74.5229, popularDistricts: ['Cantonment', 'Paris Road', 'Kashmir Road'] },
      { name: 'Abbottabad', stateProvince: 'Khyber Pakhtunkhwa', lat: 34.1688, lng: 73.2215, popularDistricts: ['Mandian', 'Supply', 'Jinnahabad'] },
      { name: 'Bahawalpur', stateProvince: 'Punjab', lat: 29.3544, lng: 71.6911, popularDistricts: ['Model Town', 'Satellite Town'] }
    ]
  },
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    defaultLat: 37.0902,
    defaultLng: -95.7129,
    cities: [
      { name: 'New York', stateProvince: 'New York', lat: 40.7128, lng: -74.0060, popularDistricts: ['Manhattan', 'Brooklyn', 'Queens', 'Upper East Side'] },
      { name: 'Los Angeles', stateProvince: 'California', lat: 34.0522, lng: -118.2437, popularDistricts: ['Downtown', 'Beverly Hills', 'Santa Monica', 'Pasadena'] },
      { name: 'Chicago', stateProvince: 'Illinois', lat: 41.8781, lng: -87.6298, popularDistricts: ['Loop', 'Lincoln Park', 'Streeterville', 'Hyde Park'] },
      { name: 'Houston', stateProvince: 'Texas', lat: 29.7604, lng: -95.3698, popularDistricts: ['Texas Medical Center', 'Downtown', 'Galleria', 'Montrose'] },
      { name: 'Miami', stateProvince: 'Florida', lat: 25.7617, lng: -80.1918, popularDistricts: ['Downtown', 'Brickell', 'Coral Gables', 'Miami Beach'] },
      { name: 'San Francisco', stateProvince: 'California', lat: 37.7749, lng: -122.4194, popularDistricts: ['Mission', 'Financial District', 'Nob Hill', 'Marina'] },
      { name: 'Dallas', stateProvince: 'Texas', lat: 32.7767, lng: -96.7970, popularDistricts: ['Uptown', 'Medical District', 'Downtown'] },
      { name: 'Seattle', stateProvince: 'Washington', lat: 47.6062, lng: -122.3321, popularDistricts: ['First Hill', 'Downtown', 'Capitol Hill'] },
      { name: 'Boston', stateProvince: 'Massachusetts', lat: 42.3601, lng: -71.0589, popularDistricts: ['Longwood Medical Area', 'Back Bay', 'Beacon Hill'] }
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    defaultLat: 55.3781,
    defaultLng: -3.4360,
    cities: [
      { name: 'London', stateProvince: 'England', lat: 51.5074, lng: -0.1278, popularDistricts: ['Harley Street', 'Westminster', 'Camden', 'Kensington', 'Marylebone'] },
      { name: 'Birmingham', stateProvince: 'England', lat: 52.4862, lng: -1.8904, popularDistricts: ['Edgbaston', 'City Centre', 'Selly Oak'] },
      { name: 'Manchester', stateProvince: 'England', lat: 53.4808, lng: -2.2426, popularDistricts: ['Oxford Road Corridor', 'City Centre', 'Didsbury'] },
      { name: 'Edinburgh', stateProvince: 'Scotland', lat: 55.9533, lng: -3.1883, popularDistricts: ['New Town', 'Old Town', 'Leith'] },
      { name: 'Glasgow', stateProvince: 'Scotland', lat: 55.8642, lng: -4.2518, popularDistricts: ['West End', 'City Centre', 'Southside'] },
      { name: 'Liverpool', stateProvince: 'England', lat: 53.4084, lng: -2.9916, popularDistricts: ['Knowledge Quarter', 'City Centre'] }
    ]
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    defaultLat: 23.4241,
    defaultLng: 53.8478,
    cities: [
      { name: 'Dubai', stateProvince: 'Dubai', lat: 25.2048, lng: 55.2708, popularDistricts: ['Dubai Healthcare City', 'Jumeirah', 'Downtown', 'Deira', 'Marina'] },
      { name: 'Abu Dhabi', stateProvince: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, popularDistricts: ['Al Maryah Island', 'Al Danah', 'Khalidiya', 'Al Reem'] },
      { name: 'Sharjah', stateProvince: 'Sharjah', lat: 25.3463, lng: 55.4209, popularDistricts: ['Al Majaz', 'Al Qasimia', 'Al Nahda'] },
      { name: 'Al Ain', stateProvince: 'Abu Dhabi', lat: 24.2075, lng: 55.7447, popularDistricts: ['Al Jimi', 'Central District'] }
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR',
    defaultLat: 23.8859,
    defaultLng: 45.0792,
    cities: [
      { name: 'Riyadh', stateProvince: 'Riyadh', lat: 24.7136, lng: 46.6753, popularDistricts: ['Al Olaya', 'As Sulimaniyah', 'Al Malaz', 'King Fahd'] },
      { name: 'Jeddah', stateProvince: 'Makkah', lat: 21.4858, lng: 39.1925, popularDistricts: ['Al Rawdah', 'Al Zahra', 'Al Hamra', 'Al Andalus'] },
      { name: 'Mecca', stateProvince: 'Makkah', lat: 21.3891, lng: 39.8579, popularDistricts: ['Al Aziziyah', 'Al Shoqiyah', 'Al Rusayfah'] },
      { name: 'Medina', stateProvince: 'Madinah', lat: 24.5247, lng: 39.5692, popularDistricts: ['Al Qiblatayn', 'Al Iskan'] },
      { name: 'Dammam', stateProvince: 'Eastern', lat: 26.4207, lng: 50.0888, popularDistricts: ['Al Faisaliyah', 'Al Mazruiyah'] }
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    defaultLat: 56.1304,
    defaultLng: -106.3468,
    cities: [
      { name: 'Toronto', stateProvince: 'Ontario', lat: 43.6532, lng: -79.3832, popularDistricts: ['University Avenue (Hospital Row)', 'Downtown', 'North York'] },
      { name: 'Vancouver', stateProvince: 'British Columbia', lat: 49.2827, lng: -123.1207, popularDistricts: ['Downtown', 'Fairview', 'Kitsilano'] },
      { name: 'Montreal', stateProvince: 'Quebec', lat: 45.5017, lng: -73.5673, popularDistricts: ['Downtown', 'Plateau-Mont-Royal', 'Westmount'] },
      { name: 'Calgary', stateProvince: 'Alberta', lat: 51.0447, lng: -114.0719, popularDistricts: ['Downtown', 'Beltline', 'Sunnyside'] },
      { name: 'Ottawa', stateProvince: 'Ontario', lat: 45.4215, lng: -75.6972, popularDistricts: ['Centretown', 'ByWard Market'] }
    ]
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    defaultLat: -25.2744,
    defaultLng: 133.7751,
    cities: [
      { name: 'Sydney', stateProvince: 'New South Wales', lat: -33.8688, lng: 151.2093, popularDistricts: ['Macquarie Street Medical District', 'CBD', 'Surry Hills', 'Bondi'] },
      { name: 'Melbourne', stateProvince: 'Victoria', lat: -37.8136, lng: 144.9631, popularDistricts: ['Parkville Medical Precinct', 'Collins Street', 'Carlton', 'St Kilda'] },
      { name: 'Brisbane', stateProvince: 'Queensland', lat: -27.4698, lng: 153.0251, popularDistricts: ['Spring Hill', 'South Brisbane', 'Fortitude Valley'] },
      { name: 'Perth', stateProvince: 'Western Australia', lat: -31.9505, lng: 115.8605, popularDistricts: ['West Perth', 'CBD', 'Subiaco'] }
    ]
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    defaultLat: 20.5937,
    defaultLng: 78.9629,
    cities: [
      { name: 'New Delhi', stateProvince: 'Delhi', lat: 28.6139, lng: 77.2090, popularDistricts: ['Ansari Nagar (AIIMS)', 'South Extension', 'Connaught Place', 'Saket'] },
      { name: 'Mumbai', stateProvince: 'Maharashtra', lat: 19.0760, lng: 72.8777, popularDistricts: ['Bandra', 'South Mumbai', 'Andheri', 'Parel (KEM)'] },
      { name: 'Bengaluru', stateProvince: 'Karnataka', lat: 12.9716, lng: 77.5946, popularDistricts: ['Koramangala', 'Indiranagar', 'Jayanagar', 'Whitefield'] },
      { name: 'Chennai', stateProvince: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, popularDistricts: ['Greams Road', 'T. Nagar', 'Adyar', 'Anna Nagar'] },
      { name: 'Hyderabad', stateProvince: 'Telangana', lat: 17.3850, lng: 78.4867, popularDistricts: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Somajiguda'] }
    ]
  },
  {
    name: 'Türkiye',
    code: 'TR',
    flag: '🇹🇷',
    currency: 'TRY',
    currencySymbol: '₺',
    defaultLat: 38.9637,
    defaultLng: 35.2433,
    cities: [
      { name: 'Istanbul', stateProvince: 'Istanbul', lat: 41.0082, lng: 28.9784, popularDistricts: ['Şişli', 'Kadıköy', 'Beşiktaş', 'Bakırköy', 'Fatih'] },
      { name: 'Ankara', stateProvince: 'Ankara', lat: 39.9334, lng: 32.8597, popularDistricts: ['Çankaya', 'Kızılay', 'Yenimahalle'] },
      { name: 'Izmir', stateProvince: 'Izmir', lat: 38.4237, lng: 27.1428, popularDistricts: ['Konak', 'Bornova', 'Karşıyaka'] }
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    defaultLat: 51.1657,
    defaultLng: 10.4515,
    cities: [
      { name: 'Berlin', stateProvince: 'Berlin', lat: 52.5200, lng: 13.4050, popularDistricts: ['Mitte (Charité)', 'Charlottenburg', 'Prenzlauer Berg', 'Schöneberg'] },
      { name: 'Munich', stateProvince: 'Bavaria', lat: 48.1351, lng: 11.5820, popularDistricts: ['Altstadt', 'Schwabing', 'Maxvorstadt'] },
      { name: 'Frankfurt', stateProvince: 'Hesse', lat: 50.1109, lng: 8.6821, popularDistricts: ['Westend', 'Sachsenhausen', 'Nordend'] },
      { name: 'Hamburg', stateProvince: 'Hamburg', lat: 53.5511, lng: 9.9937, popularDistricts: ['Eppendorf', 'Altona', 'Eimsbüttel'] }
    ]
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    defaultLat: 46.2276,
    defaultLng: 2.2137,
    cities: [
      { name: 'Paris', stateProvince: 'Île-de-France', lat: 48.8566, lng: 2.3522, popularDistricts: ['5th Arr. (Latin Quarter)', '15th Arr.', '7th Arr.', '16th Arr.'] },
      { name: 'Lyon', stateProvince: 'Auvergne-Rhône-Alpes', lat: 45.7640, lng: 4.8357, popularDistricts: ['Presqu’île', 'Part-Dieu', 'Croix-Rousse'] },
      { name: 'Marseille', stateProvince: 'Provence-Alpes-Côte d’Azur', lat: 43.2965, lng: 5.3698, popularDistricts: ['Vieux-Port', 'Prado', 'La Timone'] }
    ]
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
    defaultLat: 4.2105,
    defaultLng: 101.9758,
    cities: [
      { name: 'Kuala Lumpur', stateProvince: 'Federal', lat: 3.1390, lng: 101.6869, popularDistricts: ['Bukit Bintang', 'Bangsar', 'Mont Kiara', 'Ampang'] },
      { name: 'George Town', stateProvince: 'Penang', lat: 5.4164, lng: 100.3327, popularDistricts: ['Gurney Drive', 'Georgetown Heritage', 'Bayan Lepas'] },
      { name: 'Johor Bahru', stateProvince: 'Johor', lat: 1.4927, lng: 103.7414, popularDistricts: ['City Centre', 'Mount Austin', 'Iskandar Puteri'] }
    ]
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    defaultLat: 1.3521,
    defaultLng: 103.8198,
    cities: [
      { name: 'Singapore', stateProvince: 'Central', lat: 1.3521, lng: 103.8198, popularDistricts: ['Orchard Road Medical', 'Novena Health City', 'Outram Road (SGH)', 'Jurong'] }
    ]
  },
  {
    name: 'Qatar',
    code: 'QA',
    flag: '🇶🇦',
    currency: 'QAR',
    currencySymbol: 'QR',
    defaultLat: 25.3548,
    defaultLng: 51.1839,
    cities: [
      { name: 'Doha', stateProvince: 'Doha', lat: 25.2854, lng: 51.5310, popularDistricts: ['West Bay', 'Hamad Medical City', 'Al Sadd', 'The Pearl'] },
      { name: 'Al Rayyan', stateProvince: 'Al Rayyan', lat: 25.2919, lng: 51.4244, popularDistricts: ['Education City', 'Al Luqta'] }
    ]
  },
  {
    name: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    currency: 'EGP',
    currencySymbol: 'E£',
    defaultLat: 26.8206,
    defaultLng: 30.8025,
    cities: [
      { name: 'Cairo', stateProvince: 'Cairo', lat: 30.0444, lng: 31.2357, popularDistricts: ['Zamalek', 'Nasr City', 'Maadi', 'Heliopolis', 'Qasr El Ayni'] },
      { name: 'Alexandria', stateProvince: 'Alexandria', lat: 31.2001, lng: 29.9187, popularDistricts: ['Smouha', 'Mansheya', 'Roushdy'] }
    ]
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R',
    defaultLat: -30.5595,
    defaultLng: 22.9375,
    cities: [
      { name: 'Johannesburg', stateProvince: 'Gauteng', lat: -26.2041, lng: 28.0473, popularDistricts: ['Sandton', 'Rosebank', 'Parktown'] },
      { name: 'Cape Town', stateProvince: 'Western Cape', lat: -33.9249, lng: 18.4241, popularDistricts: ['City Bowl', 'Claremont', 'Green Point'] }
    ]
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    defaultLat: 36.2048,
    defaultLng: 138.2529,
    cities: [
      { name: 'Tokyo', stateProvince: 'Tokyo', lat: 35.6762, lng: 139.6503, popularDistricts: ['Shinjuku', 'Ginza', 'Roppongi', 'Bunkyo (Tokyo Univ)'] },
      { name: 'Osaka', stateProvince: 'Osaka', lat: 34.6937, lng: 135.5023, popularDistricts: ['Umeda', 'Namba', 'Tennoji'] }
    ]
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    defaultLat: -14.2350,
    defaultLng: -51.9253,
    cities: [
      { name: 'São Paulo', stateProvince: 'São Paulo', lat: -23.5505, lng: -46.6333, popularDistricts: ['Paulista', 'Jardins', 'Pinheiros', 'Itaim Bibi'] },
      { name: 'Rio de Janeiro', stateProvince: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, popularDistricts: ['Copacabana', 'Ipanema', 'Botafogo'] }
    ]
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    defaultLat: 40.4637,
    defaultLng: -3.7492,
    cities: [
      { name: 'Madrid', stateProvince: 'Madrid', lat: 40.4168, lng: -3.7038, popularDistricts: ['Salamanca', 'Chamberí', 'Retiro'] },
      { name: 'Barcelona', stateProvince: 'Catalonia', lat: 41.3879, lng: 2.1699, popularDistricts: ['Eixample', 'Sarrià-Sant Gervasi', 'Gràcia'] }
    ]
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
    defaultLat: 41.8719,
    defaultLng: 12.5674,
    cities: [
      { name: 'Rome', stateProvince: 'Lazio', lat: 41.9028, lng: 12.4964, popularDistricts: ['Prati', 'Parioli', 'EUR'] },
      { name: 'Milan', stateProvince: 'Lombardy', lat: 45.4642, lng: 9.1900, popularDistricts: ['Brera', 'Navigli', 'Porta Nuova'] }
    ]
  }
];

/**
 * Finds the closest city in our worldwide registry based on latitude and longitude
 */
export function findClosestCity(lat: number, lng: number): { country: CountryLocation; city: CityLocation; distanceKm: number } {
  let closestCountry = WORLDWIDE_LOCATIONS[0];
  let closestCity = WORLDWIDE_LOCATIONS[0].cities[0];
  let minDistance = Infinity;

  const R = 6371; // Earth radius in km

  for (const country of WORLDWIDE_LOCATIONS) {
    for (const city of country.cities) {
      const dLat = ((city.lat - lat) * Math.PI) / 180;
      const dLng = ((city.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((city.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;

      if (dist < minDistance) {
        minDistance = dist;
        closestCountry = country;
        closestCity = city;
      }
    }
  }

  return {
    country: closestCountry,
    city: closestCity,
    distanceKm: Math.round(minDistance * 10) / 10
  };
}
