export const prijavePodaci = [
  {
    id: "1",
    zivotinja_ime: "Reks",
    zivotinja_vrsta_id: "1",
    zivotinja_pasmina: "Njemački ovčar",
    zivotinja_opis: "Crno-smeđi, ima crvenu ogrlicu",
    zivotinja_godine: 3,
    cipirana: true,
    tip_prijave: "nestanak",
    status: "aktivna",
    lokacija_opis: "Tvrđa, Osijek",
    lokacija_lat: 45.5550,
    lokacija_lng: 18.6955,
    datum: "2026-09-20T17:34:00",
    slika: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500"
  },
  {
    id: "2",
    zivotinja_ime: "Nepoznato",
    zivotinja_vrsta_id: "2",
    zivotinja_pasmina: "Domaća",
    zivotinja_opis: "Viđena u blizini parka",
    zivotinja_godine: null,
    cipirana: false,
    tip_prijave_id: "1",
    status: "aktivna",
    lokacija_opis: "Gornji grad, Osijek",
    lokacija_lat: 45.5610,
    lokacija_lng: 18.6800,
    datum: "2026-09-21T12:00:00",
    slika: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500"
  },
  {
    id: "3",
    zivotinja_ime: "Luna",
    zivotinja_vrsta_id: "2",
    zivotinja_pasmina: "Mješanac",
    zivotinja_opis: "Sretno vraćena vlasniku",
    zivotinja_godine: 5,
    cipirana: true,
    tip_prijave_id: "1",
    status: "pronađena",
    hitno: false,
    lokacija_opis: "Jug 2, Osijek",
    lokacija_lat: 45.5480,
    lokacija_lng: 18.7100,
    datum: "2026-09-18T21:25:00",
    slika: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500"
  },
  {
    id: "4",
    zivotinja_ime: "Nepoznato",
    zivotinja_vrsta_id: "2",
    zivotinja_pasmina: "Nepoznata, srednje veličine",
    zivotinja_opis: "Lutalica, mršav, bez ogrlice, plašljiv",
    zivotinja_godine: null,
    cipirana: false,
    tip_prijave_id: "1",
    status: "aktivna",
    hitno: true,
    lokacija_opis: "Industrijska zona, Osijek",
    lokacija_lat: 45.5390,
    lokacija_lng: 18.6450,
    datum: "2026-09-15T19:50:00",
    slika: "https://images.unsplash.com/photo-1517849845537-4d257902861a?w=500"
  },
  {
    id: "5",
    zivotinja_ime: "Fifi",
    vrstaZivotinje_id: "2",
    zivotinja_pasmina: "Perzijska",
    zivotinja_opis: "Bijela, duga dlaka, plave oči, nosi ružičastu ogrlicu",
    zivotinja_godine: 4,
    cipirana: true,
    tip_prijave_id: "1",
    status: "zatvorena",
    hitno: false,
    lokacija_opis: "Sjenjak, Osijek",
    lokacija_lat: 45.5620,
    lokacija_lng: 18.7050,
    datum: "2026-09-23T10:05:00",
    slika: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500"
  },
];

const tipPrijave  = [
  {
    id: "1",
    naziv: "Viđenje",
   },
  {
    id: "2",
    zivotinja_ime: "Nestanak",
  },
];


export default function dohvatiVrstu(vrsta){
  
const vrstaZivotinje = [
{
  id: "1",
  naziv: "Pas"
},
{
  id:"2",
  naziv: "Mačka"
},

];
return vrstaZivotinje.find((v)=> v.id=== id)
}
