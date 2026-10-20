function VrstaSelect({ vrsta, setVrsta, vrste = [] }) {
  return (
    <>
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
        {vrste.map((v) => (
          <option key={v.id} value={v.id}>
            {v.naziv}
          </option>
        ))}
      </select>
    </>
  );
}

export default VrstaSelect;