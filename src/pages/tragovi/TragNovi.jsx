import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import { useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";
import LokacijaPicker from "../../components/LokacijaPicker";
import { RouteNames, putanja } from "../../constants";
import { spremiSlikuFile } from "../../services/slike/SlikeService";
import { tragSchema } from "../../schemas/tragSchema";
import { slikaFileSchema } from "../../schemas/slikaSchema";
import useAuth from "../../hooks/useAuth"

registerLocale("hr", hr);

export default function TragNovi() {
    const navigate = useNavigate()

    const [errors, setErrors] = useState({});

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };

    const location = useLocation()
    const { id } = useParams()
    const povratak = location.state?.povratak ?? putanja(RouteNames.TRAG_PREGLED, id)
    const [datum, setDatum] = useState(new Date())
    const [lokacija, setLokacija] = useState(null)
    const [slikaFile, setSlikaFile] = useState(null)
    const pregled = useMemo(() => slikaFile ? URL.createObjectURL(slikaFile) : null, [slikaFile])
    const { authUser } = useAuth();

    function odaberiSliku(e) {
        const file = e.target.files[0]
        if (!file) {
            setSlikaFile(null)
            ocistiGresku("slika")
            return
        }

        const rezultat = slikaFileSchema(2).safeParse(file)
        if (!rezultat.success) {
            setErrors({ ...errors, slika: rezultat.error.issues[0].message })
            setSlikaFile(null)
            e.target.value = ""
            return
        }
        ocistiGresku("slika")
        setSlikaFile(file)
    }

    async function dodaj(trag) {
        try {
            const res = await TragoviService.dodaj(trag)
            const noviId = (res?.data ?? res)?.id ?? trag.id

            if (slikaFile && noviId) {
                const rez = await spremiSlikuFile(noviId, slikaFile)
                if (rez.success) {
                    await TragoviService.promjeni(noviId, { ...trag, slika: rez.path })
                } else {
                    alert("Trag je spremljen, ali slika nije: " + rez.message)
                }
            }
            navigate(povratak)
        } catch (error) {
            alert(error.message)
        }
    }
    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)


        setErrors({});
        const rezultat = tragSchema.safeParse({ ...Object.fromEntries(podaci), lokacija, datum });
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

        dodaj({
            prijava: parseInt(id),
            opis: rezultat.data.opis,
            lokacija: rezultat.data.lokacija,
            datum: rezultat.data.datum.toISOString(),
            operater_id: authUser.id,
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-success text-white p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">🐾Dodaj novi trag za prijavu
                    </h3>
                    <p className="mb-0 text-white-50 small">
                        Unesite podatke o novom tragu
                    </p>

                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>

                        <Form.Group controlId="opis" className="mb-3">
                            <Form.Label className="fw-medium">Opis traga</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="opis"
                                placeholder="Unesite opis traga..."
                                isInvalid={!!errors.opis}
                                onFocus={() => ocistiGresku("opis")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.opis}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Slika (nije obavezno)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={odaberiSliku}
                                isInvalid={!!errors.slika}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.slika}
                            </Form.Control.Feedback>
                            {pregled && (
                                <img src={pregled} alt="Pregled" className="mt-2 rounded border"
                                    style={{ maxWidth: "100%", maxHeight: 180, objectFit: "cover" }} />
                            )}
                        </Form.Group>

                        <Row className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium">Lokacija</Form.Label>
                                <LokacijaPicker value={lokacija} onChange={(l) => { setLokacija(l); ocistiGresku("lokacija") }} />
                                <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors.lokacija}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="datum" className="mb-3">
                                <Form.Label className="fw-medium">Datum i vrijeme</Form.Label>
                                <div>
                                    <DatePicker
                                        selected={datum}
                                        onChange={(date) => { setDatum(date); ocistiGresku("datum") }}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="dd.MM.yyyy. HH:mm"
                                        locale="hr"
                                        customInput={<Form.Control isInvalid={!!errors.datum} />}
                                    />
                                    <Form.Control.Feedback type="invalid" className="d-block">
                                        {errors.datum}
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Row>
                        <div className="d-flex justify-content-between align-items-center pt-2">

                            <Link to={povratak} className="btn btn-outline-secondary px-4 fw-medium">
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