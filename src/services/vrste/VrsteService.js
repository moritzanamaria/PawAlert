import { DATA_SOURCE } from "../../constants";
import VrsteServiceLocalStorage from "./VrsteServiceLocalStorage";
import VrsteServiceMemorija from "./VrsteServiceMemorija";

let Servis = null
switch(DATA_SOURCE){
  case 'memorija':
    Servis = VrsteServiceMemorija
    break
    case 'localStorage':
      Servis = VrsteServiceLocalStorage
      break
      default:
        Servis = null
}

const PrazanServis = {
  get: async ()=>({data:[]}),
  getById: async (id)=>({data:{}}),
  dodaj: async (vrsta)=>{console.error('Servis nije implementiran')},
  promjeni: async (id, vrsta)=>{console.error('Servis nije implementiran')},
  obrisi: async (id)=>{console.error('Servis nije implementiran')},
}

const AktivniServis = Servis||PrazanServis

export default{
  get: ()=> AktivniServis.get(),
  getById: (id)=> AktivniServis.getById(id),
  dodaj: (vrsta)=>AktivniServis.dodaj(vrsta),
  promjeni: (id, vrsta)=>AktivniServis.promjeni(id, vrsta),
  obrisi: (id)=> AktivniServis.obrisi(id)
}