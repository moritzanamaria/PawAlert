import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { CENTAR_OSIJEK} from "../constants";
import "leaflet/dist/leaflet.css";
import FormatDatuma from "./FormatDatuma";
import { podesiLeafletIkone, parsirajKoordinate, dohvatiIkonu } from "../utils/mapHelpers";

podesiLeafletIkone();

function MapView({ prijave = []}) {
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

          return (
            <Marker key={p.id || Math.random()} position={pozicija} icon={dohvatiIkonu(p.tip_id || p.tip)}>
              <Popup>
                <div>
                  <strong>{p.zivotinja_ime || "Prijava"}</strong>
                  <br />
                  <span>Vrsta: {p.zivotinja_vrsta || p.vrsta || "-"}</span>
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
      </div>
    
  );
}

export default MapView