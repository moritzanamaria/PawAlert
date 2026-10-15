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

        zadovoljavaVrstu = String(p.zivotinja_vrsta) === String(odabranaVrsta);
      }
    
    return zadovoljavaPretragu && zadovoljavaVrstu;
  });
}