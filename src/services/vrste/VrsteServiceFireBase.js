import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

const kolekcija = () => collection(getFirebaseDB(), PrefixStorage.VRSTE);
const ref = (id) => doc(getFirebaseDB(), PrefixStorage.VRSTE, String(id));

async function get() {
    try {
        const snapshot = await getDocs(kolekcija());
        return {
            success: true,
            data: snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getById(id) {
    try {
        const docSnap = await getDoc(ref(id));
        if (docSnap.exists()) {
            return { success: true, data: { ...docSnap.data(), id: docSnap.id } };
        }
        return { success: false, data: undefined, message: "Vrsta ne postoji u bazi." };
    } catch (e) {
        console.error("Greška kod dohvaćanja po id-u: ", e);
        return { success: false, message: e.message };
    }
}

async function dodaj(vrsta) {
    try {
        // sekvencijalni id (max + 1), isto kao u localStorage servisu
        const snapshot = await getDocs(kolekcija());
        const maxId = Math.max(0, ...snapshot.docs.map(d => Number(d.id) || 0));
        const id = String(maxId + 1);

        const { id: _ignoriraj, ...ostalo } = vrsta;
        await setDoc(ref(id), ostalo);

        return { success: true, id, data: { ...ostalo, id } };
    } catch (e) {
        console.error("Greška kod dodavanja: ", e);
        return { success: false, message: e.message };
    }
}

async function promjeni(id, vrsta) {
    try {
        const { id: _ignoriraj, ...ostalo } = vrsta;
        await updateDoc(ref(id), ostalo);
        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        await deleteDoc(ref(id));
        return { success: true, message: "Uspješno obrisano" };
    } catch (e) {
        console.error("Greška kod brisanja: ", e);
        return { success: false, message: e.message };
    }
}

export default {
    get,
    getById,
    dodaj,
    promjeni,
    obrisi
}