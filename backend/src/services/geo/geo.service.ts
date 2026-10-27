import { IGeoProvider, LocationCoord, RouteResult } from './geo.interface.js';
import { OpenStreetMapProvider } from './osm.provider.js';
import { GoogleMapsProvider } from './google.provider.js';

export type GeoProviderType = 'osm' | 'google';

export class GeoService implements IGeoProvider {
  private currentProviderType: GeoProviderType;
  private osmProvider: OpenStreetMapProvider;
  private googleProvider: GoogleMapsProvider;

  constructor(preferredProvider: GeoProviderType = 'osm', googleApiKey: string = '') {
    this.currentProviderType = preferredProvider;
    this.osmProvider = new OpenStreetMapProvider();
    this.googleProvider = new GoogleMapsProvider(googleApiKey);
  }

  setProvider(provider: GeoProviderType) {
    this.currentProviderType = provider;
    console.log(`[AuriGo Geo] Proveedor de mapas cambiado a: ${provider.toUpperCase()}`);
  }

  getProvider(): IGeoProvider {
    return this.currentProviderType === 'google' ? this.googleProvider : this.osmProvider;
  }

  getCurrentProviderType(): GeoProviderType {
    return this.currentProviderType;
  }

  async searchAddress(query: string): Promise<LocationCoord[]> {
    return this.getProvider().searchAddress(query);
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    return this.getProvider().reverseGeocode(lat, lng);
  }

  async calculateRoute(origin: LocationCoord, destination: LocationCoord): Promise<RouteResult> {
    return this.getProvider().calculateRoute(origin, destination);
  }
}
