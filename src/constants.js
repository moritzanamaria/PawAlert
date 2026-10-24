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

  GENERIRANJE_PODATAKA: '/generiranje-podatka',
};

export const putanja = (ruta, id) => ruta.replace(":id", id)

export const CENTAR_OSIJEK = [45.5550, 18.6955];

export const IME_APLIKACIJE = 'PawAlert'


// localStorage   memorija
export const DATA_SOURCE = 'localStorage'