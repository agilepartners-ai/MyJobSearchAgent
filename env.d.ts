declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_JSEARCH_API_KEY: string;
    NEXT_PUBLIC_JSEARCH_API_HOST: string;
    NEXT_PUBLIC_RESUME_API_BASE_URL: string;
    NEXT_PUBLIC_RESUME_API_MODEL_TYPE: string;
    NEXT_PUBLIC_RESUME_API_MODEL: string;
    NEXT_PUBLIC_OPENAI_API_KEY: string;
  }
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const value: any;
  export default value;
}
