import bcrypt from 'bcryptjs'
import { operateri as seedOperateri } from './OperaterPodaci'

const STORAGE_KEY = 'operateri'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    const parsirano = podaci ? JSON.parse(podaci) : []

    if (parsirano.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOperateri))
        return [...seedOperateri]
    }

    return parsirano
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
    const operateri = dohvatiSveIzStorage()
    const operateriBezcLozinki = operateri.map(op => ({
        id: op.id,
        email: op.email,
        uloga: op.uloga
    }))
    return {success: true, data: [...operateriBezcLozinki]}
}

async function getById(id) {
    const operateri = dohvatiSveIzStorage()
    const operater = operateri.find(o => o.id === id)
    if (!operater) {
        return {success: false, data: null}
    }
    return {success: true, data: {
        id: operater.id,
        email: operater.email,
        uloga: operater.uloga
    }}
}

async function dodaj(operater) {
    const operateri = dohvatiSveIzStorage()
    
    if (operateri.length === 0) {
        operater.id = '1'
    } else {
        operater.id = String(parseInt(operateri[operateri.length - 1].id) + 1)
    }
    
    operater.lozinka = bcrypt.hashSync(operater.lozinka, 10)
    
    operateri.push(operater)
    spremiUStorage(operateri)
    return {success: true, data: {id: operater.id, email: operater.email}}
}

async function promjeni(id, operater) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.id === id)
    
    if (index === -1) {
        return {success: false, message: "Operater nije pronađen"}
    }
    
    operateri[index] = {
        ...operateri[index],
        email: operater.email,
        uloga: operater.uloga,
        id: id
    }
    spremiUStorage(operateri)
    return {success: true, data: {id: operateri[index].id, email: operateri[index].email, uloga: operateri[index].uloga}}
}

async function promjeniLozinku(id, novaLozinka) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.id === id)
    
    if (index === -1) {
        return {success: false, message: "Operater nije pronađen"}
    }
    
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(operateri)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

async function obrisi(id) {
    let operateri = dohvatiSveIzStorage()
    const initialLength = operateri.length
    operateri = operateri.filter(o => o.id !== id)
    
    if (operateri.length === initialLength) {
        return {success: false, message: "Operater nije pronađen"}
    }
    
    spremiUStorage(operateri)
    return {success: true, message: 'Operater obrisan'}
}

async function prijava(email, lozinka) {
    const operateri = dohvatiSveIzStorage()
    const operater = operateri.find(o => o.email === email)
    if (!operater) {
        return {success: false, message: "Email i lozinka ne odgovaraju"} // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }
    
    const isMatch = bcrypt.compareSync(lozinka, operater.lozinka)
    if (!isMatch) {
        return {success: false, message: "Email i lozinka ne odgovaraju"}
    }
    
    return {
        success: true, 
        data: {
            id: operater.id,
            email: operater.email,
            uloga: operater.uloga
        }
    }
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
}