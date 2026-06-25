const API_BASE_URL = "http://localhost:3000/api/v1";

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

// MOCK DATA Fallbacks
const MOCK_GAMES: Game[] = [
  {
    idJuego: "g1",
    titulo: "Elden Ring",
    slug: "elden-ring",
    descripcion: "Un colosal RPG de acción y mundo abierto ambientado en las Tierras Intermedias, un nuevo universo de fantasía creado por Hidetaka Miyazaki y George R. R. Martin.",
    fechaLanzamiento: "2022-02-25",
    desarrollador: "FromSoftware",
    editor: "Bandai Namco Entertainment",
    imagenPortada: "https://picsum.photos/seed/eldenring/400/600",
    bannerUrl: "https://picsum.photos/seed/eldenringbanner/1200/500",
    destacado: true,
  },
  {
    idJuego: "g2",
    titulo: "Grand Theft Auto VI",
    slug: "grand-theft-auto-vi",
    descripcion: "Grand Theft Auto VI viaja al estado de Leonida, hogar de las calles impregnadas de neón de Vice City y más allá, en la evolución más grande y envolvente de la serie GTA hasta la fecha.",
    fechaLanzamiento: "2025-10-25",
    desarrollador: "Rockstar North",
    editor: "Rockstar Games",
    imagenPortada: "https://picsum.photos/seed/gtavi/400/600",
    bannerUrl: "https://picsum.photos/seed/gtavibanner/1200/500",
    destacado: true,
  },
  {
    idJuego: "g3",
    titulo: "God of War Ragnarök",
    slug: "god-of-war-ragnarok",
    descripcion: "Embárcate en un viaje épico y entrañable mientras Kratos y Atreus luchan contra dioses nórdicos en una aventura sobre la familia, el destino y el fin del mundo.",
    fechaLanzamiento: "2022-11-09",
    desarrollador: "Santa Monica Studio",
    editor: "Sony Interactive Entertainment",
    imagenPortada: "https://picsum.photos/seed/gowr/400/600",
    bannerUrl: "https://picsum.photos/seed/gowrbanner/1200/500",
    destacado: true,
  },
  {
    idJuego: "g4",
    titulo: "Cyberpunk 2077: Phantom Liberty",
    slug: "cyberpunk-2077-phantom-liberty",
    descripcion: "Phantom Liberty es un thriller de espionaje ambientado en Dogtown, un nuevo distrito de Night City. Asume el rol de V junto a Solomon Reed en una misión para salvar a la presidenta de la NUS.",
    fechaLanzamiento: "2023-09-26",
    desarrollador: "CD Projekt Red",
    editor: "CD Projekt",
    imagenPortada: "https://picsum.photos/seed/cyberpunk/400/600",
    bannerUrl: "https://picsum.photos/seed/cyberpunkbanner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g5",
    titulo: "The Legend of Zelda: Tears of the Kingdom",
    slug: "zelda-tears-of-the-kingdom",
    descripcion: "La continuación de Breath of the Wild. El vasto mundo de Hyrule se expande al cielo con islas flotantes y las profundidades subterráneas. Usa los nuevos poderes Ultrahand, Fuse y Recall.",
    fechaLanzamiento: "2023-05-12",
    desarrollador: "Nintendo EPD",
    editor: "Nintendo",
    imagenPortada: "https://picsum.photos/seed/zeldatotk/400/600",
    bannerUrl: "https://picsum.photos/seed/zeldatotkbanner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g6",
    titulo: "Resident Evil 4",
    slug: "resident-evil-4-remake",
    descripcion: "El clásico de supervivencia y horror reimaginado. Leon S. Kennedy busca a la hija del presidente en una aldea rural europea infestada de parásitos. Gráficos de nueva generación y terror absoluto.",
    fechaLanzamiento: "2023-03-24",
    desarrollador: "Capcom",
    editor: "Capcom",
    imagenPortada: "https://picsum.photos/seed/re4remake/400/600",
    bannerUrl: "https://picsum.photos/seed/re4remakebanner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g7",
    titulo: "Forza Motorsport",
    slug: "forza-motorsport-2023",
    descripcion: "La nueva generación de Forza Motorsport. Compite en más de 20 circuitos reales, personaliza más de 500 autos con daño dinámico y condiciones climáticas en tiempo real.",
    fechaLanzamiento: "2023-10-10",
    desarrollador: "Turn 10 Studios",
    editor: "Xbox Game Studios",
    imagenPortada: "https://picsum.photos/seed/forzams/400/600",
    bannerUrl: "https://picsum.photos/seed/forzamsbanner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g8",
    titulo: "Street Fighter 6",
    slug: "street-fighter-6",
    descripcion: "La sexta entrega de la icónica franquicia de lucha. Con el nuevo sistema Drive, World Tour mode, Battle Hub y un roster renovado que incluye personajes clásicos y nuevos guerreros.",
    fechaLanzamiento: "2023-06-02",
    desarrollador: "Capcom",
    editor: "Capcom",
    imagenPortada: "https://picsum.photos/seed/sf6/400/600",
    bannerUrl: "https://picsum.photos/seed/sf6banner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g9",
    titulo: "Starfield",
    slug: "starfield",
    descripcion: "El primer universo nuevo de Bethesda en 25 años. Explora más de 1.000 planetas, personaliza tu nave, recluta tripulación y decide el destino de la humanidad entre las estrellas.",
    fechaLanzamiento: "2023-09-06",
    desarrollador: "Bethesda Game Studios",
    editor: "Bethesda Softworks",
    imagenPortada: "https://picsum.photos/seed/starfield/400/600",
    bannerUrl: "https://picsum.photos/seed/starfieldbanner/1200/500",
    destacado: false,
  },
  {
    idJuego: "g10",
    titulo: "Hollow Knight: Silksong",
    slug: "hollow-knight-silksong",
    descripcion: "Hornet toma el protagonismo en esta esperada secuela del aclamado metroidvania. Explora un nuevo reino, domina artes de seda y combate en un mundo dibujado a mano.",
    fechaLanzamiento: "2025-06-12",
    desarrollador: "Team Cherry",
    editor: "Team Cherry",
    imagenPortada: "https://picsum.photos/seed/silksong/400/600",
    bannerUrl: "https://picsum.photos/seed/silksongbanner/1200/500",
    destacado: true,
  },
];

