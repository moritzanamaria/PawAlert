import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TipService from "../../services/tip/TipService";

export default function TipNovi() {
    const navigate = useNavigate()

    async function dodaj(tip) {
        await TipService.dodaj(tip).then(() => {
            navigate(RouteNames.TIPOVI_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv')
        })
    }

    return (
        <Container className="my-4">
            <h3>
                Dodaj novi tip
            </h3>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>Naziv tipa</Form.Label>
                    <Form.Control type="text" name="naziv" placeholder="Unesite naziv tipa" required />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.TIPOVI_PREGLED} className="btn btn-danger">
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