import { useState } from "react";
import { Link } from "react-router-dom";
import { mockPrijave } from "../mockData";
import { RouteNames } from "../constants";
import FilterBar from "../components/FilterBar";
import MapView from "../components/MapView";

function Home() {
    const [odabranaVrsta, setOdabranaVrsta] = useState("sve");
    const [pretraga, setPretraga] = useState("");
    const filtriranePrijave = mockPrijave.filter((p) => {
        const vrsta = p.zivotinja?.vrsta?.toLowerCase() || "";
        const ime = p.zivotinja?.ime?.toLowerCase() || "";
        const tip = p.tip_prijave?.toLowerCase() || "";

        return (
            (odabranaVrsta === "sve" || vrsta === odabranaVrsta) &&
            (ime.includes(pretraga.toLowerCase()) || tip.includes(pretraga.toLowerCase()))
        );
    });

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Početna karta prijava</h1>
                    <p className="text-muted mb-0">Pregled svih prijava na području Osijeka</p>
                </div>
                <Link to={RouteNames.PRIJAVI_SLUCAJ} className="btn btn-primary shadow-sm">
                    ➕ Prijavi slučaj
                </Link>
            </div>

            <FilterBar
                pretraga={pretraga}
                setPretraga={setPretraga}
                odabranaVrsta={odabranaVrsta}
                setOdabranaVrsta={setOdabranaVrsta}
            />

            <MapView prijave={filtriranePrijave} />
        </div>
    );
}

export default Home