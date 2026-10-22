export function validirajLokaciju(l) {
    if (!l || typeof l.lat !== "number" || typeof l.lng !== "number") {
        return "Označite lokaciju na karti!"
    }
    const opis = (l.opis || "").trim()
    if (opis.length < 3 || opis.length > 100) {
        return "Opis lokacije mora imati između 3 i 100 znakova!"
    }
    return null
}

export function normalizirajLokaciju(zapis) {
    if (!zapis || zapis.lokacija) return zapis
    const { lokacija_lat, lokacija_lng, lokacija_opis, ...ostalo } = zapis
    return {
        ...ostalo,
        lokacija: lokacija_lat != null
            ? { lat: lokacija_lat, lng: lokacija_lng, opis: lokacija_opis ?? "" }
            : null
    }
}

export const googleMapsLink = (l) =>
    `https://www.google.com/maps?q=${l.lat},${l.lng}`

export function udaljenostKm(a, b) {
    const R = 6371
    const rad = (x) => (x * Math.PI) / 180
    const dLat = rad(b.lat - a.lat)
    const dLng = rad(b.lng - a.lng)
    const h = Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(h))
}