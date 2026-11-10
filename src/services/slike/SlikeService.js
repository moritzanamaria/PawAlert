import { SLIKE_URL } from "../../constants";

export async function spremiSliku(id, slika) {
    const odgovor = await fetch(`${SLIKE_URL}/spremiSliku.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, slika }),
    });
    return odgovor.json(); // { success, message, path }
}