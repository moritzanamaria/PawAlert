import {vrste} from "./VrstePodaci";

  async function get() {
    return {data: [...vrste]}

  }

  async function getById(id) {
    return{data: vrste.find(p => p.id===parseInt(id))}
  }

async function dodaj(vrsta) {
  if(vrste.length===0){
    vrsta.id = 1
  }else{
    vrsta.id= vrste[vrstePodaci.length -1].id + 1
  }
  vrste.push(vrsta)
  }

  async function promjeni(id, vrsta) {
    const index = nadiIndex(id)
    vrste[index] = { ...vrste[index], ...vrsta, id: parseInt(id) }
    }

    
     function nadiIndex(id){
    return vrste.findIndex(v => v.id === parseInt(id))
} 
  
async function obrisi(id){
    const index = nadiIndex(id)
        vrste.splice(index, 1)
    }


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}