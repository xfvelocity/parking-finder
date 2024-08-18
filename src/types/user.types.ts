import type { MapLocation } from "./map.types";

export interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  uuid: string;
}

export interface UserStore {
  currentLocation: MapLocation;
  accessToken: string;
  user: User;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
