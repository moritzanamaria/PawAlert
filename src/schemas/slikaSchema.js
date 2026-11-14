import { z } from "zod";

export const slikaFileSchema = (maxMB = 5) =>
    z
        .instanceof(File, { error: "Odaberite sliku." })
        .refine(
            (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
            "Dozvoljeni formati: JPG, PNG, WEBP."
        )
        .refine((f) => f.size <= maxMB * 1024 * 1024, `Slika je prevelika (max ${maxMB} MB).`);

export const slikaDataUrlSchema = z
    .string({ error: "Slika nije ispravna." })
    .regex(/^data:image\/(jpeg|png|webp);base64,/, "Dozvoljeni formati: JPG, PNG, WEBP.");