const MOCK_TRAILERS: Trailer[] = [
  {
    idTrailer: "t1",
    idJuego: "g1",
    titulo: "Tráiler Oficial de Lanzamiento",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailerelden/800/450",
    duracionSegundos: 185,
    vistas: 48000000,
    juego: { titulo: "Elden Ring" },
  },
  {
    idTrailer: "t2",
    idJuego: "g1",
    titulo: "Shadow of the Erdtree — Tráiler de la Expansión",
    tipo: "DLC",
    urlVideo: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailererdtree/800/450",
    duracionSegundos: 140,
    vistas: 22000000,
    juego: { titulo: "Elden Ring" },
  },
  {
    idTrailer: "t3",
    idJuego: "g2",
    titulo: "Tráiler 1 — Bienvenidos a Leonida",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailergta/800/450",
    duracionSegundos: 91,
    vistas: 200000000,
    juego: { titulo: "Grand Theft Auto VI" },
  },
  {
    idTrailer: "t4",
    idJuego: "g3",
    titulo: "Ragnarök — Tráiler de Revelación",
    tipo: "Cinematográfico",
    urlVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    urlPoster: "https://picsum.photos/seed/trailergow/800/450",
    duracionSegundos: 210,
    vistas: 35000000,
    juego: { titulo: "God of War Ragnarök" },
  },
  {
    idTrailer: "t5",
    idJuego: "g4",
    titulo: "Phantom Liberty — Cinemática de Anuncio",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailercyber/800/450",
    duracionSegundos: 165,
    vistas: 18000000,
    juego: { titulo: "Cyberpunk 2077: Phantom Liberty" },
  },
  {
    idTrailer: "t6",
    idJuego: "g5",
    titulo: "Tears of the Kingdom — Tráiler Final",
    tipo: "Historia",
    urlVideo: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_5MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailerzelda/800/450",
    duracionSegundos: 195,
    vistas: 42000000,
    juego: { titulo: "The Legend of Zelda: Tears of the Kingdom" },
  },
  {
    idTrailer: "t7",
    idJuego: "g6",
    titulo: "Resident Evil 4 Remake — Tráiler de Lanzamiento",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_5MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailerre4/800/450",
    duracionSegundos: 150,
    vistas: 25000000,
    juego: { titulo: "Resident Evil 4" },
  },
  {
    idTrailer: "t8",
    idJuego: "g7",
    titulo: "Forza Motorsport — Reveal Trailer",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailerforza/800/450",
    duracionSegundos: 120,
    vistas: 11000000,
    juego: { titulo: "Forza Motorsport" },
  },
  {
    idTrailer: "t9",
    idJuego: "g9",
    titulo: "Starfield — Into the Starfield",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailerstarfield/800/450",
    duracionSegundos: 240,
    vistas: 20000000,
    juego: { titulo: "Starfield" },
  },
  {
    idTrailer: "t10",
    idJuego: "g10",
    titulo: "Hollow Knight: Silksong — Reveal Trailer",
    tipo: "Cinematográfico",
    urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
    urlPoster: "https://picsum.photos/seed/trailersilksong/800/450",
    duracionSegundos: 160,
    vistas: 30000000,
    juego: { titulo: "Hollow Knight: Silksong" },
  },
];

