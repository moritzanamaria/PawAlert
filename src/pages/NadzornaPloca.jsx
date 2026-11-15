import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import {
  BiCategory,
  BiData,
  BiGridAlt,
  BiGroup,
  BiListUl,
  BiPurchaseTag,
  BiRightArrowAlt,
} from "react-icons/bi";
import { RouteNames, ZASTARJELO_DANA, putanja } from "../constants";
import prijaveService from "../services/prijave/prijaveService";
import FormatDatuma from "../components/FormatDatuma";

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

const PRECACI = [
  { naslov: "Pregled prijava", opis: "Sve prijave, uređivanje i brisanje", ikona: BiListUl, to: RouteNames.PRIJAVE_PREGLED, boja: "success" },
  { naslov: "Tipovi i vrste", opis: "Šifrarnik tipova prijava i vrsta životinja", ikona: BiCategory, to: RouteNames.TIPOVI_I_VRSTE_PREGLED, boja: "primary" },
  { naslov: "Oznake", opis: "Oznake koje se dodjeljuju prijavama", ikona: BiPurchaseTag, to: RouteNames.OZNAKE_PREGLED, boja: "warning" },
  { naslov: "Operateri", opis: "Korisnici aplikacije i njihove uloge", ikona: BiGroup, to: RouteNames.OPERATERI, boja: "danger" },
  { naslov: "Katalog", opis: "Javni prikaz svih slučajeva", ikona: BiGridAlt, to: RouteNames.KATALOG, boja: "secondary" },
];

if (import.meta.env.DEV) {
  PRECACI.push({
    naslov: "Generiranje podataka",
    opis: "Testni podaci za razvoj",
    ikona: BiData,
    to: RouteNames.GENERIRANJE_PODATAKA,
    boja: "dark",
  });
}

function Kartica({ naslov, vrijednost, boja = "dark", to }) {
  const sadrzaj = (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <div className="text-muted small">{naslov}</div>
        <div className={`fs-2 fw-bold text-${boja}`}>{vrijednost}</div>
      </Card.Body>
    </Card>
  );
  return to ? <Link to={to} className="text-decoration-none">{sadrzaj}</Link> : sadrzaj;
}

function Precac({ naslov, opis, ikona: Ikona, to, boja }) {
  return (
    <Link to={to} className="text-decoration-none">
      <Card className="h-100 shadow-sm border-0">
        <Card.Body className="d-flex align-items-center gap-3">
          <div
            className={`bg-${boja}-subtle text-${boja}-emphasis rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
            style={{ width: 48, height: 48 }}
          >
            <Ikona size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold text-dark">{naslov}</div>
            <div className="text-muted small">{opis}</div>
          </div>
          <BiRightArrowAlt size={24} className="text-muted flex-shrink-0" />
        </Card.Body>
      </Card>
    </Link>
  );
}

function TablicaPrijava({ naslov, prijave, prazno }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white fw-bold border-0 pt-3">{naslov}</Card.Header>
      <Card.Body className="p-0">
        {prijave.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">{prazno}</p>
        ) : (
          <Table responsive hover className="align-middle mb-0">
            <tbody>
              {prijave.map((p) => (
                <tr key={p.id} className={p.hitno && p.status === "otvorena" ? "table-danger" : ""}>
                  <td className="ps-3">
                    <Link to={putanja(RouteNames.DETALJI_SLUCAJA, p.id)} className="fw-semibold text-decoration-none">
                      {p.zivotinja_ime || "Nepoznato"}
                    </Link>
                    <div className="text-muted small">{p.lokacija?.opis || "Nepoznata lokacija"}</div>
                  </td>
                  <td className="text-secondary small text-end">
                    <FormatDatuma datum={p.datum} />
                  </td>
                  <td className="text-end pe-3">
                    <Link
                      to={putanja(RouteNames.PRIJAVA_PROMJENA, p.id)}
                      state={{ povratak: RouteNames.NADZORNA_PLOCA }}
                      className="btn btn-sm btn-outline-warning"
                    >
                      Uredi
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default function NadzornaPloca() {
  const [podaci, setPodaci] = useState(null);

  useEffect(() => {
    async function ucitaj() {
      try {
        const prijave = toArray(await prijaveService.get());
        const otvorene = prijave.filter((p) => p.status === "otvorena");
        const granica = Date.now() - ZASTARJELO_DANA * 24 * 60 * 60 * 1000;
        const poDatumu = [...prijave].sort((a, b) => new Date(b.datum) - new Date(a.datum));

        setPodaci({
          ukupno: prijave.length,
          otvorene: otvorene.length,
          zatvorene: prijave.length - otvorene.length,
          hitne: otvorene.filter((p) => p.hitno),
          zastarjele: otvorene.filter((p) => new Date(p.datum).getTime() < granica).length,
          zadnje: poDatumu.slice(0, 5),
        });
      } catch (error) {
        console.error("Greška pri dohvatu podataka nadzorne ploče:", error);
      }
    }
    ucitaj();
  }, []);

  if (!podaci) {
    return <Container className="my-5 text-center text-muted">Učitavanje...</Container>;
  }

  return (
    <Container className="my-4">
      <h3 className="fw-bold mb-4">📊 Nadzorna ploča</h3>

      <Row className="g-3 mb-4">
        <Col xs={6} md={4} lg><Kartica naslov="Sve prijave" vrijednost={podaci.ukupno} to={RouteNames.PRIJAVE_PREGLED} /></Col>
        <Col xs={6} md={4} lg><Kartica naslov="Otvorene" vrijednost={podaci.otvorene} boja="success" /></Col>
        <Col xs={6} md={4} lg><Kartica naslov="Hitne (otvorene)" vrijednost={podaci.hitne.length} boja="danger" /></Col>
        <Col xs={6} md={4} lg><Kartica naslov={`Starije od ${ZASTARJELO_DANA} dana`} vrijednost={podaci.zastarjele} boja="warning" /></Col>
        <Col xs={6} md={4} lg><Kartica naslov="Zatvorene" vrijednost={podaci.zatvorene} boja="secondary" /></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TablicaPrijava naslov="🚨 Hitne otvorene prijave" prijave={podaci.hitne.slice(0, 5)} prazno="Nema hitnih otvorenih prijava." />
        </Col>
        <Col lg={6}>
          <TablicaPrijava naslov="🕒 Zadnjih 5 prijava" prijave={podaci.zadnje} prazno="Još nema prijava." />
        </Col>
      </Row>

      <h5 className="fw-bold mb-3">Brze poveznice</h5>
      <Row className="g-3">
        {PRECACI.map((p) => (
          <Col key={p.to} xs={12} sm={6} lg={4}>
            <Precac {...p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}