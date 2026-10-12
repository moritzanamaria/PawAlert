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
    return{data: tragovi.find(v => v.id===parseInt(id))}
  }

async function dodaj(trag) {
    const tragovi = dohvatiSveIzStorage()
  if(tragovi.length===0){
    trag.id = 1
  }else{
    const maxId = Math.max(...tragovi.map(v=>v.id))
    trag.id = maxId +1
  }
  tragovi.push(trag)
  spremiUStorage(tragovi)
  }

  async function promjeni(id, trag) {
    const tragovi = dohvatiSveIzStorage()
    const index = tragovi.findIndex(v=>v.id===parseInt(id))
    tragovi[index] = { ...tragovi[index], ...trag, }
    spremiUStorage(tragovi)
    }

    
  
async function obrisi(id){
  let tragovi= dohvatiSveIzStorage()  
  tragovi = tragovi.filter(v=>v.id !== parseInt(id))
  spremiUStorage(tragovi)
    
}


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi
}