const MOCK_LAUNCHES: UpcomingLaunch[] = [
  {
    idLanzamiento: "l1",
    idJuego: "g2",
    fechaLanzamiento: "2025-10-25",
    ventanaLanzamiento: "Otoño 2025",
    descripcion: "El lanzamiento más esperado de la década. Vice City renace con un mundo abierto sin precedentes, protagonizado por Lucia.",
    bannerUrl: "https://picsum.photos/seed/gta6launch/1200/500",
    juego: MOCK_GAMES[1],
    reservado: false,
  },
  {
    idLanzamiento: "l2",
    idJuego: "g10",
    fechaLanzamiento: "2025-06-12",
    ventanaLanzamiento: "Primer Semestre 2025",
    descripcion: "El retorno más esperado del indie gaming. Hornet conquista un nuevo reino en este metroidvania magistral.",
    bannerUrl: "https://picsum.photos/seed/silksonglaunch/1200/500",
    juego: MOCK_GAMES[9],
    reservado: true,
  },
];

let mockSettings: UserSettings = {
  idConfig: "conf1",
  idUsuario: "u1",
  idioma: "es",
  tema: "dark",
  emailNotificaciones: true,
  notificacionesPush: true,
  controlParental: false,
  calidadVideo: "auto",
  tamanoTexto: "normal",
};

let mockFavorites: string[] = ["g1", "g2"];

// Helper fetch client with fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`API request to ${url} failed. Using mock fallback.`, error);
    if (fallbackData !== undefined) return fallbackData;
    throw error;
  }
}

export const api = {
  // QR Login Flow
  generateQrCode: async (): Promise<{ codigo: string; expiraEn: string }> => {
    return fetchWithFallback(
      `${API_BASE_URL}/qr-login/generate`,
      { method: "POST" },
      { codigo: "SPOT-TV6", expiraEn: new Date(Date.now() + 5 * 60 * 1000).toISOString() }
    );
  },

  checkQrStatus: async (codigo: string): Promise<{ estado: string; token: string | null }> => {
    // If it's a mock code, simulate approval after 8 seconds
    if (codigo === "SPOT-TV6") {
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

    return fetchWithFallback(
      `${API_BASE_URL}/qr-login/status/${codigo}`,
      {},
      { estado: "pendiente", token: null }
    );
  },

  // Games
  getGames: async (): Promise<Game[]> => {
    const response = await fetchWithFallback<{ data: Game[] }>(
      `${API_BASE_URL}/juegos?page=1&limit=20`,
      {},
      { data: MOCK_GAMES }
    );
    return response.data || MOCK_GAMES;
  },

  getGameById: async (id: string): Promise<Game> => {
    return fetchWithFallback<Game>(
      `${API_BASE_URL}/juegos/${id}`,
      {},
      MOCK_GAMES.find((g) => g.idJuego === id) || MOCK_GAMES[0]
    );
  },

  // Trailers
  getTrailers: async (): Promise<Trailer[]> => {
    return fetchWithFallback<Trailer[]>(
      `${API_BASE_URL}/trailers`,
      {},
      MOCK_TRAILERS
    );
  },

  // Upcoming Launches
  getUpcomingLaunches: async (): Promise<UpcomingLaunch[]> => {
    return fetchWithFallback<UpcomingLaunch[]>(
      `${API_BASE_URL}/proximos-lanzamientos`,
      {},
      MOCK_LAUNCHES
    );
  },

  reserveLaunch: async (idLanzamiento: string): Promise<{ status: string }> => {
    return fetchWithFallback(
      `${API_BASE_URL}/proximos-lanzamientos/${idLanzamiento}/reservar`,
      { method: "POST" },
      { status: "success" }
    );
  },

  // User Configurations Scoped to /me
  getSettings: async (): Promise<UserSettings> => {
    return fetchWithFallback<UserSettings>(
      `${API_BASE_URL}/me/configuracion`,
      {},
      mockSettings
    );
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    mockSettings = { ...mockSettings, ...settings };
    return fetchWithFallback<UserSettings>(
      `${API_BASE_URL}/me/configuracion`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      },
      mockSettings
    );
  },

  // Favorites
  getFavorites: async (): Promise<Game[]> => {
    const favGames = MOCK_GAMES.filter((g) => mockFavorites.includes(g.idJuego));
    return fetchWithFallback<Game[]>(
      `${API_BASE_URL}/me/favoritos`,
      {},
      favGames
    );
  },

  toggleFavorite: async (idJuego: string): Promise<{ status: string; favorited: boolean }> => {
    const index = mockFavorites.indexOf(idJuego);
    let favorited = false;
    if (index > -1) {
      mockFavorites.splice(index, 1);
    } else {
      mockFavorites.push(idJuego);
      favorited = true;
    }
    return fetchWithFallback(
      `${API_BASE_URL}/me/favoritos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJuego }),
      },
      { status: "success", favorited }
    );
  },
};
