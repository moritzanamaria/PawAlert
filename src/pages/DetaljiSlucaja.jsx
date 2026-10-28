import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Card, Container, ListGroup, Row, Col } from "react-bootstrap"
import { RouteNames, putanja } from "../constants"
import prijaveService from "../services/prijave/prijaveService"
import TragoviService from "../services/tragovi/TragoviService"
import FormatDatuma from "../components/FormatDatuma";
import { BiPlus, BiMap, BiTime } from "react-icons/bi";
import TragoviMapa from "../components/TragoviMapa";
import OznakeService from "../services/oznake/OznakeService"

export default function DetaljiSlucaja() {
    const { id } = useParams()
    const [prijava, setPrijava] = useState(null)
    const [tragovi, setTragovi] = useState([])
    const [oznake, setOznake] = useState([])

    useEffect(() => {
        async function ucitaj() {
          try {
                const [odgovor, t, resOznake] = await Promise.all([
                    prijaveService.getById(id),
                    TragoviService.getByPrijava(id),
                    OznakeService.get()
                ])
                setPrijava(odgovor.data ?? null)
                setTragovi(t.data ?? [])
                setOznake(resOznake.data ?? [])
            } catch (error) {
                console.error("Greška pri dohvatu podataka:", error)
            }
        }
        ucitaj()
    }, [id])

    const renderOznaka = () => {
    if (!prijava || oznake.length === 0) return 
    const oznakePrijave = prijava.oznake ?? (
        prijava.oznaka_id != null
            ? [prijava.oznaka_id]
            : prijava.oznaka != null
                ? [prijava.oznaka]
                : []
    );

    const oznakeZaPrikaz = oznakePrijave
        .map((stavka) => {
            const oznakaId =
                typeof stavka === "object"
                    ? stavka.id
                    : stavka;

            return oznake.find(
                (o) => String(o.id) === String(oznakaId)
            );
        })
        .filter(Boolean);

    if (oznakeZaPrikaz.length === 0) return null;

    return (
        <div className="d-flex flex-wrap gap-2 mb-3">
            {oznakeZaPrikaz.map((oznaka) => (
                <span
                    key={oznaka.id}
                    style={{
                        backgroundColor: oznaka.boja || "#6c757d",
                        color:  oznaka.boja_teksta || "#fff"
                    }}
                    className="px-2 py-1 fs-6 rounded-pill"
                >
                    {oznaka.naziv}
                </span>
            ))}
        </div>
    );
};
    if (!prijava) {
        return (
            <Container className="my-4">
                <p>Slučaj nije pronađen.</p>
                <Link to={RouteNames.KATALOG}>Natrag na katalog</Link>
            </Container>
        )
    }

    return (
        <Container className="my-5">
            <Row className="g-4">
                <Col xs={12} md={5} lg={6}>
                    <Card className="shadow-sm border-0 overflow-hidden">
                        <Card.Img
                            variant="top"
                            src={prijava.slika || `${import.meta.env.BASE_URL}nemaSlike.svg`}
                            alt={prijava.zivotinja_ime || "Životinja"}
                            style={{ height: "350px", objectFit: "cover" }}
                        />
                        <Card.Body>
                            <h2 className="fw-bold mb-2">{prijava.zivotinja_ime || "Nepoznato ime"}</h2>
                           <div> {renderOznaka()} </div>
                            <p className="text-secondary mb-3">{prijava.zivotinja_opis}</p>

                            <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                                <BiMap size={18} />
                                <span>{prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}</span>
                            </div>

                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <BiTime size={18} />
                                <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={7} lg={6}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">🐾 Tragovi i viđenja</h4>
                        <Link
                            to={putanja(RouteNames.TRAG_NOVI, id)}
                            state={{ povratak: putanja(RouteNames.DETALJI_SLUCAJA, id) }}
                            className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-medium text-decoration-none shadow-sm px-3 py-2"
                        >
                            <BiPlus size={18} /> Novi trag
                        </Link>
                    </div>
                    <div className="mb-3 shadow-sm rounded-3 overflow-hidden">
                        <TragoviMapa prijava={prijava} tragovi={tragovi} />
                    </div>
                    {tragovi.length === 0 ? (
                        <Card className="border-0 shadow-sm p-4 text-center text-muted bg-light">
                            <p className="mb-0">Još nema zabilježenih tragova za ovaj slučaj.</p>
                        </Card>
                    ) : (
                        <ListGroup className="shadow-sm">
                            {tragovi.map((t) => (
                                <ListGroup.Item key={t.id} className="p-3">
                                    <div className="fw-medium text-dark">{t.opis}</div>
                                    <div className="text-muted small mt-1">
                                        📍 {t.lokacija?.opis || t.lokacija_opis || "Lokacija na karti"}
                                    </div>
                                    <div className="text-muted small mt-1">
                                        🕒 <FormatDatuma datum={t.datum} prikazDatuma="Nepoznato" />
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    <div className="mt-4">
                        <Link to={RouteNames.KATALOG} className="btn btn-outline-secondary">
                            ← Natrag na Katalog
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}