import { useState, useEffect } from "react";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import TipService from "../services/tip/TipService";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import FilterPrijava from "../components/FilterPrijava";
import { filtrirajPrijave, PRAZNI_FILTERI } from "../utils/filterHelpers";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RouteNames } from "../constants";
import OznakeService from "../services/oznake/OznakeService";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [filteri, setFilteri] = useState(PRAZNI_FILTERI);
  const [tipovi, setTipovi] = useState([]);
  const [oznake, setOznake] = useState([]);
  const { isLoggedIn } = useAuth();
const { showLoading, hideLoading } = useLoading();
  useEffect(() => {

    async function dohvatiPodatke() {
            showLoading();
      try {
        const [rezPrijave, rezVrste, rezTipovi, rezOznake] = await Promise.all([
          prijaveService.get(),
          VrsteService.get(),
          TipService.get(),
          OznakeService.get(),
        ]);
        setPrijave(rezPrijave.data);
        setVrste(rezVrste.data);
        setTipovi(rezTipovi.data);
        setOznake(rezOznake.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      } finally {
        hideLoading();
      }
    }
    dohvatiPodatke();
  }, []);

  const filtriranePrijave = filtrirajPrijave(prijave, filteri);
  const otvorene = prijave.filter((p) => p.status === "otvorena")
  const hitne = otvorene.filter((p) => p.hitno)

  return (
    <Container className="py-1">
      <section className="pa-hero pa-ulaz p-4 p-md-5 mb-3">
        <Row className="align-items-center g-4">
          <Col xs={12} lg={8}>
            <span className="pa-hero-badge mb-3">Zajednica za izgubljene ljubimce</span>
            <h1 className="mb-3">
              Tragom svake <span className="pa-hero-akcent">šape</span>
            </h1>
            <p className="pa-hero-lead mb-4">
              Bilo da si primijetio izgubljenog ljubimca ili tražiš svog, označi lokaciju
              na interaktivnoj karti i pokreni zajednicu na akciju.
            </p>
            </Col>
            <Col xs={12} lg={4}>
            <div className="d-flex flex-column flex-sm-row gap-2">
              {isLoggedIn ? (
                <Link
                  to={RouteNames.PRIJAVA_NOVA}
                  state={{ povratak: RouteNames.HOME }}
                  className="btn pa-hero-btn-cta"
                >
                  Prijavi životinju
                </Link>
              ) : (
                <Link to={RouteNames.LOGIN} className="btn pa-hero-btn-cta">
                  Prijavi se i pomozi
                </Link>
              )}
              <Link to={RouteNames.KATALOG} className="btn pa-hero-btn-outline">
                Pogledaj katalog
              </Link>

            </div>
          </Col>
        </Row>

        <Row className="pa-hero-stats mt-4 pt-3 g-3 text-center">
          <Col xs={4}>
            <div className="fs-2 fw-bold lh-1">{prijave.length}</div>
            <div className="small opacity-75">prijava ukupno</div>
          </Col>
          <Col xs={4}>
            <div className="fs-2 fw-bold lh-1">{otvorene.length}</div>
            <div className="small opacity-75">otvorenih</div>
          </Col>
          <Col xs={4}>
            <div className="fs-2 fw-bold lh-1" style={{ color: "#f7bd77" }}>{hitne.length}</div>
            <div className="small opacity-75">hitnih</div>
          </Col>
        </Row>
      </section>
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4">
        <FilterPrijava
          filteri={filteri}
          setFilteri={setFilteri}
          vrste={vrste}
          tipovi={tipovi}
          oznake={oznake}
        />
      </div>

      <Row className="g-4 align-items-stretch">
        <Col xs={12} md={5} lg={4}>
          <Sidebar prijave={filtriranePrijave}
            oznake={oznake} />
        </Col>

        <Col xs={12} md={7} lg={8}>
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <MapView prijave={filtriranePrijave}
              oznake={oznake} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export default Home