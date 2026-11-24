import L from "leaflet";

const BOJE = ["#0d6efd", "#dc3545", "#198754", "#fd7e14", "#6f42c1", "#ffc107", "#6c757d", "#212529"];

export function bojaTipa(tipId, tipovi = []) {
  if (tipId == null) return "#6c757d";
  const indeks = tipovi.findIndex((t) => String(t.id) === String(tipId));
  if (indeks !== -1) return BOJE[indeks % BOJE.length];
  let h = 0;
  for (const c of String(tipId)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return BOJE[h % BOJE.length];
}

export function dohvatiIkonu(tipId, tipovi = []) {
  const boja = bojaTipa(tipId, tipovi);

  return L.divIcon({
    className: "custom-map-marker",
    html: `<div style="
      background-color: ${boja};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}
