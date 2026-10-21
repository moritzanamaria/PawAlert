import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TipService from "../../services/tip/TipService";

export default function TipNovi() {
    const navigate = useNavigate()

    async function dodaj(tip) {
        await TipService.dodaj(tip).then(() => {
            navigate(RouteNames.TIPOVI_I_VRSTE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const naziv = (podaci.get('naziv') || '').trim()
        if (naziv.length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
            return
        }
        if (naziv.length < 3 || naziv.length > 20) {
            alert("Naziv tipa mora imati najmanje 3 i najviše 20 znakova!")
            return
        }
        if (!/^[A-Za-zČčĆćĐđŠšŽž\s-]+$/.test(naziv)) {
            alert("Naziv smije sadržavati samo slova, razmake i crticu (bez brojeva)!")
            return
        }

        dodaj({
            naziv: naziv
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-success text-white p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">🏷️Dodaj novi tip</h3>
                    <p className="mb-0 text-white-50 small">
                        Unesite naziv za novi tip prijave.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>
                        <Form.Group controlId="naziv" className="mb-4">
                            <Form.Label className="fw-medium">Naziv tipa</Form.Label>
                            <Form.Control type="text" name="naziv" placeholder="Unesite naziv tipa (Npr. Pronalazak)" required />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={RouteNames.TIPOVI_I_VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">
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
    )
}