const API_BASE_URL = "http://localhost:3000/api/v1";

// =========================================================================
// Auth token persistence
// =========================================================================
const TOKEN_KEY = "gs_token";
const USER_KEY = "gs_user";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getUser(): { idUsuario: string; nombre: string; username?: string; correo: string } | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setUser(user: { idUsuario: string; nombre: string; username?: string; correo: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// =========================================================================
// Interfaces
// =========================================================================

export interface Game {
  idJuego: string;
  titulo: string;
  slug: string;
  descripcion: string;
  fechaLanzamiento: string;
  desarrollador: string;
  editor: string;
  imagenPortada: string;
  bannerUrl: string;
  destacado: boolean;
  generos?: { genero: { nombre: string } }[];
  plataformas?: { plataforma: { nombre: string } }[];
}

export interface Trailer {
  idTrailer: string;
  idJuego: string;
  titulo: string;
  tipo: string;
  urlVideo: string;
  urlPoster: string;
  duracionSegundos: number;
  vistas: number;
  juego?: { titulo: string };
}

export interface UpcomingLaunch {
  idLanzamiento: string;
  idJuego: string;
  fechaLanzamiento: string;
  ventanaLanzamiento: string;
  descripcion: string;
  bannerUrl: string;
  juego: Game;
  reservado?: boolean;
}

export interface UserSettings {
  idConfig: string;
  idUsuario: string;
  idioma: string;
  tema: string;
  emailNotificaciones: boolean;
  notificacionesPush: boolean;
  controlParental: boolean;
  calidadVideo: string;
  tamanoTexto: string;
}

export interface Reserva {
  idReserva: string;
  idUsuario: string;
  idLanzamiento: string;
  fechaReserva: string;
}

// =========================================================================
// Fetch helper — injects auth token when present
// =========================================================================

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers, credentials: "omit" });
  if (!res.ok) {
    // 401 → token invalid/expired. Clear and bounce to login so views don't
    // keep firing authenticated requests with a stale token.
    if (res.status === 401) {
      clearToken();
      if (window.location.hash !== "#/") window.location.hash = "#/";
    }
    throw new Error(`HTTP Error: ${res.status}`);
  }
  return await res.json();
}

// =========================================================================
// API
// =========================================================================

