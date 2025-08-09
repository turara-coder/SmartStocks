// Supabase client (SSR + Client) using @supabase/ssr
import { createBrowserClient, createServerClient } from "@supabase/ssr";

// 最低限の CookieOptions フォールバック（公式型が提供されていない場合用）
export interface CookieOptions {
  domain?: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  httpOnly?: boolean;
}

// Minimal placeholder type. Replace with generated types:
// npx supabase gen types typescript --project-id <id> > src/types/database.ts
// and then: import type { Database } from "@/types/database";
export type Database = Record<string, unknown>;

/** Lightweight cookie interface adapter (Next.js headers() cookies互換) */
export interface ReadWriteCookies {
  get: (name: string) => { value: string } | undefined;
  set?: (name: string, value: string, options?: CookieOptions) => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClientBrowser = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars are not set");
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { "X-Client-Info": "smartstocks-web" } },
  });
};

// Helper for server components / route handlers (pass cookies() from next/headers)
export const createClientServer = (cookies: ReadWriteCookies) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars are not set");
  }
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        // cookies.set が存在する環境（Route Handler）でのみ実行
        cookies.set?.(name, value, options);
      },
      remove(name: string, options?: CookieOptions) {
        cookies.set?.(name, "", options);
      },
    },
  });
};
