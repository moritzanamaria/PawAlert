import { useState, useEffect } from "react";
import TipService from "../../services/tip/TipService";
import VrsteService from "../../services/vrste/VrsteService";
import prijaveService from "../../services/prijave/prijaveService";
import { RouteNames, putanja } from "../../constants";
import { Badge, Button, Card, Col, Container, Row, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

export default function TipoviPregled() {
  const [vrste, setVrste] = useState([]);
  const [tipovi, setTipovi] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function dohvatiPodatke() {
      try {
        const [resTipovi, resVrste] = await Promise.all([
          TipService.get(),
          VrsteService.get()
        ]);
        setVrste(toArray(resVrste));
        setTipovi(toArray(resTipovi));
      } catch (error) {
        console.error("Greška pri dohvatu podataka:", error);
      }
    }
    dohvatiPodatke();
  }, []);

  async function obrisiVrstu(id) {
    const res = await prijaveService.get()
    const koristi = (res?.data ?? res).filter(p => p.zivotinja_vrsta === id).length
    if (koristi > 0) {
      alert(`Vrsta se koristi u ${koristi} prijava i ne može se obrisati.`)
      return
    }
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await VrsteService.obrisi(id)
    setVrste(prev => prev.filter(v => v.id !== id));
  }

  async function obrisiTip(id) {
    const res = await prijaveService.get()
    const koristi = (res?.data ?? res).filter(p => p.tip_prijave === id).length
    if (koristi > 0) {
      alert(`Tip se koristi u ${koristi} prijava i ne može se obrisati.`)
      return
    }
    if (!confirm("Sigurno obrisati ovaj tip?")) {
      return;
    }

    await TipService.obrisi(id);
    setTipovi(prev => prev.filter(t => t.id !== id));
  }

  return (
    <Container>
      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h3 className="fw-bold mb-1 text-dark">📋 Pregled tipova</h3>
                <p className="text-muted small mb-0">Popis svih definiranih tipova prijava</p>
              </div>
              <Link to={RouteNames.TIP_NOVI}
                className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2">
                <BiPlus size={20} /> Novi tip
              </Link>
            </Card.Header>

            <Card.Body className="p-0">
              <Table hover bordered responsive className="align-middle mb-0 border-top">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Naziv</th>
                    <th className="text-center pe-4" style={{ minWidth: "180px" }}>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {tipovi && tipovi.map((tip) => (
                    <tr key={tip.id}>
                      <td className="ps-4 fw-semibold text-dark">{tip.naziv}</td>
                      <td className="text-center pe-4">
                        <ButtonGroup size="sm">
                          <Button variant="outline-warning" onClick={() => { navigate(putanja(RouteNames.TIP_PROMJENA, tip.id)) }} title="Uredi">
                            <BiPencil size={16} /> Uredi
                          </Button>

                          <Button variant="outline-danger" onClick={() => obrisiTip(tip.id)} title="Obrisi">
                            <BiTrash size={16} /> Obriši
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
                Ukupno tipova: <Badge pill bg="primary" className="ms-1">{tipovi ? tipovi.length : 0}</Badge>
              </span>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h3 className="fw-bold mb-1 text-dark">🐾 Vrste životinja</h3>
                <p className="text-muted small mb-0">Upravljanje kategorijama životinja</p>
              </div>
              <Link
                to={RouteNames.VRSTA_NOVA}
                className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2"
              >
                <BiPlus size={20} /> Nova vrsta
              </Link>
            </Card.Header>

            <Card.Body className="p-0">
              <Table hover bordered responsive className="align-middle mb-0 border-top">
                <thead className="table-light">
                  <tr>
                    <th>Naziv</th>
                    <th className="text-center pe-4" style={{ width: "180px" }}>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {vrste && vrste.map((vrsta) => (
                    <tr key={vrsta.id}>
                      <td className="fw-semibold text-dark">{vrsta.naziv}</td>
                      <td className="text-center pe-4">
                        <ButtonGroup size="sm">
                          <Button variant="outline-warning" onClick={() => { navigate(putanja(RouteNames.VRSTA_PROMJENA, vrsta.id)) }} title="Uredi">
                            <BiPencil size={16} />
                          </Button>

                          <Button variant="outline-danger" onClick={() => obrisiVrstu(vrsta.id)} title="Obriši">
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
                Ukupno vrsta:{" "}
                <Badge pill bg="primary" className="ms-1">
                  {vrste ? vrste.length : 0}
                </Badge>
              </span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}