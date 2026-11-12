import { z } from "zod";

const PORUKA_KARTA = "Označite lokaciju na karti!";
const PORUKA_OPIS = "Opis lokacije mora imati između 3 i 100 znakova!";


export const lokacijaSchema = z.object(
    {
         lat: z.number({ error: PORUKA_KARTA }),
        lng: z.number({ error: PORUKA_KARTA }),
        opis: z
            .string({ error: PORUKA_OPIS })
            .trim()
            .min(3, PORUKA_OPIS)
            .max(100, PORUKA_OPIS),
    },
    { error: PORUKA_KARTA }
);