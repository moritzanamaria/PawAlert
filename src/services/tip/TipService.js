import { DATA_SOURCE } from "../../constants";
import TipServiceLocalStorage from "./TipServiceLocalStorage";
import TipServiceMemorija from "./TipServiceMemorija";

let Servis = null
switch(DATA_SOURCE){
  case 'memorija':
    Servis = TipServiceMemorija
    break
    case 'localStorage':
      Servis = TipServiceLocalStorage
      break
      default:
        Servis = null
}

const PrazanServis = {
  get: async ()=>({data:[]}),
  getById: async (id)=>({data:{}}),
  dodaj: async (tip)=>{console.error('Servis nije implementiran')},
  promjeni: async (id, tip)=>{console.error('Servis nije implementiran')},
  obrisi: async (id)=>{console.error('Servis nije implementiran')},
}

const AktivniServis = Servis||PrazanServis

export default{
  get: ()=> AktivniServis.get(),
  getById: (id)=> AktivniServis.getById(id),
  dodaj: (tip)=>AktivniServis.dodaj(tip),
  promjeni: (id, tip)=>AktivniServis.promjeni(id, tip),
  obrisi: (id)=> AktivniServis.obrisi(id)
}