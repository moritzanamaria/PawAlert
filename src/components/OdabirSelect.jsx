function OdabirSelect({
  id,
  label,
  placeholder = "Sve opcije",
  vrijednost,
  setVrijednost,
  stavke = [],
}) {
  return (
    <>
      <label htmlFor={id} className="form-label small fw-bold text-muted mb-1">
        {label}
      </label>
      <select
        id={id}
        className="form-select form-select-sm"
        value={vrijednost}
        onChange={(e) => setVrijednost(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {stavke.map((s) => (
          <option key={s.id} value={s.id}>
            {s.naziv}
          </option>
        ))}
      </select>
    </>
  );
}

export default OdabirSelect;