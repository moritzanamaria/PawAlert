import {prijavePodaci} from "./prijavePodaci";

  async function get() {
    return {data: [...prijavePodaci]}

  }

  async function getById(id) {
    return{data: prijavePodaci.find(p => p.id===parseInt(id))}
  }

async function dodaj(prijava) {
  if(prijavePodaci.length===0){
    prijava.id = 1
  }else{
    prijava.id= prijavePodaci[prijavePodaci.length -1].id + 1
  }
  prijavePodaci.push(prijava)
  }

  async function promjeni(id, prijava) {
    const index = prijavePodaci.findIndex(p => p.id === parseInt(id))
    if(index !== -1){
        prijavePodaci[index] = { ...prijavePodaci[index], ...prijava, id: parseInt(sifra) }
    }
}
  
async function obrisi(id){
    const index = prijavePodaci.findIndex(p => p.id === parseInt(id))
    if(index !== -1){
        prijavePodaci.splice(index, 1)
    }
}

export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi
}