import OperaterServiceLocalStorage from "./OperaterServiceLocalStorage"
import OperaterServiceMemorija from "./OperaterServiceMemorija"
import { DATA_SOURCE } from "../../constants"

let Servis = null

switch (DATA_SOURCE) {
    case 'memorija':
        Servis = OperaterServiceMemorija
        break
    case 'localStorage':
        Servis = OperaterServiceLocalStorage
        break;
    default:
        Servis = null
}

const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: null }),
    dodaj: async (operater) => { console.error("Servis nije učitan"); return {success: false} },
    promjeni: async (id, operater) => { console.error("Servis nije učitan"); return {success: false} },
    promjeniLozinku: async (id, novaLozinka) => { console.error("Servis nije učitan"); return {success: false} },
    obrisi: async (id) => { console.error("Servis nije učitan"); return {success: false} },
    prijava: async (email, lozinka) => { console.error("Servis nije učitan"); return {success: false, message: "Servis nije učitan"} }
}

const AktivniServis = Servis || PrazanServis

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (operater) => AktivniServis.dodaj(operater),
    promjeni: (id, operater) => AktivniServis.promjeni(id, operater),
    promjeniLozinku: (id, novaLozinka) => AktivniServis.promjeniLozinku(id, novaLozinka),
    obrisi: (id) => AktivniServis.obrisi(id),
    prijava: (email, lozinka) => AktivniServis.prijava(email, lozinka)
}