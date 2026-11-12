import { z } from "zod";

export const slikaFileSchema = (maxMB = 2) =>
       z
        .instanceof(File, { error: "Odaberite sliku." })
        .refine(
            (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
            "Dozvoljeni formati: JPG, PNG, WEBP."
        )
        .refine((f) => f.size <= maxMB * 1024 * 1024, `Slika je prevelika (max ${maxMB} MB).`);
