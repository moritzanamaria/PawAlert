export const RouteNames = {
  HOME: "/",
  PRIJAVE_PREGLED: "/prijave-pregled",
  PRIJAVA_NOVA: "/prijave/dodaj",
  PRIJAVA_PROMJENA: "/prijave/:id",

  TIPOVI_I_VRSTE_PREGLED: "/tip-i-vrste-pregled",

  TIP_NOVI: "/tip/dodaj",
  TIP_PROMJENA: "/tip/:id",

  VRSTA_NOVA: "/vrste/dodaj",
  VRSTA_PROMJENA: "/vrste/:id",

  TRAG_PREGLED: "/prijave/:id/tragovi",
  TRAG_NOVI: "/prijave/:id/tragovi/dodaj",
  TRAG_PROMJENA: "/tragovi/:id",

  KATALOG: "/katalog",
  DETALJI_SLUCAJA: '/detalji-slucaja/:id',

  OZNAKE_PREGLED: "/oznake",
  OZNAKA_NOVA: "/oznake/nova",
  OZNAKA_PROMJENA: "/oznake/promjena/:id",

  OPERATERI: '/operateri',
  OPERATERI_NOVI: '/operateri/novi',
  OPERATERI_PROMJENA: '/operateri/:id',
  OPERATERI_PROMJENA_LOZINKE: '/operateri/:id/lozinka',

  GENERIRANJE_PODATAKA: '/generiranje-podatka',

  LOGIN: '/login',
  REGISTRACIJA: '/registracija',

  NADZORNA_PLOCA: '/nadzorna-ploca',
  MOJ_PROFIL: '/moj-profil'
};

export const putanja = (ruta, id) => ruta.replace(":id", id);

export const CENTAR_OSIJEK = [45.5550, 18.6955];

export const IME_APLIKACIJE = 'PawAlert'

export const ZASTARJELO_DANA = 30

export const MAX_PRIJAVA = 500

export const SLIKE_URL = import.meta.env.DEV
  ? "http://localhost:8000/backend"
  : "https://edunova33.origo.hr/backend";

// localStorage   memorija
export const DATA_SOURCE = 'localStorage'