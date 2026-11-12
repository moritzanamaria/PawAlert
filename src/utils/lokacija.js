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
