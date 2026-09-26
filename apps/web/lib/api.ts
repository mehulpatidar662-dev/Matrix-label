import { calculateQuote, AnnotationType, TurnaroundSpeed } from './pricing';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;
  status: number;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.error?.message || 'An unexpected API error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.error?.code || 'unknown_error';
    this.details = payload.error?.details;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'annotator' | 'reviewer' | 'admin';
}

export interface QuoteEstimateResponse {
  currency: 'INR';
  labels_est: number;
  rate_paise: number;
  base_paise: number;
  discount_pct: number;
  discount_paise: number;
  surcharge_pct: number;
  surcharge_paise: number;
  total_paise: number;
}

export interface PublicStatsResponse {
  labels_delivered: number;
  avg_delivered_iou: number;
  spot_check_pct: number;
  first_sample_turnaround_hours: number;
  updated_at: string;
}

export interface SystemStatusResponse {
  status: 'operational' | 'degraded' | 'outage';
  components: {
    api: string;
    db: string;
    redis: string;
    storage: string;
    worker: string;
  };
}

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_REAL_API !== 'true';

const STORAGE_KEY_AUTH = 'matrixlabel_auth_user';

export function getClientSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setClientSession(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearClientSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  } catch {
    // ignore
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (USE_MOCKS) {
    return handleMockRequest<T>(path, init);
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data as ApiErrorPayload);
  }

  return data as T;
}

// In-memory + localStorage mock handler for offline demo mode
async function handleMockRequest<T>(path: string, init?: RequestInit): Promise<T> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 120));
  let body: any = {};
  if (init?.body) {
    try {
      body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    } catch {
      body = {};
    }
  }

  if (path === '/v1/public/stats') {
    return {
      labels_delivered: 10000000,
      avg_delivered_iou: 0.91,
      spot_check_pct: 5,
      first_sample_turnaround_hours: 48,
      updated_at: new Date().toISOString(),
    } as T;
  }

  if (path === '/v1/status') {
    return {
      status: 'operational',
      components: {
        api: 'operational',
        db: 'operational',
        redis: 'operational',
        storage: 'operational',
        worker: 'operational',
      },
    } as T;
  }

  if (path === '/v1/quotes/estimate') {
    const calc = calculateQuote(
      body.annotation_type as AnnotationType,
      body.images as number,
      body.turnaround as TurnaroundSpeed
    );
    return {
      currency: 'INR',
      labels_est: calc.labels,
      rate_paise: Math.round(calc.baseRate * 100),
      base_paise: calc.baseCost * 100,
      discount_pct: Math.round(calc.discountRate * 100),
      discount_paise: calc.discountAmount * 100,
      surcharge_pct: Math.round(calc.turnaroundRate * 100),
      surcharge_paise: calc.turnaroundAmount * 100,
      total_paise: calc.totalCost * 100,
    } as T;
  }

  if (path === '/v1/auth/register') {
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: body.name || 'Demo Client',
      email: body.email || 'client@matrixlabel.ai',
      role: 'client',
    };
    setClientSession(newUser);
    return newUser as T;
  }

  if (path === '/v1/auth/login') {
    const emailName = body.email ? body.email.split('@')[0].replace(/[._]/g, ' ') : 'Vision Engineering Lead';
    const capitalizedName = emailName
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const loggedInUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: capitalizedName || 'Vision Engineering Lead',
      email: body.email || 'lead@autonomy-systems.ai',
      role: 'client',
    };
    setClientSession(loggedInUser);
    return loggedInUser as T;
  }

  if (path === '/v1/auth/me') {
    const saved = getClientSession();
    if (!saved) {
      throw new ApiError(401, {
        error: { code: 'unauthorized', message: 'Not authenticated' },
      });
    }
    return saved as T;
  }

  if (path === '/v1/auth/logout') {
    clearClientSession();
    return {} as T;
  }

  if (path === '/v1/leads') {
    return { status: 'accepted' } as T;
  }

  return {} as T;
}
