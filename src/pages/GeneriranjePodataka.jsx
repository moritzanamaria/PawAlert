import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr, en } from '@faker-js/faker';
import prijaveService from '../services/prijave/prijaveService';
import TragoviService from '../services/tragovi/TragoviService';
import TipService from '../services/tip/TipService';
import VrsteService from '../services/vrste/VrsteService';

export default function GeneriranjePodataka() {
    const [brojVrsta, setBrojVrsta] = useState(5);
    const [brojTipova, setBrojTipova] = useState(5);
    const [brojPrijava, setBrojPrijava] = useState(10);
    const [brojTragova, setBrojTragova] = useState(20);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    const faker = new Faker({
        locale: [hr, en]
    });

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

    const generirajPrijave = async (broj) => {
        const vrsteOdgovor = await VrsteService.get();
        const vrste = vrsteOdgovor.data || vrsteOdgovor;

        const tipoviOdgovor = await TipService.get();
        const tipovi = tipoviOdgovor.data || tipoviOdgovor;

        if (vrste.length === 0 || tipovi.length === 0) {
            throw new Error('Nema dostupnih vrsta ili tipova. Prvo generirajte vrste i tipove.');
        }

        const imenaZivotinja = ['Reks', 'Bubi', 'Maza', 'Luna', 'Garfield', 'Astor', 'Nero', 'Bella', 'Max', 'Rex', 'Medo', 'Kićo'];
        const osjeckeUlice = ['Ulica Republike', 'Europska avenija', 'Gundulićeva ulica', 'Vukovarska ulica', 'Kardinala A. Stepinca', 'Strossmayerova ulica', 'Svačićeva ulica', 'Ulica J. J. Strossmayera'];

        for (let i = 0; i < broj; i++) {
            const randomVrsta = vrste[faker.number.int({ min: 0, max: vrste.length - 1 })];
            const randomTip = tipovi[faker.number.int({ min: 0, max: tipovi.length - 1 })];
            const ulica = osjeckeUlice[faker.number.int({ min: 0, max: osjeckeUlice.length - 1 })];

            await prijaveService.dodaj({
                zivotinja_ime: imenaZivotinja[faker.number.int({ min: 0, max: imenaZivotinja.length - 1 })],
                zivotinja_vrsta: randomVrsta.id,
                zivotinja_opis: faker.lorem.sentence(),
                zivotinja_godine: faker.number.int({ min: 1, max: 12 }),
                cipirana: faker.datatype.boolean(),
                tip_prijave: randomTip.id,
                status: faker.helpers.arrayElement(['otvorena', 'zatvorena']),
                lokacija: {
                    lat: faker.number.float({ min: 45.5400, max: 45.5750, precision: 0.0001 }),
                    lng: faker.number.float({ min: 18.6400, max: 18.7200, precision: 0.0001 }),
                    opis: `Osijek, ${ulica} ${faker.number.int({ min: 1, max: 120 })}`
                },
                datum: faker.date.recent({ days: 30 }).toISOString(),
                slika: 'https://picsum.photos/400/300',
                hitno: faker.datatype.boolean(0.3)
            });
        }
    };

    const generirajTragove = async (broj) => {
        const prijaveOdgovor = await prijaveService.get();
        const prijave = prijaveOdgovor.data || prijaveOdgovor;

        if (prijave.length === 0) {
            throw new Error('Nema dostupnih prijava. Prvo generirajte prijave.');
        }

        const osjeckeUlice = ['Svačićeva ulica', 'Retfala', 'Jug 2', 'Tvrđa', 'Donji grad', 'Gornji grad', 'Industrijska četvrt'];

        for (let i = 0; i < broj; i++) {
            const randomPrijava = prijave[faker.number.int({ min: 0, max: prijave.length - 1 })];
            const ulica = osjeckeUlice[faker.number.int({ min: 0, max: osjeckeUlice.length - 1 })];

            await TragoviService.dodaj({
                prijava: randomPrijava.id,
                opis: faker.lorem.paragraph(),
                lokacija: {
                    lat: faker.number.float({ min: 45.5400, max: 45.5750, precision: 0.0001 }),
                    lng: faker.number.float({ min: 18.6400, max: 18.7200, precision: 0.0001 }),
                    opis: `Osijek, ${ulica} ${faker.number.int({ min: 1, max: 120 })}`
                },
                datum: faker.date.recent({ days: 10 }).toISOString()
            });
        }
    };

    const handleGenerirajVrste = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajVrste(brojVrsta);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojVrsta} vrsta!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju vrsta: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajTipove = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajTipove(brojTipova);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojTipova} tipova!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju tipova: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajPrijave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajPrijave(brojPrijava);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojPrijava} prijava u Osijeku!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju prijava: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajTragove = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajTragove(brojTragova);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojTragova} tragova u Osijeku!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju tragova: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiVrste = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve vrste?')) return;
        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await VrsteService.get();
            const vrste = rezultat.data || rezultat;
            for (const vrsta of vrste) {
                await VrsteService.obrisi(vrsta.id);
            }
            setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${vrste.length} vrsta!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju vrsta: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiTipove = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve tipove?')) return;
        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await TipService.get();
            const tipovi = rezultat.data || rezultat;
            for (const tip of tipovi) {
                await TipService.obrisi(tip.id);
            }
            setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${tipovi.length} tipova!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju tipova: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiPrijave = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve prijave?')) return;
        setLoading(true);
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
            setLoading(false);
        }
    };

    const handleObrisiTragove = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve tragove?')) return;
        setLoading(true);
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
            setLoading(false);
        }
    };
