import { z } from "zod";
import { lokacijaSchema } from "./lokacijaSchema.js";
import { datumSchema } from "./datumSchema.js";

export const tragSchema = z.object({
    opis: z
        .string()
        .trim()
        .min(1, "Opis traga je obavezan i ne smije sadržavati samo razmake!")
        .min(3, "Opis traga mora imati najmanje 3 i najviše 500 znakova!")
        .max(500, "Opis traga mora imati najmanje 3 i najviše 500 znakova!"),
    lokacija: lokacijaSchema,
    datum: datumSchema("Datum traga ne može biti u budućnosti!"),
});