export function filtrirajPrijave(prijave = [], pretraga = "", odabranaVrsta = "", vrste = []) {
  return prijave.filter((p) => {
    const imeIliNaziv = (p.zivotinja_ime || p.naziv || "").toLowerCase();
    const opisLokacije = (p.lokacija_opis || p.opis || "").toLowerCase();
    const pojamPretrage = pretraga.toLowerCase();

    const zadovoljavaPretragu =
      !pojamPretrage ||
      imeIliNaziv.includes(pojamPretrage) ||
      opisLokacije.includes(pojamPretrage);

    let zadovoljavaVrstu = true;
    if (odabranaVrsta !== "") {
      const vrstaIdPrijave = p.vrsta_id || p.zivotinja_vrsta_id;
      const vrstaNazivPrijave = p.zivotinja_vrsta || p.vrsta;

      const odabraniObjekt = vrste.find((v) => String(v.id) === String(odabranaVrsta));

      if (odabraniObjekt) {
        zadovoljavaVrstu =
          String(vrstaIdPrijave) === String(odabraniObjekt.id) ||
          String(vrstaNazivPrijave).toLowerCase() === String(odabraniObjekt.naziv).toLowerCase();
      } else {
        zadovoljavaVrstu = String(vrstaIdPrijave) === String(odabranaVrsta);
      }
    }
    return zadovoljavaPretragu && zadovoljavaVrstu;
  });
}