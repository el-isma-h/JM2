/**
 * Limiteur de débit en mémoire (fenêtre glissante), par processus. Suffisant pour un seul conteneur ;
 * à remplacer par un stockage partagé si l'app est un jour répliquée.
 *
 *   const loginLimiter = createRateLimiter({ limit: 5, windowMs: 15 * 60_000 });
 *   const r = loginLimiter.hit(`login:${ip}:${email}`);
 *   if (!r.allowed) return { error: `Réessayez dans ${Math.ceil(r.retryAfterMs / 60000)} min.` };
 */
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterMs: number };

export type RateLimiter = {
  hit(key: string, now?: number): RateLimitResult;
  reset(key: string): void;
};

export function createRateLimiter(opts: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>();
  const maxKeys = opts.maxKeys ?? 10_000;
  return {
    hit(key, now = Date.now()) {
      const since = now - opts.windowMs;
      const list = (hits.get(key) ?? []).filter((t) => t > since);
      if (list.length >= opts.limit) {
        hits.set(key, list);
        return { allowed: false, remaining: 0, retryAfterMs: list[0] + opts.windowMs - now };
      }
      list.push(now);
      hits.delete(key);
      hits.set(key, list);
      if (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
      return { allowed: true, remaining: opts.limit - list.length, retryAfterMs: 0 };
    },
    reset(key) {
      hits.delete(key);
    },
  };
}

/** Limiteurs partagés de l'application (un seul exemplaire par processus, même après rechargement à chaud). */
type G = typeof globalThis & { __nfiaLimiters?: Record<string, RateLimiter> };
export function sharedLimiter(name: string, opts: { limit: number; windowMs: number }): RateLimiter {
  const g = globalThis as G;
  g.__nfiaLimiters ??= {};
  return (g.__nfiaLimiters[name] ??= createRateLimiter(opts));
}
