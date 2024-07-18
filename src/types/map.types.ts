export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapLocationResult {
  text: string;
  value: MapPosition;
}

export interface MapLocation {
  name: string;
  position: MapPosition;
}

export interface MapFilters {
  hours: number[];
}

export interface MapBounds {
  left_corner_latitude: number;
  left_corner_longitude: number;
  right_corner_latitude: number;
  right_corner_longitude: number;
}

export interface MapStore {
  location: MapLocation;
  filters: MapFilters;
  bounds: MapBounds;
  mapZoom: number;
}
