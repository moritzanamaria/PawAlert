import { differenceInDays } from "date-fns";
import { ZASTARJELO_DANA } from "../constants";

export const PRAZNI_FILTERI = {
  pretraga: "",
  vrsta: "",
  tip: "",
  oznake: "",
  status: "",
  samoHitne: false,
}

export function filtrirajPrijave(prijave = [], filteri = PRAZNI_FILTERI) {
  const { pretraga = "", vrsta = "", tip = "", oznake = "", status = "", samoHitne = false } = filteri
  const pojam = pretraga.toLowerCase()

  return prijave.filter((p) => {
    const ime = (p.zivotinja_ime || p.naziv || "").toLowerCase();
    const opisLokacije = (p.lokacija?.opis || p.lokacija_opis || p.opis || "").toLowerCase();
    const zadovoljavaPretragu = !pojam || ime.includes(pojam) || opisLokacije.includes(pojam)
    const zadovoljavaVrstu = !vrsta || String(p.zivotinja_vrsta) === String(vrsta)
    const zadovoljavaTip = !tip || String(p.tip_prijave) === String(tip)
    const zadovoljavaStatus = !status || p.status === status
    const zadovoljavaHitno = !samoHitne || Boolean(p.hitno);
    const zadovoljavaOznaku = !oznake || (p.oznake && p.oznake.some(o => {
      const idOznake = typeof o === "object" ? o.id : o;
      return String(idOznake) === String(oznake);
    }));
    return zadovoljavaPretragu && zadovoljavaVrstu && zadovoljavaTip && zadovoljavaStatus && zadovoljavaHitno && zadovoljavaOznaku;
  });
}

export function jeZastarjela(prijava) {
  if (prijava.status !== "otvorena" || !prijava.datum) return false
  return differenceInDays(new Date(), new Date(prijava.datum)) > ZASTARJELO_DANA
}