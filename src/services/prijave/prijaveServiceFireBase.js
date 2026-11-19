import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

function pretvoriDatumUString(datum) {
    if (!datum) {
        return new Date().toISOString();
    }
    if (typeof datum.toDate === "function") {
        return datum.toDate().toISOString();
    }
    return new Date(datum).toISOString();
}

function pretvoriDatumUTimestamp(datum) {
    const dateObj = datum ? new Date(datum) : new Date();
    return Timestamp.fromDate(dateObj);
}

async function get() {
    try {
        const skupPrijava = collection(getFirebaseDB(), PrefixStorage.PRIJAVE);
        const prijaveSnapshot = await getDocs(skupPrijava);
        return {
            success: true,
            data: prijaveSnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                    datum: pretvoriDatumUString(data.datum)
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja prijava: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(prijava) {
    try {
        const { id, ...podaciPrijave } = prijava;
        podaciPrijave.datum = pretvoriDatumUTimestamp(podaciPrijave.datum);

        const skupPrijava = collection(getFirebaseDB(), PrefixStorage.PRIJAVE);
        const docRef = await addDoc(skupPrijava, podaciPrijave);

        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja prijave: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.PRIJAVE, String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                success: true,
                data: {
                    ...data,
                    id: docSnap.id,
                    datum: pretvoriDatumUString(data.datum)
                }
            };
        } else {
            return {
                success: false,
                message: "Prijava s tim ID-jem ne postoji u bazi."
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja prijave po ID-ju: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeni(id, prijava) {
    try {
        const { id: _, ...podaciPrijave } = prijava;
        if (podaciPrijave.datum !== undefined) {
            podaciPrijave.datum = pretvoriDatumUTimestamp(podaciPrijave.datum);
        }

        const docRef = doc(getFirebaseDB(), PrefixStorage.PRIJAVE, String(id));
        await updateDoc(docRef, podaciPrijave);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene prijave: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.PRIJAVE, String(id));
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja prijave: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

export default {
    get,
    dodaj,
    promijeni,
    getById,
    obrisi
};