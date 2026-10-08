const STORAGE_KEY='vrste'
function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
  const vrste = dohvatiSveIzStorage()
  return {data: vrste}
  
}

async function getById(id) {
    const vrste = dohvatiSveIzStorage()
    return{data: vrste.find(v => v.id===parseInt(id))}
  }

async function dodaj(vrsta) {
    const vrste = dohvatiSveIzStorage()
  if(vrste.length===0){
    vrsta.id = 1
  }else{
    const maxId = Math.max(...vrste.map(v=>v.id))
    vrsta.id = maxId +1
  }
  vrste.push(vrsta)
  spremiUStorage(vrste)
  }

  async function promjeni(id, vrsta) {
    const vrste = dohvatiSveIzStorage()
    const index = vrste.findIndex(v=>v.id===parseInt(id))
    vrste[index] = { ...vrste[index], ...vrsta, }
    spremiUStorage(vrste)
    }

    
  
async function obrisi(id){
  let vrste= dohvatiSveIzStorage()  
  vrste = vrste.filter(v=>v.id !== parseInt(id))
  spremiUStorage(vrste)
    
}


export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi
}