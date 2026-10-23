import { useState, useEffect } from "react";
import TragoviService from "../../services/tragovi/TragoviService";
import { RouteNames } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormatDatuma from "../../components/FormatDatuma";
import { BiPlus, BiPencil, BiTrash, BiArrowBack } from "react-icons/bi";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

export default function TragPregled() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tragovi, setTragovi] = useState([])

useEffect(() => {
    async function ucitajTragove() {
      try {
        const res = await TragoviService.get();
        setTragovi(toArray(res));
      } catch (error) {
        console.error("Greška:", error);
      }
    }
    ucitajTragove();
  }, []);

  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await TragoviService.obrisi(id)
   setTragovi(prev => prev.filter(t => t.id !== id));
  }

  return (
    <Container className="my-5">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-1 text-dark">📍Tragovi </h3>
            <p className="text-muted small mb-0">Popis zabilježenih tragova i lokacija</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-outline-secondary d-flex align-items-center gap-1 shadow-sm px-3 py-2">
              <BiArrowBack size={18} /> Natrag na prijave
            </Link>
            <Link to={`/prijave/${id}/tragovi/dodaj`}
              className="btn btn-success d-flex align-items-center gap-1 shadow-sm px-3 py-2">
              <BiPlus size={20} /> Novi trag
            </Link>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <Table bordered responsive hover className="align-middle mb-0 border-top">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Prijava</th>
                <th>Opis</th>
                <th>Lokacija</th>
                <th className="text-center">Datum</th>
                <th className="text-center pe-4" style={{ minWidth: "180px" }}>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {tragovi && tragovi.map((trag) => (
                <tr key={trag.id}>
                  <td className="ps-4 fw-semibold text-dark">{trag.prijava}</td>
                  <td>{trag.opis}</td>
                  <td className="text-muted">{trag.lokacija?.opis || trag.lokacija_opis || "Nepoznata lokacija"}</td>
                  <td className="text-center text-secondary small">
                    <FormatDatuma datum={trag.datum} />
                  </td>
                  <td className="text-center pe-4">
                    <ButtonGroup size="sm">
                      <Button variant="outline-warning" onClick={() => navigate(`/tragovi/${trag.id}`)} title="Uredi">
                        <BiPencil size={16} />
                      </Button>
                      <Button variant="outline-danger" onClick={() => obrisi(trag.id)} title="Obriši">
                        <BiTrash size={16} />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </Table>

        </Card.Body>
        <Card.Footer className="bg-light border-0 p-3 px-4 d-flex align-items-center justify-content-between">
          <span className="text-muted small">
            Ukupno tragova: <Badge pill bg="primary" className="ms-1">{tragovi ? tragovi.length : 0}</Badge>
          </span>
        </Card.Footer>
      </Card>
    </Container>
  )
}