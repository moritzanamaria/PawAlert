import { useState, useEffect } from "react";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import { filtrirajPrijave } from "../utils/filterHelpers";

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [pretraga, setPretraga] = useState("");
  const [odabranaVrsta, setOdabranaVrsta] = useState("");

  useEffect(() => {
   dohvatiPrijave();
   dohvatiVrste();
  }, []);

async function dohvatiPrijave() {
    const rez = await prijaveService.get();
    setPrijave(rez.data || rez);
  }

  async function dohvatiVrste() {
    const rez = await VrsteService.get();
    setVrste(rez.data || rez);
  };

  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, odabranaVrsta)

  return (
    <div className="container my-4">
<div className="p-4 mb-4 bg-white shadow-sm rounded-4 border-start border-success border-5">
  <h1 className="h3 fw-bold text-dark mb-1">
   Tragom svake šape 🐾
  </h1>
  <p className="text-muted mb-0">
    Bilo da si primijetio izgubljenog ljubimca ili tražiš svog, označi lokaciju na interaktivnoj karti i pokreni zajednicu na akciju.
  </p>
</div>

      <FilterBar
        pretraga={pretraga}
        setPretraga={setPretraga}
        vrsta={odabranaVrsta}
        setVrsta={setOdabranaVrsta}
        vrste= {vrste}
      />


      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-md-5 col-lg-4">
          <Sidebar prijave={filtriranePrijave} />
        </div>


        <div className="col-12 col-md-7 col-lg-8">
          <MapView prijave={filtriranePrijave} />
        </div>
      </div>
    </div>

  );
};


export default Home