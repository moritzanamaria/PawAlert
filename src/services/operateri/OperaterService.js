import OperaterServiceLocalStorage from "./OperaterServiceLocalStorage"
import OperaterServiceFirebase from "./OperaterServiceFireBase"
import OperaterServiceMemorija from "./OperaterServiceMemorija"
import { DATA_SOURCE } from "../../constants"

let Servis = null

switch (DATA_SOURCE) {
    case 'memorija':
        Servis = OperaterServiceMemorija
        break
    case 'localStorage':
        Servis = OperaterServiceLocalStorage
        break
    case 'firebase':
        Servis = OperaterServiceFirebase
        break
    default:
        Servis = null
}

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getById: async (_id) => ({ success: false, data: null }),
    dodaj: async (_operater) => { console.error("Servis nije učitan"); return { success: false } },
    promjeni: async (_id, _operater) => { console.error("Servis nije učitan"); return { success: false } },
    promjeniLozinku: async (_id, _novaLozinka) => { console.error("Servis nije učitan"); return { success: false } },
    obrisi: async (_id) => { console.error("Servis nije učitan"); return { success: false } },
    prijava: async (_email, _lozinka) => { console.error("Servis nije učitan"); return { success: false, message: "Servis nije učitan" } }
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