import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const operaterSchema = z.object({
  email: z.email({
    error: (issue) =>
      !issue.input || (typeof issue.input === 'string' && issue.input.trim() === '')
        ? "Email je obavezan!"
        : "Unesite ispravan email format!"
  }).trim(),

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  uloga: z.enum(['admin', 'korisnik'], {
    error: "Uloga mora biti 'admin' ili 'korisnik'!"
  })
});

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      !issue.input || (typeof issue.input === 'string' && issue.input.trim() === '')
        ? "Email je obavezan!"
        : "Unesite ispravan email format!"
  }).trim(),

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!")
});

export const promjenaLozinkeSchema = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  potvrdaLozinke: z.string()
    .min(1, "Potvrda lozinke je obavezna!")
}).refine((data) => data.novaLozinka === data.potvrdaLozinke, {
  error: "Lozinke se ne podudaraju!",
  path: ["potvrdaLozinke"]
});