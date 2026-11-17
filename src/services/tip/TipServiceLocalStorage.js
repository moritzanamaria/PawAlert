import {PrefixStorage } from "../../constants"


function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(PrefixStorage.TIPOVI)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(PrefixStorage.TIPOVI, JSON.stringify(podaci))
}

async function get() {
  const tipovi = dohvatiSveIzStorage()
  return {data: tipovi}
  
}

async function getById(id) {
    const tipovi = dohvatiSveIzStorage()
    return{data: tipovi.find(t => String(t.id) === String(id))}
  }

async function dodaj(tip) {
    const tipovi = dohvatiSveIzStorage()
  if(tipovi.length===0){
    tip.id = 1
  }else{
    const maxId = Math.max(...tipovi.map(t=>t.id))
    tip.id = String(maxId +1)
  }
  tipovi.push(tip)
  spremiUStorage(tipovi)
  }

  async function promjeni(id, tip) {
    const tipovi = dohvatiSveIzStorage()
    const index = tipovi.findIndex(t=>String(t.id) === String(id))
    tipovi[index] = { ...tipovi[index], ...tip, id: String(id)}
    spremiUStorage(tipovi)
    }

    
  
async function obrisi(id){
  let tipovi= dohvatiSveIzStorage()  
  tipovi = tipovi.filter(t=>String(t.id) === String(id))
  spremiUStorage(tipovi)
    
}


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}