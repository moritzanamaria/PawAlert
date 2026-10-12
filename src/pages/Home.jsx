import { useState, useEffect } from "react";
import prijaveService from "../services/prijave/prijaveService";
import VrsteService from "../services/vrste/VrsteService";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import { dohvatiDostupneVrste, filtrirajPrijave } from "../utils/filterHelpers";

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [vrste, setVrste] = useState([]);
  const [pretraga, setPretraga] = useState("");
  const [odabranaVrsta, setOdabranaVrsta] = useState("");

  useEffect(() => {
   dohvatiPodatke();
  }, []);

 async function dohvatiPodatke() {
    const [odgovorPrijave, odgovorVrste] = await Promise.all([
      prijaveService.get(),
      VrsteService.get(),
    ]);

    setPrijave(odgovorPrijave.data || odgovorPrijave);
    setVrste(odgovorVrste.data || odgovorVrste);
  }

  const dostupneVrste = dohvatiDostupneVrste(vrste);
  const filtriranePrijave = filtrirajPrijave(prijave, pretraga, odabranaVrsta)

  return (
    <div className="container my-4">

      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Početna karta prijava</h1>
        <p className="text-muted mb-0">Pregled svih prijava na području Osijeka</p>
      </div>

      <FilterBar
        pretraga={pretraga}
        setPretraga={setPretraga}
        vrsta={odabranaVrsta}
        setVrsta={setOdabranaVrsta}
        dostupneVrste={dostupneVrste}
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