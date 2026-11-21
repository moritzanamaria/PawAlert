import { useState } from 'react';
import { Button, Card, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr, en } from '@faker-js/faker';
import prijaveService from '../services/prijave/prijaveService';
import TragoviService from '../services/tragovi/TragoviService';
import TipService from '../services/tip/TipService';
import VrsteService from '../services/vrste/VrsteService';
import OznakeService from '../services/oznake/OznakeService';
import { DATA_SOURCE, PrefixStorage } from '../constants';
import { izveziSveUXml } from '../utils/xmlExporter';
import { BsFileEarmarkCode } from 'react-icons/bs';
import { brojSchema } from '../schemas/brojSchema';
import OperaterService from '../services/operateri/OperaterService';
import useAuth from '../hooks/useAuth';
import OperaterServiceFireBase from '../services/operateri/OperaterServiceFireBase';
import VrsteServiceFireBase from '../services/vrste/VrsteServiceFireBase';
import TipServiceFireBase from '../services/tip/TipServiceFireBase';
import OznakeServiceFireBase from '../services/oznake/OznakeServiceFireBase';
import prijaveServiceFireBase from '../services/prijave/prijaveServiceFireBase';
import TragoviServiceFireBase from '../services/tragovi/TragoviServiceFireBase';
import VrsteServiceMemorija from '../services/vrste/VrsteServiceMemorija';
import TipServiceMemorija from '../services/tip/TipServiceMemorija';
import OznakeServiceMemorija from '../services/oznake/OznakeServiceMemorija';
import prijaveServiceMemorija from '../services/prijave/prijaveServiceMemorija';
import TragoviServiceMemorija from '../services/tragovi/TragoviServiceMemorija';
import { operateri as operateriMemorija } from '../services/operateri/OperaterPodaci';
import useLoading from "../hooks/useLoading";
import useModal from "../hooks/useModal";

