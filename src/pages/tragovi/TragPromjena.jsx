import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale("hr", hr);

export default function TragPromjena() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [datum, setDatum] = useState(new Date());

    const [trag, setTrag] = useState({
        prijava: "",
        korisnik: "",
        opis: "",
        lokacija_opis: "",
        lokacija_lat: 0,
        lokacija_lng: 0,
        datum: ""
    })

    async function ucitajTrag() {
        await TragoviService.getById(id).then((odgovor) => {
            setTrag(odgovor.data)
        })
    }

    useEffect(() => {
        ucitajTrag()
    }, [])

    async function promjeni(podaci) {
        await TragoviService.promjeni(id, podaci).then(() => {
            navigate(`/prijave/${trag.prijava}/tragovi`)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            ...trag,
            opis: podaci.get('opis'),
            lokacija_opis: podaci.get('lokacija_opis'),
            datum: new Date(podaci.get('datum')).toISOString(),
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️Promjena traga #{id}</h3>
                    <p className="mb-0 text-dark-50 small">
                        Ažurirajte informacije o tragu.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={trag.id} onSubmit={obradiSubmit}>

                        <Form.Group controlId="opis" className="mb-3">
                            <Form.Label className="fw-medium">Opis traga</Form.Label>
                            <Form.Control as="textarea" rows={3} name="opis" defaultValue={trag.opis} required placeholder="Unesite opis traga..." />
                        </Form.Group>
                        <Row className="mb-4">
                            <Form.Group as={Col} md={6} controlId="lokacija_opis" className="mb-3">
                                <Form.Label className="fw-medium">Opis lokacije</Form.Label>
                                <Form.Control type="text" name="lokacija_opis" defaultValue={trag.lokacija_opis} required />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="datum" className="mb-3">
                                <Form.Label className="fw-medium">Datum i vrijeme</Form.Label>
                                <div>
                                    <DatePicker
                                        selected={datum}
                                        onChange={(date) => setDatum(date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="dd.MM.yyyy. HH:mm"
                                        locale="hr"
                                        customInput={<Form.Control required />}
                                    />
                                </div>
                            </Form.Group>
                        </Row>
                        <div className="d-flex justify-content-between align-items-center pt-2">

                            <Link to={`/prijave/${trag.prijava}/tragovi`} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">Spremi</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}