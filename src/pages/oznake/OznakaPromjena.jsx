import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import OznakeService from "../../services/oznake/OznakeService";
import { RouteNames, putanja } from "../../constants";

export default function OznakaPromjena() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const povratak = location.state?.povratak ?? RouteNames.OZNAKE_PREGLED;

    const [oznaka, setOznaka] = useState({
        naziv: "",
        boja: "#0d6efd",
    });

    useEffect(() => {
        async function ucitajOznaku() {
            try {
                const res = await OznakeService.getById(params.id);
                const oData = res?.data ?? res;
                setOznaka(oData || { naziv: "", boja: "#0d6efd" });
            } catch (error) {
                console.error("Greška pri učitavanju oznake:", error);
            }
        }
        if (params.id) {
            ucitajOznaku();
        }
    }, [params.id]);

    async function promjeni(podaci) {
        try {
            await OznakeService.promjeni(params.id, podaci);
            navigate(povratak);
        } catch (error) {
            console.error("Greška pri promjeni oznake:", error);
        }
    }

    function obradiSubmit(e) {
        e.preventDefault();
        const trimmedNaziv = oznaka.naziv.trim();

        if (trimmedNaziv.length === 0) {
            alert("Naziv oznake je obavezan i ne smije sadržavati samo razmake!");
            return;
        }
        if (trimmedNaziv.length < 2 || trimmedNaziv.length > 30) {
            alert("Naziv oznake mora imati između 2 i 30 znakova!");
            return;
        }

        promjeni({
            ...oznaka,
            naziv: trimmedNaziv,
        });
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3 d-flex align-items-center gap-3">
                    <lord-icon
                        src="https://cdn.lordicon.com/puzgkqsp.json"
                        trigger="loop"
                        colors="primary:#212529,secondary:#495057"
                        style={{ width: "45px", height: "45px" }}
                    ></lord-icon>
                    <div>
                        <h3 className="mb-0 fw-bold fs-4">Promjena oznake</h3>
                        <p className="mb-0 text-muted small">
                            Ažurirajte naziv i boju oznake.
                        </p>
                    </div>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={oznaka.id} onSubmit={obradiSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={8} controlId="naziv" className="mb-3">
                                <Form.Label className="fw-medium">Naziv oznake</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={oznaka.naziv}
                                    onChange={(e) => setOznaka({ ...oznaka, naziv: e.target.value })}
                                    placeholder="Unesite naziv oznake..."
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="boja" className="mb-3">
                                <Form.Label className="fw-medium">Boja oznake</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        value={oznaka.boja || "#0d6efd"}
                                        onChange={(e) => setOznaka({ ...oznaka, boja: e.target.value })}
                                        title="Odaberite boju oznake"
                                        style={{ height: "38px", cursor: "pointer" }}
                                    />
                                    <span className="text-muted small font-monospace">{oznaka.boja}</span>
                                </div>
                            </Form.Group>
                        </Row>

                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={povratak} className="btn btn-outline-secondary px-4 fw-medium">
                                Odustani
                            </Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Spremi
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}