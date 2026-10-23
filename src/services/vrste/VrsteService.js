import { DATA_SOURCE } from "../../constants";
import VrsteServiceLocalStorage from "./VrsteServiceLocalStorage";
import VrsteServiceMemorija from "./VrsteServiceMemorija";

let Servis = 
  DATA_SOURCE === 'memorija' ? VrsteServiceMemorija :
  DATA_SOURCE === 'localStorage' ? VrsteServiceLocalStorage : 
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
  dodaj: (vrsta) => AktivniServis.dodaj(vrsta),
  promjeni: (id, vrsta) => AktivniServis.promjeni(id, vrsta),
  obrisi: (id) => AktivniServis.obrisi(id)
}