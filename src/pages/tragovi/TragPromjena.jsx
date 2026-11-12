import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale/hr";
import DatePicker, { registerLocale } from "react-datepicker";
import LokacijaPicker from "../../components/LokacijaPicker";
import { RouteNames, putanja } from "../../constants";
import { spremiSlikuFile } from "../../services/slike/SlikeService";
import { slikaUrl } from "../../utils/slika";
import { tragSchema } from "../../schemas/tragSchema";
import { slikaFileSchema } from "../../schemas/slikaSchema";

registerLocale("hr", hr);

export default function TragPromjena() {
    const navigate = useNavigate()

    const [errors, setErrors] = useState({});

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };
    const params = useParams()
    const [datum, setDatum] = useState(new Date());
    const [lokacija, setLokacija] = useState(null);
    const [slikaFile, setSlikaFile] = useState(null)
    const [cacheBust] = useState(Date.now())
    const pregled = useMemo(() => slikaFile ? URL.createObjectURL(slikaFile) : null, [slikaFile])

    const [trag, setTrag] = useState({
        prijava: "",
        korisnik: "",
        opis: "",
        lokacija_opis: "",
        lokacija_lat: 0,
        lokacija_lng: 0,
        datum: ""
    })

    function slikaSrc() {
        if (pregled) return pregled
        const u = slikaUrl(trag.slika)
        return u ? `${u}?t=${cacheBust}` : null
    }

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
            navigate(putanja(RouteNames.TRAG_PREGLED, trag.prijava))
        } catch (error) {
            console.error("Greška pri promjeni:", error);
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
        let slikaPath = trag.slika || ""
        if (slikaFile) {
            try {
                const rez = spremiSlikuFile(params.id, slikaFile)
                if (!rez.success) {
                    alert(rez.message)
                    return
                }
                slikaPath = rez.path
            } catch (err) {
                console.error(err)
                alert("Greška pri spremanju slike.")
                return
            }
        }

        promjeni({
            ...trag,
            opis: rezultat.data.opis,
            lokacija: rezultat.data.lokacija,
            datum: rezultat.data.datum.toISOString(),
            slika: slikaPath
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
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="opis"
                                defaultValue={trag.opis}
                                placeholder="Unesite opis traga..."
                                isInvalid={!!errors.opis}
                                onFocus={() => ocistiGresku("opis")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.opis}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Slika</Form.Label>
                            <Form.Control type="file" accept="image/png,image/jpeg,image/webp" onChange={odaberiSliku} isInvalid={!!errors.slika} />
                            <Form.Control.Feedback type="invalid">
                                {errors.slika}
                            </Form.Control.Feedback>
                            {slikaSrc() && (
                                <img src={slikaSrc()} alt="Slika traga" className="mt-2 rounded border"
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
                                        onChange={(date) => { setDatum(date); ocistiGresku("datum") }} showTimeSelect
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

                            <Link to={putanja(RouteNames.TRAG_PREGLED, trag.prijava)} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">Spremi</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}