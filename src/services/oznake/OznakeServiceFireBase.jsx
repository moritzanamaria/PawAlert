import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupOznaka = collection(getFirebaseDB(), PrefixStorage.OZNAKE);
        const oznakeSnapshot = await getDocs(skupOznaka);
        return {
            success: true,
            data: oznakeSnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja oznaka: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(oznaka) {
    try {
        const { id: _, ...podaciOznake } = oznaka;
        const skupOznaka = collection(getFirebaseDB(), PrefixStorage.OZNAKE);
        const docRef = await addDoc(skupOznaka, podaciOznake);

        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja oznake: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OZNAKE, String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                success: true,
                data: {
                    ...data,
                    id: docSnap.id
                }
            };
        } else {
            return {
                success: false,
                message: "Oznaka s tim ID-jem ne postoji u bazi."
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja oznake po ID-ju: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeni(id, oznaka) {
    try {
        const { id: _, ...podaciOznake } = oznaka;
        const docRef = doc(getFirebaseDB(), PrefixStorage.OZNAKE, String(id));
        await updateDoc(docRef, podaciOznake);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene oznake: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OZNAKE, String(id));
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja oznake: ", e);
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