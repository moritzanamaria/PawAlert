import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Form, Spinner } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import { CENTAR_OSIJEK } from "../constants";
import { podesiLeafletIkone } from "../utils/mapHelpers";

podesiLeafletIkone();

async function opisIzKoordinata(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=hr`
        )
        const a = (await res.json()).address || {}
        const ulica = [a.road, a.house_number].filter(Boolean).join(" ")
        const naselje = a.suburb || a.city || a.town || a.village
        return [ulica, naselje].filter(Boolean).join(", ")
    } catch {
        return ""
    }
}

function KlikNaKartu({ onKlik }) {
    useMapEvents({ click: (e) => onKlik(e.latlng.lat, e.latlng.lng) })
    return null
}

function Prati({ value }) {
    const map = useMap()
    useEffect(() => {
        if (value && typeof value.lat === "number" && typeof value.lng === "number") {
            map.flyTo([value.lat, value.lng], Math.max(map.getZoom(), 16))
        }
    }, [value?.lat, value?.lng, map])
    return null
}

export default function LokacijaPicker({ value, onChange }) {
    const [ucitava, setUcitava] = useState(false)

    async function postavi(lat, lng) {
        onChange({ lat, lng, opis: value?.opis ?? "" })
        setUcitava(true)
        const opis = await opisIzKoordinata(lat, lng)
        onChange({ lat, lng, opis: opis || value?.opis || "" })
        setUcitava(false)
    }

    const defaultLat = 45.5511;
    const defaultLng = 18.6939;

    const imaValidneKoordinate = value && typeof value.lat === "number" && typeof value.lng === "number";
    
    const centarMape = imaValidneKoordinate 
        ? [value.lat, value.lng] 
        : (CENTAR_OSIJEK && typeof CENTAR_OSIJEK.lat === "number" && typeof CENTAR_OSIJEK.lng === "number"
            ? [CENTAR_OSIJEK.lat, CENTAR_OSIJEK.lng]
            : [defaultLat, defaultLng]);

    return (
        <div className="d-flex flex-column gap-2">
            <MapContainer
                center={centarMape}
                zoom={imaValidneKoordinate ? 16 : 13}
                style={{ height: "320px", borderRadius: "8px" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <KlikNaKartu onKlik={postavi} />
                <Prati value={value} />
                
                {imaValidneKoordinate && (
                    <Marker
                        position={[value.lat, value.lng]}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const p = e.target.getLatLng()
                                postavi(p.lat, p.lng)
                            }
                        }}
                    />
                )}
            </MapContainer>

            <Form.Control
                type="text"
                placeholder="Opis lokacije (automatski se upisuje klikom na kartu, možete ga urediti)"
                value={value?.opis ?? ""}
                disabled={!imaValidneKoordinate}
                onChange={(e) => onChange({ ...value, opis: e.target.value })}
            />
            
            <small className="text-muted">
                {ucitava
                    ? <><Spinner size="sm" animation="border" className="me-1" /> Učitavam adresu...</>
                    : "Klikni bilo gdje na kartu ili povuci marker da automatski dohvatiš adresu."}
            </small>
        </div>
    )
}