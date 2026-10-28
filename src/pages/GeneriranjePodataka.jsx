import { useState } from 'react';
import { Button, Card, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr, en } from '@faker-js/faker';
import prijaveService from '../services/prijave/prijaveService';
import TragoviService from '../services/tragovi/TragoviService';
import TipService from '../services/tip/TipService';
import VrsteService from '../services/vrste/VrsteService';
import OznakeService from '../services/oznake/OznakeService';
import { DATA_SOURCE } from '../constants';

export default function GeneriranjePodataka() {
    const [brojVrsta, setBrojVrsta] = useState(5);
    const [brojTipova, setBrojTipova] = useState(5);
    const [brojOznaka, setBrojOznaka] = useState(5);
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

    const generirajOznake = async (broj) => {
        const naziviOznaka = ['Ima ogrlicu', 'Ozlijeđen', 'Star', 'Mladunče', 'Preplašen', 'Traži se vlasnik', 'Agresivan', 'Miran'];
        const bojeOznaka =  ['#fd7e14','#dc3545', '#198754', '#0d6efd', '#6c757d', '#ffc107', '#6610f2', '#d63384'];

        for (let i = 0; i < broj; i++) {
            await OznakeService.dodaj({
                naziv: naziviOznaka[i % naziviOznaka.length] + (i >= naziviOznaka.length ? ` ${Math.floor(i / naziviOznaka.length) + 1}` : ''),
                boja: bojeOznaka[i % bojeOznaka.length]
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

        if (vrste.length === 0 || tipovi.length === 0) {
            throw new Error('Nema dostupnih vrsta ili tipova. Prvo generirajte vrste i tipove.');
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
                slika: 'https://picsum.photos/400/300',
                hitno: faker.datatype.boolean({ probability: 0.3 }),
                oznake: odabraneOznake
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

    const handleGenerirajOznake = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajOznake(brojOznaka);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojOznaka} oznaka!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju oznaka: ' + error.message });
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

    const handleObrisiOznake = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve oznake?')) return;
        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await OznakeService.get();
            const oznake = rezultat.data || rezultat;
            for (const oznaka of oznake) {
                await OznakeService.obrisi(oznaka.id);
            }
            setPoruka({ tip: 'success', tekst: `Uspješno obrisano ${oznake.length} oznaka!` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju oznaka: ' + error.message });
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
            await generirajOznake(brojOznaka);
            await generirajPrijave(brojPrijava);
            await generirajTragove(brojTragova);
            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano: ${brojVrsta} vrsta, ${brojTipova} tipova, ${brojPrijava} prijava, ${brojTragova} tragova i ${brojOznaka} oznaka!`
            });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju svih podataka: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiSve = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati SVE podatke (tragove, prijave, tipove, vrste i oznake)?')) return;
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

            const oznakeOdgovor = await OznakeService.get();
            const oznake = oznakeOdgovor.data || oznakeOdgovor;
            for (const oznaka of oznake) {
                await OznakeService.obrisi(oznaka.id)
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano: ${tragovi.length} tragova, ${prijave.length} prijava, ${tipovi.length} tipova, ${vrste.length} vrsta i ${oznake.length} oznaka!`
            });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju svih podataka: ' + error.message });
        } finally {
            setLoading(false);
        }
    };
if (DATA_SOURCE === 'memorija') {
        return (
            <Container className="mt-4">
                <Card className="shadow-sm border-0 rounded-3 p-4 text-center">
                    <h3 className='shadow-sm p-4' style={{color: 'olive', background: 'antiquewhite'}}>Trenutno ste na memoriji te ne možete generirati podatke</h3>
                    <h5 className='text-muted p-5' style={{fontStyle: "italic"}}>Pogledaj pregled prijava da vidiš podatke koji su na memoriji te ih tamo po potrebi ažuriraj </h5>
                
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Card className="shadow-sm border-0 rounded-3 mb-4">
                <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h3 className="fw-bold mb-1 text-dark">🎴 Generiranje podataka</h3>
                        <p className="text-muted small mb-0">Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku u Osijeku.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="success" onClick={handleGenerirajSve} disabled={loading} className='mb-1 flex-fill flex-md-grow-0'>
                            {loading ? 'Radim...' : 'Generiraj sve'}
                        </Button>
                        <Button variant="danger" onClick={handleObrisiSve} disabled={loading} className='mb-1 flex-fill flex-md-grow-0'>
                            {loading ? 'Radim...' : 'Obriši sve'}
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
                        <Col md={6}>
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
                        <Col md={6}>
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
                        <Col md={4}>
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
                        <Col md={4}>
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
                    <Col md={4}>
                        <Form onSubmit={handleGenerirajOznake}>
                            <Form.Group className="mb-3">
                                <Form.Label>Broj oznaka</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={brojOznaka}
                                    onChange={(e) => setBrojOznaka(parseInt(e.target.value))}
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">Unesite broj oznaka (1-20)</Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                {loading ? 'Generiranje...' : 'Generiraj oznake'}
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
                    <Col md={6}>
                        <Button variant="danger" onClick={handleObrisiVrste} disabled={loading} className="w-100 mb-2">
                            {loading ? 'Brisanje...' : 'Obriši sve vrste'}
                        </Button>
                    </Col>
                    <Col md={6}>
                        <Button variant="danger" onClick={handleObrisiTipove} disabled={loading} className="w-100 mb-2">
                            {loading ? 'Brisanje...' : 'Obriši sve tipove'}
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
                            <Button variant="danger" onClick={handleObrisiOznake} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Brisanje...' : 'Obriši sve oznake'}
                            </Button>
                        </Col>
                </Row>

                <Alert variant="danger" className="mt-3">
                    <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
                </Alert>
            </Card.Body>
        </Card>
            </Container >
        );
}