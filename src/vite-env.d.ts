/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_DEFAULT_API: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
