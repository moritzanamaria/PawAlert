import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

const kolekcija = () => collection(getFirebaseDB(), PrefixStorage.PRIJAVE);
const ref = (id) => doc(getFirebaseDB(), PrefixStorage.PRIJAVE, String(id));

async function get() {
    try {
        const snapshot = await getDocs(kolekcija());
        return {
            success: true,
            data: snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja prijava: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getById(id) {
    try {
        const docSnap = await getDoc(ref(id));
        if (docSnap.exists()) {
            return { success: true, data: { ...docSnap.data(), id: docSnap.id } };
        }
        return { success: false, data: undefined, message: "Prijava ne postoji u bazi." };
    } catch (e) {
        console.error("Greška kod dohvaćanja prijave po id-u: ", e);
        return { success: false, message: e.message };
    }
}

async function dodaj(prijava) {
    try {
        const snapshot = await getDocs(kolekcija());
        const maxId = Math.max(0, ...snapshot.docs.map(d => Number(d.id) || 0));
        const id = String(maxId + 1);

        const { id: _ignoriraj, ...ostalo } = prijava;
        await setDoc(ref(id), ostalo);

        return { success: true, id, data: { ...ostalo, id } };
    } catch (e) {
        console.error("Greška kod dodavanja prijave: ", e);
        return { success: false, message: e.message };
    }
}

async function promjeni(id, prijava) {
    try {
        const { id: _ignoriraj, ...ostalo } = prijava;
        await updateDoc(ref(id), ostalo);
        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene prijave: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        await deleteDoc(ref(id));
        return { success: true, message: "Uspješno obrisano" };
    } catch (e) {
        console.error("Greška kod brisanja prijave: ", e);
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