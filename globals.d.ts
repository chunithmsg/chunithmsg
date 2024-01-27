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
  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_DB_URL: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_SENDER_ID: z.string(),
});

declare global {
  namespace NodeJS {
    type NodeEnv = 'development' | 'production';
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }

  // eslint-disable-next-line no-var, vars-on-top
  var firebase:
    | undefined
    | ReturnType<typeof import('firebase/app').initializeApp>;
}
