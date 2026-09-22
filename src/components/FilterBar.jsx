function FilterBar({ pretraga, setPretraga, odabranaVrsta, setOdabranaVrsta }) {
  const vrste = ["sve", "pas", "mačka", "ptica", "ostalo"];

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
          {vrste.map((vrsta) => (
            <button
              key={vrsta}
              className={`btn btn-sm ${
                odabranaVrsta === vrsta ? "btn-dark" : "btn-outline-secondary"
              } text-capitalize`}
              onClick={() => setOdabranaVrsta(vrsta)}
            >
              {vrsta}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar