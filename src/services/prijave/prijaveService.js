import { DATA_SOURCE } from "../../constants";
import { normalizirajLokaciju } from "../../utils/lokacija";
import prijaveServiceLocalStorage from "./prijaveServiceLocalStorage";
import prijaveServiceMemorija from "./prijaveServiceMemorija";

let Servis = null
switch(DATA_SOURCE){
  case 'memorija':
    Servis = prijaveServiceMemorija
    break
    case 'localStorage':
      Servis = prijaveServiceLocalStorage
      break
      default:
        Servis = null
}

const PrazanServis = {
  get: async ()=>({data:[]}),
  getById: async (id)=>({data:{}}),
  dodaj: async (prijava)=>{console.error('Servis nije implementiran')},
  promjeni: async (id, prijava)=>{console.error('Servis nije implementiran')},
  obrisi: async (id)=>{console.error('Servis nije implementiran')},
}

const AktivniServis = Servis||PrazanServis

export default{
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
  dodaj: (prijava)=>AktivniServis.dodaj(prijava),
  promjeni: (id, prijava)=>AktivniServis.promjeni(id, prijava),
  obrisi: (id)=> AktivniServis.obrisi(id)
}