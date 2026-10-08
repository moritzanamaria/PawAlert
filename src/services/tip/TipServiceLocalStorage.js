const STORAGE_KEY='tipovi'
function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
  const tipovi = dohvatiSveIzStorage()
  return {data: tipovi}
  
}

async function getById(id) {
    const tipovi = dohvatiSveIzStorage()
    return{data: tipovi.find(t => t.id===parseInt(id))}
  }

async function dodaj(tip) {
    const tipovi = dohvatiSveIzStorage()
  if(tipovi.length===0){
    tip.id = 1
  }else{
    const maxId = Math.max(...tipovi.map(t=>t.id))
    tip.id = maxId +1
  }
  tipovi.push(tip)
  spremiUStorage(tipovi)
  }

  async function promjeni(id, tip) {
    const tipovi = dohvatiSveIzStorage()
    const index = tipovi.findIndex(t=>t.id===parseInt(id))
    tipovi[index] = { ...tipovi[index], ...tip, }
    spremiUStorage(tipovi)
    }

    
  
async function obrisi(id){
  let tipovi= dohvatiSveIzStorage()  
  tipovi = tipovi.filter(t=>t.id !== parseInt(id))
  spremiUStorage(tipovi)
    
}


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}