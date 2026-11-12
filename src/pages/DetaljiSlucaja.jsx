import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Card, Container, Row, Col } from "react-bootstrap"
import { RouteNames, putanja } from "../constants"
import prijaveService from "../services/prijave/prijaveService"
import TragoviService from "../services/tragovi/TragoviService"
import FormatDatuma from "../components/FormatDatuma";
import { BiPlus, BiMap, BiTime, BiPrinter, BiArrowBack } from "react-icons/bi";
import TragoviMapa from "../components/TragoviMapa";
import OznakeService from "../services/oznake/OznakeService"
import VrsteService from "../services/vrste/VrsteService"
import TipService from "../services/tip/TipService"
import LetakModal from "../components/LetakModal"
import { slikaUrl } from "../utils/slika";
import { Chrono } from "react-chrono"
import "react-chrono/dist/style.css"

export default function DetaljiSlucaja() {
    const { id } = useParams()
    const [prijava, setPrijava] = useState(null)
    const [tragovi, setTragovi] = useState([])
    const [oznake, setOznake] = useState([])
    const [vrste, setVrste] = useState([])
    const [tipovi, setTipovi] = useState([])
    const [prikaziLetak, setPrikaziLetak] = useState(false)


    useEffect(() => {
        async function ucitaj() {
            try {
                const [odgovor, t, resOznake, resVrste, resTipovi] = await Promise.all([
                    prijaveService.getById(id),
                    TragoviService.getByPrijava(id),
                    OznakeService.get(),
                    VrsteService.get(),
                    TipService.get()
                ])
                setPrijava(odgovor.data ?? null)
                setTragovi(t.data ?? [])
                setOznake(resOznake.data ?? [])
                setVrste(resVrste.data ?? resVrste ?? [])
                setTipovi(resTipovi.data ?? resTipovi ?? [])
            } catch (error) {
                console.error("Greška pri dohvatu podataka:", error)
            }
        }
        ucitaj()
    }, [id])

    const stavkeTimeline = useMemo(() => {
        const nemaSlike = `${import.meta.env.BASE_URL}nemaSlike.svg`
        return [...tragovi]
            .sort((a, b) => new Date(b.datum) - new Date(a.datum))   // najnoviji prvi
            .map((t) => {
                const d = new Date(t.datum)
                const valjan = !isNaN(d.getTime())
                return {
                    id: String(t.id),
                    title: valjan
                        ? d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "Nepoznato",
                    cardTitle: t.lokacija?.opis || t.lokacija_opis || "Lokacija na karti",
                    cardSubtitle: valjan
                        ? d.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" }) + " h"
                        : "",
                    cardDetailedText: t.opis,
                    media: {
                        type: "IMAGE",
                        name: t.slika ? "Slika traga" : "Trag bez slike",
                        source: { url: t.slika ? slikaUrl(t.slika) : nemaSlike }
                    }
                }
            })
    }, [tragovi])

    const renderOznaka = () => {
        if (!prijava || oznake.length === 0) return null
        const oznakePrijave = prijava.oznake ?? (
            prijava.oznaka_id != null
                ? [prijava.oznaka_id]
                : prijava.oznaka != null
                    ? [prijava.oznaka]
                    : []
        );

        const oznakeZaPrikaz = oznakePrijave
            .map((stavka) => {
                const oznakaId = typeof stavka === "object" ? stavka.id : stavka;
                return oznake.find((o) => String(o.id) === String(oznakaId));
            })
            .filter(Boolean);

        if (oznakeZaPrikaz.length === 0) return null;

        return (
            <div className="d-flex flex-wrap gap-2 mb-3">
                {oznakeZaPrikaz.map((oznaka) => (
                    <span
                        key={oznaka.id}
                        style={{
                            backgroundColor: oznaka.boja || "#6c757d",
                            color: oznaka.boja_teksta || "#fff"
                        }}
                        className="px-2 py-1 fs-6 rounded-pill"
                    >
                        {oznaka.naziv}
                    </span>
                ))}
            </div>
        );
    };

    const oznakeZaLetak = (prijava?.oznake ?? [])
        .map((oid) => oznake.find((o) => String(o.id) === String(typeof oid === "object" ? oid.id : oid)))
        .filter(Boolean)
    const nazivVrste = vrste.find((v) => v.id === prijava?.zivotinja_vrsta)?.naziv ?? ""
    const nazivTipa = tipovi.find((t) => t.id === prijava?.tip_prijave)?.naziv ?? ""

    if (!prijava) {
        return (
            <Container className="my-4">
                <p>Slučaj nije pronađen.</p>
                <Link to={RouteNames.KATALOG}>Natrag na katalog</Link>
            </Container>
        )
    }

    return (
        <Container className="my-5">
            <div className="mb-4">
                <Link to={RouteNames.KATALOG} className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
                    <BiArrowBack size={18} /> Natrag na katalog
                </Link>
            </div>
            <Row className="g-4">
                <Col xs={12} lg={5}>
                    <Card className="shadow-sm border-0 overflow-hidden h-100">
                        <Card.Img
                            variant="top"
                            src={slikaUrl(prijava.slika) || `${import.meta.env.BASE_URL}nemaSlike.svg`}
                            alt={prijava.zivotinja_ime || "Životinja"}
                            style={{ height: "260px", objectFit: "cover" }}
                        />
                        <Card.Body className="p-4 d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="fw-bold mb-2">{prijava.zivotinja_ime || "Nepoznato ime"}</h2>
                                {renderOznaka()}
                                <p className="text-secondary mb-3">{prijava.zivotinja_opis}</p>
                                <div className="d-flex flex-column gap-2 text-muted small mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <BiMap size={18} className="text-success flex-shrink-0" />
                                        <span>{prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija"}</span>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <BiTime size={18} className="text-success flex-shrink-0" />
                                        <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline-success"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-medium mt-auto"
                                onClick={() => setPrikaziLetak(true)}>
                                <BiPrinter size={18} /> Izradi letak (PDF)
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>


                <Col xs={12} lg={7}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                            <div>
                                <h4 className="fw-bold mb-0">🐾 Tragovi i viđenja</h4>
                                <p className="text-muted small mb-0">Kronološki pregled prikupljenih tragova i zapažanja</p>
                            </div>
                            <Link
                                to={putanja(RouteNames.TRAG_NOVI, id)}
                                state={{ povratak: putanja(RouteNames.DETALJI_SLUCAJA, id) }}
                                className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-medium text-decoration-none shadow-sm px-3 py-2"
                            >
                                <BiPlus size={18} /> Novi trag
                            </Link>
                        </div>
                        {tragovi.length === 0 ? (
                            <div className="text-center text-muted py-5 bg-light rounded-3 my-auto">
                                <p className="mb-0">Još nema zabilježenih tragova za ovaj slučaj.</p>
                            </div>
                        ) : (
                            <div style={{ minHeight: "420px" }}>
                                <Chrono
                                    items={stavkeTimeline}
                                    mode="VERTICAL"
                                    theme={{
                                        primary: "#198754",
                                        secondary: "#198754",
                                        cardBgColor: "#ffffff",
                                        cardTitleColor: "#212529",
                                        cardSubtitleColor: "#6c757d",
                                        cardDetailsColor: "#495057",
                                        titleColor: "#ffffff",
                                        titleColorActive: "#ffffff",
                                        shadowColor: "rgba(25, 135, 84, 0.25)",
                                        glowColor: "rgba(25, 135, 84, 0.35)"
                                    }}
                                    disableToolbar
                                    hideControls
                                    timelineHeight={620}
                                    mediaHeight={180}
                                    mediaSettings={{ fit: "cover" }}
                                    scrollable={{ scrollbar: true }}
                                    fontSizes={{ cardTitle: "1rem", cardSubtitle: "0.8rem", cardText: "0.9rem", title: "0.85rem" }}
                                    focusActiveItemOnLoad={false}
                                />
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={12}>
                    <Card className="shadow-sm border-0 overflow-hidden h-">
                        <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                            <h4 className="fw-bold mb-1">🗺️ Karta kretanja i tragova</h4>
                            <p className="text-muted small">Prikaz svih lokacija vezanih uz ovaj slučaj</p>
                        </Card.Header>
                        <Card.Body className="p-0 pt-3">
                            <div style={{ height: "450px", width: "100%" }}>
                                <TragoviMapa prijava={prijava} tragovi={tragovi} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <LetakModal
                show={prikaziLetak}
                onHide={() => setPrikaziLetak(false)}
                prijava={prijava}
                nazivTipa={nazivTipa}
                nazivVrste={nazivVrste}
                oznake={oznakeZaLetak}
            />
        </Container>
    );
}