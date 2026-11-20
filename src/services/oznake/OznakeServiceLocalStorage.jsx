import { oznake } from "./OznakePodaci"; 
import { PrefixStorage } from '../../constants'

function dohvatiSveIzStorage() {
  const podaci = localStorage.getItem(PrefixStorage.OZNAKE);
  if (!podaci) {
    localStorage.setItem(PrefixStorage.OZNAKE, JSON.stringify(oznake));
    return oznake;
  }
  return JSON.parse(podaci);
}

function spremiUStorage(podaci) {
  localStorage.setItem(PrefixStorage.OZNAKE, JSON.stringify(podaci));
}

async function get() {
  const oznake = dohvatiSveIzStorage();
  return { data: oznake };
}

async function getById(id) {
  const oznake = dohvatiSveIzStorage();
  return { data: oznake.find(o => String(o.id) === String(id)) };
}

async function dodaj(oznaka) {
  const oznake = dohvatiSveIzStorage();
  if (oznake.length === 0) {
    oznaka.id = 1;
  } else {
    const maxId = Math.max(...oznake.map(o => String(o.id)));
    oznaka.id = maxId + 1;
  }
  oznake.push(oznaka);
  spremiUStorage(oznake);
}

async function promijeni(id, oznaka) {
  const oznake = dohvatiSveIzStorage();
  const index = oznake.findIndex(o => String(o.id) === String(id));
  if (index !== -1) {
    oznake[index] = { ...oznake[index], ...oznaka };
    spremiUStorage(oznake);
  }
}

async function obrisi(id) {
  let oznake = dohvatiSveIzStorage();
  oznake = oznake.filter(o => String(o.id) !== String(id));
  spremiUStorage(oznake);
}

export default {
  get,
  getById,
  dodaj,
  promijeni,
  obrisi,
}