import PretragaInput from "./PretragaInput";
import VrstaSelect from "./VrstaSelect";

function FilterBar({ pretraga, setPretraga, vrsta, setVrsta, vrste = [] }) {
  return (
    <div className="card shadow-sm border-0 p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-6">
          <PretragaInput pretraga={pretraga} setPretraga={setPretraga} />
        </div>
        <div className="col-12 col-md-6">
          <VrstaSelect vrsta={vrsta} setVrsta={setVrsta} vrste={vrste} />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;