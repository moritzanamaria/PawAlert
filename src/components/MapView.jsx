import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CENTAR_OSIJEK, putanja, RouteNames } from "../constants";
import "leaflet/dist/leaflet.css";
import FormatDatuma from "./FormatDatuma";
import { podesiLeafletIkone, parsirajKoordinate, dohvatiIkonu, bojaTipa } from "../utils/mapHelpers";
import { useEffect, useState } from "react";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import OznakeService from "../services/oznake/OznakeService";
import "../App.css"
import { Link } from "react-router-dom";

podesiLeafletIkone();

function MapView({ prijave = [], vrste: propVrste, tipovi: propTipovi, oznake: propOznake }) {
  const [fetchedVrste, setFetchedVrste] = useState([]);
  const [fetchedTipovi, setFetchedTipovi] = useState([]);
  const [fetchedOznake, setFetchedOznake] = useState([]);

  useEffect(() => {
    if (!propVrste || propVrste.length === 0) {
      VrsteService.get()
        .then((res) => setFetchedVrste(res.data || res))
        .catch(() => { });
    }

    if (!propTipovi || propTipovi.length === 0) {
      TipService.get()
        .then((res) => setFetchedTipovi(res.data || res))
        .catch(() => { });
    }

    if (!propOznake || propOznake.length === 0) {
      OznakeService.get()
        .then((res) => setFetchedOznake(res.data || res))
        .catch(() => { });
    }

  }, [propVrste, propTipovi, propOznake]);

  const vrste = propVrste && propVrste.length > 0 ? propVrste : fetchedVrste;
  const tipovi = propTipovi && propTipovi.length > 0 ? propTipovi : fetchedTipovi;
  const oznake = propOznake && propOznake.length > 0 ? propOznake : fetchedOznake;

  const getNazivVrste = (idOrName) => {
    const vrsta = vrste.find((v) => v.id === Number(idOrName));
    return vrsta ? vrsta.naziv : idOrName;
  };

  const getNazivTipa = (idOrName) => {
    const tip = tipovi.find((t) => t.id === Number(idOrName));
    return tip ? tip.naziv : idOrName;
  };

  return (
    <div className="card-body">
      <MapContainer center={CENTAR_OSIJEK} zoom={13} style={{ height: "550px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
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
                  <Link
                    to={putanja(RouteNames.DETALJI_SLUCAJA, p.id)}
                    title="Pogledaj tragove"
                    className="text-decoration-none fs-4 lh-1"
                  >
                    🐾
                  </Link>
                  <br />
                  <span>Vrsta: {nazivVrste}</span>
                  <br />
                  <span>Tip: {nazivTipa}</span>

                  {p.oznake && p.oznake.length > 0 && (
                    <>
                      <br />
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {p.oznake.map((rawOznaka, idx) => {

                          const o = typeof rawOznaka === "object"
                            ? rawOznaka
                            : oznake.find((item) => Number(item.id) === Number(rawOznaka));

                          if (!o) return null;
                          return (
                            <span
                              key={o.id || idx}
                              className="badge"
                              style={{
                                backgroundColor: o.boja || "#6c757d",
                                color: o.boja_teksta || "#fff",
                                fontSize: "0.75rem",
                              }}
                            >
                              {o.naziv}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <br />
                  <span>Lokacija: {p.lokacija?.opis || p.lokacija_opis || "-"}</span>
                  <br />
                  {p.datum && <small className="text-muted"><FormatDatuma datum={p.datum} /></small>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="d-flex align-items-stretch p-2">
        {tipovi.map((t) => (
          <div key={t.id} className="m-1">
            <span
              className="legenda-tocka"
              style={{
                backgroundColor: bojaTipa(t.id) || "#6c757d",
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                marginRight: "6px"
              }}
            />
            <span>{t.naziv}</span>
          </div>
        ))}
      </div>
    </div>

  );
}

export default MapView