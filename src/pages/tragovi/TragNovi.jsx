import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";

export default function TragNovi() {
    const navigate = useNavigate()

    async function dodaj(trag) {
        await TragoviService.dodaj(trag).then(() => {
            navigate(RouteNames.TRAG_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            prijava: parseInt(podaci.get('prijava')) || 0,
            korisnik: parseInt(podaci.get('korisnik')) || 0,
            opis: podaci.get('opis'),
            lokacija_opis: podaci.get('lokacija_opis'),
            lokacija_lat: parseFloat(podaci.get('lokacija_lat')) || 0,
            lokacija_lng: parseFloat(podaci.get('lokacija_lng')) || 0,
            datum: podaci.get('datum')
        })
    }

    return (
        <Container className="my-4">
            <h3>
                Dodaj novi trag
            </h3>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>Prijava(ID)</Form.Label>
                    <Form.Control type="text" name="prijava" placeholder="Unesite broj prijave" required />
                </Form.Group>
                <Form.Group controlId="korisnik" className="mb-3">
                    <Form.Label>Korisnik (ID)</Form.Label>
                    <Form.Control type="number" name="korisnik" placeholder="Unesite ID korisnika" required />
                </Form.Group>

                <Form.Group controlId="opis" className="mb-3">
                    <Form.Label>Opis traga</Form.Label>
                    <Form.Control as="textarea" rows={3} name="opis" placeholder="Unesite opis traga" required />
                </Form.Group>

                <Form.Group controlId="lokacija_opis" className="mb-3">
                    <Form.Label>Opis lokacije</Form.Label>
                    <Form.Control type="text" name="lokacija_opis" placeholder="Unesite opis lokacije (npr. Promenada, Osijek)" required />
                </Form.Group>


                <Form.Group controlId="datum" className="mb-3">
                    <Form.Label>Datum i vrijeme</Form.Label>
                    <Form.Control type="datetime-local" name="datum" required />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.TRAG_PREGLED} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}