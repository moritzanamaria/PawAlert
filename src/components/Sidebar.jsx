
import { Link } from "react-router-dom";
import { RouteNames, putanja } from "../constants";
import { useEffect, useState } from "react";

function Sidebar({ prijave = [], oznake = [] }) {
  const najnovije = [...prijave]
    .sort((a, b) => new Date(b.datum || 0) - new Date(a.datum || 0))
    .slice(0, 3);

function ProtekloVrijeme({ datum }) {
  const [sada, setSada] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setSada(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pocetak = new Date(datum).getTime();
  if (Number.isNaN(pocetak)) return null;

  let razlika = Math.max(0, Math.floor((sada - pocetak) / 1000));

  const dana = Math.floor(razlika / 86400);
  razlika %= 86400;
  const sati = Math.floor(razlika / 3600);
  razlika %= 3600;
  const minute = Math.floor(razlika / 60);
  const sekunde = razlika % 60;

  return (
    <span className="text-muted small">
      {dana}d {sati}h {minute}m {sekunde}s
    </span>
  );
}

  return (
    <div className="d-flex flex-column gap-3 h-100">
      <style>{`
        @keyframes glowPulse {
      0% { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
      50% { box-shadow: 0 0.5rem 1.5rem rgba(13, 110, 253, 0.25); }
      100% { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
    }
    .animirani-sidebar {
      animation: glowPulse 3s infinite ease-in-out;
    }
      `}</style>

      <div className="card shadow-sm border-0 p-4 text-center animirani-sidebar">
        <div style={{ fontSize: "3rem" }}>🐾</div>
        <h3 className="fw-bold mt-2 mb-1">Aktivni sustav prijava</h3>
        <p className="text-muted small mb-3">
          Pratite lokacije prijavljenih životinja u stvarnom vremenu na području Osijeka.
        </p>
        <div className="badge bg-secondary fs-6 p-2 mx-auto" style={{ width: "fit-content" }}>
          Ukupno prijava: {prijave.length}
        </div>
      </div>

      <div className="card shadow-sm border-0 p-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Najnovije dojave</h4>
        </div>

        <div className="list-group list-group-flush">
          {najnovije.length > 0 ? (
            najnovije.map((prijava) => (
              <div key={prijava.id} className="list-group-item px-0 py-2 border-0 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <strong className="text-dark fs-5">
                        {prijava.zivotinja_ime || "Prijava bez naziva"}
                      </strong>
                      <Link
                        to={putanja(RouteNames.DETALJI_SLUCAJA, prijava.id)}
                        title="Pogledaj tragove"
                        className="text-decoration-none fs-3 lh-1 px-1"
                      >
                        🐾
                      </Link>
                    </div>
                    <div className="text-muted small mt-1">
                      📍 {prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}
                    </div>
                  </div>
                  {prijava.oznake && prijava.oznake.length > 0 && (
                      <div className="d-flex flex-column align-items-end gap-2">
                        {prijava.oznake.map((idOznake) => {
                          const o = oznake.find((item) => item.id === Number(idOznake));
                          if (!o) return null;
                          return (
                            <span
                              key={o.id}
                              className="badge"
                              style={{
                                backgroundColor: o.boja || "#6c757d",
                                color:  o.boja_teksta || "#fff",
                                fontSize: "0.75rem",
                              }}
                            >
                              {o.naziv}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {prijava.datum && (
          <div className="small mt-1 d-flex align-items-center gap-2">
            <span
              title={new Date(prijava.datum).toLocaleString("hr-HR")}
              style={{ cursor: "pointer" }}
            >
              🕒
            </span>
            <ProtekloVrijeme datum={prijava.datum} />
          </div>
        )}
      </div>
              
              
            ))
          ) : (
            <p className="text-muted small my-2">Nema dostupnih prijava.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;