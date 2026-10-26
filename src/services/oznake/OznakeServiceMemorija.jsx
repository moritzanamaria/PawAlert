import { oznake } from "./OznakePodaci";

async function get() {
  return { data: [...oznake] }
}

async function getById(id) {
  return { data: oznake.find(p => p.id === parseInt(id)) }
}

async function dodaj(oznaka) {
  if (oznake.length === 0) {
    oznaka.id = 1
  } else {
    oznaka.id = oznake[oznake.length - 1].id + 1
  }
  oznake.push(oznaka)
}

async function promjeni(id, oznaka) {
  const index = nadiIndex(id)
  if (index === -1) return
  oznake[index] = { ...oznake[index], ...oznaka, id: parseInt(id) }
}

function nadiIndex(id) {
  return oznake.findIndex(p => p.id === parseInt(id))
}

async function obrisi(id) {
  const index = nadiIndex(id)
  if (index === -1) return
  oznake.splice(index, 1)
}

export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}