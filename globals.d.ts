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
});

declare global {
  namespace NodeJS {
    type NodeEnv = 'development' | 'production';
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
