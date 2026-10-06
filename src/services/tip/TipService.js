import TipPodaci from "./TipPodaci";

  async function get() {
    return {data: [...TipPodaci]}

  }

  async function getById(id) {
    return{data: TipPodaci.find(p => p.id===parseInt(id))}
  }

async function dodaj(tip) {
  if(TipPodaci.length===0){
    tip.id = 1
  }else{
    tip.id= TipPodaci[TipPodaci.length -1].id + 1
  }
  TipPodaci.push(tip)
  }

  async function promjeni(id, tip) {
     const index = nadiIndex(id)
     TipPodaci[index] = { ...TipPodaci[index], ...tip, id: parseInt(id) }
     }
 
     function nadiIndex(id){
    return TipPodaci.findIndex(t => t.id === parseInt(id))
} 

   
 async function obrisi(id){
     const index = nadiIndex(id)
         TipPodaci.splice(index, 1)
     }
 

export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi
}