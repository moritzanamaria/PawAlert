import { oznake } from "./OznakePodaci"; 

const STORAGE_KEY = 'oznake';

function dohvatiSveIzStorage() {
  const podaci = localStorage.getItem(STORAGE_KEY);
  if (!podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oznake));
    return oznake;
  }
  return JSON.parse(podaci);
}

function spremiUStorage(podaci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
  const oznake = dohvatiSveIzStorage();
  return { data: oznake };
}

async function getById(id) {
  const oznake = dohvatiSveIzStorage();
  return { data: oznake.find(o => o.id === parseInt(id)) };
}

async function dodaj(oznaka) {
  const oznake = dohvatiSveIzStorage();
  if (oznake.length === 0) {
    oznaka.id = 1;
  } else {
    const maxId = Math.max(...oznake.map(o => o.id));
    oznaka.id = maxId + 1;
  }
  oznake.push(oznaka);
  spremiUStorage(oznake);
}

async function promjeni(id, oznaka) {
  const oznake = dohvatiSveIzStorage();
  const index = oznake.findIndex(o => o.id === parseInt(id));
  if (index !== -1) {
    oznake[index] = { ...oznake[index], ...oznaka };
    spremiUStorage(oznake);
  }
}

async function obrisi(id) {
  let oznake = dohvatiSveIzStorage();
  oznake = oznake.filter(o => o.id !== parseInt(id));
  spremiUStorage(oznake);
}

export default {
  get,
  getById,
  dodaj,
  promjeni,
  obrisi,
}