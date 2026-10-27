import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import FilterPrijava from "../components/FilterPrijava";
import { filtrirajPrijave, PRAZNI_FILTERI, jeZastarjela } from "../utils/filterHelpers";
import FormatDatuma from "../components/FormatDatuma";
import { RouteNames } from "../constants";
import { BiPlus } from "react-icons/bi";
import OznakeService from "../services/oznake/OznakeService";

export default function Katalog() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [tipovi, setTipovi] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [filteri, setFilteri] = useState(PRAZNI_FILTERI);
  const [sortiranje, setSortiranje] = useState("najnovije");

  useEffect(() => {
    prijaveService.get().then((res) => setPrijave(res.data || res));
    VrsteService.get().then((res) => setVrste(res.data || res));
    TipService.get().then((res) => setTipovi(res.data || res));
    OznakeService.get().then((res) => setOznake(res.data || res));
  }, []);

  const prikazanePrijave = filtrirajPrijave(prijave, filteri).sort((a, b) =>
    sortiranje === "najstarije"
      ? new Date(a.datum) - new Date(b.datum)
      : new Date(b.datum) - new Date(a.datum)
  );
  const getNazivVrste = (id) => vrste.find((v) => v.id === id)?.naziv ?? "";
  const getNazivTipa = (id) => tipovi.find((t) => t.id === id)?.naziv ?? "";

  const [animiraneSve, setAnimiraneSve] = useState(0);
  const [animiraneOtvorene, setAnimiraneOtvorene] = useState(0);
  const [animiraniHitni, setAnimiraniHitni] = useState(0);

  const brojSvih = prijave.length;
  const brojOtvorenih = prijave.filter(p => p.status === "otvorena").length;
  const brojHitnih = prijave.filter(p => p.hitno).length;

  useEffect(() => {
    if (animiraneSve < brojSvih) {
      const timer = setTimeout(() => {
        setAnimiraneSve(prev => Math.min(prev + 1, brojSvih));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animiraneSve, brojSvih]);

  useEffect(() => {
    if (animiraneOtvorene < brojOtvorenih) {
      const timer = setTimeout(() => {
        setAnimiraneOtvorene(prev => Math.min(prev + 1, brojOtvorenih));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animiraneOtvorene, brojOtvorenih]);

  useEffect(() => {
    if (animiraniHitni < brojHitnih) {
      const timer = setTimeout(() => {
        setAnimiraniHitni(prev => Math.min(prev + 1, brojHitnih));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animiraniHitni, brojHitnih]);

  return (
    <Container>
      <Row className="g-3 mb-4">
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-column justify-content-center">
            <div className="fs-2 fw-bold text-primary">{animiraneSve}</div>
            <div className="text-muted small">Ukupno prijava</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-column justify-content-center">
            <div className="fs-2 fw-bold text-success">{animiraneOtvorene}</div>
            <div className="text-muted small">Otvorene</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-column justify-content-center">
            <div className="fs-2 fw-bold text-danger">{animiraniHitni}</div>
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
          <Link to={RouteNames.PRIJAVA_NOVA} state={{ povratak: RouteNames.KATALOG }} className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2 justify-content-center col-12 col-md-auto">
            <BiPlus size={20} /> Nova prijava
          </Link>
        </Card.Header>
        <div className="px-4 pb-3">
          <FilterPrijava
            filteri={filteri}
            setFilteri={setFilteri}
            vrste={vrste}
            tipovi={tipovi}
            oznake={oznake}
            sortiranje={sortiranje}
            setSortiranje={setSortiranje}
          />
        </div>
      </Card>
      <Row className="g-4">
        {prikazanePrijave.map((prijava) => (
          <Col xs={12} md={4} key={prijava.id}>
            <Card className={`h-100 rounded-3 ${prijava.hitno ? "border border-danger border-3" : "border-0 shadow-sm"}`}
            style={prijava.hitno ? {boxShadow: "0 0 0 .25rem rgba(220,53,69,.15)"} : undefined} >
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
                    <br />
                    {getNazivVrste(prijava.zivotinja_vrsta)}
                  </Card.Title>
                </div>

                <Card.Subtitle className="mb-3 text-muted">
                      {getNazivTipa(prijava.tip_prijave)}
                </Card.Subtitle>

                <Card.Text className="small text-secondary mb-3 flex-grow-1">
                  📍 <strong>Lokacija:</strong> {prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}
                  <br />
                  🕒 <strong>Vrijeme:</strong> {" "} <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" relativno />
                  {jeZastarjela(prijava) && (
                    <span className="text-warning-emphasis fw-medium"> zastarjelo </span>
                  )}
                  {prijava.oznake && prijava.oznake.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {prijava.oznake.map((idOznake, idx) => {
                      const o = oznake.find((item) => Number(item.id) === Number(idOznake));
                      if (!o) return null;
                      return (
                        <span
                          key={o.id || idx}
                          className="badge"
                          style={{
                            backgroundColor: o.boja || "#6c757d",
                            color: "#fff",
                            fontSize: "0.75rem",
                          }}
                        >
                          {o.naziv}
                        </span>
                      );
                    })}
                  </div>
                )}
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

      {prikazanePrijave.length === 0 && (
        <div className="text-center py-5 text-muted">
          <h5>Nema prijava koje odgovaraju zadanim kriterijima.</h5>
        </div>
      )}
    </Container>
  );
}