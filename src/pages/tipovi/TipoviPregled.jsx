import { useState, useEffect } from "react";
import TipService from "../../services/tip/TipService";
import { RouteNames } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";

export default function TipoviPregled() {
  const [tipovi, setTipovi] = useState([])
  const navigate = useNavigate()

  async function ucitajTipove() {
    await TipService.get().then((odgovor) => {
      setTipovi(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajTipove()
  }, [])

  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await TipService.obrisi(id)
    ucitajTipove()
  }

  return (
   <Container className="my-5" style={{ maxWidth: "850px" }}>
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
                <Button variant="outline-warning" onClick={() => { navigate(`/tip/${tip.id}`) }} title="Uredi">
                  <BiPencil size={16} /> Uredi
                </Button>
        
                <Button variant="outline-danger" onClick={() => obrisi(tip.id)} title="Obrisi">
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
        </Container>
  )
}