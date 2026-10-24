import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale/hr";
import DatePicker, { registerLocale } from "react-datepicker";
import LokacijaPicker from "../../components/LokacijaPicker";
import { validirajLokaciju } from "../../utils/lokacija";

registerLocale("hr", hr);

export default function TragPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [datum, setDatum] = useState(new Date());
    const [lokacija, setLokacija] = useState(null);
    const [trag, setTrag] = useState({
        prijava: "",
        korisnik: "",
        opis: "",
        lokacija_opis: "",
        lokacija_lat: 0,
        lokacija_lng: 0,
        datum: ""
    })

    useEffect(() => {
        async function ucitajTrag() {
            try {
                const res = await TragoviService.getById(params.id);
                const tData = res?.data ?? res;
                setTrag(tData || {});
                if (tData?.datum) setDatum(new Date(tData.datum))
                if (tData?.lokacija) {
                    setLokacija(tData.lokacija);
                } else if (tData?.lokacija_opis || tData?.lokacija_lat) {
                    setLokacija({
                        opis: tData.lokacija_opis || "",
                        lat: tData.lokacija_lat || 0,
                        lng: tData.lokacija_lng || 0
                    });
                }
            } catch (error) {
                console.error("Greška:", error);
            }
        }
        if (params.id) {
            ucitajTrag();
        }
    }, [params.id]);

    async function promjeni(podaci) {
        try {
            await TragoviService.promjeni(params.id, podaci)
            navigate(`/prijave/${trag.prijava}/tragovi`)
        } catch (error) {
            console.error("Greška pri promjeni:", error);
        }
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

        const greskaLokacije = validirajLokaciju(lokacija)
        if (greskaLokacije) {
            alert(greskaLokacije)
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

        promjeni({
            ...trag,
            opis: opis,
            lokacija: { ...lokacija, opis: lokacija.opis.trim() },
            datum: datum.toISOString(),
        })
    }
    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️Promjena traga</h3>
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
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium">Lokacija</Form.Label>
                                <LokacijaPicker value={lokacija} onChange={setLokacija} />
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