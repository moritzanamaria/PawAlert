import { useState, useEffect } from "react";
import VrsteService from "../../services/vrste/VrsteService";
import { RouteNames } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";

export default function VrstePregled() {
  const [vrste, setVrste] = useState([])
  const navigate = useNavigate()

  async function ucitajVrste() {
    await VrsteService.get().then((odgovor) => {
      setVrste(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajVrste()
  }, [])


  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await VrsteService.obrisi(id)
    ucitajVrste()
  }

  return (
    <Container className="my-5" style={{ maxWidth: "850px" }}>
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
                      <Button variant="outline-warning" onClick={() => { navigate(`/vrste/${vrsta.id}`) }} title="Uredi">
                        <BiPencil size={16} />
                      </Button>

                      <Button variant="outline-danger" onClick={() => obrisi(vrsta.id)} title="Obriši">
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
    </Container>
  );
}