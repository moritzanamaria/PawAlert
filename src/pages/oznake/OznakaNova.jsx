import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import OznakeService from "../../services/oznake/OznakeService";
import { useState } from "react";
import { RouteNames } from "../../constants";
import Wheel from "@uiw/react-color-wheel";
import { ShadeSlider, hsvaToHex, hexToHsva } from "@uiw/react-color";
import { oznakaSchema } from "../../schemas/oznakaSchema";
import useLoading from "../../hooks/useLoading";

export default function OznakaNova() {
    const navigate = useNavigate();
    const { loading, showLoading, hideLoading } = useLoading();

    const [errors, setErrors] = useState({});

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };

    const location = useLocation();
    const povratak = location.state?.povratak ?? RouteNames.OZNAKE_PREGLED;

    const [naziv, setNaziv] = useState("");
    const [bojaHsva, setBojaHsva] = useState(hexToHsva("#0d6efd"));
    const [bojaTekstaHsva, setBojaTekstaHsva] = useState(hexToHsva("#ffffff"));

    const bojaHex = hsvaToHex(bojaHsva);
    const bojaTekstaHex = hsvaToHex(bojaTekstaHsva);

    async function dodaj(oznaka) {
        showLoading();
        try {
            await OznakeService.dodaj(oznaka);
            navigate(povratak);
        } catch (error) {
            console.error("Greška pri dodavanju oznake:", error);
            setErrors({ opcenito: "Oznaku nije moguće dodati. Pokušaj ponovno." });
        } finally {
            hideLoading();
        }
    }

    function OdabirBoje({ label, hsva, setHsva }) {
        return (
            <Form.Group as={Col} md={6} className="mb-3 text-center">
                <Form.Label className="fw-medium d-block text-start">{label}</Form.Label>
                <div className="shadow-sm d-flex flex-column align-items-center justify-content-center p-3 rounded bg-white gap-3">
                    <Wheel
                        color={hsva}
                        onChange={(col) => setHsva((prev) => ({ ...prev, ...col.hsva }))}
                        width={160}
                        height={160}
                    />
                    <div className="w-100 px-2">
                        <span className="text-muted small d-block text-start mb-1">Svjetlina:</span>
                        <ShadeSlider
                            hsva={hsva}
                            onChange={(nova) => setHsva((prev) => ({ ...prev, ...nova }))}
                            style={{ height: 16, borderRadius: 8 }}
                        />
                    </div>
                </div>
            </Form.Group>
        );
    } function obradiSubmit(e) {
        e.preventDefault();

        const rezultat = oznakaSchema.safeParse({ ...Object.fromEntries(podaci), boja: bojaHex, boja_teksta: bojaTekstaHex });
        if (!rezultat.success) {
            const noveGreske = {};
            rezultat.error.issues.forEach((issue) => {
                noveGreske[issue.path[0]] ??= issue.message;
            });
            setErrors(noveGreske);
            return;
        }
        setErrors({})
        dodaj(rezultat.data);
    }


    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-success p-4 rounded-top-3 d-flex align-items-center gap-3">
                    <lord-icon
                        src="https://cdn.lordicon.com/puzgkqsp.json"
                        trigger="loop"
                        colors="primary:#ffffff,secondary:#a8ffdb"
                        style={{ width: "45px", height: "45px" }}
                    ></lord-icon>
                    <div>
                        <h3 className="mb-0 fw-bold fs-4 ">Dodaj novu oznaku</h3>
                        <p className="mb-0 small">
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
                                    name="naziv"
                                    value={naziv}
                                    onChange={(e) => setNaziv(e.target.value)}
                                    placeholder="npr.  Preplašen, Crna, Ima ogrlicu..."
                                    isInvalid={!!errors.naziv}
                                    onFocus={() => ocistiGresku("naziv")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.naziv}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-4">
                            <OdabirBoje label="Boja oznake" hsva={bojaHsva} setHsva={setBojaHsva} />
                            <OdabirBoje label="Boja teksta" hsva={bojaTekstaHsva} setHsva={setBojaTekstaHsva} />
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

                            <Button type="submit" variant="success" className="px-5 fw-bold" disabled={loading}>
                                Dodaj
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}