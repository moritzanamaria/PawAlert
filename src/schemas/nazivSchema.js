import { z } from "zod";

const nazivSchema = (sto) =>
    z.object({
        naziv: z
            .string()
            .trim()
            .min(1, "Naziv je obavezan i ne smije sadržavati samo razmake!")
            .min(3, `Naziv ${sto} mora imati najmanje 3 i najviše 20 znakova!`)
            .max(20, `Naziv ${sto} mora imati najmanje 3 i najviše 20 znakova!`)
            .regex(
                /^[A-Za-zČčĆćĐđŠšŽž\s-]+$/,
                "Naziv smije sadržavati samo slova, razmake i crticu (bez brojeva)!"
            ),
    });

export const vrstaSchema = nazivSchema("vrste");
export const tipSchema = nazivSchema("tipa");