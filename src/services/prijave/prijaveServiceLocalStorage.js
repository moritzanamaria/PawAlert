const STORAGE_KEY='prijave'

function dohvatiSveIzStorage(){
  const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci): []

  }

function spremiUStorage(podaci){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
  const prijave = dohvatiSveIzStorage()
  return {data: prijave}
  
}

async function getById(id) {
    const prijave = dohvatiSveIzStorage()
    return{
      data: prijave.find(p => p.id===parseInt(id))}
  }

async function dodaj(prijava) {
    const prijave = dohvatiSveIzStorage()
  if(prijave.length===0){
    prijava.id = 1
  }else{
    const maxId = Math.max(...prijave.map(p=>p.id))
    prijava.id = maxId +1
  }
  prijave.push(prijava)
  spremiUStorage(prijave)
  }

  async function promjeni(id, prijava) {
    const prijave = dohvatiSveIzStorage()
    const index = prijave.findIndex(p=>p.id===parseInt(id))
    prijave[index] = { ...prijave[index], ...prijava, }
    spremiUStorage(prijave)
    }

    
  
async function obrisi(id){
  let prijave= dohvatiSveIzStorage()  
  prijave = prijave.filter(p=>p.id !== parseInt(id))
  spremiUStorage(prijave)
    
}

async function dohvatiStranicu(stranica = 1, velicinaStranice = 8) {
  const prijave = dohvatiSveIzStorage();
  const pocetniIndeks = (stranica - 1) * velicinaStranice;
  const zavrsniIndeks = pocetniIndeks + velicinaStranice;

  const stranicenjePodaci = prijave.slice(pocetniIndeks, zavrsniIndeks);
  const ukupnoStavki = prijave.length;
  const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice) || 1;

  return {
    data: stranicenjePodaci,
    ukupnoStranica: ukupnoStranica,
    ukupnoStavki: ukupnoStavki
  };
}



export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
  dohvatiStranicu
}