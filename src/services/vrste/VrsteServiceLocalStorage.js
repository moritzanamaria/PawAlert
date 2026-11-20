import {PrefixStorage } from "../../constants"

function dohvatiSveIzStorage() {
  const podaci = localStorage.getItem(PrefixStorage.VRSTE)
  return podaci ? JSON.parse(podaci) : []
}
 
function spremiUStorage(podaci){
  localStorage.setItem(PrefixStorage.VRSTE, JSON.stringify(podaci))
}

async function get() {
  const vrste = dohvatiSveIzStorage()
  return {data: vrste}
  
}

async function getById(id) {
    const vrste = dohvatiSveIzStorage()
    return{data: vrste.find(v => String(v.id) === String(id))}
  }

async function dodaj(vrsta) {
    const vrste = dohvatiSveIzStorage()
  if(vrste.length===0){
    vrsta.id = 1
  }else{
    const maxId = Math.max(...vrste.map(v=>v.id))
    vrsta.id = String(maxId +1)
  }
  vrste.push(vrsta)
  spremiUStorage(vrste)
  }

  async function promijeni(id, vrsta) {
    const vrste = dohvatiSveIzStorage()
    const index = vrste.findIndex(v=>String(v.id) === String(id))
     if (index === -1) return
    vrste[index] = { ...vrste[index], ...vrsta, id: String(id) }
    spremiUStorage(vrste)
    }

   
async function obrisi(id){
  let vrste= dohvatiSveIzStorage()  
  vrste = vrste.filter(v=>String(v.id) !== String(id))
  spremiUStorage(vrste)
    
}


export default {
  get,
  getById,
  dodaj,
  promijeni,
  obrisi
}