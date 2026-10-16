import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Container, ListGroup, Row, Col } from "react-bootstrap"
import { RouteNames } from "../constants"
import prijaveService from "../services/prijave/prijaveService"
import TragoviService from "../services/tragovi/TragoviService"

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
                <Link to={RouteNames.PRIJAVE_PREGLED}>Natrag na katalog</Link>
            </Container>
        )
    }

    return (
       <div className="container my-4">
  <Row className="g-2">
    <Col xs={12} md={5} lg={6}>
      <img
        src={prijava.slika || `${import.meta.env.BASE_URL}nemaSlike.svg`}
        alt={prijava.zivotinja_ime}
        className="rounded shadow-sm"
        style={{ objectFit: "cover" }}
      />
    </Col>
    <Col xs={12} md={7} lg={6} className="card-body" style={{textAlign: "right"}}>
        <h1 className="card-title">{prijava.zivotinja_ime}</h1>
        <h1 className="card-text ">{prijava.zivotinja_opis}</h1>
        <h1 className="card-text fw-bold">{prijava.lokacija_opis}</h1>
              

            <h4 className="card-title">Tragovi</h4>
            {tragovi.length === 0 ? (
                <p className="card-text">Još nema tragova.</p>
            ) : (
                <ListGroup className="py-5" xs={12} md={6} lg= {5} style={{alignContent:"right"}}>
                    {tragovi.map((t) => (
                        <ListGroup.Item key={t.id}>
                            {t.opis}
                            {t.lokacija_opis && <div className="text-muted">{t.lokacija_opis}</div>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
    </Col>
  </Row>
</div>
    )
}