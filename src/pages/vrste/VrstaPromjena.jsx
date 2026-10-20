import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Container, Form } from "react-bootstrap";
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
        <Container className="my-5" style={{ maxWidth: "600px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️ Izmjena vrste</h3>
                    <p className="mb-0 text-dark-50 small">
                        Uredite naziv za odabranu vrstu životinje.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={vrsta.id} onSubmit={obradiSubmit}>
                        <Form.Group className="mb-4" controlId="naziv">
                            <Form.Label className="fw-medium">Naziv</Form.Label>
                            <Form.Control type="text" name="naziv" defaultValue={vrsta.naziv} placeholder="Npr. Pas, Ptica" required />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={RouteNames.VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="warning" className="px-5 fw-bold text-dark">Spremi promjene</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}