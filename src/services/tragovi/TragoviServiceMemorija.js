import { tragovi } from "./TragoviPodaci";

async function get() {
  return { data: [...tragovi] }
}

async function getById(id) {
  return { data: tragovi.find(t => t.id === parseInt(id)) }
}

async function getByPrijava(prijavaId) {
 return { data: tragovi.filter(t => t.prijava === parseInt(prijavaId))}
}

async function dodaj(trag) {
  if (tragovi.length === 0) {
    trag.id = 1
  } else {
    trag.id = tragovi[tragovi.length - 1].id + 1
  }
  tragovi.push(trag)
  return { data: trag }
}

async function promijeni(id, trag) {
  const index = nadiIndex(id)
  if (index === -1) return
  tragovi[index] = { ...tragovi[index], ...trag, id: parseInt(id) }
}

function nadiIndex(id) {
  return tragovi.findIndex(v => v.id === parseInt(id));
}

async function obrisi(id) {
  const index = nadiIndex(id)
  if (index === -1) return
  tragovi.splice(index, 1)
}


export default {
  get,
  getById,
  getByPrijava,
  dodaj,
  promijeni,
  obrisi,
}