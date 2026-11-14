import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge, Button, ButtonGroup, Card, Container, Tab, Table, Tabs } from "react-bootstrap";
import { BiLockAlt, BiLockOpenAlt, BiPencil, BiPlus, BiShow } from "react-icons/bi";
import { RouteNames, putanja } from "../constants";
import useAuth from "../hooks/useAuth";
import prijaveService from "../services/prijave/prijaveService";
import TragoviService from "../services/tragovi/TragoviService";
import VrsteService from "../services/vrste/VrsteService";
import FormatDatuma from "../components/FormatDatuma";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

export default function MojProfil() {
  const { authUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "prijave";

  const [svePrijave, setSvePrijave] = useState([]);
  const [sviTragovi, setSviTragovi] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [osvjezi, setOsvjezi] = useState(0);

  useEffect(() => {
    async function ucitaj() {
      try {
        const [rp, rt, rv] = await Promise.all([
          prijaveService.get(),
          TragoviService.get(),
          VrsteService.get(),
        ]);
        setSvePrijave(toArray(rp));
        setSviTragovi(toArray(rt));
        setVrste(toArray(rv));
      } catch (error) {
        console.error("Greška pri dohvatu podataka profila:", error);
      }
    }
    ucitaj();
  }, [osvjezi]);

  const jeMoje = (zapis) => String(zapis.operater_id) === String(authUser.id);

  const mojePrijave = svePrijave
    .filter(jeMoje)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const mojiTragovi = sviTragovi
    .filter(jeMoje)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  const nazivVrste = (id) => vrste.find((v) => String(v.id) === String(id))?.naziv ?? id;
  const imePrijave = (id) => {
    const p = svePrijave.find((x) => String(x.id) === String(id));
    return p ? (p.zivotinja_ime || "Nepoznato") : `Prijava #${id}`;
  };

  async function promijeniStatus(prijava) {
    const novi = prijava.status === "otvorena" ? "zatvorena" : "otvorena";
    const poruka =
      novi === "zatvorena"
        ? "Zatvoriti prijavu? Kasnije je možete ponovno otvoriti."
        : "Ponovno otvoriti prijavu?";
    if (!confirm(poruka)) return;

    try {
      await prijaveService.promjeni(prijava.id, { ...prijava, status: novi });
      setOsvjezi((n) => n + 1);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">👤 Moj profil</h3>
            <p className="text-muted small mb-0">{authUser.email}</p>
          </div>
          <Link
            to={RouteNames.PRIJAVA_NOVA}
            state={{ povratak: RouteNames.MOJ_PROFIL }}
            className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2"
          >
            <BiPlus size={20} /> Nova prijava
          </Link>
        </Card.Header>

        <Card.Body className="pt-0">
          <Tabs
            activeKey={tab}
            onSelect={(k) => setSearchParams({ tab: k })}
            className="mb-3"
          >
            <Tab eventKey="prijave" title={<>Moje prijave <Badge bg="secondary">{mojePrijave.length}</Badge></>}>
              {mojePrijave.length === 0 ? (
                <p className="text-center text-muted py-5 mb-0">Još niste poslali nijednu prijavu.</p>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Ime životinje</th>
                      <th className="d-none d-md-table-cell">Vrsta</th>
                      <th className="d-none d-md-table-cell text-center">Datum</th>
                      <th className="text-center">Status</th>
                      <th className="text-center" style={{ minWidth: "160px" }}>Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mojePrijave.map((p) => (
                      <tr key={p.id}>
                        <td className="fw-semibold">
                          {p.zivotinja_ime || <span className="text-muted fst-italic">Nepoznato</span>}
                        </td>
                        <td className="d-none d-md-table-cell">{nazivVrste(p.zivotinja_vrsta)}</td>
                        <td className="d-none d-md-table-cell text-center text-secondary small">
                          <FormatDatuma datum={p.datum} />
                        </td>
                        <td className="text-center">
                          <Badge bg={p.status === "otvorena" ? "success" : "secondary"} className="text-capitalize">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <ButtonGroup size="sm">
                            <Link
                              to={putanja(RouteNames.DETALJI_SLUCAJA, p.id)}
                              className="btn btn-outline-primary"
                              title="Pogledaj"
                            >
                              <BiShow size={16} />
                            </Link>
                            <Link
                              to={putanja(RouteNames.PRIJAVA_PROMJENA, p.id)}
                              state={{ povratak: RouteNames.MOJ_PROFIL }}
                              className="btn btn-outline-warning"
                              title="Uredi"
                            >
                              <BiPencil size={16} />
                            </Link>
                            <Button
                              variant={p.status === "otvorena" ? "outline-secondary" : "outline-success"}
                              onClick={() => promijeniStatus(p)}
                              title={p.status === "otvorena" ? "Zatvori prijavu" : "Ponovno otvori"}
                            >
                              {p.status === "otvorena" ? <BiLockAlt size={16} /> : <BiLockOpenAlt size={16} />}
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="tragovi" title={<>Moji tragovi <Badge bg="secondary">{mojiTragovi.length}</Badge></>}>
              {mojiTragovi.length === 0 ? (
                <p className="text-center text-muted py-5 mb-0">
                  Još niste dodali nijedan trag. Trag možete dodati na stranici detalja pojedinog slučaja.
                </p>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Prijava</th>
                      <th>Opis</th>
                      <th className="d-none d-md-table-cell text-center">Datum</th>
                      <th className="text-center">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mojiTragovi.map((t) => (
                      <tr key={t.id}>
                        <td className="fw-semibold">
                          <Link to={putanja(RouteNames.DETALJI_SLUCAJA, t.prijava)}>{imePrijave(t.prijava)}</Link>
                        </td>
                        <td>{t.opis}</td>
                        <td className="d-none d-md-table-cell text-center text-secondary small">
                          <FormatDatuma datum={t.datum} />
                        </td>
                        <td className="text-center">
                          <Link
                            to={putanja(RouteNames.TRAG_PROMJENA, t.id)}
                            state={{ povratak: RouteNames.MOJ_PROFIL }}
                            className="btn btn-sm btn-outline-warning"
                            title="Uredi"
                          >
                            <BiPencil size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}