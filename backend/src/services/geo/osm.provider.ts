import axios from 'axios';
import { IGeoProvider, LocationCoord, RouteResult } from './geo.interface.js';

export class OpenStreetMapProvider implements IGeoProvider {
  // Nominatim para geocodificación
  private nominatimUrl = 'https://nominatim.openstreetmap.org';
  // OSRM público para cálculo de rutas y distancias
  private osrmUrl = 'https://router.project-osrm.org';

  async searchAddress(query: string): Promise<LocationCoord[]> {
    try {
      const response = await axios.get(`${this.nominatimUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'User-Agent': 'AuriGo-RideSharing-App/1.0',
        },
      });

      return response.data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.display_name,
        displayName: item.name || item.display_name.split(',')[0],
      }));
    } catch (error) {
      console.error('Error buscando dirección en OSM:', error);
      return [];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await axios.get(`${this.nominatimUrl}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
        },
        headers: {
          'User-Agent': 'AuriGo-RideSharing-App/1.0',
        },
      });
      return response.data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error en geocodificación inversa OSM:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  async calculateRoute(origin: LocationCoord, destination: LocationCoord): Promise<RouteResult> {
    try {
      // OSRM acepta: lng,lat;lng,lat
      const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
      const response = await axios.get(`${this.osrmUrl}/route/v1/driving/${coords}`, {
        params: {
          overview: 'full',
          geometries: 'geojson',
        },
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMinutes = Math.round(route.duration / 60);

        return {
          distanceKm: distanceKm || 1, // Mínimo 1 km
          durationMinutes: durationMinutes || 5,
          geometry: route.geometry,
          provider: 'osm',
        };
      }
    } catch (error) {
      console.error('Error calculando ruta en OSM (OSRM):', error);
    }

    // Fallback con distancia haversine aproximada
    const haversineDist = this.calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    return {
      distanceKm: Math.max(1, Math.round(haversineDist * 10) / 10),
      durationMinutes: Math.max(5, Math.round((haversineDist / 25) * 60)), // estimado a 25 km/h en ciudad
      provider: 'osm',
    };
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1.3; // Factor 1.3 para aproximar distancia por calle
  }
}
