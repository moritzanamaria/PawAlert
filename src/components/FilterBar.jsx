function FilterBar({ pretraga, setPretraga, vrsta, setVrsta, vrste = [] }) {
  return (
    <div className="card shadow-sm border-0 p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-6">
          <label htmlFor="pretragaInput" className="form-label small fw-bold text-muted mb-1">
            Pretraži
          </label>
          <input
            id="pretragaInput"
            type="text"
            className="form-control form-control-sm"
            placeholder="Ime životinje ili lokacija..."
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="vrstaSelect" className="form-label small fw-bold text-muted mb-1">
            Vrsta
          </label>
          <select
            id="vrstaSelect"
            className="form-select form-select-sm"
            value={vrsta}
            onChange={(e) => setVrsta(e.target.value)}
          >
            <option value="">Sve vrste</option>
            {vrste.map((v,) => (            
              <option key={v.id} value={v.id}>
                {v.naziv}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;