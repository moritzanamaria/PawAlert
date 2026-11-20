import OperaterServiceLocalStorage from "./OperaterServiceLocalStorage"
import OperaterServiceFireBase from "./OperaterServiceFireBase"
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
        Servis = OperaterServiceFireBase
        break
    default:
        Servis = null
}

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getById: async (_id) => ({ success: false, data: null }),
    dodaj: async (_operater) => { console.error("Servis nije učitan"); return { success: false } },
    promijeni: async (_id, _operater) => { console.error("Servis nije učitan"); return { success: false } },
    promijeniLozinku: async (_id, _novaLozinka) => { console.error("Servis nije učitan"); return { success: false } },
    obrisi: async (_id) => { console.error("Servis nije učitan"); return { success: false } },
    prijava: async (_email, _lozinka) => { console.error("Servis nije učitan"); return { success: false, message: "Servis nije učitan" } }
}

const AktivniServis = Servis || PrazanServis

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (operater) => AktivniServis.dodaj(operater),
    promijeni: (id, operater) => AktivniServis.promijeni(id, operater),
    promijeniLozinku: (id, novaLozinka) => AktivniServis.promijeniLozinku(id, novaLozinka),
    obrisi: (id) => AktivniServis.obrisi(id),
    prijava: (email, lozinka) => AktivniServis.prijava(email, lozinka)
}