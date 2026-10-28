import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import OznakeService from "../../services/oznake/OznakeService";
import { useState } from "react";
import { RouteNames } from "../../constants";
import Wheel from "@uiw/react-color-wheel";
import { ShadeSlider, hsvaToHex, hexToHsva } from "@uiw/react-color";

export default function OznakaNova() {
    const navigate = useNavigate();
    const location = useLocation();
    const povratak = location.state?.povratak ?? RouteNames.OZNAKE_PREGLED;

    const [naziv, setNaziv] = useState("");
  const [bojaHsva, setBojaHsva] = useState(hexToHsva("#0d6efd"));
    const [bojaTekstaHsva, setBojaTekstaHsva] = useState(hexToHsva("#ffffff"));

    const bojaHex = hsvaToHex(bojaHsva);
    const bojaTekstaHex = hsvaToHex(bojaTekstaHsva);

    async function dodaj(oznaka) {
        try {
            await OznakeService.dodaj(oznaka);
            navigate(povratak);
        } catch (error) {
            console.error("Greška pri dodavanju oznake:", error);
        }
    }

    function obradiSubmit(e) {
        e.preventDefault();
        const trimmedNaziv = naziv.trim();

        if (trimmedNaziv.length === 0) {
            alert("Naziv oznake je obavezan i ne smije sadržavati samo razmake!");
            return;
        }
        if (trimmedNaziv.length < 2 || trimmedNaziv.length > 30) {
            alert("Naziv oznake mora imati između 2 i 30 znakova!");
            return;
        }

        dodaj({
            naziv: trimmedNaziv,
           boja: bojaHex,
            boja_teksta: bojaTekstaHex,
        });
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-success text-white p-4 rounded-top-3 d-flex align-items-center gap-3">
                    <lord-icon
                        src="https://cdn.lordicon.com/puzgkqsp.json"
                        trigger="loop"
                        colors="primary:#ffffff,secondary:#a8ffdb"
                        style={{ width: "45px", height: "45px" }}
                    ></lord-icon>
                    <div>
                        <h3 className="mb-0 fw-bold fs-4 text-white">Dodaj novu oznaku</h3>
                        <p className="mb-0 text-white-50 small">
                            Unesite naziv i odaberite boju za novu oznaku
                        </p>
                    </div>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={12} controlId="naziv" className="mb-3">
                                <Form.Label className="fw-medium">Naziv oznake</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={naziv}
                                    onChange={(e) => setNaziv(e.target.value)}
                                    placeholder="npr.  Preplašen, Crna, Ima ogrlicu..."
                                    required
                                />
                            </Form.Group>
</Row>

                        <Row className="mb-4">
                            <Form.Group as={Col} md={6} className="mb-3 text-center">
                                <Form.Label className="fw-medium d-block text-start">Boja oznake</Form.Label>
                                <div className="shadow-sm d-flex flex-column align-items-center justify-content-center p-3 rounded bg-white gap-3">
                                    <Wheel
                                        color={bojaHsva}
                                        onChange={(col) => setBojaHsva((prev) => ({ ...prev, ...col.hsva }))}
                                        width={160}
                                        height={160}
                                    />
                                    <div className="w-100 px-2">
                                        <span className="text-muted small d-block text-start mb-1">Svjetlina:</span>
                                        <ShadeSlider
                                            hsva={bojaHsva}
                                            onChange={(newColor) => setBojaHsva((prev) => ({ ...prev, ...newColor }))}
                                            style={{ height: 16, borderRadius: 8 }}
                                        />
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} md={6} className="mb-3 text-center">
                                <Form.Label className="fw-medium d-block text-start">Boja teksta</Form.Label>
                                <div className="shadow-sm d-flex flex-column align-items-center justify-content-center p-3 rounded bg-white gap-3">
                                    <Wheel
                                        color={bojaTekstaHsva}
                                        onChange={(col) => setBojaTekstaHsva((prev) => ({ ...prev, ...col.hsva }))}
                                        width={160}
                                        height={160}
                                    />
                                    <div className="w-100 px-2">
                                        <span className="text-muted small d-block text-start mb-1">Svjetlina:</span>
                                        <ShadeSlider
                                            hsva={bojaTekstaHsva}
                                            onChange={(newColor) => setBojaTekstaHsva((prev) => ({ ...prev, ...newColor }))}
                                            style={{ height: 16, borderRadius: 8 }}
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                        </Row>
                        <div className="mb-3">
                            <span className="text-muted small me-2">Pregled:</span>
                            <span className="badge fs-6" style={{ backgroundColor: bojaHex, color: bojaTekstaHex }}>
                                {naziv.trim() || "Naziv oznake"}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={povratak} className="btn btn-outline-secondary px-4 fw-medium">
                                Odustani
                            </Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Dodaj
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}