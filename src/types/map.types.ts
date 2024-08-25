export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapLocationResult {
  title: string;
  desc?: string;
  position: MapPosition;
}

export interface MapLocation {
  name: string;
  position: MapPosition;
}

export interface MapFilters {
  dateTime: MapFiltersDateTime;
}

export interface MapFiltersDateTime {
  from: string;
  hours: number;
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
  loading: boolean;
  recentSearches: MapLocationResult[];
}

export interface ParkingPrice {
  hours: number;
  originalHours: string;
  price: number;
  appPrice: boolean;
}

export interface ParkingLocation {
  type: string;
  coordinates: number[];
}

export interface ParkingHours {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface ParkingInfo {
  disabledSpaces: number;
  spaces: number;
  openingHours: ParkingHours;
}

export interface Parking {
  address: string;
  info: ParkingInfo;
  location: ParkingLocation;
  name: string;
  placeId: string;
  prices: ParkingPrice[];
  rating: number;
  type: string;
  _id: string;
}

export interface AddPrices {
  price: number;
  hours: number;
}
