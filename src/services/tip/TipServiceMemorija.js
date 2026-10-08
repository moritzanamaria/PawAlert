import {tipovi} from "./TipPodaci";

  async function get() {
    return {data: [...tipovi]}

  }

  async function getById(id) {
    return{data: tipovi.find(p => p.id===parseInt(id))}
  }

async function dodaj(tip) {
  if(tipovi.length===0){
    tip.id = 1
  }else{
    tip.id= tipovi[tipoviPodaci.length -1].id + 1
  }
  tipovi.push(tip)
  }

  async function promjeni(id, tip) {
    const index = nadiIndex(id)
    tipovi[index] = { ...tipovi[index], ...tip, id: parseInt(id) }
    }

    
     function nadiIndex(id){
    return tipovi.findIndex(p => p.id === parseInt(id))
} 
  
async function obrisi(id){
    const index = nadiIndex(id)
        tipovi.splice(index, 1)
    }


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}