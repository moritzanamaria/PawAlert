import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline,
  CircleMarker, Tooltip, useMap } from "react-leaflet";
import { CENTAR_OSIJEK } from "../constants";
import { dohvatiIkonu } from "../utils/mapHelpers";
import FormatDatuma from "./FormatDatuma";

const CRVENA = "#dc3545";
const STIL_LINIJE = { color: CRVENA, dashArray: "6 6" };
const STIL_TRAGA = { color: CRVENA, fillColor: CRVENA, fillOpacity: 0.9 };

const poz = ({ lokacija }) => [lokacija.lat, lokacija.lng];

function PrilagodiPogled({ tocke }) {
  const map = useMap();
  useEffect(() => {
  if (tocke.length === 1) map.setView(tocke[0], 16);
    else map.fitBounds(tocke, { padding: [30, 30] });
  }, [tocke, map]);
  return null;
}

export default function TragoviMapa({ prijava, tragovi }) {
 const poredani = useMemo(() => [...tragovi].sort((a, b) => a.datum.localeCompare(b.datum)), [tragovi]);
  const tocke = useMemo(() => [poz(prijava), ...poredani.map(poz)], [prijava, poredani]);

  return (
    <MapContainer
      center={CENTAR_OSIJEK}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <PrilagodiPogled tocke={tocke} />


        <Marker position={poz(prijava)} icon={dohvatiIkonu(prijava.tip_prijave)}>
          <Popup>
            Prijavljeno ovdje: <strong>{prijava.zivotinja_ime}</strong>
          </Popup>
        </Marker>
    
     <Polyline positions={poredani.map(poz)} pathOptions={STIL_LINIJE} />

    
      {poredani.map((t, i) => (
        <CircleMarker
          key={t.id}
          center={poz(t)}
          radius={11}
          pathOptions={{ color: "#dc3545", fillColor: "#dc3545", fillOpacity: 0.9 }}
        >
          <Tooltip
            permanent
            direction="center"
            className="bg-transparent border-0 shadow-none text-white fw-bold"
          >
            {i + 1}
          </Tooltip>
          <Popup>
            <div>{t.opis}</div>
            <small className="text-muted">
              <FormatDatuma datum={t.datum} />
            </small>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}