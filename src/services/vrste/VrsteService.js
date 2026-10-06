import VrstePodaci from "./VrstePodaci";

  async function get() {
    return {data: [...VrstePodaci]}

  }

  async function getById(id) {
    return{data: VrstePodaci.find(p => p.id===parseInt(id))}
  }

async function dodaj(vrsta) {
  if(VrstePodaci.length===0){
    vrsta.id = 1
  }else{
    vrsta.id= VrstePodaci[VrstePodaci.length -1].id + 1
  }
  VrstePodaci.push(vrsta)
  }

 
  async function promjeni(id, vrsta) {
     const index = nadiIndex(id)
     VrstePodaci[index] = { ...VrstePodaci[index], ...vrsta, id: parseInt(id) }
     }
 
     function nadiIndex(id){
    return VrstePodaci.findIndex(v => v.id === parseInt(id))
} 

   
 async function obrisi(id){
     const index = nadiIndex(id)
         VrstePodaci.splice(index, 1)
     }

export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi
}