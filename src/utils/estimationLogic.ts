import type { PropertyData, PriceEstimate } from '../types';

const CANTON_MULTIPLIERS: { [key: string]: number } = {
  'Genève': 1.8,
  'Zürich': 1.7,
  'Zoug': 1.6,
  'Vaud': 1.5,
  'Bâle-Ville': 1.4,
  'Berne': 1.3,
  'Lucerne': 1.25,
  'Saint-Gall': 1.2,
  'Tessin': 1.15,
  'default': 1.0
};

// Prix moyen au m² par région (données 2024)
const REGIONAL_PRICES: { [key: string]: { [key: string]: number } } = {
  'Genève': {
    'Genève-Ville': 15000,
    'Carouge': 13500,
    'Vernier': 11000,
    'default': 12000
  },
  'Vaud': {
    'Lausanne': 12000,
    'Montreux': 11500,
    'Nyon': 12500,
    'default': 10000
  },
  'Zürich': {
    'Zürich': 14000,
    'Winterthur': 11000,
    'Uster': 10500,
    'default': 11000
  },
  'default': {
    'default': 8500
  }
};

const VIEW_MULTIPLIERS: { [key: string]: number } = {
  'Lac': 1.3,
  'Montagnes': 1.2,
  'Dégagée': 1.15,
  'Ville': 1.1,
  'Jardin': 1.05,
  'Standard': 1.0
};

const BASE_PRICE_PER_M2 = 8500; // Prix de base par m² en CHF

async function getRegionalPricePerM2(data: PropertyData): Promise<number> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.address)},${encodeURIComponent(data.city)},Switzerland&addressdetails=1`
    );
    const results = await response.json();

    if (results && results.length > 0) {
      const location = results[0];
      const canton = data.canton;
      const city = data.city;

      // Get canton-specific prices
      const cantonPrices = REGIONAL_PRICES[canton] || REGIONAL_PRICES['default'];
      
      // Get city-specific price or default for the canton
      return cantonPrices[city] || cantonPrices['default'];
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }

  // Fallback to canton-based pricing
  return BASE_PRICE_PER_M2 * (CANTON_MULTIPLIERS[data.canton] || CANTON_MULTIPLIERS.default);
}

export async function calculateEstimate(data: PropertyData): Promise<PriceEstimate> {
  const cantonMultiplier = CANTON_MULTIPLIERS[data.canton] || CANTON_MULTIPLIERS.default;
  const viewMultiplier = data.view ? VIEW_MULTIPLIERS[data.view] || 1.0 : 1.0;
  
  // Calcul de la dépréciation basée sur l'âge
  const age = new Date().getFullYear() - data.yearBuilt;
  const ageDepreciation = Math.max(0.7, 1 - (age * 0.005)); // Maximum 30% depreciation due to age

  // Multiplicateur pour les caractéristiques extérieures
  const exteriorMultiplier = 1.0 
    + (data.hasBalcony ? 0.05 : 0) 
    + (data.hasTerrace ? 0.08 : 0);

  let typeMultiplier = 1.0;
  switch (data.propertyType) {
    case 'apartment':
      typeMultiplier = 1.0 + (data.rooms * 0.05); // Bonus par pièce
      break;
    case 'house':
      typeMultiplier = 1.2 + (data.floors ? data.floors * 0.05 : 0); // Bonus par étage
      break;
    case 'villa':
      typeMultiplier = 1.4 + (data.bathrooms * 0.05); // Bonus par salle de bain
      break;
    case 'building':
      // Pour les immeubles, on prend en compte le nombre de lots et la moyenne des pièces
      const unitsBonus = data.buildingUnits ? (data.buildingUnits * 0.1) : 0;
      const roomsBonus = data.unitsRooms ? (data.unitsRooms * 0.05) : 0;
      typeMultiplier = 1.6 + unitsBonus + roomsBonus;
      break;
    case 'land':
      typeMultiplier = 0.8;
      break;
  }

  // Obtenir le prix régional au m²
  const regionalPricePerM2 = await getRegionalPricePerM2(data);
  
  // Calcul du prix de base
  let basePrice = regionalPricePerM2 * data.surface;

  // Application des multiplicateurs
  basePrice *= cantonMultiplier;
  basePrice *= typeMultiplier;
  basePrice *= viewMultiplier;
  basePrice *= exteriorMultiplier;

  // Application de la dépréciation pour tout sauf les terrains
  if (data.propertyType !== 'land') {
    basePrice *= ageDepreciation;
  }

  // Calcul de la fourchette de prix (+/- 10%)
  const minPrice = Math.round((basePrice * 0.9) / 1000) * 1000;
  const maxPrice = Math.round((basePrice * 1.1) / 1000) * 1000;

  return {
    basePrice: Math.round(basePrice / 1000) * 1000,
    minPrice,
    maxPrice,
    pricePerM2: Math.round(basePrice / data.surface),
    regionalPricePerM2: Math.round(regionalPricePerM2)
  };
}