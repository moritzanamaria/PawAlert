import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

function izFirestorea(d) {
    const data = d.data();
    return {
        ...data,
        id: d.id,
        datum: data.datum?.toDate ? data.datum.toDate().toISOString() : data.datum
    };
}

function uFirestore(trag) {
    const { id, ...ostalo } = trag;
    return {
        ...ostalo,
        prijava: String(trag.prijava),
        datum: Timestamp.fromDate(new Date(trag.datum ?? Date.now()))
    };
}

async function get() {
    try {
        const skupTragova = collection(getFirebaseDB(), PrefixStorage.TRAGOVI);
        const snapshot = await getDocs(skupTragova);
        return { success: true, data: snapshot.docs.map(izFirestorea) };
    } catch (e) {
        console.error("Greška kod dohvaćanja: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: izFirestorea(docSnap) };
        }
        return { success: false, data: undefined, message: "Trag ne postoji u bazi." };
    } catch (e) {
        console.error("Greška kod dohvaćanja po id-u: ", e);
        return { success: false, message: e.message };
    }
}

async function getByPrijava(prijavaId) {
    try {
        const skupTragova = collection(getFirebaseDB(), PrefixStorage.TRAGOVI);
        const q = query(skupTragova, where('prijava', '==', String(prijavaId)));
        const snapshot = await getDocs(q);
        return { success: true, data: snapshot.docs.map(izFirestorea) };
    } catch (e) {
        console.error("Greška kod dohvaćanja po prijavi: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function dodaj(trag) {
    try {
        const skupTragova = collection(getFirebaseDB(), PrefixStorage.TRAGOVI);
        const docRef = await addDoc(skupTragova, uFirestore(trag));
        return { success: true, id: docRef.id, data: { ...trag, id: docRef.id } };
    } catch (e) {
        console.error("Greška kod dodavanja: ", e);
        return { success: false, message: e.message };
    }
}

async function promjeni(id, trag) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
        await updateDoc(docRef, uFirestore(trag));
        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
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
    getByPrijava,
    dodaj,
    promjeni,
    obrisi
}