export const api = {
  // =====================
  // Auth
  // =====================

  login: async (username: string, contrasena: string): Promise<{ token: string; usuario: { idUsuario: string; nombre: string; username?: string; correo: string } }> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, contrasena }),
      credentials: "omit",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Login failed (${res.status})`);
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.usuario);
    return data;
  },

  register: async (nombre: string, username: string, correo: string, contrasena: string): Promise<{ token: string; usuario: { idUsuario: string; nombre: string; username?: string; correo: string } }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, username, correo, contrasena }),
      credentials: "omit",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Registration failed (${res.status})`);
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.usuario);
    return data;
  },

  logout: async (): Promise<void> => {
    const token = getToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        credentials: "omit",
      }).catch(() => {});
    }
    clearToken();
  },

  isLoggedIn: (): boolean => getToken() !== null,

  getCurrentUser: () => getUser(),

  // =====================
  // QR Login Flow (SPOT-TV6 mock is a dev-only convenience)
  // =====================

  generateQrCode: async (): Promise<{ codigo: string; expiraEn: string }> => {
    try {
      return await apiFetch<{ codigo: string; expiraEn: string }>(
        `${API_BASE_URL}/qr-login/generate`,
        { method: "POST" }
      );
    } catch {
      // ponytail: SPOT-TV6 dev-only convenience so the login screen renders
      // without a running backend. Remove when backend QR pairing lands.
      if (import.meta.env.DEV) {
        console.warn("QR generate failed, using dev mock code SPOT-TV6");
        return { codigo: "SPOT-TV6", expiraEn: new Date(Date.now() + 5 * 60 * 1000).toISOString() };
      }
      throw new Error("No se pudo generar el código QR");
    }
  },

  checkQrStatus: async (codigo: string): Promise<{ estado: string; token: string | null }> => {
    // ponytail: SPOT-TV6 dev-only convenience so the login screen renders
    // without a running backend. Remove when backend QR pairing lands.
    if (import.meta.env.DEV && codigo === "SPOT-TV6") {
      const startTime = localStorage.getItem("qr_start_time");
      if (!startTime) {
        localStorage.setItem("qr_start_time", Date.now().toString());
        return { estado: "pendiente", token: null };
      }
      const elapsed = Date.now() - parseInt(startTime, 10);
      if (elapsed > 8000) {
        localStorage.removeItem("qr_start_time");
        return { estado: "aprobado", token: "mock-jwt-session-token" };
      }
      return { estado: "pendiente", token: null };
    }

    return apiFetch<{ estado: string; token: string | null }>(
      `${API_BASE_URL}/qr-login/status/${codigo}`,
      {}
    );
  },

  // =====================
  // Games
  // =====================

  getGames: async (): Promise<Game[]> => {
    const response = await apiFetch<{ data: Game[] }>(`${API_BASE_URL}/juegos?page=1&limit=20`, {});
    return response.data || [];
  },

  getGameById: async (id: string): Promise<Game> => {
    return apiFetch<Game>(`${API_BASE_URL}/juegos/${id}`, {});
  },

  // =====================
  // Trailers
  // =====================

  getTrailers: async (): Promise<Trailer[]> => {
    const response = await apiFetch<{ data: Trailer[] }>(`${API_BASE_URL}/trailers`, {});
    return response.data || [];
  },

  // =====================
  // Upcoming Launches
  // =====================

  getUpcomingLaunches: async (): Promise<UpcomingLaunch[]> => {
    const response = await apiFetch<{ data: UpcomingLaunch[] }>(`${API_BASE_URL}/proximos-lanzamientos`, {});
    const rawLaunches = response.data || [];
    if (!rawLaunches.length) return [];

    // Backend returns only { titulo, slug } for juego — enrich with full Game from games list
    const games = await api.getGames().catch(() => []);
    const gameMap = new Map(games.map((g) => [g.idJuego, g]));

    // Merge reservado from user's reservations (when authenticated)
    let reservadoIds = new Set<string>();
    if (getToken()) {
      const reservations = await api.getReservations().catch(() => []);
      reservadoIds = new Set(reservations.map((r) => r.idLanzamiento));
    }

    return rawLaunches.map((l) => ({
      ...l,
      juego: gameMap.get(l.idJuego) ?? l.juego,
      reservado: reservadoIds.has(l.idLanzamiento) ? true : l.reservado ?? false,
    }));
  },

  // =====================
  // Reservations
  // =====================

  getReservations: async (): Promise<Reserva[]> => {
    const response = await apiFetch<{ data: Reserva[] }>(`${API_BASE_URL}/me/reservas`, {});
    return response.data || [];
  },

  reserveLaunch: async (idLanzamiento: string): Promise<{ status: string }> => {
    await apiFetch(`${API_BASE_URL}/me/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idLanzamiento }),
    });
    return { status: "success" };
  },

  cancelReservation: async (idLanzamiento: string): Promise<{ status: string }> => {
    await apiFetch(`${API_BASE_URL}/me/reservas/${idLanzamiento}`, { method: "DELETE" });
    return { status: "success" };
  },

  // =====================
  // User Settings
  // =====================

  getSettings: async (): Promise<UserSettings> => {
    return apiFetch<UserSettings>(`${API_BASE_URL}/me/configuracion`, {});
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    return apiFetch<UserSettings>(`${API_BASE_URL}/me/configuracion`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  },

  // =====================
  // Favorites
  // =====================

  getFavorites: async (): Promise<Game[]> => {
    const response = await apiFetch<{ data: any[] }>(`${API_BASE_URL}/me/favoritos`, {});
    // Backend returns Favorito[] with nested juego; extract Game[]
    return ((response.data || []) as any[]).map((f) => f.juego ?? f).filter(Boolean) as Game[];
  },

  toggleFavorite: async (idJuego: string, currentlyFavorited: boolean): Promise<{ status: string; favorited: boolean }> => {
    if (currentlyFavorited) {
      await apiFetch(`${API_BASE_URL}/me/favoritos/${idJuego}`, { method: "DELETE" });
      return { status: "success", favorited: false };
    } else {
      await apiFetch(`${API_BASE_URL}/me/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJuego }),
      });
      return { status: "success", favorited: true };
    }
  },
};
