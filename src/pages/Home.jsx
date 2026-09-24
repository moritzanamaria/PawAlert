import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import prijaveService from "../services/prijaveService";
import { RouteNames } from "../constants";
import FilterBar from "../components/FilterBar";
import MapView from "../components/MapView";

function Home() {
  const [prijave, setPrijave] = useState([]);
  const [odabranaVrsta, setOdabranaVrsta] = useState("sve");
  const [pretraga, setPretraga] = useState("");

  useEffect(() => {
    ucitajPrijave();
  }, []);

  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data);
    });
  }
const normPretraga = pretraga.toLowerCase();

  const filtriranePrijave = (prijave || []).filter((p) => {
    const vrsta = p.zivotinja?.vrsta?.toLowerCase() || "";
    const ime = p.zivotinja?.ime?.toLowerCase() || "";
    const tip = p.tip_prijave?.toLowerCase() || "";

    const odgovaraVrsti = odabranaVrsta === "sve" || vrsta === odabranaVrsta;
    const odgovaraPretrazi = ime.includes(normPretraga) || tip.includes(normPretraga);

    return odgovaraVrsti && odgovaraPretrazi;
  });

  const najnovijeDojave = [...filtriranePrijave].sort(
    (a, b) => new Date(b.datum) - new Date(a.datum)
  );

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Početna karta prijava</h1>
                    <p className="text-muted mb-0">Pregled svih prijava na području Osijeka</p>
                </div>
                <Link to={RouteNames.PRIJAVI_SLUCAJ} className="btn btn-warning shadow-sm">
                    Prijavi slučaj
                </Link>
            </div>

            <FilterBar
                pretraga={pretraga}
                setPretraga={setPretraga}
                odabranaVrsta={odabranaVrsta}
                setOdabranaVrsta={setOdabranaVrsta}
            />

            <MapView prijave={filtriranePrijave} najnovije={najnovijeDojave}/>
        </div>
    );
}

export default Home