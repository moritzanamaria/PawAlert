import { matchPath } from "react-router-dom";
import { RouteNames } from "../constants";

const STRANICE = [
  { ruta: RouteNames.HOME, naslov: "Početna", uIzborniku: true },
  { ruta: RouteNames.KATALOG, naslov: "Katalog", uIzborniku: true },
  { ruta: RouteNames.NADZORNA_PLOCA, naslov: "Nadzorna ploča", uIzborniku: true },
  { ruta: RouteNames.MOJ_PROFIL, naslov: "Moj profil", uIzborniku: true },
  { ruta: RouteNames.PRIJAVE_PREGLED, naslov: "Pregled prijava", uIzborniku: true },
  { ruta: RouteNames.LOGIN, naslov: "Prijava", uIzborniku: true },
  { ruta: RouteNames.REGISTRACIJA, naslov: "Registracija", uIzborniku: true },

  { ruta: RouteNames.DETALJI_SLUCAJA, naslov: "Detalji slučaja" },
  { ruta: RouteNames.PRIJAVA_NOVA, naslov: "Nova prijava" },
  { ruta: RouteNames.TRAG_NOVI, naslov: "Novi trag" },
  { ruta: RouteNames.TRAG_PREGLED, naslov: "Tragovi prijave" },
  { ruta: RouteNames.PRIJAVA_PROMJENA, naslov: "Promjena prijave" },
  { ruta: RouteNames.TRAG_PROMJENA, naslov: "Promjena traga" },

  { ruta: RouteNames.TIPOVI_I_VRSTE_PREGLED, naslov: "Tipovi i vrste", sifrarnik: "Tipovi i vrste" },
  { ruta: RouteNames.TIP_NOVI, naslov: "Novi tip", sifrarnik: "Tipovi i vrste" },
  { ruta: RouteNames.TIP_PROMJENA, naslov: "Promjena tipa", sifrarnik: "Tipovi i vrste" },
  { ruta: RouteNames.VRSTA_NOVA, naslov: "Nova vrsta", sifrarnik: "Tipovi i vrste" },
  { ruta: RouteNames.VRSTA_PROMJENA, naslov: "Promjena vrste", sifrarnik: "Tipovi i vrste" },

  { ruta: RouteNames.OZNAKE_PREGLED, naslov: "Oznake", sifrarnik: "Oznake" },
  { ruta: RouteNames.OZNAKA_NOVA, naslov: "Nova oznaka", sifrarnik: "Oznake" },
  { ruta: RouteNames.OZNAKA_PROMJENA, naslov: "Promjena oznake", sifrarnik: "Oznake" },

  { ruta: RouteNames.OPERATERI, naslov: "Operateri", sifrarnik: "Operateri" },
  { ruta: RouteNames.OPERATERI_NOVI, naslov: "Novi operater", sifrarnik: "Operateri" },
  { ruta: RouteNames.OPERATERI_PROMJENA_LOZINKE, naslov: "Promjena lozinke", sifrarnik: "Operateri" },
  { ruta: RouteNames.OPERATERI_PROMJENA, naslov: "Promjena operatera", sifrarnik: "Operateri" },

  { ruta: RouteNames.GENERIRANJE_PODATAKA, naslov: "Generiranje podataka", sifrarnik: "Generiraj podatke" },
];

export function pronadiStranicu(pathname) {
  return STRANICE.find((s) => matchPath(s.ruta, pathname)) ?? null;
}
