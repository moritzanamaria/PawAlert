import L from "leaflet";

const  kreirajIkonu = (emoji, bojaKlasa) =>
  L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div class="${bojaKlasa} rounded-circle d-flex align-items-center justify-content-center border border-2 border-white shadow" style="width: 38px; height: 38px; cursor: pointer;">
        <span style="font-size: 1.2rem; line-height: 1;">${emoji}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });

export const  VrstaIkone = {
  pas: kreirajIkonu("🐶", "bg-primary text-white"),
  mačka: kreirajIkonu("🐱", "bg-warning text-dark"),
  macka: kreirajIkonu("🐱", "bg-warning text-dark"),
  ptica: kreirajIkonu("🦜", "bg-info text-white"),
  ostalo: kreirajIkonu("🐾", "bg-secondary text-white"),
};