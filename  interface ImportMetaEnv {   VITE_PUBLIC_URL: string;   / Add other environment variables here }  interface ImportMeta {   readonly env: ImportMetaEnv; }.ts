/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}