import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import prijaveService from "../services/prijaveService";

export default function PrijavaNova() {
    const navigate = useNavigate()
    async function nova(prijava) {
        await prijaveService.nova(prijava).then(() => {
            navigate(RouteNames.PRIJAVE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        nova({
            zivotinja_ime: podaci.get('zivotinja_ime'),
            zivotinja_vrsta: podaci.get('zivotinja_vrsta'),
            zivotinja_opis: podaci.get('zivotinja_opis'),
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: podaci.get('tip_prijave'),
            status: podaci.get('status') || 'aktivna',
            lokacija_opis: podaci.get('lokacija_opis'),
            lokacija_lat: parseFloat(podaci.get('lokacija_lat')),
            lokacija_lng: parseFloat(podaci.get('lokacija_lng')),
            datum: new Date(podaci.get('datum')).toISOString(),
            slika: podaci.get('slika')
        })
    }

    return (
        <>
            <h3>
                Prijava novog slučaja
            </h3>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="zivotinja_ime">
                    <Form.Label>Ime životinje</Form.Label>
                    <Form.Control type="text" name="zivotinja_ime" placeholder="Nepoznato" />
                </Form.Group>

                <Form.Group controlId="zivotinja_vrsta">
                    <Form.Label>Vrsta</Form.Label>
                    <Form.Select name="zivotinja_vrsta" required>
                        <option value="pas">Pas</option>
                        <option value="mačka">Mačka</option>
                        <option value="ostalo">Ostalo</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="zivotinja_opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control as="textarea" rows={3} name="zivotinja_opis" />
                </Form.Group>

                <Form.Group controlId="zivotinja_godine">
                    <Form.Label>Godine</Form.Label>
                    <Form.Control type="number" name="zivotinja_godine" step={1} min={0} />
                </Form.Group>

                <Form.Group controlId="cipirana" className="mt-3">
                    <Form.Check label="Čipirana" name="cipirana" />
                </Form.Group>

                <Form.Group controlId="tip_prijave">
                    <Form.Label>Tip prijave</Form.Label>
                    <Form.Select name="tip_prijave" required>
                        <option value="vidjenje">Viđenje</option>
                        <option value="nestanak">Nestanak</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="lokacija_opis">
                    <Form.Label>Opis lokacije</Form.Label>
                    <Form.Control type="text" name="lokacija_opis" placeholder="Gornji grad, Osijek" />
                </Form.Group>

                <Form.Group controlId="lokacija_lat">
                    <Form.Label>Geografska širina</Form.Label>
                    <Form.Control type="number" name="lokacija_lat" step="any" />
                </Form.Group>

                <Form.Group controlId="lokacija_lng">
                    <Form.Label>Geografska dužina</Form.Label>
                    <Form.Control type="number" name="lokacija_lng" step="any" />
                </Form.Group>

                <Form.Group controlId="datum">
                    <Form.Label>Datum i vrijeme</Form.Label>
                    <Form.Control type="datetime-local" name="datum" required />
                </Form.Group>

                <Form.Group controlId="slika">
                    <Form.Label>Slika (URL)</Form.Label>
                    <Form.Control type="url" name="slika" />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>

    )
}
