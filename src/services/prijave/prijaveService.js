import { DATA_SOURCE } from "../../constants";
import { normalizirajLokaciju } from "../../utils/lokacija";
import prijaveServiceLocalStorage from "./prijaveServiceLocalStorage";
import prijaveServiceMemorija from "./prijaveServiceMemorija";

let Servis = 
  DATA_SOURCE === 'memorija' ? prijaveServiceMemorija :
  DATA_SOURCE === 'localStorage' ? prijaveServiceLocalStorage : 
  null;

const PrazanServis = {
  get: async () => ({ data: [] }),
  getById: async () => ({ data: {} }),
  dodaj: async () => { console.error('Servis nije implementiran') },
  promjeni: async () => { console.error('Servis nije implementiran') },
  obrisi: async () => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis;

export default {
  get: async () => {
    const res = await AktivniServis.get()
    const lista = Array.isArray(res) ? res : (res?.data ?? [])
    return { data: lista.map(normalizirajLokaciju) }
  },
  getById: async (id) => {
    const res = await AktivniServis.getById(id)
    const zapis = res?.data ?? res
    return { data: normalizirajLokaciju(zapis) }
  },
  dodaj: (prijava) => AktivniServis.dodaj(prijava),
  promjeni: (id, prijava) => AktivniServis.promjeni(id, prijava),
  obrisi: (id) => AktivniServis.obrisi(id)
}