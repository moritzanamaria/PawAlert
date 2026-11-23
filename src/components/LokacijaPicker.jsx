import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import { CENTAR_OSIJEK } from "../constants";
import { dohvatiIkonu } from "../utils/mapHelpers";

 const IKONA = dohvatiIkonu();   

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

async function koordinateIzAdrese(adresa) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=hr&accept-language=hr&q=${encodeURIComponent(adresa)}`
        )
        const [prvi] = await res.json()
        return prvi ? { lat: Number(prvi.lat), lng: Number(prvi.lon) } : null
    } catch {
        return null
    }
}

function KlikNaKartu({ onKlik }) {
    useMapEvents({ click: (e) => onKlik(e.latlng.lat, e.latlng.lng) })
    return null
}

function Prati({ lat, lng }) {
    const map = useMap()
    useEffect(() => {
        if (lat != null) map.flyTo([lat, lng], Math.max(map.getZoom(), 16));
    }, [lat, lng, map]);

    return null
}

export default function LokacijaPicker({ value, onChange }) {
    const [ucitava, setUcitava] = useState(false)
    const [adresa, setAdresa] = useState("")
    const [poruka, setPoruka] = useState("")
    const imaTocku = value?.lat != null;

    async function trazi() {
        if (!adresa.trim()) return
        setUcitava(true)
        setPoruka("")
        const k = await koordinateIzAdrese(`${adresa}, Osijek`)
        setUcitava(false)
        if (k) postavi(k.lat, k.lng)
        else setPoruka("Adresa nije pronađena. Pokušajte drugačije ili kliknite na kartu.")
    }

    function mojaLokacija() {
        if (!navigator.geolocation) {
            setPoruka("Preglednik ne podržava određivanje lokacije.")
            return
        }
        setPoruka("")
        navigator.geolocation.getCurrentPosition(
            (pos) => postavi(pos.coords.latitude, pos.coords.longitude),
            () => setPoruka("Lokaciju nije moguće dohvatiti. Upišite adresu ili kliknite na kartu.")
        )
    }
    async function postavi(lat, lng) {
        onChange({ ...value, lat, lng })
        setUcitava(true)
        const opis = await opisIzKoordinata(lat, lng)
        onChange({ lat, lng, opis: opis || value?.opis || "" })
        setUcitava(false)
    }

    return (
        <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-wrap gap-2">
            <InputGroup className="flex-grow-1" style={{ minWidth: "15rem", width: "auto" }}>
                <Form.Control
                    type="search"
                    aria-label="Adresa za pretragu"
                    placeholder="Upišite adresu, npr. Trg Ante Starčevića 1"
                    value={adresa}
                    onChange={(e) => setAdresa(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            trazi()
                        }
                    }}
                />
                <Button variant="outline-primary" onClick={trazi}>Traži</Button>
            </InputGroup>
            <Button variant="outline-secondary" onClick={mojaLokacija}>Moja lokacija</Button>
            </div>

            <MapContainer
                center={imaTocku ? [value.lat, value.lng] : CENTAR_OSIJEK}
                zoom={imaTocku ? 16 : 13}
                style={{ height: "320px", borderRadius: "8px" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <KlikNaKartu onKlik={postavi} />
                <Prati lat={value?.lat} lng={value?.lng} />

                {imaTocku && (
                    <Marker
                        position={[value.lat, value.lng]}
                        icon={IKONA}
                        title="Odabrana lokacija"
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const { lat, lng } = e.target.getLatLng();
                                postavi(lat, lng)
                            },
                        }}
                    />
                )}
            </MapContainer>

            <Form.Control
                type="text"
                aria-label="Opis lokacije"
                placeholder="Opis lokacije (automatski se upisuje klikom na kartu, možete ga urediti)"
                value={value?.opis ?? ""}
                disabled={!imaTocku}
                onChange={(e) => onChange({ ...value, opis: e.target.value })}
            />

            <small className="text-muted" aria-live="polite">
                {ucitava ? (
                     <>
                     <Spinner size="sm" animation="border" className="me-1" /> Učitavam adresu...</>
                     ) : (
                         poruka || "Upišite adresu, kliknite bilo gdje na kartu ili povucite marker."
                        )}
            </small>
        </div>
    )
}