const handleGenerirajSve = async () => {
    setLoading(true);
    setPoruka(null);

    try {
        await generirajVrste(brojVrsta);
        await generirajTipove(brojTipova);
        await generirajPrijave(brojPrijava);
        await generirajTragove(brojTragova);
        setPoruka({
            tip: 'success',
            tekst: `Uspješno generirano: ${brojVrsta} vrsta, ${brojTipova} tipova, ${brojPrijava} prijava i ${brojTragova} tragova!`
        });
    } catch (error) {
        setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju svih podataka: ' + error.message });
    } finally {
        setLoading(false);
    }
};

const handleObrisiSve = async () => {
    if (!window.confirm('Jeste li sigurni da želite obrisati SVE podatke (tragove, prijave, tipove i vrste)?')) return;
    setLoading(true);
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

        setPoruka({
            tip: 'success',
            tekst: `Uspješno obrisano: ${tragovi.length} tragova, ${prijave.length} prijava, ${tipovi.length} tipova i ${vrste.length} vrsta!`
        });
    } catch (error) {
        setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju svih podataka: ' + error.message });
    } finally {
        setLoading(false);
    }
};
    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h1 className="mb-0">Generiranje podataka</h1>
                <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleGenerirajSve} disabled={loading}>
                        {loading ? 'Radim...' : 'Generiraj sve'}
                    </Button>
                    <Button variant="danger" onClick={handleObrisiSve} disabled={loading}>
                        {loading ? 'Radim...' : 'Obriši sve'}
                    </Button>
                </div>
            </div>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku u Osijeku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajVrste}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj vrsta</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="20"
                                value={brojVrsta}
                                onChange={(e) => setBrojVrsta(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">Unesite broj vrsta (1-20)</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj vrste'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajTipove}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj tipova</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="20"
                                value={brojTipova}
                                onChange={(e) => setBrojTipova(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">Unesite broj tipova (1-20)</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj tipove'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajPrijave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj prijava</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojPrijava}
                                onChange={(e) => setBrojPrijava(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">Unesite broj prijava (1-50)</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj prijave'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajTragove}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj tragova</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojTragova}
                                onChange={(e) => setBrojTragova(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">Unesite broj tragova (1-100)</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj tragove'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">Koristite ove opcije za brisanje svih podataka iz baze.</p>

            <Row className="mt-3">
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiVrste} disabled={loading} className="w-100 mb-2">
                        {loading ? 'Brisanje...' : 'Obriši sve vrste'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiTipove} disabled={loading} className="w-100 mb-2">
                        {loading ? 'Brisanje...' : 'Obriši sve tipove'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiPrijave} disabled={loading} className="w-100 mb-2">
                        {loading ? 'Brisanje...' : 'Obriši sve prijave'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiTragove} disabled={loading} className="w-100 mb-2">
                        {loading ? 'Brisanje...' : 'Obriši sve tragove'}
                    </Button>
                </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}