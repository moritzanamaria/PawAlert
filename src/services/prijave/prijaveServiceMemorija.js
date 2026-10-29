import { prijave } from "./prijavePodaci";

async function get() {
  return { data: [...prijave] }

}

async function getById(id) {
  return { data: prijave.find(p => p.id === parseInt(id)) }
}

async function dodaj(prijava) {
  if (prijave.length === 0) {
    prijava.id = 1
  } else {
    prijava.id = prijave[prijave.length - 1].id + 1
  }
  prijave.push(prijava)
}

async function promjeni(id, prijava) {
  const index = nadiIndex(id)
  if (index === -1) return
  prijave[index] = { ...prijave[index], ...prijava, id: parseInt(id) }
}


function nadiIndex(id) {
  return prijave.findIndex(p => p.id === parseInt(id))
}

async function obrisi(id) {
  const index = nadiIndex(id)
  if (index === -1) return
  prijave.splice(index, 1)
}

async function dohvatiStranicu(stranica = 1, velicinaStranice = 8) {
    const pocetniIndeks = (stranica - 1) * velicinaStranice; // (2-1) * 8, 1 * 8 = 8
    const zavrsniIndeks = pocetniIndeks + velicinaStranice; // 8+8=16
    const stranicenjePodaci = prijave.slice(pocetniIndeks, zavrsniIndeks);
    const ukupnoStavki = prijave.length;
    const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice);

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