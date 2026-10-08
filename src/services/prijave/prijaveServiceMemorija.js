import {prijave} from "./prijavePodaci";

  async function get() {
    return {data: [...prijave]}

  }

  async function getById(id) {
    return{data: prijave.find(p => p.id===parseInt(id))}
  }

async function dodaj(prijava) {
  if(prijave.length===0){
    prijava.id = 1
  }else{
    prijava.id= prijave[prijave.length -1].id + 1
  }
  prijave.push(prijava)
  }

  async function promjeni(id, prijava) {
    const index = nadiIndex(id)
    prijave[index] = { ...prijave[index], ...prijava, id: parseInt(id) }
    }

    
     function nadiIndex(id){
    return prijave.findIndex(p => p.id === parseInt(id))
} 
  
async function obrisi(id){
    const index = nadiIndex(id)
        prijave.splice(index, 1)
    }


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}