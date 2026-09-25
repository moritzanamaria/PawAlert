function FilterBar({ pretraga, setPretraga, odabranaVrsta, setOdabranaVrsta }) {
  const vrste = [   { vrijednost: "sve", naziv: "Sve" },
    { vrijednost: "pas", naziv: "Pas" },
    { vrijednost: "macka", naziv: "Mačka" },
    { vrijednost: "ptica", naziv: "Ptica" },
    { vrijednost: "ostalo", naziv: "Ostalo" }
  ];

  return (
    <div className="card shadow-sm border-0 p-3 mb-3 bg-light rounded-3">
      <div className="row g-2 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Pretraži po imenu ili opisu..."
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
          />
        </div>
        <div className="col-md-7 d-flex gap-1 flex-wrap justify-content-md-end">
          {vrste.map((v) => (
            <button
             key={v.vrijednost}
              className={`btn btn-sm ${
                odabranaVrsta === v.vrijednost ? "btn-dark" : "btn-outline-secondary"
              }`}
              onClick={() => setOdabranaVrsta(v.vrijednost)}
            >
              {v.naziv}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar