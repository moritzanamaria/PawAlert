import { SLIKE_URL } from "../constants";

export function slikaUrl(slika) {
    if (!slika) return null;
    if (/^https?:\/\//i.test(slika)) return slika;
    return `${SLIKE_URL}/${slika}`;
}