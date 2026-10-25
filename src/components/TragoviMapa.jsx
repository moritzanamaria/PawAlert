import { useEffect, useMemo } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline,
  CircleMarker, Tooltip, useMap,
} from "react-leaflet";
import { CENTAR_OSIJEK } from "../constants";
import { podesiLeafletIkone, parsirajKoordinate } from "../utils/mapHelpers";
import FormatDatuma from "./FormatDatuma";

podesiLeafletIkone();

function PrilagodiPogled({ tocke }) {
  const map = useMap();
  useEffect(() => {
    if (tocke.length === 0) return;
    if (tocke.length === 1) map.setView(tocke[0], 16);
    else map.fitBounds(tocke, { padding: [30, 30] });
  }, [tocke, map]);
  return null;
}

export default function TragoviMapa({ prijava, tragovi }) {
  const pozicijaPrijave = useMemo(() => parsirajKoordinate(prijava), [prijava]);

  const poredaniTragovi = useMemo(
    () =>
      tragovi
        .map((t) => ({ trag: t, poz: parsirajKoordinate(t) }))
        .filter((x) => x.poz)
        .sort((a, b) => new Date(a.trag.datum) - new Date(b.trag.datum)),
    [tragovi]
  );

  const sveTocke = useMemo(() => {
    const t = poredaniTragovi.map((x) => x.poz);
    return pozicijaPrijave ? [pozicijaPrijave, ...t] : t;
  }, [poredaniTragovi, pozicijaPrijave]);

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
      <PrilagodiPogled tocke={sveTocke} />

      {pozicijaPrijave && (
        <Marker position={pozicijaPrijave}>
          <Popup>
            Prijavljeno ovdje: <strong>{prijava.zivotinja_ime || "Prijava"}</strong>
          </Popup>
        </Marker>
      )}

      {poredaniTragovi.length > 1 && (
        <Polyline
          positions={poredaniTragovi.map((x) => x.poz)}
          pathOptions={{ color: "#dc3545", dashArray: "6 6" }}
        />
      )}

      {poredaniTragovi.map((x, i) => (
        <CircleMarker
          key={x.trag.id}
          center={x.poz}
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
            <div>{x.trag.opis}</div>
            <small className="text-muted">
              <FormatDatuma datum={x.trag.datum} />
            </small>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}