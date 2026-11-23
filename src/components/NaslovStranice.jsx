import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { IME_APLIKACIJE, RouteNames } from "../constants";
import { pronadiStranicu } from "../utils/stranice";

export default function NaslovStranice() {
  const { pathname } = useLocation();
  const stranica = pronadiStranicu(pathname);
  const prethodna = useRef(pathname);

  useEffect(() => {
    document.title = stranica ? `${stranica.naslov} – ${IME_APLIKACIJE}` : IME_APLIKACIJE;

    if (prethodna.current === pathname) return;
    prethodna.current = pathname;

    document.getElementById("sadrzaj")?.focus({ preventScroll: true });
  }, [pathname, stranica]);

  if (!stranica || stranica.ruta === RouteNames.HOME) return null;

  return <h1 className="visually-hidden">{stranica.naslov}</h1>;
}
