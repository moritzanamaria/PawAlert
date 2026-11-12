import { z } from "zod";

export const brojSchema = (max) => {
    const poruka = `Unesite cijeli broj između 1 i ${max}.`;
 return z.object({
        broj: z.number({ error: poruka }).int(poruka).min(1, poruka).max(max, poruka),
    });
};