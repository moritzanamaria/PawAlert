import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

const kolekcija = () => collection(getFirebaseDB(), PrefixStorage.OZNAKE);
const ref = (id) => doc(getFirebaseDB(), PrefixStorage.OZNAKE, String(id));

async function get() {
    try {
        const snapshot = await getDocs(kolekcija());
        return {
            success: true,
            data: snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja oznaka: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getById(id) {
    try {
        const docSnap = await getDoc(ref(id));
        if (docSnap.exists()) {
            return { success: true, data: { ...docSnap.data(), id: docSnap.id } };
        }
        return { success: false, data: undefined, message: "Oznaka ne postoji u bazi." };
    } catch (e) {
        console.error("Greška kod dohvaćanja oznake po id-u: ", e);
        return { success: false, message: e.message };
    }
}

async function dodaj(oznaka) {
    try {
        // sekvencijalni id (max + 1)
        const snapshot = await getDocs(kolekcija());
        const maxId = Math.max(0, ...snapshot.docs.map(d => Number(d.id) || 0));
        const id = String(maxId + 1);

        const { id: _ignoriraj, ...ostalo } = oznaka;
        await setDoc(ref(id), ostalo);

        return { success: true, id, data: { ...ostalo, id } };
    } catch (e) {
        console.error("Greška kod dodavanja oznake: ", e);
        return { success: false, message: e.message };
    }
}

async function promjeni(id, oznaka) {
    try {
        const { id: _ignoriraj, ...ostalo } = oznaka;
        await updateDoc(ref(id), ostalo);
        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene oznake: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        await deleteDoc(ref(id));
        return { success: true, message: "Uspješno obrisano" };
    } catch (e) {
        console.error("Greška kod brisanja oznake: ", e);
        return { success: false, message: e.message };
    }
}

export default {
    get,
    getById,
    dodaj,
    promjeni,
    obrisi
};