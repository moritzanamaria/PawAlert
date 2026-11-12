import L from "leaflet";

const BOJE = ["#0d6efd", "#dc3545", "#198754", "#fd7e14", "#6f42c1", "#ffc107", "#6c757d", "#212529"];

export function bojaTipa(tipId) {
  const stvarniId = typeof tipId === "object" && tipId !== null ? (tipId.id ?? tipId.tip_id) : tipId;
  const id = Number(stvarniId);
  return isNaN(id) ? "#6c757d" : BOJE[id % BOJE.length];
}

export function dohvatiIkonu(tipId) {
  const boja = bojaTipa(tipId);

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

export function parsirajKoordinate(p) {
  if (!p) return null;

  if (p.lokacija) {
    const lat = parseFloat(p.lokacija.lat);
    const lng = parseFloat(p.lokacija.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }

  const lat = parseFloat(p.lokacija_lat ?? p.lat);
  const lng = parseFloat(p.lokacija_lng ?? p.lng);

  if (!isNaN(lat) && !isNaN(lng)) {
    return [lat, lng];
  }

  if (Array.isArray(p.coordinates) && p.coordinates.length >= 2) {
    return [p.coordinates[1], p.coordinates[0]];
  }
  if (p.geometry && Array.isArray(p.geometry.coordinates) && p.geometry.coordinates.length >= 2) {
    return [p.geometry.coordinates[1], p.geometry.coordinates[0]];
  }

  return null;
}



export function podesiLeafletIkone() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}