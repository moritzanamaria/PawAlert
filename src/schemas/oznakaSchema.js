import { z } from "zod";

const HEX = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;

export const oznakaSchema = z.object({
    naziv: z
        .string()
        .trim()
        .min(1, "Naziv oznake je obavezan i ne smije sadržavati samo razmake!")
        .min(2, "Naziv oznake mora imati između 2 i 30 znakova!")
        .max(30, "Naziv oznake mora imati između 2 i 30 znakova!"),
    boja: z.string().regex(HEX, "Boja oznake nije u ispravnom HEX formatu!"),
    boja_teksta: z.string().regex(HEX, "Boja teksta nije u ispravnom HEX formatu!"),
});