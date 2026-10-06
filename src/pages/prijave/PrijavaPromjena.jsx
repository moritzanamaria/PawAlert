import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import prijaveService from "../../services/prijave/prijaveService";
import TipPodaci from "../../services/tip/TipPodaci";
import VrstePodaci from "../../services/vrste/VrstePodaci";

export default function PrijavaPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [prijava, setPrijava] = useState({})
    const [cipirana, setCipirana] = useState(false);
    const [hitno, setHitno] = useState(false);

    async function ucitajPrijavu() {
        await prijaveService.getById(params.id).then((odgovor) => {
            const p = odgovor.data
            p.datum = p.datum.substring(0, 10)

            setPrijava(p)
            setCipirana(Boolean(p.cipirana))
            setHitno(Boolean(p.hitno))
        })
    }
    useEffect(() => {
        ucitajPrijavu()
    }, [])

    async function promjeni(podaciPrijave) {
        await prijaveService.promjeni(params.id, podaciPrijave).then(() => {
            navigate(RouteNames.PRIJAVE_PREGLED)
        })

    }
    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            ...prijava,
            zivotinja_ime: podaci.get('zivotinja_ime'),
            zivotinja_vrsta: podaci.get("zivotinja_vrsta"),
            zivotinja_opis: podaci.get('zivotinja_opis'),
            zivotinja_godine: parseInt(podaci.get('zivotinja_godine')),
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: podaci.get('tip_prijave'),
            status: podaci.get('status') || prijava.status || 'aktivna',
            lokacija_opis: podaci.get('lokacija_opis'),
            datum: new Date(podaci.get('datum')).toISOString(),
            slika: podaci.get('slika'),
            hitno: podaci.get('hitno') === 'on'
        })
    }

    return (
        <div className="container my-4">
            <h3>
                Promjena slučaja
            </h3>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="zivotinja_ime">
                    <Form.Label>Ime životinje</Form.Label>
                    <Form.Control type="text" name="zivotinja_ime"
                        defaultValue={prijava.zivotinja_ime} />
                </Form.Group>

                <Form.Group controlId="zivotinja_vrsta">
                    <Form.Label>Vrsta</Form.Label>
                    <Form.Select name="zivotinja_vrsta" defaultValue={prijava.zivotinja_vrsta} required>
                        <option value="" disabled
                        >Odaberi vrstu...</option>
                        {VrstePodaci && VrstePodaci.map((v) => (
                            <option key={v.id} value={v.naziv}>{v.naziv}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="zivotinja_opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control as="textarea" rows={3} name="zivotinja_opis"
                        defaultValue={prijava.zivotinja_opis} />
                </Form.Group>

                <Form.Group controlId="zivotinja_godine">
                    <Form.Label>Godine</Form.Label>
                    <Form.Control type="number" name="zivotinja_godine" step={1} min={0}
                        defaultValue={prijava.zivotinja_godine} />
                </Form.Group>

                <Form.Group controlId="cipirana" className="mt-3">
                    <Form.Check label="Čipirana" name="cipirana"
                        checked={cipirana}
                        onChange={(e) => { setCipirana(e.target.checked) }} />
                </Form.Group>

                <Form.Group controlId="tip_prijave">
                    <Form.Label>Tip prijave</Form.Label>
                    <Form.Select name="tip_prijave" required
                        defaultValue={prijava.tip_prijave}>
                        <option value="" disabled>Odaberi tip...</option>
                        {TipPodaci && TipPodaci.map((t) => (
                            <option key={t.id} value={t.naziv}>{t.naziv}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="lokacija_opis">
                    <Form.Label>Opis lokacije</Form.Label>
                    <Form.Control type="text" name="lokacija_opis" defaultValue={prijava.lokacija_opis} placeholder="Gornji grad, Osijek" />
                </Form.Group>


                <Form.Group controlId="datum">
                    <Form.Label>Datum i vrijeme</Form.Label>
                    <Form.Control type="datetime-local" name="datum" required defaultValue={prijava.datum} />
                </Form.Group>

                <Form.Group controlId="slika">
                    <Form.Label>Slika (URL)</Form.Label>
                    <Form.Control type="url" defaultValue={prijava.slika} name="slika" />
                </Form.Group>

                <Form.Group controlId="hitno" className="mt-3">
                    <Form.Check label="Hitno" name="hitno"
                        checked={hitno}
                        onChange={(e) => { setHitno(e.target.checked) }} />
                </Form.Group>

                <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" defaultValue={prijava.status === "zatvorena" ? "zatvorena" : "otvorena"} required>
                        <option value="otvorena">Otvorena</option>
                        <option value="zatvorena">Zatvorena</option>
                    </Form.Select>
                </Form.Group>

                <Row className="mt-4" >
                    <Col>
                        <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Spremi
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>

    )
}
