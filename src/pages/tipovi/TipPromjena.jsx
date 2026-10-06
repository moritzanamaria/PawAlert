import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TipService from "../../services/tip/TipService";

export default function TipPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [tip, setTip] = useState({})

    async function ucitajTip() {
        await TipService.getById(params.id).then((odgovor) => {
            setTip(odgovor.data)
        })
    }

    useEffect(() => {
        ucitajTip()
    }, [])

    async function promjeni(podaci) {
        await TipService.promjeni(params.id, podaci).then(() => {
            navigate(RouteNames.TIPOVI_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            ...tip,
            naziv: podaci.get('naziv')
        })
    }

    return (
        <div className="container my-4">
            <h3>Promjena tipa</h3>
            <Form key={tip.id} onSubmit={obradiSubmit}>
                <Form.Group className="mb-3" controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" defaultValue={tip.naziv} />
                </Form.Group>
                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.TIPOVI_PREGLED} className="btn btn-danger">Odustani</Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">Spremi</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}