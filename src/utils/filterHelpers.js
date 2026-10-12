export function dohvatiDostupneVrste(vrste) {
  if (!Array.isArray(vrste)) return [];
  return vrste.map((v) => v.naziv || v);
}

export function filtrirajPrijave(prijave, pretraga, odabranaVrsta) {
  if (!Array.isArray(prijave)) return [];

  return prijave.filter((p) => {
    const tekst = `${p.zivotinja_ime || ""} ${p.lokacija_opis || ""}`.toLowerCase();
    const zadovoljavaPretraga = tekst.includes(pretraga.toLowerCase());

    const trenutnaVrsta = p.zivotinja_vrsta || p.vrsta || "";
    const zadovoljavaVrstu = odabranaVrsta === "" || trenutnaVrsta === odabranaVrsta;

    return zadovoljavaPretraga && zadovoljavaVrstu;
  });
}