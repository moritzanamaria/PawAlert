import { DATA_SOURCE } from "../../constants";
import { normalizirajLokaciju } from "../../utils/lokacija";
import TragoviServiceLocalStorage from "./TragoviServiceLocalStorage";
import TragoviServiceMemorija from "./TragoviServiceMemorija";

let Servis = 
  DATA_SOURCE === 'memorija' ? TragoviServiceMemorija:
  DATA_SOURCE === 'localStorage' ? TragoviServiceLocalStorage : 
  null;

const PrazanServis = {
  get: async () => ({ data: [] }),
  getById: async () => ({ data: {} }),
  getByPrijava: async () => ({ data: [] }),
  dodaj: async () => { console.error('Servis nije implementiran') },
  promjeni: async () => { console.error('Servis nije implementiran') },
  obrisi: async () => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis
const toLista = (res) => Array.isArray(res) ? res : (res?.data ?? [])

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
  getByPrijava: async (prijavaId) => {
    const res = await AktivniServis.getByPrijava(prijavaId)
    return { data: toLista(res).map(normalizirajLokaciju) }
  },
  dodaj: (trag) => AktivniServis.dodaj(trag),
  promjeni: (id, trag) => AktivniServis.promjeni(id, trag),
  obrisi: (id) => AktivniServis.obrisi(id)
}