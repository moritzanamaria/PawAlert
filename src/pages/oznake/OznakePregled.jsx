import { useState, useEffect } from "react";
import OznakeService from "../../services/oznake/OznakeService";
import { RouteNames, putanja } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiPencil, BiTrash, BiArrowBack } from "react-icons/bi";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};


export default function OznakePregled() {
  const navigate = useNavigate();
  const [oznake, setOznake] = useState([]);

  useEffect(() => {
    async function ucitajOznake() {
      try {
        const res = await OznakeService.get();
        setOznake(toArray(res));
      } catch (error) {
        console.error("Greška pri učitavanju oznaka:", error);
      }
    }
    ucitajOznake();
  }, []);

  async function obrisi(id) {
    if (!confirm("Sigurno obrisati ovu oznaku?")) {
      return;
    }

    try {
      await OznakeService.obrisi(id);
      setOznake((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Greška pri brisanju:", error);
    }
  }



  return (
    <Container className="my-5">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <lord-icon
              src="https://cdn.lordicon.com/puzgkqsp.json"
              trigger="loop"
              colors="primary:#0d6efd,secondary:#08a88a"
              style={{ width: "45px", height: "45px" }}
            ></lord-icon>
            <div>
              <h3 className="fw-bold mb-1 text-dark">Oznake</h3>
              <p className="text-muted small mb-0">Upravljanje oznakama (tagovima) prijava</p>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link
              to={RouteNames.OZNAKE_PREGLED || "/oznake"}
              className="btn btn-outline-secondary d-flex align-items-center gap-1 shadow-sm px-3 py-2"
            >
              <BiArrowBack size={18} /> Početna
            </Link>
            <Link
              to={RouteNames.OZNAKA_NOVA || "/oznake/nova"}
              className="btn btn-success d-flex align-items-center gap-1 shadow-sm px-3 py-2"
            >
              <BiPlus size={20} /> Nova oznaka
            </Link>
          </div>
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
                            color: "#ffffff",
                            border: "2px solid rgba(0, 0, 0, 0.1)",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}>
                        {oznaka.naziv}
                      </span>
                    </td>
                    <td className="text-center pe-4">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-warning"
                          onClick={() => navigate(putanja(RouteNames.OZNAKA_PROMJENA, oznaka.id))}
                          title="Uredi"
                        >
                          <BiPencil size={16} />
                        </Button>
                        <Button variant="outline-danger" onClick={() => obrisi(oznaka.id)} title="Obriši">
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