export default function GeneriranjePodataka() {
    const [brojVrsta, setBrojVrsta] = useState(5);
    const [brojTipova, setBrojTipova] = useState(5);
    const [brojOznaka, setBrojOznaka] = useState(5);
    const [brojPrijava, setBrojPrijava] = useState(10);
    const [brojTragova, setBrojTragova] = useState(20);
    const [brojOperatera, setBrojOperatera] = useState(5);
    const [poruka, setPoruka] = useState(null);
    const { loading, showLoading, hideLoading } = useLoading();
    const { showModal } = useModal();
    const [errors, setErrors] = useState({});
    const { authUser } = useAuth();
    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };

    const provjeriBroj = (polje, broj, max) => {
        const rezultat = brojSchema(max).safeParse({ broj });
        if (!rezultat.success) {
            setErrors({ [polje]: rezultat.error.issues[0].message });
            return false;
        }
        setErrors({});
        return true;
    };

    const faker = new Faker({
        locale: [hr, en]
    });

    const dohvatiIzMemorije = async () => {
        const [vrste, tipovi, oznake, prijave, tragovi] = (await Promise.all([
            VrsteServiceMemorija.get(),
            TipServiceMemorija.get(),
            OznakeServiceMemorija.get(),
            prijaveServiceMemorija.get(),
            TragoviServiceMemorija.get(),
        ])).map((res) => res.data);
        return { vrste, tipovi, oznake, prijave, tragovi, operateri: operateriMemorija };
    };

    const dodajIliBaci = async (servis, zapis) => {
        const rez = await servis.dodaj(zapis);
        if (rez?.success === false) throw new Error(rez.message);
        return rez?.id ?? rez?.data?.id;
    };

    const handleMemorijaULocalStorage = async () => {
        showModal('Presipati podatke iz memorije u localStorage? Postojeći podaci u localStorageu bit će zamijenjeni.', async () => {
            showLoading();
            setPoruka(null);
            try {
                const podaci = await dohvatiIzMemorije();

                localStorage.setItem(PrefixStorage.VRSTE, JSON.stringify(podaci.vrste));
                localStorage.setItem(PrefixStorage.TIPOVI, JSON.stringify(podaci.tipovi));
                localStorage.setItem(PrefixStorage.OZNAKE, JSON.stringify(podaci.oznake));
                localStorage.setItem(PrefixStorage.PRIJAVE, JSON.stringify(podaci.prijave));
                localStorage.setItem(PrefixStorage.TRAGOVI, JSON.stringify(podaci.tragovi));
                localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(podaci.operateri));

                setPoruka({
                    tip: 'success',
                    tekst: `Uspješno presipano u localStorage!`
                });
            } catch (error) {
                setPoruka({
                    tip: 'danger',
                    tekst: 'Greška pri presipavanju podataka: ' + error.message
                });
            } finally {
                hideLoading();
            }
        });
    };

    const handleMemorijaUFireBase = async () => {
        showModal('Jeste li sigurni da želite pretočiti iz memorije u firebase?', async () => {
            showLoading();
            setPoruka(null);
            const ocistiUndefined = (obj) =>
                Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

            const prebaci = async (servis, stavke, naziv = '') => {
                const mapa = new Map();
                for (const { id, ...ostatak } of stavke) {
                    try {
                        const noviId = await dodajIliBaci(servis, ocistiUndefined(ostatak));
                        mapa.set(String(id), noviId);
                    } catch (err) {
                        console.error(`Greška u [${naziv}] za id=${id}:`, err, ostatak);
                        throw err;
                    }
                }
                return mapa;
            };
            try {
                const { vrste, tipovi, oznake, prijave, tragovi, operateri } = await dohvatiIzMemorije();

                // 1. Operateri (lozinke su već hashirane); one s istim emailom preskačemo
                const postojeciEmailovi = (await OperaterServiceFireBase.get()).data.map((o) => o.email);
                for (const { id: _id, ...ostatak } of operateri) {
                    if (postojeciEmailovi.includes(ostatak.email)) continue;
                    const rez = await OperaterServiceFireBase.dodaj(ostatak);
                    if (!rez?.success) throw new Error(rez?.message || 'Greška pri dodavanju operatera');
                }

                // 2. Vrste, tipovi i oznake (trebamo nove ID-ove za prijave)
                const mapaVrsta = await prebaci(VrsteServiceFireBase, vrste, 'Vrste');
                const mapaTipova = await prebaci(TipServiceFireBase, tipovi, 'Tipovi');
                const mapaOznaka = await prebaci(OznakeServiceFireBase, oznake, 'Oznake');
                // 3. Prijave (povezivanje starih ID-ova s novim FireBase ID-ovima)
                const mapaPrijava = new Map();
                for (const { id, ...ostatak } of prijave) {
                    ostatak.zivotinja_vrsta = mapaVrsta.get(String(ostatak.zivotinja_vrsta)) ?? null;
                    ostatak.tip_prijave = mapaTipova.get(String(ostatak.tip_prijave)) ?? null;
                    ostatak.oznake = (ostatak.oznake ?? [])
                        .map((o) => mapaOznaka.get(String(o)))
                        .filter((o) => o != null); // makni one koje nije našao
                    mapaPrijava.set(String(id), await dodajIliBaci(prijaveServiceFireBase, ostatak));
                }

                // 4. Tragovi
                for (const { id: _id, ...ostatak } of tragovi) {
                    ostatak.prijava = mapaPrijava.get(String(ostatak.prijava)) ?? null;
                    await dodajIliBaci(TragoviServiceFireBase, ostatak);
                }

                setPoruka({ tip: 'success', tekst: 'Uspješno presipano u FireBase!' });
            } catch (error) {
                console.error('Greška pri presipanju:', error);
                setPoruka({
                    tip: 'danger',
                    tekst: 'Došlo je do greške prilikom sinkronizacije: ' + error.message
                });
            } finally {
                hideLoading();
            }
        });
    };
    const generirajVrste = async (broj) => {
        const naziviVrsta = ['Pas', 'Mačka', 'Ptica', 'Kunić', 'Hrčak', 'Kornjača', 'Tvor', 'Papiga'];

        for (let i = 0; i < broj; i++) {
            await VrsteService.dodaj({
                naziv: naziviVrsta[i % naziviVrsta.length] + (i >= naziviVrsta.length ? ` ${Math.floor(i / naziviVrsta.length) + 1}` : '')
            });
        }
    };

    const generirajTipove = async (broj) => {
        const naziviTipova = [
            'Izgubljeni kućni ljubimac',
            'Pronađena životinja',
            'Napuštena životinja',
            'Ozlijeđena životinja',
            'Zlostavljana životinja',
            'Hitna intervencija',
            'Udomljavanje',
            'Ostalo'
        ];

        for (let i = 0; i < broj; i++) {
            await TipService.dodaj({
                naziv: naziviTipova[i % naziviTipova.length] + (i >= naziviTipova.length ? ` ${Math.floor(i / naziviTipova.length) + 1}` : ''),
                opis: faker.lorem.sentence()
            });
        }
    };

    const unspashSlikeZivotinja = [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60", // Slatki pas
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60", // Mačka
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60", // Štene
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=60", // Mačić
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&auto=format&fit=crop&q=60", // Pas u prirodi
        "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&auto=format&fit=crop&q=60", // Mačka znatželjna
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60", // Dva psa
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=60", // Mačka leži
    ];

    const generirajOznake = async (broj) => {
        const naziviOznaka = ['Ima ogrlicu', 'Ozlijeđen', 'Star', 'Mladunče', 'Preplašen', 'Traži se vlasnik', 'Agresivan', 'Miran'];
        const bojeOznaka = ['#fd7e14', '#dc3545', '#198754', '#0d6efd', '#6c757d', '#ffc107', '#6610f2', '#d63384'];
        const bojeTekstaOznaka = ['#0F52BA', '#FFD1DC', '#36454F', '#ffffff', '#cccccc', '#000000'];
        for (let i = 0; i < broj; i++) {
            await OznakeService.dodaj({
                naziv: naziviOznaka[i % naziviOznaka.length] + (i >= naziviOznaka.length ? ` ${Math.floor(i / naziviOznaka.length) + 1}` : ''),
                boja: bojeOznaka[i % bojeOznaka.length],
                boja_teksta: faker.helpers.arrayElement(bojeTekstaOznaka)
            });
        }
    };

    const generirajPrijave = async (broj) => {
        const vrsteOdgovor = await VrsteService.get();
        const vrste = vrsteOdgovor.data || vrsteOdgovor;

        const tipoviOdgovor = await TipService.get();
        const tipovi = tipoviOdgovor.data || tipoviOdgovor;

        const oznakeOdgovor = await OznakeService.get();
        const oznake = oznakeOdgovor.data || oznakeOdgovor;

        if (vrste.length === 0 || tipovi.length === 0 || oznake.length === 0) {
            throw new Error('Nema dostupnih vrsta, tipova ili oznaka. Prvo generirajte vrste, tipove i oznake!');
        }

        const imenaZivotinja = ['Reks', 'Bubi', 'Maza', 'Luna', 'Garfield', 'Astor', 'Nero', 'Bella', 'Max', 'Rex', 'Medo', 'Kićo'];
        const osjeckeUlice = ['Ulica Republike', 'Europska avenija', 'Gundulićeva ulica', 'Vukovarska ulica', 'Kardinala A. Stepinca', 'Strossmayerova ulica', 'Svačićeva ulica', 'Ulica J. J. Strossmayera'];

        for (let i = 0; i < broj; i++) {
            const randomVrsta = vrste[faker.number.int({ min: 0, max: vrste.length - 1 })];
            const randomTip = tipovi[faker.number.int({ min: 0, max: tipovi.length - 1 })];
            const ulica = osjeckeUlice[faker.number.int({ min: 0, max: osjeckeUlice.length - 1 })];
            const odabraneOznake = [];
            if (oznake.length > 0) {
                const brojOznakaZaPrijavu = faker.number.int({ min: 0, max: Math.min(3, oznake.length) });
                const shuffled = [...oznake].sort(() => 0.5 - Math.random());
                for (let j = 0; j < brojOznakaZaPrijavu; j++) {
                    odabraneOznake.push(shuffled[j].id);
                }
            }
            await prijaveService.dodaj({
                zivotinja_ime: imenaZivotinja[faker.number.int({ min: 0, max: imenaZivotinja.length - 1 })],
                zivotinja_vrsta: randomVrsta.id,
                zivotinja_opis: faker.lorem.sentence(),
                zivotinja_godine: faker.number.int({ min: 1, max: 12 }),
                cipirana: faker.datatype.boolean(),
                tip_prijave: randomTip.id,
                status: faker.helpers.arrayElement(['otvorena', 'zatvorena']),
                lokacija: {
                    lat: faker.number.float({ min: 45.5400, max: 45.5750, fractionDigits: 4 }),
                    lng: faker.number.float({ min: 18.6400, max: 18.7200, fractionDigits: 4 }),
                    opis: `Osijek, ${ulica} ${faker.number.int({ min: 1, max: 120 })}`
                },
                datum: faker.date.recent({ days: 30 }).toISOString(),
                slika: unspashSlikeZivotinja[i % unspashSlikeZivotinja.length],
                oznake: odabraneOznake,
                hitno: faker.datatype.boolean(),
            });
        }
    };

    const generirajTragove = async (broj) => {
        const prijaveOdgovor = await prijaveService.get();
        const prijave = prijaveOdgovor.data || prijaveOdgovor;

        if (prijave.length === 0) {
            throw new Error('Nema dostupnih prijava. Prvo generirajte prijave.');
        }

        const osjeckeUlice = ['Ulica Republike', 'Europska avenija', 'Gundulićeva ulica', 'Vukovarska ulica', 'Kardinala A. Stepinca', 'Strossmayerova ulica', 'Svačićeva ulica', 'Ulica J. J. Strossmayera'];

        for (let i = 0; i < broj; i++) {
            const randomPrijava = prijave[faker.number.int({ min: 0, max: prijave.length - 1 })];
            const ulica = osjeckeUlice[faker.number.int({ min: 0, max: osjeckeUlice.length - 1 })];

            await TragoviService.dodaj({
                prijava: randomPrijava.id,
                opis: faker.lorem.paragraph(),
                lokacija: {
                    lat: faker.number.float({ min: 45.5400, max: 45.5750, fractionDigits: 4 }),
                    lng: faker.number.float({ min: 18.6400, max: 18.7200, fractionDigits: 4 }),
                    opis: `Osijek, ${ulica} ${faker.number.int({ min: 1, max: 120 })}`
                },
                datum: faker.date.recent({ days: 10 }).toISOString(),
                slika: unspashSlikeZivotinja[i % unspashSlikeZivotinja.length],
            });
        }
    };

    const handleGenerirajVrste = async (e) => {
        e.preventDefault();

        if (!provjeriBroj('brojVrsta', brojVrsta, 20)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajVrste(brojVrsta);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojVrsta} vrsta!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju vrsta: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleGenerirajTipove = async (e) => {
        e.preventDefault();

        if (!provjeriBroj('brojTipova', brojTipova, 20)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajTipove(brojTipova);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojTipova} tipova!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju tipova: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleGenerirajOznake = async (e) => {
        e.preventDefault();

        if (!provjeriBroj('brojOznaka', brojOznaka, 20)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajOznake(brojOznaka);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojOznaka} oznaka!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju oznaka: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleGenerirajPrijave = async (e) => {
        e.preventDefault();

        if (!provjeriBroj('brojPrijava', brojPrijava, 50)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajPrijave(brojPrijava);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojPrijava} prijava!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju prijava: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleGenerirajTragove = async (e) => {
        e.preventDefault();
        if (!provjeriBroj('brojTragova', brojTragova, 100)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajTragove(brojTragova);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojTragova} tragova!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju tragova: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleObrisiVrste = async () => {
        showModal('Jeste li sigurni da želite obrisati sve vrste?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const prijaveOdgovor = await prijaveService.get();
                const prijave = prijaveOdgovor.data || prijaveOdgovor;

                if (prijave && prijave.length > 0) {
                    throw new Error('Vrste se koriste u prijavama, prvo obrišite prijave!');
                }
                const rezultat = await VrsteService.get();
                const vrste = rezultat.data || rezultat;
                for (const vrsta of vrste) {
                    await VrsteService.obrisi(vrsta.id);
                }
                setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${vrste.length} vrsta!` });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju vrsta: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };

    const handleObrisiTipove = async () => {
        showModal('Jeste li sigurni da želite obrisati sve tipove?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const prijaveOdgovor = await prijaveService.get();
                const prijave = prijaveOdgovor.data || prijaveOdgovor;

                if (prijave && prijave.length > 0) {
                    throw new Error('Tipovi se koriste u prijavama, prvo obrišite prijave!');
                }
                const rezultat = await TipService.get();
                const tipovi = rezultat.data || rezultat;
                for (const tip of tipovi) {
                    await TipService.obrisi(tip.id);
                }
                setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${tipovi.length} tipova!` });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju tipova: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };

    const handleObrisiOznake = async () => {
        showModal('Jeste li sigurni da želite obrisati sve oznake?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const prijaveOdgovor = await prijaveService.get();
                const prijave = prijaveOdgovor.data || prijaveOdgovor;

                if (prijave && prijave.length > 0) {
                    throw new Error('Oznake se koriste u prijavama, prvo obrišite prijave!');
                }
                const rezultat = await OznakeService.get();
                const oznake = rezultat.data || rezultat;
                for (const oznaka of oznake) {
                    await OznakeService.obrisi(oznaka.id);
                }
                setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${oznake.length} oznaka!` });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju oznaka: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };

    const handleObrisiPrijave = async () => {
        showModal('Jeste li sigurni da želite obrisati sve prijave?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const rezultat = await prijaveService.get();
                const prijave = rezultat.data || rezultat;
                for (const prijava of prijave) {
                    await prijaveService.obrisi(prijava.id);
                }
                setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${prijave.length} prijava!` });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju prijava: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };

    const handleObrisiTragove = async () => {
        showModal('Jeste li sigurni da želite obrisati sve tragove?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const rezultat = await TragoviService.get();
                const tragovi = rezultat.data || rezultat;
                for (const trag of tragovi) {
                    await TragoviService.obrisi(trag.id);
                }
                setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${tragovi.length} tragova!` });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju tragova: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };


    const handleGenerirajSve = async () => {
        showLoading();
        setPoruka(null);

        try {
            await generirajVrste(brojVrsta);
            await generirajTipove(brojTipova);
            await generirajOznake(brojOznaka);
            await generirajPrijave(brojPrijava);
            await generirajTragove(brojTragova);
            await generirajOperatere(brojOperatera);
            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano: ${brojVrsta} vrsta, ${brojTipova} tipova, ${brojPrijava} prijava, ${brojTragova} tragova, ${brojOznaka} oznaka i ${brojOperatera} operatera!`
            });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju svih podataka: ' + error.message });
        } finally {
            hideLoading();
        }
    };

    const handleObrisiSve = async () => {
        showModal('Jeste li sigurni da želite obrisati SVE podatke (tragove, prijave, tipove, vrste, oznake i operatere)?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const tragoviOdgovor = await TragoviService.get();
                const tragovi = tragoviOdgovor.data || tragoviOdgovor;
                for (const trag of tragovi) {
                    await TragoviService.obrisi(trag.id);
                }

                const prijaveOdgovor = await prijaveService.get();
                const prijave = prijaveOdgovor.data || prijaveOdgovor;
                for (const prijava of prijave) {
                    await prijaveService.obrisi(prijava.id);
                }

                const tipoviOdgovor = await TipService.get();
                const tipovi = tipoviOdgovor.data || tipoviOdgovor;
                for (const tip of tipovi) {
                    await TipService.obrisi(tip.id);
                }

                const vrsteOdgovor = await VrsteService.get();
                const vrste = vrsteOdgovor.data || vrsteOdgovor;
                for (const vrsta of vrste) {
                    await VrsteService.obrisi(vrsta.id);
                }

                const oznakeOdgovor = await OznakeService.get();
                const oznake = oznakeOdgovor.data || oznakeOdgovor;
                for (const oznaka of oznake) {
                    await OznakeService.obrisi(oznaka.id)
                }

                const operateriOdgovor = await OperaterService.get();
                const operateri = operateriOdgovor.data || operateriOdgovor;
                for (const operater of operateri) {
                    if (operater.email === authUser.email) continue;
                    await OperaterService.obrisi(operater.id)
                }
                setPoruka({
                    tip: 'success',
                    tekst: `Uspješno obrisano: ${tragovi.length} tragova, ${prijave.length} prijava, ${tipovi.length} tipova, ${vrste.length} vrsta i ${oznake.length} oznaka!`
                });
            } catch (error) {
                setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju svih podataka: ' + error.message });
            } finally {
                hideLoading();
            }
        });
    };

    if (DATA_SOURCE === 'memorija') {
        return (
            <Container className="mt-4">
                <Card className="shadow-sm border-0 rounded-3 p-4 text-center">
                    <h3 className='shadow-sm p-4' style={{ color: 'olive', background: 'antiquewhite' }}>Trenutno ste na memoriji te ne možete generirati podatke</h3>
                    <h5 className='text-muted p-5' style={{ fontStyle: "italic" }}>Pogledaj pregled prijava da vidiš podatke koji su na memoriji te ih tamo po potrebi ažuriraj </h5>

                </Card>
            </Container>
        );
    }
    const generirajOperatere = async (broj) => {
        const operateri = (await OperaterService.get()).data;
        const adminPostoji = operateri.some(op => op.email === 'admin@pawalert.hr');
        if (!adminPostoji) {
            await OperaterService.dodaj({
                email: 'admin@pawalert.hr',
                lozinka: 'Edunova123!',
                uloga: 'admin'
            });
        }

        for (let i = 0; i < broj; i++) {
            await OperaterService.dodaj({
                email: faker.internet.email(),
                lozinka: 'Edunova123!',
                uloga: 'korisnik'
            });
        }
    };

    const handleGenerirajOperatere = async (e) => {
        e.preventDefault();
        if (!provjeriBroj('brojOperatera', brojOperatera, 50)) return;
        showLoading();
        setPoruka(null);

        try {
            await generirajOperatere(brojOperatera);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojOperatera} operatera!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju operatera: ' + error.message
            });
        } finally {
            hideLoading();
        }
    };

    const handleObrisiOperatere = async () => {
        showModal('Jeste li sigurni da želite obrisati sve operatere?', async () => {
            showLoading();
            setPoruka(null);
            try {
                const rezultat = await OperaterService.get();
                const operateri = rezultat.data;

                for (const operater of operateri) {
                    if (operater.email === authUser.email) continue;
                    await OperaterService.obrisi(operater.id);
                }

                setPoruka({
                    tip: 'success',
                    tekst: `Uspješno obrisano ${operateri.length} operatera!`
                });
            } catch (error) {
                setPoruka({
                    tip: 'danger',
                    tekst: 'Greška pri brisanju operatera: ' + error.message
                });
            } finally {
                hideLoading();
            }
        });
    };




    return (
        <Container>
            <Card className="shadow-sm border-0 rounded-3 mb-4">
                <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h3 className="fw-bold mb-1 text-dark">Generiranje podataka</h3>
                        <p className="text-muted small mb-0">Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku u Osijeku.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="success" onClick={handleGenerirajSve} disabled={loading} className='mb-1 flex-fill flex-md-grow-0'>
                            {loading ? 'Radim...' : 'Generiraj sve'}
                        </Button>
                        <Button variant="danger" onClick={handleObrisiSve} disabled={loading} className='mb-1 flex-fill flex-md-grow-0'>
                            {loading ? 'Radim...' : 'Obriši sve'}
                        </Button>
                        <Button
                            onClick={izveziSveUXml}
                            variant="outline-secondary"
                            className="btn-icon p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
                            style={{ width: "38px", height: "38px" }}
                            title="Izvezi cijelu bazu u XML"
                        >
                            <BsFileEarmarkCode size={20} />
                        </Button>
                    </div>
                    {poruka && (
                        <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                            {poruka.tekst}
                        </Alert>
                    )}
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajVrste}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj vrsta</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={brojVrsta}
                                        onChange={(e) => setBrojVrsta(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojVrsta}
                                        onFocus={() => ocistiGresku('brojVrsta')}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brojVrsta}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">Unesite broj vrsta (1-20)</Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? 'Generiranje...' : 'Generiraj vrste'}
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajTipove}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj tipova</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={brojTipova}
                                        onChange={(e) => setBrojTipova(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojTipova}
                                        onFocus={() => ocistiGresku('brojTipova')}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brojTipova}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">Unesite broj tipova (1-20)</Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? 'Generiranje...' : 'Generiraj tipove'}
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajOznake}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj oznaka</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={brojOznaka}
                                        onChange={(e) => setBrojOznaka(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojOznaka}
                                        onFocus={() => ocistiGresku('brojOznaka')}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brojOznaka}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">Unesite broj oznaka (1-20)</Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? 'Generiranje...' : 'Generiraj oznake'}
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajPrijave}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj prijava</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={brojPrijava}
                                        onChange={(e) => setBrojPrijava(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojPrijava}
                                        onFocus={() => ocistiGresku('brojPrijava')}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brojPrijava}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">Unesite broj prijava (1-50)</Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? 'Generiranje...' : 'Generiraj prijave'}
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajTragove}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj tragova</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={brojTragova}
                                        onChange={(e) => setBrojTragova(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojTragova}
                                        onFocus={() => ocistiGresku('brojTragova')}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brojTragova}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">Unesite broj tragova (1-100)</Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? 'Generiranje...' : 'Generiraj tragove'}
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Form onSubmit={handleGenerirajOperatere}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Broj operatera</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={brojOperatera}
                                        onChange={(e) => setBrojOperatera(e.target.value)}
                                        disabled={loading}
                                        isInvalid={!!errors.brojOperatera}
                                        onFocus={() => ocistiGresku('brojOperatera')}
                                    />
                                    <Form.Text className="text-muted">
                                        +1 admin (1-50)
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">{errors.brojOperatera}</Form.Control.Feedback>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="w-100"
                                >
                                    {loading ? 'Generiranje...' : 'Generiraj operatere'}
                                </Button>
                            </Form>
                        </Col>

                    </Row>
                    <Alert variant="warning" className="mt-3">
                        <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. Ako želite početi ispočetka, prvo obrišite postojeće podatke.
                    </Alert>

                    <hr className="my-4" />
                    <div className='mx-2'>
                        <h3>Brisanje podataka</h3>
                        <p className="text-muted">Koristite ove opcije za brisanje svih podataka iz baze.</p>
                    </div>
                    <Row className="my-3">
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiVrste} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve vrste'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiTipove} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve tipove'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiOznake} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve oznake'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiPrijave} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve prijave'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiTragove} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve tragove'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="danger" onClick={handleObrisiOperatere} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve operatere'}
                            </Button>
                        </Col>

                    </Row>

                    <Alert variant="danger" className="mt-3">
                        <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
                    </Alert>
                </Card.Body>
                <hr className="my-4" />
                <Row className="m-2">
                    <Col md={4}>
                        <div className='mx-2'>
                            <h3>Presipavanje podataka</h3>
                            <p className="text-muted">
                                Koristite ove opcije za kopiranje iz jednog izvora u drugi.
                            </p>
                        </div>
                    </Col>
                    <Col md={4} className='my-2'>
                        <Button
                            variant="danger"
                            onClick={handleMemorijaULocalStorage}
                            disabled={loading}
                            className="w-100 mb-2"
                        >
                            {loading ? 'Presipavanje...' : 'Iz memorije u localStorage'}
                        </Button>
                    </Col>
                    <Col md={4} className='my-2'>
                        <Button
                            variant="danger"
                            onClick={handleMemorijaUFireBase}
                            disabled={loading}
                            className="w-100 mb-2"
                        >
                            {loading ? 'Pretakanje...' : 'Iz memorije u firebase'}
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Container >
    );
}