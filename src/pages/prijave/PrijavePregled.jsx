import { useState, useEffect } from "react";
import prijaveService from "../../services/prijave/prijaveService";
import VrsteService from "../../services/vrste/VrsteService";
import TipService from "../../services/tip/TipService";
import { RouteNames } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup, Row, Col } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import PretragaInput from "../../components/PretragaInput";
import VrstaSelect from "../../components/VrstaSelect";
import { filtrirajPrijave } from "../../utils/filterHelpers";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash, BiSearch } from "react-icons/bi";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

export default function PrijavePregled() {
  const [prijave, setPrijave] = useState([])
  const [vrste, setVrste] = useState([]);
  const [tipovi, setTipovi] = useState([]);
  const [pretraga, setPretraga] = useState("");
  const [vrsta, setVrsta] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    async function dohvatiPodatke() {
      try {
        const [resPrijave, resVrste, resTipovi] = await Promise.all([
          prijaveService.get(),
          VrsteService.get(),
          TipService.get()
        ]);
        setPrijave(toArray(resPrijave));
        setVrste(toArray(resVrste));
        setTipovi(toArray(resTipovi));
      } catch (error) {
        console.error("Greška pri dohvatu podataka:", error);
      }
    }

    dohvatiPodatke();
  }, []);

  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await prijaveService.obrisi(id)
    setPrijave(prevPrijave => prevPrijave.filter(p => p.id !== id));
  }

  const getNazivVrste = (id) => {
    const vrsta = vrste.find(v => v.id === id);
    return vrsta ? vrsta.naziv : id;
  };

  const getNazivTipa = (id) => {
    const tip = tipovi.find(t => t.id === id);
    return tip ? tip.naziv : id;
  };

  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, vrsta, vrste);

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
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-col justify-content-center">
            <div className="fs-2 fw-bold text-primary">{animiraneSve}</div>
            <div className="text-muted small">Ukupno prijava</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-col justify-content-center">
            <div className="fs-2 fw-bold text-success">{animiraneOtvorene}</div>
            <div className="text-muted small">Otvorene</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="card shadow-sm border-0 p-3 text-center h-100 d-flex flex-col justify-content-center">
            <div className="fs-2 fw-bold text-danger">{animiraniHitni}</div>
            <div className="text-muted small">Hitni slučajevi</div>
          </div>
        </Col>
      </Row>
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">📋 Pregled prijava</h3>
            <p className="text-muted small mb-0">Popis svih uočenih i prijavljenih slučajeva</p>
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

        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0 border-top">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Ime životinje</th>
                <th className="d-none d-md-table-cell">Vrsta</th>
                <th className="d-none d-lg-table-cell">Lokacija</th>
                <th className="d-none d-lg-table-cell">Tip prijave</th>
                <th className="text-center d-none d-md-table-cell">Vrijeme prijave</th>
                <th className="text-center">Status</th>
                <th className="text-center pe-4" style={{ minWidth: "220px" }}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filtriranePrijave.map((prijava) => (
                <tr key={prijava.id} className={prijava.hitno ? "table-danger" : ""}>
                  <td className="ps-4 fw-semibold text-dark">
                    {prijava.zivotinja_ime || <span className="text-muted fst-italic">Nepoznato</span>}
                  </td>
                  <td className="d-none d-md-table-cell">
                    <Badge bg="info" className="text-dark bg-opacity-10 border border-info px-2 py-1">
                      {getNazivVrste(prijava.zivotinja_vrsta)}
                    </Badge>
                  </td>
                  <td className="text-muted d-none d-lg-table-cell">{prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}</td>
                  <td className="d-none d-lg-table-cell">{getNazivTipa(prijava.tip_prijave)}</td>
                  <td className="text-center text-secondary small d-none d-md-table-cell">
                    <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                  </td>
                  <td className="text-center">
                    <Badge bg={prijava.status === "otvorena" ? "success" : "secondary"} className="text-capitalize px-2 py-1">
                      {prijava.status}
                    </Badge>
                  </td>
                  <td className="text-center pe-4">
                    <ButtonGroup size="sm">
                      <Link to={`/prijave/${prijava.id}/tragovi`} className="btn btn-outline-primary" title="Tragovi">
                        <BiSearch size={16} /> Tragovi
                      </Link>
                      <Button variant="outline-warning" onClick={() => navigate(`/prijave/${prijava.id}`)} title="Uredi">
                        <BiPencil size={16} />
                      </Button>
                      <Button variant="outline-danger" onClick={() => obrisi(prijava.id)} title="Obriši">
                        <BiTrash size={16} />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>


        <Card.Footer className="bg-light border-0 p-3 px-4 d-flex align-items-center justify-content-between">
          <span className="text-muted small">
            Ukupno prijava: <Badge pill bg="primary" className="ms-1">{prijave ? prijave.length : 0}</Badge>
          </span>
        </Card.Footer>

      </Card>
    </Container>
  )
}
