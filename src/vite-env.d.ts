/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KOGO_IOS_URL?: string
  readonly VITE_KOGO_ANDROID_URL?: string
  readonly VITE_KOGO_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
