import { useState, useEffect } from "react";
import prijaveService from "../../services/prijave/prijaveService";
import VrsteService from "../../services/vrste/VrsteService";
import TipService from "../../services/tip/TipService";
import { RouteNames, putanja } from "../../constants";
import { Badge, Button, Card, Container, Table, ButtonGroup, Pagination } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
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
  const navigate = useNavigate();

  const [trenutnaStranica, postaviTrenutnuStranicu] = useState(1);
  const [ukupnoStranica, postaviUkupnoStranica] = useState(0);
  const velicinaStranice = 6;

  useEffect(() => {
    async function dohvatiInicijalnePodatke() {
      try {
        const [resVrste, resTipovi] = await Promise.all([
          VrsteService.get(),
          TipService.get(),

        ]);
        setVrste(toArray(resVrste));
        setTipovi(toArray(resTipovi));
      } catch (error) {
        console.error("Greška pri dohvatu podataka:", error);
      }
    }
    dohvatiInicijalnePodatke();
  }, []);

  const [osvjezi, setOsvjezi] = useState(0);

  useEffect(() => {
    async function ucitajStranicu() {
      try {
        const odgovor = await prijaveService.dohvatiStranicu(trenutnaStranica, velicinaStranice);
        setPrijave(toArray(odgovor.data));
        postaviUkupnoStranica(odgovor.ukupnoStranica || 0);
      } catch (error) {
        console.error("Greška pri dohvatu stranice prijava:", error);
      }
    }
    ucitajStranicu();
  }, [trenutnaStranica, osvjezi]);


  async function obrisi(id) {
    if (!confirm('Brisanjem prijave brišu se i svi njezini tragovi. Nastaviti?')) {
      return
    }

    await prijaveService.obrisi(id)
    setPrijave(prevPrijave => prevPrijave.filter(p => p.id !== id));
setOsvjezi((n) => n + 1);  }

  function promijeniStranicu(stranica) {
    postaviTrenutnuStranicu(stranica);
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
    <Container>
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
              {prijave.map((prijava) => (
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
                      <Link to={putanja(RouteNames.TRAG_PREGLED, prijava.id)} className="btn btn-outline-primary" title="Tragovi">
                        <BiSearch size={16} /> Tragovi
                      </Link>
                      <Button variant="outline-warning" onClick={() => navigate(putanja(RouteNames.PRIJAVA_PROMJENA, prijava.id))} title="Uredi">
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
        {ukupnoStranica > 1 && (
          <div className="d-flex justify-content-center p-3">
            <Pagination>
              <Pagination.First
                onClick={() => promijeniStranicu(1)}
                disabled={trenutnaStranica === 1}
              />
              <Pagination.Prev
                onClick={() => promijeniStranicu(trenutnaStranica - 1)}
                disabled={trenutnaStranica === 1}
              />

              {[...Array(ukupnoStranica)].map((_, indeks) => {
                const brojStranice = indeks + 1;
                if (
                  brojStranice === 1 ||
                  brojStranice === ukupnoStranica ||
                  (brojStranice >= trenutnaStranica - 2 && brojStranice <= trenutnaStranica + 2)
                ) {
                  return (
                    <Pagination.Item
                      key={brojStranice}
                      active={brojStranice === trenutnaStranica}
                      onClick={() => promijeniStranicu(brojStranice)}
                    >
                      {brojStranice}
                    </Pagination.Item>
                  );
                } else if (
                  brojStranice === trenutnaStranica - 3 ||
                  brojStranice === trenutnaStranica + 3
                ) {
                  return <Pagination.Ellipsis key={brojStranice} disabled />;
                }
                return null;
              })}

              <Pagination.Next
                onClick={() => promijeniStranicu(trenutnaStranica + 1)}
                disabled={trenutnaStranica === ukupnoStranica}
              />
              <Pagination.Last
                onClick={() => promijeniStranicu(ukupnoStranica)}
                disabled={trenutnaStranica === ukupnoStranica}
              />
            </Pagination>
          </div>
        )}
      </Card>
    </Container>
  )
}
