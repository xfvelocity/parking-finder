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
}

export interface SimpleParking {
  address: string;
  location: ParkingLocation;
  name: string;
  uuid: string;
  type: string;
  rating: number;
  matchingPrice?: number;
}

export interface Parking extends SimpleParking {
  info: ParkingInfo;
  prices: ParkingPrice[];
  openingHours: ParkingHours;
  pendingInfoByUser?: boolean;
  updatedByUuid: String;
  updatedAt: String;
}

export interface AddPrices {
  price: number;
  hours: number;
}

export interface NewParkingTimes {
  monday: NewParkingTime;
  tuesday: NewParkingTime;
  wednesday: NewParkingTime;
  thursday: NewParkingTime;
  friday: NewParkingTime;
  saturday: NewParkingTime;
  sunday: NewParkingTime;
}

export interface NewParkingTime {
  openingTime: string | string[];
  closingTime: string | string[];
  isOpen: boolean;
}

export interface NewParkingInfo {
  disabledSpaces: number | null;
  spaces: number | null;
}

export interface NewParking {
  openingHours: NewParkingTimes;
  info: NewParkingInfo;
  prices: AddPrices[];
}
