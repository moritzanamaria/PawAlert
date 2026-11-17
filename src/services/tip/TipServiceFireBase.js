import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupTipova = collection(getFirebaseDB(), PrefixStorage.TIPOVI);
        const snapshot = await getDocs(skupTipova);
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
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { ...docSnap.data(), id: docSnap.id } };
        }
        return { success: false, data: undefined, message: "Tip ne postoji u bazi." };
    } catch (e) {
        console.error("Greška kod dohvaćanja po id-u: ", e);
        return { success: false, message: e.message };
    }
}

async function dodaj(tip) {
    try {
        const skupTipova = collection(getFirebaseDB(), PrefixStorage.TIPOVI);
        const snapshot = await getDocs(skupTipova);
        const maxId = Math.max(0, ...snapshot.docs.map(d => Number(d.id) || 0));
        const id = String(maxId + 1);

        const { id: _ignoriraj, ...ostalo } = tip;
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, id);
        await setDoc(docRef, ostalo);

        return { success: true, id, data: { ...ostalo, id } };
    } catch (e) {
        console.error("Greška kod dodavanja: ", e);
        return { success: false, message: e.message };
    }
}

async function promjeni(id, tip) {
    try {
        const { id: _ignoriraj, ...ostalo } = tip;
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
        await updateDoc(docRef, ostalo);
        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
        await deleteDoc(docRef);
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