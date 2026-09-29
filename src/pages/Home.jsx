import { useState, useEffect } from "react";
import prijaveService from "../services/prijaveService";
import MapView from "../components/MapView";

function Home() {
 const [prijave, setPrijave] = useState([]);
 
  useEffect(() => {
    ucitajPrijave();
  }, []);

  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data);
    });
  };
 

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Početna karta prijava</h1>
          <p className="text-muted mb-0">Pregled svih prijava na području Osijeka</p>
        </div>
      </div>


      <MapView prijaveService={prijave} />
      </div>
  );
};


export default Home