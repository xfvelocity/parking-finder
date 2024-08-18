export interface ApiLoginSuccess {
  uuid: string;
  name: string;
  email: string;
  accessToken: string;
  emailVerified: boolean;
}

export interface ApiLoginEmailNotVerified {
  uuid: string;
  emailVerified: boolean;
}
