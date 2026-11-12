export function prvaGreska(rezultat) {
    return rezultat.error.issues[0].message;
}