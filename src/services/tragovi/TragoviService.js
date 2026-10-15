import { DATA_SOURCE } from "../../constants";
import TragoviServiceLocalStorage from "./TragoviServiceLocalStorage";
import TragoviServiceMemorija from "./TragoviServiceMemorija";

let Servis = null
switch (DATA_SOURCE) {
  case 'memorija':
    Servis = TragoviServiceMemorija
    break
  case 'localStorage':
    Servis = TragoviServiceLocalStorage
    break
  default:
    Servis = null
}

const PrazanServis = {
  get: async () => ({ data: [] }),
  getById: async (id) => ({ data: {} }),
  getByPrijava: async (prijavaId) => ({ data: [] }),
  dodaj: async (trag) => { console.error('Servis nije implementiran') },
  promjeni: async (id, trag) => { console.error('Servis nije implementiran') },
  obrisi: async (id) => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis

export default {
  get: () => AktivniServis.get(),
  getById: (id) => AktivniServis.getById(id),
  getByPrijava: (prijavaId) => AktivniServis.getByPrijava(prijavaId),
  dodaj: (trag) => AktivniServis.dodaj(trag),
  promjeni: (id, trag) => AktivniServis.promjeni(id, trag),
  obrisi: (id) => AktivniServis.obrisi(id)
}