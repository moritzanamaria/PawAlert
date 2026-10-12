import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { GrAlert } from "react-icons/gr";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import FilterBar from "../components/FilterBar";
import FormatDatuma from "../components/FormatDatuma";
import { filtrirajPrijave } from "../utils/filterHelpers";
import { RouteNames } from "../constants";

export default function Katalog() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [pretraga, setPretraga] = useState("");
  const [odabranaVrsta, setOdabranaVrsta] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    prijaveService.get().then((res) => setPrijave(res.data || res));
    VrsteService.get().then((res) => setVrste(res.data || res));
  }, []);

  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, odabranaVrsta);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Katalog prijava 🐾</h2>
        <Link to={RouteNames.PRIJAVA_NOVA} className="btn btn-success">
          + Nova prijava
        </Link>
      </div>

      <FilterBar
        pretraga={pretraga}
        setPretraga={setPretraga}
        vrsta={odabranaVrsta}
        setVrsta={setOdabranaVrsta}
        vrste={vrste}
      />

      <Row className="g-4 mt-1">
        {filtriranePrijave && filtriranePrijave.map((prijava) => (
          <Col key={prijava.id} sm={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 position-relative">
              <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
                {prijava.hitno && (
                  <Badge bg="danger" className="d-flex align-items-center gap-1 px-2 py-1 fs-6">
                    <GrAlert /> HITNO
                  </Badge>
                )}
              </div>

              <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
                <Badge
                  bg={prijava.status === "otvorena" ? "warning" : "secondary"}
                  text={prijava.status === "otvorena" ? "dark" : "white"}
                >
                  {prijava.status?.toUpperCase()}
                </Badge>
              </div>

              <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                <Card.Img
                  variant="top"
                  src={prijava.slika || "https://via.placeholder.com/400x200?text=Nema+slike"}
                  alt={prijava.zivotinja_ime}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>

              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="mb-0 fw-bold fs-4">
                    {prijava.zivotinja_ime || "Nepoznato"}
                  </Card.Title>
                  <Badge bg={prijava.tip_prijave === "Nestanak" ? "danger" : "info"} className="fs-6">
                    {prijava.tip_prijave}
                  </Badge>
                </div>

                <Card.Subtitle className="mb-3 text-muted">
                  {prijava.zivotinja_vrsta} {prijava.zivotinja_pasmina && `• ${prijava.zivotinja_pasmina}`}
                </Card.Subtitle>

                <Card.Text className="small text-secondary mb-3 flex-grow-1">
                  📍 <strong>Lokacija:</strong> {prijava.lokacija_opis || "Nije navedena"}
                  <br />
                  🕒 <strong>Vrijeme:</strong> <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                </Card.Text>

                <Button
                  variant="outline-primary"
                  className="w-100 mt-auto"
                  onClick={() => navigate(`/prijave/${prijava.id}`)}
                >
                  Detalji i tragovi
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filtriranePrijave.length === 0 && (
        <div className="text-center py-5 text-muted">
          <h5>Nema prijava koje odgovaraju zadanim kriterijima.</h5>
        </div>
      )}
    </Container>
  );
}