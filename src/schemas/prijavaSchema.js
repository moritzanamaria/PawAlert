import { z } from "zod";
import { lokacijaSchema } from "./lokacijaSchema.js";
import { datumSchema } from "./datumSchema.js";

const PORUKA_GODINE = "Godine moraju biti cijeli broj između 0 i 50!";

export const prijavaSchema = z.object({
    zivotinja_ime: z
        .string()
        .trim()
        .refine(
            (s) => s.length === 0 || (s.length >= 2 && s.length <= 50),
            "Ime životinje mora imati najmanje 2 i najviše 50 znakova!"
        ),
    zivotinja_vrsta: z
        .string({ error: "Morate odabrati vrstu životinje!" })
        .min(1, "Morate odabrati vrstu životinje!"),
    zivotinja_godine: z
        .string()
        .trim()
        .refine((s) => s === "" || (/^\d+$/.test(s) && Number(s) <= 50), PORUKA_GODINE),
    zivotinja_opis: z.string().trim().max(500, "Opis može imati najviše 500 znakova!"),
    tip_prijave: z
        .string({ error: "Morate odabrati tip prijave!" })
        .min(1, "Morate odabrati tip prijave!"),
    status: z.enum(["otvorena", "zatvorena"], { error: "Status mora biti otvorena ili zatvorena!" }),
    lokacija: lokacijaSchema,
    datum: datumSchema("Datum prijave ne može biti u budućnosti!"),
});