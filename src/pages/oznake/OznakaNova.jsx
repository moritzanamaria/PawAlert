import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import OznakeService from "../../services/oznake/OznakeService";
import { useState } from "react";
import { RouteNames } from "../../constants";

export default function OznakaNova() {
    const navigate = useNavigate();
    const location = useLocation();
    const povratak = location.state?.povratak ?? RouteNames.OZNAKE_PREGLED;

    const [naziv, setNaziv] = useState("");
    const [boja, setBoja] = useState("#0d6efd"); // Zadana plava boja
    const [bojaTeksta, setBojaTeksta] = useState("#ffffff");

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
            boja: boja,
            boja_teksta: bojaTeksta,
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
                            <Form.Group as={Col} md={6} controlId="naziv" className="mb-3">
                                <Form.Label className="fw-medium">Naziv oznake</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={naziv}
                                    onChange={(e) => setNaziv(e.target.value)}
                                    placeholder="npr.  Preplašen, Crna, Ima ogrlicu..."
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="boja" className="mb-3">
                                <Form.Label className="fw-medium">Boja oznake</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        value={boja}
                                        onChange={(e) => setBoja(e.target.value)}
                                        title="Odaberite boju oznake"
                                        style={{ height: "38px", cursor: "pointer" }}
                                    />
                                    <span className="text-muted small font-monospace">{boja}</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md={3} controlId="boja_teksta" className="mb-3">
                                <Form.Label className="fw-medium">Boja teksta</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        value={bojaTeksta}
                                        onChange={(e) => setBojaTeksta(e.target.value)}
                                        title="Odaberite boju teksta"
                                        style={{ height: "38px", cursor: "pointer" }}
                                    />
                                    <span className="text-muted small font-monospace">{bojaTeksta}</span>
                                </div>
                            </Form.Group>
                        </Row>
                        <div className="mb-3">
                            <span className="text-muted small me-2">Pregled:</span>
                            <span className="badge fs-6" style={{ backgroundColor: boja, color: bojaTeksta }}>
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