import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import prijaveService from "../../services/prijave/prijaveService";
import VrsteService from "../../services/vrste/VrsteService";
import TipService from "../../services/tip/TipService";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";
import { useEffect, useState } from "react";

registerLocale("hr", hr);

export default function PrijavaNova() {
    const navigate = useNavigate()
    const [datum, setDatum] = useState(new Date());
    const [vrste, setVrste] = useState([]);
    const [tipovi, setTipovi] = useState([]);

    async function dohvatiPodatke() {

            const [resVrste, resTipovi] = await Promise.all([
                VrsteService.get(),
                TipService.get()
            ]);

            const vData = Array.isArray(resVrste) ? resVrste : (resVrste?.data ?? []);
            const tData = Array.isArray(resTipovi) ? resTipovi : (resTipovi?.data ?? []);

            setVrste(Array.isArray(vData) ? vData : []);
            setTipovi(Array.isArray(tData) ? tData : []);
    }

    useEffect(() => {
        dohvatiPodatke();
    }, []);

    async function dodaj(prijava) {
        await prijaveService.dodaj(prijava).then(() => {
            navigate(RouteNames.PRIJAVE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            zivotinja_ime: podaci.get('zivotinja_ime'),
            zivotinja_vrsta: parseInt(podaci.get("zivotinja_vrsta")),
            zivotinja_opis: podaci.get('zivotinja_opis'),
            zivotinja_godine: podaci.get('zivotinja_godine') ? parseInt(podaci.get('zivotinja_godine')) : null,
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: parseInt(podaci.get('tip_prijave')),
            status: podaci.get('status') || 'otvorena',
            lokacija_opis: podaci.get('lokacija_opis'),
            datum: new Date(podaci.get('datum')).toISOString(),
            slika: podaci.get('slika'),
            hitno: podaci.get('hitno') === 'on'
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-secondary text-white p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">
                        🐾 Prijava novog slučaja
                    </h3>

                    <p className="mb-0 text-white-50 small px-4">
                        Unesite sve potrebne podatke o uočenoj životinji i lokaciji.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>
                        <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2">
                            1. Podaci o životinji
                        </h5>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="zivotinja_ime">
                                <Form.Label className="fw-medium">Ime životinje</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zivotinja_ime"
                                    placeholder="Npr. Reks" />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="zivotinja_vrsta">
                                <Form.Label className="fw-medium">Vrsta</Form.Label>
                                <Form.Select name="zivotinja_vrsta" defaultValue="" required>
                                    <option value="" disabled>Odaberi vrstu...</option>
                                    {vrste && vrste.map(v =>
                                        <option key={v.id} value={v.id}>
                                            {v.naziv}
                                        </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="zivotinja_godine">
                                <Form.Label className="fw-medium">Godine</Form.Label>
                                <Form.Control type="number" name="zivotinja_godine" step={1} min={0} placeholder="Npr. 2" />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="slika">
                                <Form.Label className="fw-medium">Slika (URL)</Form.Label>
                                <Form.Control type="url" name="slika" placeholder="https://primjer.com/slika.jpg" />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-4" controlId="zivotinja_opis">
                            <Form.Label className="fw-medium">Opis</Form.Label>
                            <Form.Control as="textarea" rows={3} name="zivotinja_opis" placeholder="Boja krzna, posebne oznake, ponašanje, ozljede..." />
                        </Form.Group>

                        <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2 pt-2">
                            2. Detalji prijave i lokacija
                        </h5>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="tip_prijave">
                                <Form.Label className="fw-medium">Tip prijave</Form.Label>
                                <Form.Select name="tip_prijave" defaultValue="" required>
                                    <option value="" disabled>Odaberi tip...</option>
                                    {tipovi && tipovi.map(t =>
                                        <option key={t.id} value={t.id}>
                                            {t.naziv}
                                        </option>
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="status">
                                <Form.Label className="fw-medium">Status</Form.Label>
                                <Form.Select name="status" required>
                                    <option value="otvorena">Otvorena</option>
                                    <option value="zatvorena">Zatvorena</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group s={Col} md={6} controlId="lokacija_opis">
                                <Form.Label className="fw-medium">Opis lokacije</Form.Label>
                                <Form.Control type="text" name="lokacija_opis" placeholder="Gornji grad, Osijek" />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="datum">
                                <Form.Label className="fw-medium p-4">Datum i vrijeme</Form.Label>
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
                            </Form.Group>
                        </Row>

                        <div className="bg-light p-3 rounded-3 mb-4 border">
                            <Row className="align-items-centar">
                                <Col sm={6}>
                                    <Form.Group controlId="cipirana" className="mb-0">
                                        <Form.Check
                                            type="checkbox"
                                            label="Životinja je čipirana"
                                            name="cipirana"
                                            className="fw-medium text-dark"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="hitno" className="mb-0">
                                        <Form.Check type="checkbox" label="🚨 Hitna intervencija" name="hitno" className="fw-bold text-danger" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">
                                Odustani
                            </Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Spremi prijavu
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>

    )
}
