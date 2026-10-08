import { useState, useEffect } from "react";
import prijaveService from "../services/prijave/prijaveService";
import MapView from "../components/MapView";
import Sidebar from "../components/SideBar";

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

      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Početna karta prijava</h1>
        <p className="text-muted mb-0">Pregled svih prijava na području Osijeka</p>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-md-5 col-lg-4">
          <Sidebar prijave={prijave} />
        </div>


        <div className="col-12 col-md-7 col-lg-8">
          <MapView prijave={prijave} />
        </div>
      </div>
    </div>




  );
};


export default Home