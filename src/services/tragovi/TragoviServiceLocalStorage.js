import { PrefixStorage } from "../../constants"

function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(PrefixStorage.TRAGOVI)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(PrefixStorage.TRAGOVI, JSON.stringify(podaci))
}

async function get() {
  const tragovi = dohvatiSveIzStorage()
  return {data: tragovi}
  
}

async function getById(id) {
    const tragovi = dohvatiSveIzStorage()
    return{data: tragovi.find(t => String(t.id)===String(id))}
  }

  async function getByPrijava(prijavaId) {
        const tragovi = dohvatiSveIzStorage();
        const filtrirani = tragovi.filter(t => String(t.prijava) === String(prijavaId));
        return { data: filtrirani };
    }

async function dodaj(trag) {
    const tragovi = dohvatiSveIzStorage()
  if(tragovi.length===0){
    trag.id = 1
  }else{
    const maxId = Math.max(...tragovi.map(t=>t.id))
    trag.id = maxId +1
  }
  tragovi.push(trag)
  spremiUStorage(tragovi)
  return{data: trag}
  }

  async function promjeni(id, trag) {
    const tragovi = dohvatiSveIzStorage()
    const index = tragovi.findIndex(t => String(t.id)===String(id))
    tragovi[index] = { ...tragovi[index], ...trag, id: String(id)}
    spremiUStorage(tragovi)
    
    return{data: trag}
  }

    
  
async function obrisi(id){
  let tragovi= dohvatiSveIzStorage()  
  tragovi = tragovi.filter(t=>String(t.id) !== String(id))
  spremiUStorage(tragovi)
    return{data:{}}
}


export default {
  get,
  getById,
  getByPrijava,
  dodaj,
  promjeni,
  obrisi
}