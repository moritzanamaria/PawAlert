// src/components/Sidebar.jsx

function Sidebar({ prijave = [] }) {
  // Izračun 3 najnovije prijave iz primljenih podataka
  const najnovije = [...prijave]
    .sort((a, b) => new Date(b.datum || 0) - new Date(a.datum || 0))
    .slice(0, 3);

  return (
    <div className="d-flex flex-column gap-3 h-100">
      <style>{`
        @keyframes laganoPulsiranje {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animirani-sidebar {
          animation: laganoPulsiranje 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* 1. Animirana kartica sa sažetkom */}
      <div className="card shadow-sm border-0 p-4 text-center animirani-sidebar">
        <div style={{ fontSize: "3rem" }}>🐾</div>
        <h5 className="fw-bold mt-2 mb-1">Aktivni sustav prijava</h5>
        <p className="text-muted small mb-3">
          Pratite lokacije prijavljenih životinja u stvarnom vremenu na području Osijeka.
        </p>
        <div className="badge bg-primary fs-6 p-2 mx-auto" style={{ width: "fit-content" }}>
          Ukupno aktivnih prijava: {prijave.length}
        </div>
      </div>

      {/* 2. Kartica s listom najnovijih dojava */}
      <div className="card shadow-sm border-0 p-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Najnovije dojave</h6>
          <span className="badge bg-danger rounded-pill">Uživo</span>
        </div>

        <div className="list-group list-group-flush">
          {najnovije.length > 0 ? (
            najnovije.map((p) => (
              <div key={p.id || Math.random()} className="list-group-item px-0 py-2 border-0 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="d-block text-dark small">
                      {p.zivotinja_ime || "Prijava bez naziva"}
                    </strong>
                    <span className="text-muted small">
                      📍 {p.lokacija_opis || "Nepoznata lokacija"}
                    </span>
                  </div>
                  {p.datum && (
                    <span className="badge bg-light text-dark border small">
                      {p.datum}
                    </span>
                  )}
                </div>
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