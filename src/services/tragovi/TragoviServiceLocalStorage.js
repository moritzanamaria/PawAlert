const STORAGE_KEY='tragovi'

function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
  const tragovi = dohvatiSveIzStorage()
  return {data: tragovi}
  
}

async function getById(id) {
    const tragovi = dohvatiSveIzStorage()
    return{data: tragovi.find(t => t.id===parseInt(id))}
  }

  async function getByPrijava(prijavaId) {
        const tragovi = dohvatiSveIzStorage();
        const filtrirani = tragovi.filter(t => parseInt(t.prijava) === parseInt(prijavaId));
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
    const index = tragovi.findIndex(t=>t.id===parseInt(id))
    tragovi[index] = { ...tragovi[index], ...trag, }
    spremiUStorage(tragovi)
    
    return{data: trag}
  }

    
  
async function obrisi(id){
  let tragovi= dohvatiSveIzStorage()  
  tragovi = tragovi.filter(t=>t.id !== parseInt(id))
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