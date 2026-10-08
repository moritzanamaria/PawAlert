import { DATA_SOURCE } from "../../constants";
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
  get: ()=> AktivniServis.get(),
  getById: (id)=> AktivniServis.getById(id),
  dodaj: (prijava)=>AktivniServis.dodaj(prijava),
  promjeni: (id, prijava)=>AktivniServis.promjeni(id, prijava),
  obrisi: (id)=> AktivniServis.obrisi(id)
}