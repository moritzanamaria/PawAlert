import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import prijaveService from "../../services/prijave/prijaveService";
import TipPodaci from "../../services/tip/TipPodaci";
import VrstePodaci from "../../services/vrste/VrstePodaci";

export default function PrijavaNova() {
    const navigate = useNavigate()

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
            zivotinja_vrsta: podaci.get("zivotinja_vrsta"),
            zivotinja_opis: podaci.get('zivotinja_opis'),
            zivotinja_godine: podaci.get('zivotinja_godine') ? parseInt(podaci.get('zivotinja_godine')): null,
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: podaci.get('tip_prijave'),
            status: podaci.get('status') || 'otvorena',
            lokacija_opis: podaci.get('lokacija_opis'),
            datum: new Date(podaci.get('datum')).toISOString(),
            slika: podaci.get('slika'),
            hitno: podaci.get('hitno') === 'on'
        })
    }

    return (
        <Container className="my-4">
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
                    <Form.Select name="zivotinja_vrsta" defaultValue="" required>
                        <option value="" disabled>Odaberi vrstu...</option>
                    {VrstePodaci && VrstePodaci.map(v => 
                        <option key={v.id} value={v.naziv}>
                            {v.naziv}
                        </option>
                    )}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="zivotinja_opis">
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
                    <Form.Select name="tip_prijave" defaultValue=""required>
                        <option value="" disabled>Odaberi tip...</option>
                        {TipPodaci && TipPodaci.map(t => 
                        <option key={t.id} value={t.naziv}>
                            {t.naziv}
                        </option>
                    )}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="status">
    <Form.Label>Status</Form.Label>
    <Form.Select name="status" required>
        <option value="otvorena">Otvorena</option>
        <option value="zatvorena">Zatvorena</option>
    </Form.Select>
</Form.Group>

                <Form.Group controlId="lokacija_opis">
                    <Form.Label>Opis lokacije</Form.Label>
                    <Form.Control type="text" name="lokacija_opis" placeholder="Gornji grad, Osijek" />
                </Form.Group>


                <Form.Group controlId="datum">
                    <Form.Label>Datum i vrijeme</Form.Label>
                    <Form.Control type="datetime-local" name="datum" required />
                </Form.Group>

                <Form.Group controlId="slika">
                    <Form.Label>Slika (URL)</Form.Label>
                    <Form.Control type="url" name="slika" />
                </Form.Group>

                <Form.Group controlId="hitno" className="mt-3">
                    <Form.Check label="Hitno" name="hitno" />
                </Form.Group>

                <Row className="mt-4" >
                    <Col>
                        <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-danger">
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
