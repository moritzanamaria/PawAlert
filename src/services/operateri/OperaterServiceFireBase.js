import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where, limit } from "firebase/firestore";
import bcrypt from "bcryptjs";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const operateriSnapshot = await getDocs(skupOperatera);
        return {
            success: true,
            data: operateriSnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id
                };
            })
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function dodaj(operater) {
    try {
        const { id: _, ...podaciOperatera } = operater;
        if (!podaciOperatera.lozinka.startsWith("$2")) {
            podaciOperatera.lozinka = bcrypt.hashSync(podaciOperatera.lozinka, 10);
        }
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const docRef = await addDoc(skupOperatera, podaciOperatera);
        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja operatera: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, String(id));
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
                message: "Operater s tim ID-jem ne postoji u bazi."
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera po ID-ju: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeni(id, operater) {
    try {
        const { id: _, ...podaciOperatera } = operater;
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, String(id));
        await updateDoc(docRef, podaciOperatera);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene operatera: ", e);
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, String(id));
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja operatera: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

async function promijeniLozinku(id, novaLozinka) {
    try {
        const hashiranaLozinka = bcrypt.hashSync(novaLozinka, 10);
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, String(id));
        await updateDoc(docRef, {
            lozinka: hashiranaLozinka
        });

        return { success: true, message: "Lozinka uspješno promijenjena" };
    } catch (e) {
        console.error("Greška kod promjene lozinke: ", e);
        return { success: false, message: e.message };
    }
}

async function prijava(email, lozinka) {
    try {
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const q = query(skupOperatera, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        const operaterDoc = querySnapshot.docs[0];
        if (!operaterDoc) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }
        const operaterPodaci = operaterDoc.data();
        const isMatch = bcrypt.compareSync(lozinka, operaterPodaci.lozinka);
        if (!isMatch) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }

        return {
            success: true,
            data: {
                id: operaterDoc.id,
                email: operaterPodaci.email,
                uloga: operaterPodaci.uloga
            }
        };
    } catch (e) {
        console.error("Greška kod prijave: ", e);
        return { success: false, message: e.message };
    }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    promijeniLozinku,
    getById,
    obrisi,
    prijava
};