import { useState, useEffect } from "react";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import { filtrirajPrijave } from "../utils/filterHelpers";
import { Col, Container, Row } from "react-bootstrap";
import PretragaInput from "../components/PretragaInput";
import VrstaSelect from "../components/VrstaSelect";

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [pretraga, setPretraga] = useState("");
  const [vrsta, setVrsta] = useState("");

  useEffect(() => {

  async function dohvatiPodatke() {
  try{  
   const [rezPrijave, rezVrste] = await Promise.all([
          prijaveService.get(),
          VrsteService.get(),
        ]);
        setPrijave(rezPrijave.data || rezPrijave);
        setVrste(rezVrste.data || rezVrste);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    }
    dohvatiPodatke();
  }, []);

  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, vrsta, vrste)

  return (
    <Container className="py-1">
      <Row className="g-3 mb-4 align-items-stretch">
        <Col xs={12} md={5}>
          <div className="p-5 mb-1 bg-white shadow-sm rounded-4 border-start border-success border-5">
            <h1 className="h3 fw-bold text-dark mb-1">
              Tragom svake šape 🐾
            </h1>
            <p className="text-muted mb-0">
              Bilo da si primijetio izgubljenog ljubimca ili tražiš svog, označi lokaciju na interaktivnoj karti i pokreni zajednicu na akciju.
            </p>
          </div>
        </Col>
        <Col xs={12} md={7} className="d-flex flex-column gap-3">
          <div className="card shadow-sm border-0 p-3 flex-fill justify-content-center">
            <PretragaInput pretraga={pretraga} setPretraga={setPretraga} />
          </div>

          <div className="card shadow-sm border-0 p-3 flex-fill justify-content-center">
            <VrstaSelect vrsta={vrsta} setVrsta={setVrsta} vrste={vrste} />
          </div>
        </Col>
      </Row>
      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-md-5 col-lg-4">
          <Sidebar prijave={filtriranePrijave} />
        </div>


        <div className="shadow-sm col-12 col-md-7 col-lg-8">
          <MapView prijave={filtriranePrijave} />
        </div>
      </div>
    </Container>
  );
};


export default Home