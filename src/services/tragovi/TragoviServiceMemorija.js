import {tragovi} from "./TragoviPodaci";

  async function get() {
    return {data: [...tragovi]}

  }

  async function getById(id) {
    return{data: tragovi.find(p => p.id===parseInt(id))}
  }

async function dodaj(trag) {
  if(tragovi.length===0){
    trag.id = 1
  }else{
    trag.id= tragovi[tragoviPodaci.length -1].id + 1
  }
  tragovi.push(trag)
  }

  async function promjeni(id, trag) {
    const index = nadiIndex(id)
    tragovi[index] = { ...tragovi[index], ...trag, id: parseInt(id) }
    }

    
     function nadiIndex(id){
    return tragovi.findIndex(v => v.id === parseInt(id))
} 
  
async function obrisi(id){
    const index = nadiIndex(id)
        tragovi.splice(index, 1)
    }


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}