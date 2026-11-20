import { DATA_SOURCE } from "../../constants";
import VrsteServiceFireBase from "./VrsteServiceFireBase"
import VrsteServiceLocalStorage from "./VrsteServiceLocalStorage";
import VrsteServiceMemorija from "./VrsteServiceMemorija";

let Servis = null;

switch (DATA_SOURCE) {
  case 'memorija':
    Servis = VrsteServiceMemorija
    break
  case 'localStorage':
    Servis = VrsteServiceLocalStorage
    break
  case 'firebase':
    Servis = VrsteServiceFireBase
    break
  default:
    Servis = null
}

const PrazanServis = {
  get: async () => ({ data: [] }),
  getById: async () => ({ data: {} }),
  dodaj: async () => { console.error('Servis nije implementiran') },
  promijeni: async () => { console.error('Servis nije implementiran') },
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
  promijeni: (id, vrsta) => AktivniServis.promijeni(id, vrsta),
  obrisi: (id) => AktivniServis.obrisi(id)
}