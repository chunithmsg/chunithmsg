/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { z } from 'zod';

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.md';

export {};

const envSchema = z.object({
  GCLOUD_PROJECT: z.string(),
  GOOGLE_PROJECT_ID: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  ANALYZE: z.string(),
  FRONTEND_URL: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

declare global {
  namespace NodeJS {
    type NodeEnv = 'development' | 'production';
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
