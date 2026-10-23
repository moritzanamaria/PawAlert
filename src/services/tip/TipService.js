import { DATA_SOURCE } from "../../constants";
import TipServiceLocalStorage from "./TipServiceLocalStorage";
import TipServiceMemorija from "./TipServiceMemorija";

let Servis = 
  DATA_SOURCE === 'memorija' ? TipServiceMemorija :
  DATA_SOURCE === 'localStorage' ? TipServiceLocalStorage : 
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
  dodaj: (tip) => AktivniServis.dodaj(tip),
  promjeni: (id, tip) => AktivniServis.promjeni(id, tip),
  obrisi: (id) => AktivniServis.obrisi(id)
}