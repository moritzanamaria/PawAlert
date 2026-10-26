import { DATA_SOURCE } from "../../constants";
import OznakeServiceLocalStorage from "./OznakeServiceLocalStorage";
import OznakeServiceMemorija from "./OznakeServiceMemorija";

let Servis = 
  DATA_SOURCE === 'memorija' ? OznakeServiceMemorija :
  DATA_SOURCE === 'localStorage' ? OznakeServiceLocalStorage : 
  null;

const PrazanServis = {
  get: async () => ({ data: [] }),
  getById: async () => ({ data: {} }),
  dodaj: async () => { console.error('Servis nije implementiran') },
  promjeni: async () => { console.error('Servis nije implementiran') },
  obrisi: async () => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis

export default {
  get: async () => {
    const res = await AktivniServis.get();
    const lista = Array.isArray(res) ? res : (res?.data ?? []);
    return { data: lista };
  },
  getById: async (id) => {
    const res = await AktivniServis.getById(id);
    const zapis = res?.data ?? res;
    return { data: zapis };
  },
  dodaj: (oznaka) => AktivniServis.dodaj(oznaka),
  promjeni: (id, oznaka) => AktivniServis.promjeni(id, oznaka),
  obrisi: (id) => AktivniServis.obrisi(id)
}