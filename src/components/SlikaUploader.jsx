import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap";
import { izrezi } from "../utils/cropSlika";
import { slikaFileSchema } from "../schemas/slikaSchema";

const OMJERI = [
    { label: "1:1", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:4", value: 3 / 4 },
    { label: "16:9", value: 16 / 9 },
];

export default function SlikaUploader({ value, onChange }) {
    const [izvor, setIzvor] = useState(null); // slika koja se trenutno uređuje
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [omjer, setOmjer] = useState(4 / 3);
    const [pikseli, setPikseli] = useState(null);
    const [radi, setRadi] = useState(false);
     const [greska, setGreska] = useState("");


    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setPikseli(croppedAreaPixels);
    }, []);

    function otvori(src) {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setIzvor(src);
    }

    function odaberi(e) {
        const file = e.target.files[0];
        e.target.value = ""; 
        if (!file) return;

        const rezultat = slikaFileSchema(15).safeParse(file);
        if (!rezultat.success) {
            alert(prvaGreska(rezultat));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => otvori(reader.result);
        reader.readAsDataURL(file);
    }

    async function potvrdi() {
        if (!pikseli) return;
        try {
            setRadi(true);
            const rezultat = await izrezi(izvor, pikseli, rotation);
            onChange(rezultat);
            setIzvor(null);
        } catch (err) {
            console.error(err);
            alert("Greška pri obradi slike.");
        } finally {
            setRadi(false);
        }
    }

    const mozeSeUredivati = value && value.startsWith("data:");

    return (
        <>
            <Form.Control
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={odaberi}
            isInvalid={!!greska}
            />
            <Form.Control.Feedback type="invalid">{greska}</Form.Control.Feedback>

            {value && (
                <div className="mt-2">
                    <img
                        src={value}
                        alt="Pregled slike"
                        className="rounded border"
                        style={{ maxWidth: "100%", maxHeight: 180, objectFit: "cover" }}
                    />
                    <div className="mt-2 d-flex gap-2">
                        {mozeSeUredivati && (
                            <Button size="sm" variant="outline-secondary" onClick={() => otvori(value)}>
                                Uredi
                            </Button>
                        )}
                        <Button size="sm" variant="outline-danger" onClick={() => onChange(null)}>
                            Ukloni sliku
                        </Button>
                    </div>
                </div>
            )}

            <Modal show={!!izvor} onHide={() => setIzvor(null)} size="lg" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="fs-5">Uredi sliku</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ position: "relative", width: "100%", height: 380, background: "#222" }}>
                        {izvor && (
                            <Cropper
                                image={izvor}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={omjer}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>

                    <div className="mt-3">
                       <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label className="mb-1 small fw-medium">Zoom</Form.Label>
                                <Form.Range 
                                    min={1} 
                                    max={3} 
                                    step={0.05} 
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))} 
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="mb-1 small fw-medium">Rotacija ({rotation}°)</Form.Label>
                                <Form.Range 
                                    min={-180} 
                                    max={180} 
                                    step={1} 
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))} 
                                />
                            </Col>
                        </Row>
                        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                            <ButtonGroup size="sm">
                                {OMJERI.map((o) => (
                                    <Button key={o.label}
                                        variant={omjer === o.value ? "secondary" : "outline-secondary"}
                                        onClick={() => setOmjer(o.value)}>
                                        {o.label}
                                    </Button>
                                ))}
                            </ButtonGroup>

                            <ButtonGroup size="sm">
                                <Button variant="outline-secondary"
                                    onClick={() => setRotation((r) => (r - 90 <= -180 ? 180 : r - 90))}>
                                    ⟲ 90°
                                </Button>
                                <Button variant="outline-secondary"
                                    onClick={() => setRotation((r) => (r + 90 > 180 ? -90 : r + 90))}>
                                    ⟳ 90°
                                </Button>
                                <Button variant="outline-secondary"
                                    onClick={() => { setZoom(1); setRotation(0); setCrop({ x: 0, y: 0 }); }}>
                                    Reset
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setIzvor(null)}>Odustani</Button>
                    <Button variant="success" onClick={potvrdi} disabled={radi}>
                        {radi ? "Obrađujem..." : "Primijeni"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}