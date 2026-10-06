import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import vrsteService from "../../services/vrste/vrsteService";

export default function VrstaNova() {
    const navigate = useNavigate()

    async function dodaj(vrsta) {
        await vrsteService.dodaj(vrsta).then(() => {
            navigate(RouteNames.VRSTE_PREGLED)
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
                Dodaj novu vrstu
            </h3>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>Naziv vrste</Form.Label>
                    <Form.Control type="text" name="naziv" placeholder="Unesite naziv vrste" required />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.VRSTE_PREGLED} className="btn btn-danger">
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