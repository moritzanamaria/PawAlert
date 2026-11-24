import { useState, useEffect } from "react";
import OznakeService from "../../services/oznake/OznakeService";
import { RouteNames, putanja } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";
import useLoading from "../../hooks/useLoading";
import useModal from "../../hooks/useModal";

export default function OznakePregled() {
  const navigate = useNavigate();
  const [oznake, setOznake] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { showModal } = useModal();

  useEffect(() => {
    async function ucitajOznake() {
      showLoading();
      try {
        const res = await OznakeService.get();
        setOznake(res.data);
      } catch (error) {
        console.error("Greška pri učitavanju oznaka:", error);
      } finally {
        hideLoading();
      }
    }
    ucitajOznake();
  }, []);

  async function obrisi(id) {
    showModal("Sigurno obrisati ovu oznaku?", async () => {
      showLoading();
      try {
        await OznakeService.obrisi(id);
        setOznake((prev) => prev.filter((o) => o.id !== id));
      } catch (error) {
        console.error("Greška pri brisanju:", error);
      } finally {
        hideLoading();
      }
    });
  }



  return (
    <Container className="my-5">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <div>
              <h2 className="h3 fw-bold mb-1 text-dark">📋 Pregled oznaka</h2>
              <p className="text-muted small mb-0">Popis svih oznaka</p>
            </div>
          </div>
            <Link
              to={RouteNames.OZNAKA_NOVA || "/oznake/nova"}
              className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2 justify-content-center col-12 col-md-auto"
            >
              <BiPlus size={20} /> Nova oznaka
            </Link>
        </Card.Header>

        <Card.Body className="p-0">
          <Table bordered responsive hover className="align-middle mb-0 border-top">
            <thead className="table-light">
              <tr>
                <th>Naziv oznake</th>
                <th className="text-center pe-4" style={{ minWidth: "180px" }}>
                  Akcija
                </th>
              </tr>
            </thead>
            <tbody>
              {oznake && oznake.length > 0 ? (
                oznake.map((oznaka) => (
                  <tr key={oznaka.id}>
                    <td className="text-center"><span className="fw-bold badge d-inline-flex align-items-center px-2.5 py-1.5"
                      style={{
                        backgroundColor: oznaka.boja || "#6c757d",
                        color: oznaka.boja_teksta || "#fff",
                        border: "2px solid rgba(0, 0, 0, 0.1)",
                      }}>
                      {oznaka.naziv}
                    </span>
                    </td>
                    <td className="text-center pe-4">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-warning"
                          onClick={() => navigate(putanja(RouteNames.OZNAKA_PROMJENA, oznaka.id))}
                          title="Uredi"
                          aria-label={`Uredi oznaku: ${oznaka.naziv}`}
                        >
                          <BiPencil size={16} />
                        </Button>
                        <Button variant="outline-danger" onClick={() => obrisi(oznaka.id)} title="Obriši" aria-label={`Obriši oznaku: ${oznaka.naziv}`}>
                          <BiTrash size={16} />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <div className="mb-2">
                      <lord-icon
                        src="https://cdn.lordicon.com/puzgkqsp.json"
                        trigger="hover"
                        colors="primary:#6c757d,secondary:#adb5bd"
                        style={{ width: "40px", height: "40px" }}
                      ></lord-icon>
                    </div>
                    <span>Trenutno nema unesenih oznaka.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>

        <Card.Footer className="bg-light border-0 p-3 px-4 d-flex align-items-center justify-content-between">
          <span className="text-muted small">
            Ukupno oznaka:{" "}
            <Badge pill bg="primary" className="ms-1">
              {oznake ? oznake.length : 0}
            </Badge>
          </span>
        </Card.Footer>
      </Card>
    </Container>
  );
}