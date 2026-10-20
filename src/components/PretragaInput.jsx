function PretragaInput({ pretraga, setPretraga }) {
  return (
    <>
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
    </>
  );
}

export default PretragaInput;