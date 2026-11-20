import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupTipova = collection(getFirebaseDB(), PrefixStorage.TIPOVI);
        const tipoviSnapshot = await getDocs(skupTipova);
        return {
            success: true,
            data: tipoviSnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja tipova: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(tip) {
    try {
        const { id: _, ...podaciTipa } = tip;
        const skupTipova = collection(getFirebaseDB(), PrefixStorage.TIPOVI);
        const docRef = await addDoc(skupTipova, podaciTipa);

        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja tipa: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
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
                message: "Tip s tim ID-jem ne postoji u bazi."
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja tipa po ID-ju: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeni(id, tip) {
    try {
        const { id: _, ...podaciTipa } = tip;
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
        await updateDoc(docRef, podaciTipa);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene tipa: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TIPOVI, String(id));
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja tipa: ", e);
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