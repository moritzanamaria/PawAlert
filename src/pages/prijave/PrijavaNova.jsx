import { Link, useNavigate, useLocation } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import prijaveService from "../../services/prijave/prijaveService";
import VrsteService from "../../services/vrste/VrsteService";
import TipService from "../../services/tip/TipService";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";
import { useEffect, useState } from "react";
import LokacijaPicker from "../../components/LokacijaPicker";
import OznakeService from "../../services/oznake/OznakeService";
import { spremiSliku } from "../../services/slike/SlikeService";
import SlikaUploader from "../../components/SlikaUploader";
import { prijavaSchema } from "../../schemas/prijavaSchema";

registerLocale("hr", hr);

export default function PrijavaNova() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };
    const location = useLocation();
    const povratak = location.state?.povratak ?? RouteNames.PRIJAVE_PREGLED;
    const [datum, setDatum] = useState(new Date());
    const [vrste, setVrste] = useState([]);
    const [tipovi, setTipovi] = useState([]);
    const [oznake, setOznake] = useState([]);
    const [odabraneOznake, setOdabraneOznake] = useState([]);
    const [lokacija, setLokacija] = useState(null);
    const [novaSlika, setNovaSlika] = useState(null);

    useEffect(() => {
        async function dohvatiPodatke() {
            try {
                const [resVrste, resTipovi, resOznake] = await Promise.all([
                    VrsteService.get(),
                    TipService.get(),
                    OznakeService.get()
                ]);

                const vData = Array.isArray(resVrste) ? resVrste : (resVrste?.data ?? []);
                const tData = Array.isArray(resTipovi) ? resTipovi : (resTipovi?.data ?? []);
                const oData = Array.isArray(resOznake) ? resOznake : (resOznake?.data ?? []);

                setVrste(Array.isArray(vData) ? vData : []);
                setTipovi(Array.isArray(tData) ? tData : []);
                setOznake(Array.isArray(oData) ? oData : []);
            } catch (error) {
                console.error("Greška pri dohvatu podataka:", error);
            }
        }
        dohvatiPodatke();
    }, []);

    const handleOznakaChange = (id) => {
        if (odabraneOznake.includes(id)) {
            setOdabraneOznake(odabraneOznake.filter((item) => item !== id));
        } else {
            setOdabraneOznake([...odabraneOznake, id]);
        }
    };

    async function dodaj(prijava) {
        try {
            const res = await prijaveService.dodaj(prijava);
            const nova = res?.data ?? res;
            const noviId = nova?.id ?? prijava.id;


            if (novaSlika) {
                if (!noviId) {
                    console.error("Odgovor API-ja nema id:", res);
                    alert("Prijava je spremljena, ali slika nije jer API nije vratio id.");
                    navigate(povratak);
                    return;
                }

                const rez = await spremiSliku(noviId, novaSlika);
                if (rez.success) {
                    await prijaveService.promjeni(noviId, { ...prijava, slika: rez.path });
                } else {
                    alert("Prijava je spremljena, ali slika nije: " + rez.message);
                }
            }

            navigate(povratak);
        } catch (error) {
            alert(error.message);
        }
    }

    function obradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)

        setErrors({});
        const rezultat = prijavaSchema.safeParse({ ...Object.fromEntries(podaci), lokacija, datum });
        if (!rezultat.success) {
            const noveGreske = {};
            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0];
                if (!noveGreske[kljuc]) {
                    noveGreske[kljuc] = issue.message;
                }
            });
            setErrors(noveGreske);
            return;
        }

        const p = rezultat.data

        dodaj({
            zivotinja_ime: p.zivotinja_ime,
            zivotinja_vrsta: parseInt(p.zivotinja_vrsta),
            zivotinja_opis: p.zivotinja_opis,
            zivotinja_godine: p.zivotinja_godine ? parseInt(p.zivotinja_godine) : null,
            cipirana: podaci.get('cipirana') === 'on',
            tip_prijave: parseInt(p.tip_prijave),
            status: p.status,
            lokacija: p.lokacija,
            datum: p.datum.toISOString(),
            slika: "",
            hitno: podaci.get('hitno') === 'on',
            oznake: odabraneOznake
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
                                    placeholder="Npr. Reks"
                                    isInvalid={!!errors.zivotinja_ime}
                                    onFocus={() => ocistiGresku("zivotinja_ime")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.zivotinja_ime}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="zivotinja_vrsta">
                                <Form.Label className="fw-medium">Vrsta</Form.Label>
                                <Form.Select
                                    name="zivotinja_vrsta"
                                    defaultValue=""
                                    isInvalid={!!errors.zivotinja_vrsta}
                                    onFocus={() => ocistiGresku("zivotinja_vrsta")}>
                                    <option value="" disabled>Odaberi vrstu...</option>
                                    {vrste && vrste.map(v =>
                                        <option key={v.id} value={v.id}>
                                            {v.naziv}
                                        </option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.zivotinja_vrsta}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="zivotinja_godine">
                                <Form.Label className="fw-medium">Godine</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="zivotinja_godine"
                                    step={1}
                                    min={0}
                                    placeholder="Npr. 2"
                                    isInvalid={!!errors.zivotinja_godine}
                                    onFocus={() => ocistiGresku("zivotinja_godine")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.zivotinja_godine}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={6}>
                                <Form.Label className="fw-medium">Slika</Form.Label>
                                <SlikaUploader
                                    value={novaSlika}
                                    onChange={(val) => {
                                        setNovaSlika(val);
                                        ocistiGresku("slika");
                                    }}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-4" controlId="zivotinja_opis">
                            <Form.Label className="fw-medium">Opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="zivotinja_opis"
                                placeholder="Boja krzna, posebne oznake, ponašanje, ozljede..."
                                isInvalid={!!errors.zivotinja_opis}
                                onFocus={() => ocistiGresku("zivotinja_opis")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.zivotinja_opis}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2 pt-2">
                            Oznake (Tagovi)
                        </h5>
                        <div className="mb-4 p-3 bg-light rounded-3 border">
                            <div className="d-flex flex-wrap gap-3">
                                {oznake && oznake.length > 0 ? (
                                    oznake.map((oznaka) => (
                                        <Form.Check
                                            key={oznaka.id}
                                            type="checkbox"
                                            id={`oznaka-${oznaka.id}`}
                                            label={
                                                <span style={{ color: oznaka.boja || "inherit", fontWeight: "600" }}>
                                                    {oznaka.naziv}
                                                </span>
                                            }
                                            checked={odabraneOznake.includes(oznaka.id)}
                                            onChange={() => handleOznakaChange(oznaka.id)}
                                        />
                                    ))
                                ) : (
                                    <span className="text-muted small">Nema definiranih oznaka.</span>
                                )}
                            </div>
                        </div>

                        <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2 pt-2">
                            2. Detalji prijave i lokacija
                        </h5>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="tip_prijave">
                                <Form.Label className="fw-medium">Tip prijave</Form.Label>
                                <Form.Select
                                    name="tip_prijave"
                                    defaultValue=""
                                    isInvalid={!!errors.tip_prijave}
                                    onFocus={() => ocistiGresku("tip_prijave")}
                                >
                                    <option value="" disabled>Odaberi tip...</option>
                                    {tipovi && tipovi.map(t =>
                                        <option key={t.id} value={t.id}>
                                            {t.naziv}
                                        </option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.tip_prijave}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="status">
                                <Form.Label className="fw-medium">Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    isInvalid={!!errors.status}
                                    onFocus={() => ocistiGresku("status")}
                                >
                                    <option value="otvorena">Otvorena</option>
                                    <option value="zatvorena">Zatvorena</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.status}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium">Lokacija</Form.Label>
                                <LokacijaPicker
                                    value={lokacija}
                                    onChange={(l) => { setLokacija(l); ocistiGresku("lokacija") }}
                                />
                                <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors.lokacija}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="datum">
                                <Form.Label className="fw-medium p-4">Datum i vrijeme</Form.Label>
                                <DatePicker
                                    selected={datum}
                                    onChange={(date) => { setDatum(date); ocistiGresku("datum") }}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd.MM.yyyy. HH:mm"
                                    locale="hr"
                                    customInput={
                                        <Form.Control isInvalid={!!errors.datum} />
                                    }
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.datum}
                                </Form.Control.Feedback>
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
                            <Link to={povratak} className="btn btn-outline-secondary px-4 fw-medium">
                                Odustani
                            </Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Spremi prijavu
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container >

    )
}
