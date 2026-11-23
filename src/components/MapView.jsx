import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CENTAR_OSIJEK, putanja, RouteNames } from "../constants";
import "leaflet/dist/leaflet.css";
import FormatDatuma from "./FormatDatuma";
import { dohvatiIkonu, bojaTipa } from "../utils/mapHelpers";
import { useEffect, useState } from "react";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import OznakeService from "../services/oznake/OznakeService";
import { Link } from "react-router-dom";
import BrandMark from "./BrandMark"

function useLista(propLista, service) {
  const [dohvaceno, setDohvaceno] = useState([]);
  const imaProp = propLista.length > 0;

  useEffect(() => {
    if (!imaProp) service.get().then((res) => setDohvaceno(res.data));
  }, [imaProp, service]);

  return imaProp ? propLista : dohvaceno;
}

const naziv = (lista, id) => lista.find((x) => String(x.id) === String(id))?.naziv;

function MapView({ prijave = [], vrste: propVrste = [], tipovi: propTipovi = [], oznake: propOznake = [] }) {
  const vrste = useLista(propVrste, VrsteService);
  const tipovi = useLista(propTipovi, TipService);
  const oznake = useLista(propOznake, OznakeService);


  return (
    <div className="card-body">
      <MapContainer center={CENTAR_OSIJEK} zoom={13} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        />
        {prijave.filter((p) => p.lokacija?.lat != null).map((p) => (
          <Marker key={p.id} position={[p.lokacija.lat, p.lokacija.lng]} icon={dohvatiIkonu(p.tip_prijave)} title={`${p.zivotinja_ime || "Prijava"} - ${naziv(tipovi, p.tip_prijave) ?? ""}`}>
            <Popup maxWidth={240}>
              <div>
                <strong>{p.zivotinja_ime}</strong>{" "}
                <Link
                  to={putanja(RouteNames.DETALJI_SLUCAJA, p.id)}
                  title="Pogledaj tragove"
                  aria-label={`Detalji: ${p.zivotinja_ime || "prijava"}`}
                  className="text-decoration-none fs-4 lh-1"
                >
                  <BrandMark size={28} valovi={false} />
                </Link>
                <br />
                <span>Vrsta: {naziv(vrste, p.zivotinja_vrsta)}</span>
                <br />
                <span>Tip: {naziv(tipovi, p.tip_prijave)}</span>
                <div className="d-flex flex-wrap gap-1 my-1">
                  {(p.oznake ?? []).map((id) => {
                    const o = oznake.find((x) => String(x.id) === String(id));
                    return (
                      o && (
                        <span
                          key={id}
                          className="badge"
                          style={{
                            backgroundColor: o.boja || "#6c757d",
                            color: o.boja_teksta || "#fff"
                          }}
                        >
                          {o.naziv}
                        </span>
                      )
                    );
                  })}
                </div>
                Lokacija: {p.lokacija.opis}
                <br />
                <small className="text-muted">
                  <FormatDatuma datum={p.datum} />
                </small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="d-flex flex-wrap gap-1 py-2 small">
        {tipovi.map((t) => (
          <div key={t.id} className="d-flex align-items-center m-1">
            <span className="legenda-tocka" style={{ backgroundColor: bojaTipa(t.id) }} />
            {t.naziv}
          </div>
        ))}
      </div>
    </div>

  );
}

export default MapView