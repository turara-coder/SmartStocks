// Minimal type declarations for @supabase/ssr to satisfy TypeScript until official types are resolved.
// NOTE: 必要最小限。公式型が利用可能になったら削除/置換してください。

declare module "@supabase/ssr" {
  import { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";

  interface CookieAdapter {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: Record<string, unknown>): void;
    remove(name: string, options?: Record<string, unknown>): void;
  }

  interface SSRClientOptions<Schema = unknown> {
    cookies?: CookieAdapter;
    global?: { headers?: Record<string, string> };
    options?: SupabaseClientOptions<Schema>;
  }

  // Server-side client (supports cookie adapter)
  export function createServerClient<Schema = unknown>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SSRClientOptions<Schema>,
  ): SupabaseClient<Schema>;

  // Browser client
  export function createBrowserClient<Schema = unknown>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: { global?: { headers?: Record<string, string> } } & {
      options?: SupabaseClientOptions<Schema>;
    },
  ): SupabaseClient<Schema>;
}
