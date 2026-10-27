export interface LocationCoord {
  lat: number;
  lng: number;
  address?: string;
  displayName?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry?: any;
  provider: 'osm' | 'google';
}

export interface IGeoProvider {
  searchAddress(query: string): Promise<LocationCoord[]>;
  reverseGeocode(lat: number, lng: number): Promise<string>;
  calculateRoute(origin: LocationCoord, destination: LocationCoord): Promise<RouteResult>;
}
