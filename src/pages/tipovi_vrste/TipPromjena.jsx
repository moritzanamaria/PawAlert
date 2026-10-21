import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
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
        if (naziv.length < 3 || naziv.length > 50) {
            alert("Naziv tipa mora imati najmanje 3 i najviše 50 znakova!")
            return
        }
        if (!/^[A-Za-zČčĆćĐđŠšŽž\s-]+$/.test(naziv)) {
            alert("Naziv smije sadržavati samo slova, razmake i crticu (bez brojeva)!")
            return
        }

        promjeni({
            ...tip,
            naziv: naziv
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️ Promjena tipa #{params.id}</h3>
                    <p className="mb-0 text-dark-50 small">
                        Ažurirajte naziv tipa prijave.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={tip.id} onSubmit={obradiSubmit}>
                        <Form.Group className="mb-4" controlId="naziv">
                            <Form.Label className="fw-medium">Naziv</Form.Label>
                            <Form.Control type="text" name="naziv" defaultValue={tip.naziv} required
                                placeholder="Unesite naziv tipa..." />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center pt-2">

                            <Link to={RouteNames.TIPOVI_I_VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">Spremi</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}