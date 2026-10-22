import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Card, Container, ListGroup, Row, Col } from "react-bootstrap"
import { RouteNames } from "../constants"
import prijaveService from "../services/prijave/prijaveService"
import TragoviService from "../services/tragovi/TragoviService"
import FormatDatuma from "../components/FormatDatuma"; 
import { BiPlus, BiMap, BiTime } from "react-icons/bi";

export default function DetaljiSlucaja() {
    const { id } = useParams()
    const [prijava, setPrijava] = useState(null)
    const [tragovi, setTragovi] = useState([])

    useEffect(() => {
        async function ucitaj() {
            const odgovor = await prijaveService.getById(id)
            setPrijava(odgovor.data ?? null)
            const t = await TragoviService.getByPrijava(id)
            setTragovi(t.data)
        }
        ucitaj()
    }, [id])


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
                            to={`/prijave/${id}/tragovi/dodaj`}
                            className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-medium text-decoration-none shadow-sm px-3 py-2"
                        >
                            <BiPlus size={18} /> Novi trag
                        </Link>
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
                        <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-outline-secondary">
                            ← Natrag na pregled prijava
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}