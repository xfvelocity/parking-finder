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

export interface MapStore {
  location: MapLocation;
  filters: MapFilters;
}
