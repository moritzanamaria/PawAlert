import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import prijaveService from "../../services/prijave/prijaveService";
import TipService from "../../services/tip/TipService";
import VrsteService from "../../services/vrste/VrsteService";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";
import LokacijaPicker from "../../components/LokacijaPicker";
import { validirajLokaciju } from "../../utils/lokacija";

registerLocale("hr", hr);

export default function PrijavaPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [prijava, setPrijava] = useState({});
    const [vrste, setVrste] = useState([]);
    const [tipovi, setTipovi] = useState([]);
    const [cipirana, setCipirana] = useState(false);
    const [hitno, setHitno] = useState(false);
    const handleDateChange = (date) => {
        setPrijava({ ...prijava, datum: date });
    };
    const [lokacija, setLokacija] = useState(null);

    async function ucitajPodatke() {
        const [resPrijava, resVrste, resTipovi] = await Promise.all([
            prijaveService.getById(params.id),
            VrsteService.get(),
            TipService.get()
        ]);
        const pData = resPrijava?.data ?? resPrijava;
        const vData = Array.isArray(resVrste) ? resVrste : (resVrste?.data ?? []);
        const tData = Array.isArray(resTipovi) ? resTipovi : (resTipovi?.data ?? []);
        setPrijava(pData || {});
        setCipirana(Boolean(pData?.cipirana));
        setHitno(Boolean(pData?.hitno));
        if (pData?.lokacija) {
            setLokacija(pData.lokacija);
        }
        setVrste(Array.isArray(vData) ? vData : []);
        setTipovi(Array.isArray(tData) ? tData : []);
    }

    useEffect(() => {
        ucitajPodatke()
    }, [params.id])

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
            zivotinja_vrsta: parseInt(podaci.get("zivotinja_vrsta")),
            zivotinja_opis: podaci.get('zivotinja_opis'),
            zivotinja_godine: parseInt(podaci.get('zivotinja_godine')),
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: parseInt(podaci.get('tip_prijave')),
            status: podaci.get('status') || prijava.status || 'aktivna',
            lokacija_opis: podaci.get('lokacija_opis'),
            datum: podaci.get('datum'),
            slika: podaci.get('slika'),
            hitno: podaci.get('hitno') === 'on'
        })
    } function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const ime = (podaci.get('zivotinja_ime') || '').trim()
        if (ime.length > 0 && (ime.length < 2 || ime.length > 50)) {
            alert("Ime životinje mora imati najmanje 2 i najviše 50 znakova!")
            return
        }

        if (!podaci.get('zivotinja_vrsta')) {
            alert("Morate odabrati vrstu životinje!")
            return
        }

        const godineRaw = podaci.get('zivotinja_godine')
        if (godineRaw !== null && godineRaw !== '') {
            const godine = Number(godineRaw)
            if (isNaN(godine) || !Number.isInteger(godine) || godine < 0 || godine > 50) {
                alert("Godine moraju biti cijeli broj između 0 i 50!")
                return
            }
        }

        const slika = (podaci.get('slika') || '').trim()
        if (slika.length > 0 && !/^https?:\/\//i.test(slika)) {
            alert("URL slike mora započeti s http:// ili https://")
            return
        }

        const opis = (podaci.get('zivotinja_opis') || '').trim()
        if (opis.length > 500) {
            alert("Opis može imati najviše 500 znakova!")
            return
        }

        if (!podaci.get('tip_prijave')) {
            alert("Morate odabrati tip prijave!")
            return
        }

        const greskaLokacije = validirajLokaciju(lokacija)
        if (greskaLokacije) {
            alert(greskaLokacije)
            return
        }
        const odabraniDatum = prijava.datum ? new Date(prijava.datum) : null
        if (!odabraniDatum || isNaN(odabraniDatum.getTime())) {
            alert("Morate odabrati datum i vrijeme!")
            return
        }
        if (odabraniDatum > new Date()) {
            alert("Datum prijave ne može biti u budućnosti!")
            return
        }

        promjeni({
            ...prijava,
            zivotinja_ime: ime,
            zivotinja_vrsta: parseInt(podaci.get('zivotinja_vrsta')),
            zivotinja_opis: opis,
            zivotinja_godine: godineRaw ? parseInt(godineRaw) : null,
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: parseInt(podaci.get('tip_prijave')),
            status: podaci.get('status') || prijava.status || 'otvorena',
            lokacija: { ...lokacija, opis: lokacija.opis.trim() },
            datum: odabraniDatum.toISOString(),
            slika: slika,
            hitno: podaci.get('hitno') === 'on'
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️ Promjena slučaja</h3>
                    <p className="mb-0 text-dark-50 small">
                        Uredite podatke za odabranu prijavu.
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
                                    key={prijava.zivotinja_ime}
                                    defaultValue={prijava.zivotinja_ime}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="zivotinja_vrsta">
                                <Form.Label className="fw-medium">
                                    Vrsta <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="zivotinja_vrsta"
                                    value={prijava.zivotinja_vrsta || ""}
                                    onChange={(e) => setPrijava({ ...prijava, zivotinja_vrsta: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="" disabled>Odaberi vrstu...</option>
                                    {vrste && vrste.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.naziv}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="zivotinja_godine">
                                <Form.Label className="fw-medium">Procjena godina</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="zivotinja_godine"
                                    step={1}
                                    min={0}
                                    key={prijava.zivotinja_godine}
                                    defaultValue={prijava.zivotinja_godine}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="slika">
                                <Form.Label className="fw-medium">Slika (URL link)</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="slika"
                                    key={prijava.slika}
                                    defaultValue={prijava.slika}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-4" controlId="zivotinja_opis">
                            <Form.Label className="fw-medium">Opis životinje</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="zivotinja_opis"
                                key={prijava.zivotinja_opis}
                                defaultValue={prijava.zivotinja_opis}
                            />
                        </Form.Group>

                        <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2 pt-2">
                            2. Detalji prijave i lokacija
                        </h5>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="tip_prijave">
                                <Form.Label className="fw-medium">
                                    Tip prijave <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="tip_prijave"
                                    value={prijava.tip_prijave || ""}
                                    onChange={(e) => setPrijava({ ...prijava, tip_prijave: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="" disabled>Odaberi tip...</option>
                                    {tipovi && tipovi.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.naziv}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="status">
                                <Form.Label className="fw-medium">
                                    Status <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="status"
                                    key={prijava.status}
                                    defaultValue={prijava.status === "zatvorena" ? "zatvorena" : "otvorena"}
                                    required
                                >
                                    <option value="otvorena">Otvorena</option>
                                    <option value="zatvorena">Zatvorena</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium">Lokacija</Form.Label>
                                <LokacijaPicker value={lokacija} onChange={setLokacija} />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="datum">
                                <Form.Label className="fw-medium p-4">
                                    Datum i vrijeme <span className="text-danger">*</span>
                                </Form.Label>
                                <DatePicker
                                    selected={prijava.datum ? new Date(prijava.datum) : null}
                                    onChange={handleDateChange}
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
                            <Row className="align-items-center">
                                <Col sm={6}>
                                    <Form.Group controlId="cipirana" className="mb-0">
                                        <Form.Check
                                            type="checkbox"
                                            label="Životinja je čipirana"
                                            name="cipirana"
                                            className="fw-medium text-dark"
                                            checked={cipirana}
                                            onChange={(e) => setCipirana(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="hitno" className="mb-0">
                                        <Form.Check
                                            type="checkbox"
                                            label="🚨 Hitna intervencija"
                                            name="hitno"
                                            className="fw-bold text-danger"
                                            checked={hitno}
                                            onChange={(e) => setHitno(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link
                                to={RouteNames.PRIJAVE_PREGLED}
                                className="btn btn-outline-secondary px-4 fw-medium"
                            >
                                Odustani
                            </Link>
                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Spremi
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
