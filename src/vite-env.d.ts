/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Maps JavaScript API key */
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  /** Base URL for the SafeSafar REST API backend */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
