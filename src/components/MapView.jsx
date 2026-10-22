import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CENTAR_OSIJEK } from "../constants";
import "leaflet/dist/leaflet.css";
import FormatDatuma from "./FormatDatuma";
import { podesiLeafletIkone, parsirajKoordinate, dohvatiIkonu } from "../utils/mapHelpers";
import { useEffect, useState } from "react";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import { bojaTipa } from "../utils/mapHelpers";

podesiLeafletIkone();

function MapView({ prijave = [], vrste: propVrste, tipovi: propTipovi }) {
  const [vrste, setVrste] = useState(propVrste || []);
  const [tipovi, setTipovi] = useState(propTipovi || []);

  useEffect(() => {
    if (!propVrste || propVrste.length === 0) {
      VrsteService.get()
        .then((res) => setVrste(res.data || res))
        .catch(() => { });
    } else {
      setVrste(propVrste);
    }

    if (!propTipovi || propTipovi.length === 0) {
      TipService.get()
        .then((res) => setTipovi(res.data || res))
        .catch(() => { });
    } else {
      setTipovi(propTipovi);
    }
  }, [propVrste, propTipovi]);

  const getNazivVrste = (idOrName) => {
    const vrsta = vrste.find((v) => v.id === Number(idOrName));
    return vrsta ? vrsta.naziv : idOrName;
  };

  const getNazivTipa = (idOrName) => {
    const tip = tipovi.find((t) => t.id === Number(idOrName));
    return tip ? tip.naziv : idOrName;
  };

  return (
    <div className="card-body p-0">
      <MapContainer center={CENTAR_OSIJEK} zoom={13} style={{ height: "550px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {prijave.map((p) => {
          const pozicija = parsirajKoordinate(p);
          if (!pozicija) return null;
          const vrstaVal = p.zivotinja_vrsta ?? p.vrsta_id ?? p.vrsta;
          const tipVal = p.tip_prijave ?? p.tip_id ?? p.tip;

          const nazivVrste = getNazivVrste(vrstaVal);
          const nazivTipa = getNazivTipa(tipVal);
          return (
            <Marker key={p.id} position={pozicija} icon={dohvatiIkonu(tipVal)}>
              <Popup>
                <div>
                  <strong>{p.zivotinja_ime || "Prijava"}</strong>
                  <br />
                  <span>Vrsta: {nazivVrste}</span>
                  <br />
                  <span>Tip: {nazivTipa}</span>
                  <br />
                  <span>Lokacija: {p.lokacija_opis || "-"}</span>
                  <br />
                  {p.datum && <small className="text-muted"><FormatDatuma datum={p.datum} /></small>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="d-flex flex-wrap gap-3 p-2 small">
  {tipovi.map((t) => (
    <span key={t.id}>
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: bojaTipa(t.id),
          marginRight: 6,
        }}
      />
      {t.naziv}
    </span>
  ))}
</div>
    </div>

  );
}

export default MapView