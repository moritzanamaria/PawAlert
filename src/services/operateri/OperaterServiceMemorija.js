import { operateri } from "./OperaterPodaci"
import bcrypt from 'bcryptjs'

async function get(){
    const operateriBezcLozinki = operateri.map(op => ({
        id: op.id,
        email: op.email,
        uloga: op.uloga
    }))
    return {success: true, data: [...operateriBezcLozinki]}
}

async function getById(id) {
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

async function dodaj(operater){
    if(operateri.length===0){
        operater.id='1'
    }else{
        operater.id = String(parseInt(operateri[operateri.length - 1].id) + 1)
    }
    
    operater.lozinka = bcrypt.hashSync(operater.lozinka, 10)
    
    operateri.push(operater)
    return {success: true, data: {id: operater.id, email: operater.email}}
}

async function promjeni(id, operater) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Operater nije pronađen"}
    }
    
    operateri[index] = {
        ...operateri[index], 
        email: operater.email,
        uloga: operater.uloga,
        id: id
    }
    
    return {success: true, data: {id: operateri[index].id, email: operateri[index].email, uloga: operateri[index].uloga}}
}

async function promjeniLozinku(id, novaLozinka) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Operater nije pronađen"}
    }
    
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

function nadiIndex(id){
    return operateri.findIndex(o=>o.id === id)
}

async function obrisi(id) {
    const index = nadiIndex(id)
    if (index > -1) {
        operateri.splice(index, 1)
        return {success: true, message: "Operater obrisan"}
    }
    return {success: false, message: "Operater nije pronađen"}
}

async function prijava(email, lozinka) {
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

export default{
    get,
    dodaj,
    getById,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
}