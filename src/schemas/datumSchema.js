import { z } from "zod";

export const datumSchema = (porukaBuducnost) =>
    z
        .date({ error: "Morate odabrati datum i vrijeme!" })
        .refine((d) => d <= new Date(), porukaBuducnost);