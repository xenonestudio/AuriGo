import axios from 'axios';
import { IGeoProvider, LocationCoord, RouteResult } from './geo.interface.js';

export class GoogleMapsProvider implements IGeoProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchAddress(query: string): Promise<LocationCoord[]> {
    if (!this.apiKey) {
      console.warn('Google Maps API Key no provista. Verifique variables de entorno.');
      return [];
    }
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: query,
          key: this.apiKey,
        },
      });

      if (response.data.results) {
        return response.data.results.map((item: any) => ({
          lat: item.geometry.location.lat,
          lng: item.geometry.location.lng,
          address: item.formatted_address,
          displayName: item.formatted_address.split(',')[0],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error buscando dirección en Google Maps:', error);
      return [];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    if (!this.apiKey) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error geocodificación inversa Google Maps:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  async calculateRoute(origin: LocationCoord, destination: LocationCoord): Promise<RouteResult> {
    if (!this.apiKey) {
      return { distanceKm: 5, durationMinutes: 15, provider: 'google' };
    }
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode: 'driving',
          key: this.apiKey,
        },
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const leg = response.data.routes[0].legs[0];
        const distanceKm = Math.round((leg.distance.value / 1000) * 10) / 10;
        const durationMinutes = Math.round(leg.duration.value / 60);

        return {
          distanceKm: distanceKm || 1,
          durationMinutes: durationMinutes || 5,
          provider: 'google',
        };
      }
    } catch (error) {
      console.error('Error calculando ruta en Google Maps:', error);
    }

    return { distanceKm: 5, durationMinutes: 15, provider: 'google' };
  }
}
