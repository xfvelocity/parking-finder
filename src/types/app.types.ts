export interface SelectOption {
  text: string;
  value: any;
}

export interface ConfigSnackbar {
  text: string;
  background: string;
  icon: string;
}

export interface ConfigStore {
  snackbar: ConfigSnackbar;
}
