import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where, limit } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import bcrypt from 'bcryptjs';

async function get() {
    try {
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const snapshot = await getDocs(skupOperatera);
        
        const data = snapshot.docs.map(doc => {
            const operater = doc.data();
            return {
                id: doc.id,
                email: operater.email,
                uloga: operater.uloga
            };
        });
        
        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera: ", e);
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                success: true,
                data: {
                    id: docSnap.id,
                    email: data.email,
                    uloga: data.uloga
                }
            };
        }
        return { success: false, message: "Operater nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(operater) {
    try {
        const hashiranaLozinka = bcrypt.hashSync(operater.lozinka, 10)
        const noviOperater = {
            email: operater.email,
            uloga: operater.uloga,
            lozinka: hashiranaLozinka
        };
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const docRef = await addDoc(skupOperatera, noviOperater);
        return {
            success: true,
            data: { id: docRef.id, email: operater.email }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodajBezHash(operater) {
    try {
        const noviOperater = {
            email: operater.email,
            uloga: operater.uloga,
            lozinka: operater.lozinka
        };
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const docRef = await addDoc(skupOperatera, noviOperater);
        return {
            success: true,
            data: { id: docRef.id, email: operater.email }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promijeni(id, operater) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, id);
        await updateDoc(docRef, {
            email: operater.email,
            uloga: operater.uloga
        });

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeniLozinku(id, novaLozinka) {
    try {
        const hashiranaLozinka = bcrypt.hashSync(novaLozinka, 10);
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, id);
        
        await updateDoc(docRef, {
            lozinka: hashiranaLozinka
        });

        return { success: true, message: "Lozinka uspješno promijenjena" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, id);
        await deleteDoc(docRef);
        return { success: true, message: "Operater obrisan" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function prijava(email, lozinka) {
    try {
        const skupOperatera = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        
        const q = query(skupOperatera, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        const operaterDoc = querySnapshot.docs[0];
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
        return { success: false, message: "Greška kod prijave: " + e.message };
    }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    promjeniLozinku,
    obrisi,
    prijava,
    dodajBezHash
}