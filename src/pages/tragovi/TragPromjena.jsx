import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import TragoviService from "../../services/tragovi/TragoviService";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale("hr", hr);

export default function TragPromjena() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [datum, setDatum] = useState(new Date());

    const [trag, setTrag] = useState({
        prijava: "",
        korisnik: "",
        opis: "",
        lokacija_opis: "",
        lokacija_lat: 0,
        lokacija_lng: 0,
        datum: ""
    })

    async function ucitajTrag() {
        await TragoviService.getById(id).then((odgovor) => {
            setTrag(odgovor.data)
        })
    }

    useEffect(() => {
        ucitajTrag()
    }, [])

    async function promjeni(podaci) {
        await TragoviService.promjeni(id, podaci).then(() => {
            navigate(`/prijave/${trag.prijava}/tragovi`)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            ...trag,
            prijava: parseInt(podaci.get('prijava')),
            korisnik: parseInt(podaci.get('korisnik')),
            opis: podaci.get('opis'),
            lokacija_opis: podaci.get('lokacija_opis'),
            lokacija_lat: parseFloat(podaci.get('lokacija_lat')) || 0,
            lokacija_lng: parseFloat(podaci.get('lokacija_lng')) || 0,
            datum: new Date(podaci.get('datum')).toISOString(),
        })
    }

    return (
        <div className="container my-4">
            <h3>Promjena traga {id}</h3>
            <Form key={trag.id} onSubmit={obradiSubmit}>
                <Form.Group className="mb-3" controlId="naziv">
                    <Form.Label>Prijava (ID)</Form.Label>
                    <Form.Control type="text" name="prijava" defaultValue={trag.prijava} />
                </Form.Group>
                <Form.Group controlId="korisnik" className="mb-3">
                    <Form.Label>Korisnik (ID)</Form.Label>
                    <Form.Control type="number" name="korisnik" defaultValue={trag.korisnik} required />
                </Form.Group>

                <Form.Group controlId="opis" className="mb-3">
                    <Form.Label>Opis traga</Form.Label>
                    <Form.Control as="textarea" rows={3} name="opis" defaultValue={trag.opis} required />
                </Form.Group>

                <Form.Group controlId="lokacija_opis" className="mb-3">
                    <Form.Label>Opis lokacije</Form.Label>
                    <Form.Control type="text" name="lokacija_opis" defaultValue={trag.lokacija_opis} required />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="lokacija_lat" className="mb-3">
                            <Form.Label>Geografska širina (Latitude)</Form.Label>
                            <Form.Control type="number" step="any" name="lokacija_lat" defaultValue={trag.lokacija_lat} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="lokacija_lng" className="mb-3">
                            <Form.Label>Geografska dužina (Longitude)</Form.Label>
                            <Form.Control type="number" step="any" name="lokacija_lng" defaultValue={trag.lokacija_lng} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="datum" className="mb-3">
                    <Form.Label className="p-4">Datum i vrijeme</Form.Label>
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
                <Row className="mt-4">
                    <Col>
                        <Link to={`/prijave/${trag.prijava}/tragovi`} className="btn btn-danger">Odustani</Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">Spremi</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}