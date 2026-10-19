import { useState, useEffect } from "react";
import prijaveService from "../../services/prijave/prijaveService";
import { RouteNames } from "../../constants";
import { Badge, Button, Card, Container, Table, Spinner, ButtonGroup } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import { GrAlert } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { vrste } from "../../services/vrste/VrstePodaci";
import { tipovi } from "../../services/tip/TipPodaci";
import { BiPlus, BiPencil, BiTrash, BiSearch } from "react-icons/bi";

export default function PrijavePregled() {
  const [prijave, setPrijave] = useState([])
  const navigate = useNavigate()
  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajPrijave()
  }, [])


  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await prijaveService.obrisi(id)
    ucitajPrijave()
  }

  const getNazivVrste = (id) => {
    const vrsta = vrste.find(v => v.id === id);
    return vrsta ? vrsta.naziv : id;
  };

  const getNazivTipa = (id) => {
    const tip = tipovi.find(t => t.id === id);
    return tip ? tip.naziv : id;
  };


  return (
    <Container className="my-5">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-1 text-dark">📋 Pregled prijava</h3>
            <p className="text-muted small mb-0">Popis svih uočenih i prijavljenih slučajeva</p>
          </div>
          <Link to={RouteNames.PRIJAVA_NOVA} className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2">
            <BiPlus size={20} /> Nova prijava
          </Link>
        </Card.Header>

        <Card.Body className="p-0">
            <Table responsive hover className="align-middle mb-0 border-top">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Ime životinje</th>
                  <th>Vrsta</th>
                  <th>Lokacija</th>
                  <th>Tip prijave</th>
                  <th className="text-center">Vrijeme prijave</th>
                  <th className="text-center">Hitno</th>
                  <th className="text-center">Status</th>
                  <th className="text-center pe-4" style={{ minWidth: "220px" }}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {prijave.map((prijava) => (
                  <tr key={prijava.id}>
                    <td className="ps-4 fw-semibold text-dark">
                      {prijava.zivotinja_ime || <span className="text-muted fst-italic">Nepoznato</span>}
                    </td>
                    <td>
                      <Badge bg="info" className="text-dark bg-opacity-10 border border-info px-2 py-1">
                        {getNazivVrste(prijava.zivotinja_vrsta)}
                      </Badge>
                    </td>
                    <td className="text-muted">{prijava.lokacija_opis || "-"}</td>
                    <td>{getNazivTipa(prijava.tip_prijave)}</td>
                    <td className="text-center text-secondary small">
                      <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                    </td>
                    <td className="text-center">
                      {prijava.hitno ? (
                        <Badge bg="danger" className="d-inline-flex align-items-center gap-1 px-2 py-1">
                          <GrAlert size={14} /> Hitno
                        </Badge>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
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
