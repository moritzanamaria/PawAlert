import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, ListGroup } from "react-bootstrap";
import { GrAlert } from "react-icons/gr";
import prijaveService from "../../services/prijave/prijaveService";
import tragoviService from "../../services/tragovi/tragoviService";
import FormatDatuma from "../../components/FormatDatuma";

export default function PrijavaDetalji() {
  const { id } = useParams();
  const [prijava, setPrijava] = useState(null);
  const [tragovi, setTragovi] = useState([]);

  useEffect(() => {
    async function ucitaj() {
      const resPrijava = await prijaveService.getById(id);
      setPrijava(resPrijava.data || resPrijava);

      const resTragovi = await tragoviService.getByPrijavaId(id);
      setTragovi(resTragovi.data || resTragovi || []);
    }
    ucitaj();
  }, [id]);

  if (!prijava) {
    return (
      <Container className="my-5 text-center">
        <p>Učitavanje detalja prijave...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Link to={-1} className="btn btn-outline-secondary mb-3">
        ← Natrag
      </Link>

      <Row className="g-4">
        <Col md={5}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              variant="top"
              src={prijava.slika || "https://via.placeholder.com/400x250"}
              style={{ height: "280px", objectFit: "cover" }}
            />
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <Badge bg={prijava.tip_prijave === "Nestanak" ? "danger" : "info"}>
                  {prijava.tip_prijave}
                </Badge>
                <Badge bg={prijava.status === "otvorena" ? "warning" : "secondary"}>
                  {prijava.status}
                </Badge>
              </div>

              {prijava.hitno && (
                <Badge bg="danger" className="w-100 mb-2">
                  <GrAlert /> HITNO
                </Badge>
              )}

              <h3 className="fw-bold">{prijava.zivotinja_ime || "Nepoznato"}</h3>
              <p className="text-muted small mb-3">
                {prijava.zivotinja_vrsta} • {prijava.zivotinja_pasmina || "Nepoznata pasmina"}
              </p>

              <p className="mb-1">📍 <strong>Lokacija:</strong> {prijava.lokacija_opis}</p>
              <p className="text-muted small">
                🕒 <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
              </p>

              {prijava.zivotinja_opis && (
                <p className="bg-light p-2 rounded small mt-2">
                  {prijava.zivotinja_opis}
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="border-0 shadow-sm p-3">
            <h4 className="fw-bold mb-3">Dojavljeni tragovi 🐾 ({tragovi.length})</h4>
            {tragovi.length === 0 ? (
              <p className="text-muted">Nema zabilježenih tragova.</p>
            ) : (
              <ListGroup variant="flush">
                {tragovi.map((t) => (
                  <ListGroup.Item key={t.id} className="px-0 py-2">
                    <div className="d-flex justify-content-between small text-muted">
                      <span>📍 {t.lokacija_opis}</span>
                      <FormatDatuma datum={t.datum} prikazDatuma="Nepoznato" />
                    </div>
                    <p className="mb-0 mt-1">{t.opis}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}