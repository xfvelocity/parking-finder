import type { MapLocation } from "./map.types";

export interface User {
  email: string;
  emailVerified: boolean;
  uuid: string;
}

export interface UserStore {
  currentLocation: MapLocation;
  accessToken: string;
  user: User;
}
