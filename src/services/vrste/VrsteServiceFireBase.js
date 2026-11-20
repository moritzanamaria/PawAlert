import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupVrsta = collection(getFirebaseDB(), PrefixStorage.VRSTE);
        const vrsteSnapshot = await getDocs(skupVrsta);
        return {
            success: true,
            data: vrsteSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja vrsta: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(vrsta) {
    try {
        const { id: _, ...podaciZaSpremanje } = vrsta;
        const skupVrsta = collection(getFirebaseDB(), PrefixStorage.VRSTE);
        const docRef = await addDoc(skupVrsta, podaciZaSpremanje);
        
        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja vrste: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.VRSTE, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                success: true,
                data: {
                    id: docSnap.id,
                    ...data
                }
            };
        } else {
            return { 
                success: false, 
                message: "Vrsta s tim ID-jem ne postoji u bazi." 
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja po ID-ju: ", e);
        return { 
            success: false, 
            message: e.message 
        };
    }
}

async function promijeni(id, vrsta) {
    try {
        const { id: _, ...podaciZaAzuriranje } = vrsta;
        const docRef = doc(getFirebaseDB(), PrefixStorage.VRSTE, id);
        await updateDoc(docRef, podaciZaAzuriranje);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene vrste: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.VRSTE, id);
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja vrste: ", e);
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
}