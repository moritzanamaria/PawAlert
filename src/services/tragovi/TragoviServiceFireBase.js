import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupTragova = collection(getFirebaseDB(), PrefixStorage.TRAGOVI);
        const tragoviSnapshot = await getDocs(skupTragova);
        return {
            success: true,
            data: tragoviSnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja tragova: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getByPrijava(prijavaId) {
    try {
        const upit = query(
            collection(getFirebaseDB(), PrefixStorage.TRAGOVI),
            where("prijava", "==", String(prijavaId))
        );
        const tragoviSnapshot = await getDocs(upit);
        return {
            success: true,
            data: tragoviSnapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }))
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja tragova prijave: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(trag) {
    try {
        const { id: _, ...podaciTraga } = trag;
        const skupTragova = collection(getFirebaseDB(), PrefixStorage.TRAGOVI);
        const docRef = await addDoc(skupTragova, podaciTraga);

        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja traga: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
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
                message: "Trag s tim ID-jem ne postoji u bazi."
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja traga po ID-ju: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeni(id, trag) {
    try {
        const { id: _, ...podaciTraga } = trag;
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
        await updateDoc(docRef, podaciTraga);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene traga: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TRAGOVI, String(id));
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja traga: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

export default {
    get,
    getByPrijava,
    dodaj,
    promijeni,
    getById,
    obrisi
};