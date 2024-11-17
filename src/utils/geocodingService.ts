interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&q=${encodeURIComponent(address)},Switzerland` +
      `&countrycodes=ch&addressdetails=1&limit=1`,
      {
        headers: {
          'User-Agent': 'EstimationImmo/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const results = await response.json();
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function extractNeighborhood(result: GeocodingResult): string | null {
  const address = result.address;
  return address.neighbourhood || 
         address.suburb || 
         address.municipality || 
         address.village || 
         address.town || 
         address.city || 
         null;
}

export async function validateSwissAddress(address: string): Promise<boolean> {
  const result = await geocodeAddress(address);
  return result !== null;
}