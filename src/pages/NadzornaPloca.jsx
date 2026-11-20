import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Highcharts from "highcharts";
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
import { izveziSveUXml } from '../utils/xmlExporter';
import { BsFileEarmarkCode } from 'react-icons/bs';
import useLoading from "../hooks/useLoading";

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

function PregledPrijavaChart({ podaci }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !podaci) return;

    const chart = Highcharts.chart(chartContainerRef.current, {
      chart: {
        type: "pie",
        backgroundColor: "#f5efef",
        height: 360,
        borderRadius: "10px"
      },
      title: {
        text: "📝 Prijave (🟢 otvorene / ⚫ zatvorene / 🔴 hitne)",
        align: "left",
        style: {
          color: "#212529",
          fontWeight: "900",
          fontSize: "16px",
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: "<b>{point.y}</b> prijava ({point.percentage:.1f}%)",
      },
      series: [
        {
          name: "Prijave",
          borderRadius: 8,
          borderWidth: 3,
          innerSize: "70%",
          dataLabels: [
            {
              format: "{point.name}: {point.y}",
            },
            {
              format: "{point.percentage:.0f}%",
              distance: "-15%",
              backgroundColor: "contrast",
              style: {
                textOutline: "none",
              },
            },
          ],
          data: [
            { name: "Hitne", y: podaci.hitne.length, color: "#dc3545" },
            { name: "Otvorene", y: podaci.otvorene - podaci.hitne.length, color: "#198754" },
            { name: "Zatvorene", y: podaci.zatvorene, color: "#6c757d" },
          ].filter((item) => item.y > 0),
        },
      ],
    });

    return () => {
      chart.destroy();
    };
  }, [podaci]);

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body>
        {podaci.ukupno === 0 ? (
          <p className="text-muted text-center py-5 mb-0">Još nema zabilježenih prijava za prikaz grafikona.</p>
        ) : (
          <div ref={chartContainerRef} />
        )}
      </Card.Body>
    </Card>
  );
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
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    async function ucitaj() {
      showLoading();
      try {
        const prijave = (await prijaveService.get()).data;
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
      } finally {
        hideLoading();
      }
    }
    ucitaj();
  }, []);

   if (!podaci) return null;

  return (
    <Container className="my-4">
      <div className="d-flex gap-2">
        <h3 className="fw-bold mb-4">📊 Nadzorna ploča</h3>
        <Button
          onClick={izveziSveUXml}
          variant="outline-secondary"
          className="btn-icon p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
          style={{ width: "38px", height: "38px" }}
          title="Izvezi cijelu bazu u XML"
        >
          <BsFileEarmarkCode size={20} />
        </Button>
      </div>
      <PregledPrijavaChart podaci={podaci} />

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