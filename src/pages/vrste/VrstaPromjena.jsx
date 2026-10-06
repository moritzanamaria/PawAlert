import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import VrsteService from "../../services/vrste/VrsteService";

export default function VrstaPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [vrsta, setVrsta] = useState({})

    async function ucitajVrstu() {
        await VrsteService.getById(params.id).then((odgovor) => {
            setVrsta(odgovor.data)
        })
    }

    useEffect(() => {
        ucitajVrstu()
    }, [])

    async function promjeni(podaci) {
        await VrsteService.promjeni(params.id, podaci).then(() => {
            navigate(RouteNames.VRSTE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            ...vrsta,
            naziv: podaci.get('naziv')
        })
    }

    return (
        <Container className="my-4">
            <h3>Promjena Vrste</h3>
            <Form key={vrsta.id} onSubmit={obradiSubmit}>
                <Form.Group className="mb-3" controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" defaultValue={vrsta.naziv} />
                </Form.Group>
                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.VRSTE_PREGLED} className="btn btn-danger">Odustani</Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">Spremi</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}