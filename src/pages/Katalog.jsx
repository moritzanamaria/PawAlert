import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import PretragaInput from "../components/PretragaInput";
import VrstaSelect from "../components/VrstaSelect";
import { filtrirajPrijave } from "../utils/filterHelpers";
import FormatDatuma from "../components/FormatDatuma";
import { RouteNames } from "../constants";
import { BiPlus } from "react-icons/bi";

export default function Katalog() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [tipovi, setTipovi]= useState([]);
  const [pretraga, setPretraga] = useState("");
  const [vrsta, setVrsta] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    prijaveService.get().then((res) => setPrijave(res.data || res));
    VrsteService.get().then((res) => setVrste(res.data || res));
    TipService.get().then((res) => setTipovi(res.data || res));
  }, []);

  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, vrsta, vrste);
const getNazivVrste = (id) => vrste.find((v) => v.id === id)?.naziv ?? "";
const getNazivTipa = (id) => tipovi.find((t) => t.id === id)?.naziv ?? "";

const ukupnoPrijava = prijave.length;
  const otvorenePrijave = prijave.filter((p) => p.status === "otvorena").length;
  const hitnePrijave = prijave.filter((p) => p.hitno).length;

  return (
    <Container>
        <Row className="g-3 mb-4">
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-col justify-content-center">
            <div className="fs-2 fw-bold text-primary">{ukupnoPrijava}</div>
            <div className="text-muted small">Ukupno prijava</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-column justify-content-center">
            <div className="fs-2 fw-bold text-success">{otvorenePrijave}</div>
            <div className="text-muted small">Otvorene</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-column justify-content-center">
            <div className="fs-2 fw-bold text-danger">{hitnePrijave}</div>
            <div className="text-muted small">Hitni slučajevi</div>
          </div>
        </Col>
      </Row>
      <Card className="shadow-sm border-0 rounded-3 mb-4">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">🎴 Katalog</h3>
            <p className="text-muted small mb-0">Popis svih prijavljenih slučajeva</p>
          </div>
          <Link to={RouteNames.PRIJAVA_NOVA} className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2 justify-content-center col-12 col-md-auto">
            <BiPlus size={20} /> Nova prijava
          </Link>
        </Card.Header>
        <div className="px-4 pb-3">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <PretragaInput pretraga={pretraga} setPretraga={setPretraga} />
            </Col>
            <Col xs={12} md={6}>
              <VrstaSelect vrsta={vrsta} setVrsta={setVrsta} vrste={vrste} />
            </Col>
          </Row>
        </div>
      </Card>
<Row className="g-4">
        {filtriranePrijave.map((prijava) => (
          <Col xs={12} md={4} key={prijava.id}>
            <Card className="h-100 shadow-sm border-0 rounded-3">
              {prijava.slika && (
                <Card.Img 
                  variant="top" 
                  src={prijava.slika} 
                  style={{ height: "200px", objectFit: "cover" }} 
                  alt={prijava.zivotinja_ime || "Slika prijave"} 
                />
              )}
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2 justify-content-center col-12 col-md-auto">
                  <Card.Title className="mb-0 fw-bold fs-4">
                    {prijava.zivotinja_ime}
                  </Card.Title>
                  <Badge bg={getNazivTipa(prijava.tip_prijave) === "Nestanak" ? "danger" : "info"} className="fs-6 text-wrap text-start mw-100" style={{ whiteSpace: "normal", lineHeight: 1.3 }}>
                    {getNazivTipa(prijava.tip_prijave)}
                  </Badge>
                </div>

                <Card.Subtitle className="mb-3 text-muted">
                  {getNazivVrste(prijava.zivotinja_vrsta)}
                </Card.Subtitle>

                <Card.Text className="small text-secondary mb-3 flex-grow-1">
                  📍 <strong>Lokacija:</strong> {prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}
                  <br />
                  🕒 <strong>Vrijeme:</strong> <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                </Card.Text>

                <Link
                  to={RouteNames.DETALJI_SLUCAJA.replace(':id', prijava.id)}
                  className="btn btn-primary"
                >
                  Detalji i tragovi
                </Link>
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