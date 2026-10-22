import L from "leaflet";

const BOJE = ["blue", "red", "green", "orange", "violet", "yellow", "grey", "black"];
const ikone = {};

function napraviIkonu(boja) {
  if (!ikone[boja]) {
    ikone[boja] = new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${boja}.png`,
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }
  return ikone[boja];
}

export function bojaTipa(tipId) {
  const id = Number(tipId);
  return isNaN(id) ? "grey" : BOJE[id % BOJE.length];
}

export function dohvatiIkonu(tipId) {
  return napraviIkonu(bojaTipa(tipId));
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