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

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [filteri, setFilteri] = useState(PRAZNI_FILTERI);
  const [tipovi, setTipovi] = useState([]);
  const [oznake, setOznake] = useState([]);

  useEffect(() => {

    async function dohvatiPodatke() {
      try {
        const [rezPrijave, rezVrste, rezTipovi, rezOznake] = await Promise.all([
          prijaveService.get(),
          VrsteService.get(),
          TipService.get(),
          OznakeService.get(),
        ]);
        setPrijave(rezPrijave.data || rezPrijave);
        setVrste(rezVrste.data || rezVrste);
        setTipovi(rezTipovi.data || rezTipovi);
        setOznake(rezOznake.data || rezOznake);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    }
    dohvatiPodatke();
  }, []);

  const filtriranePrijave = filtrirajPrijave(prijave, filteri)

  return (
    <Container className="py-1">
      <div className="bg-white shadow-sm rounded-3 border-start border-secondary border-5 p-3 mb-2">
        <Row className="align-items-center g-3">
          <Col xs={12} md>
            <h1 className="h3 fw-bold text-dark mb-1">
              Tragom svake šape 🐾
            </h1>
            <p className="text-muted mb-0">
              Bilo da si primijetio izgubljenog ljubimca ili tražiš svog, označi lokaciju na interaktivnoj karti i pokreni zajednicu na akciju.
            </p>
          </Col>
          <Col xs={12} md="auto" className="d-flex flex-column flex-sm-row gap-2">
            <Link
              to={RouteNames.PRIJAVA_NOVA}
              state={{ povratak: RouteNames.HOME }}
              className="btn btn-success fw-semibold"
            >
              Prijavi životinju
            </Link>
            <Link to={RouteNames.KATALOG} className="btn btn-outline-success fw-semibold">
              Katalog
            </Link>
          </Col>
        </Row>
      </div>
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
              oznake={oznake}/>
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export default Home