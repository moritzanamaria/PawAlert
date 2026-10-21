import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";

registerLocale("hr", hr);


export default function TragNovi() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [trag, setTrag] = useState({})
    const [datum, setDatum] = useState(new Date());

    async function dodaj(trag) {
        await TragoviService.dodaj(trag).then(() => {
            navigate(`/prijave/${id}/tragovi`)
        })
    }
function obradiSubmit(e) {
    e.preventDefault()
    const podaci = new FormData(e.target)

    const opis = (podaci.get('opis') || '').trim()
    if (opis.length === 0) {
        alert("Opis traga je obavezan i ne smije sadržavati samo razmake!")
        return
    }
    if (opis.length < 3 || opis.length > 500) {
        alert("Opis traga mora imati najmanje 3 i najviše 500 znakova!")
        return
    }

    const lokacija = (podaci.get('lokacija_opis') || '').trim()
    if (lokacija.length === 0) {
        alert("Opis lokacije je obavezan i ne smije sadržavati samo razmake!")
        return
    }
    if (lokacija.length < 3 || lokacija.length > 100) {
        alert("Opis lokacije mora imati najmanje 3 i najviše 100 znakova!")
        return
    }

    if (!datum || isNaN(datum.getTime())) {
        alert("Morate odabrati datum i vrijeme!")
        return
    }
    if (datum > new Date()) {
        alert("Datum traga ne može biti u budućnosti!")
        return
    }

    dodaj({
        prijava: parseInt(id),
        opis: opis,
        lokacija_opis: lokacija,
        datum: datum.toISOString(),
    })
}

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-success text-white p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">🐾Dodaj novi trag za prijavu {id}
                    </h3>
                    <p className="mb-0 text-white-50 small">
                        Unesite podatke o novom tragu za prijavu {id}.
                    </p>

                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>

                        <Form.Group controlId="opis" className="mb-3">
                            <Form.Label className="fw-medium">Opis traga</Form.Label>
                            <Form.Control as="textarea" rows={3} name="opis" placeholder="Unesite opis traga..." required />
                        </Form.Group>

                        <Row className="mb-4">
                            <Form.Group as={Col} md={6} controlId="lokacija_opis" className="mb-3">
                                <Form.Label className="fw-medium">Opis lokacije</Form.Label>
                                <Form.Control type="text" name="lokacija_opis" placeholder="Unesite opis lokacije (npr. Promenada, Osijek)" required />
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

                            <Link to={`/prijave/${id}/tragovi`} className="btn btn-outline-secondary px-4 fw-medium">
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