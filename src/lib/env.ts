import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_GNSS_API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

const resolveNetlifyUrl = (): string | undefined =>
  process.env.DEPLOY_PRIME_URL ??
  process.env.DEPLOY_URL ??
  process.env.URL;

const fallbackAppUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  resolveNetlifyUrl() ??
  "http://localhost:3000";

const fallbackNextAuthUrl =
  process.env.NEXTAUTH_URL ??
  fallbackAppUrl;

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: fallbackAppUrl,
  NEXT_PUBLIC_GNSS_API_URL:
    process.env.NEXT_PUBLIC_GNSS_API_URL ?? `${fallbackAppUrl.replace(/\/$/, "")}/api/v1/gnss`,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: fallbackNextAuthUrl,
});

export type Env = z.infer<typeof envSchema>;
