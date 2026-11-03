import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { BiPrinter } from "react-icons/bi";
import { generirajLetak } from "../utils/letakPdfGenerator.js";

const citaj = (kljuc) => {
  try {
    return localStorage.getItem(kljuc) ?? "";
  } catch {
    return "";
  }
};
const spremi = (kljuc, vrijednost) => {
  try {
    localStorage.setItem(kljuc, vrijednost);
  } catch {
    /* nije bitno */
  }
};

export default function LetakModal({ show, onHide, prijava, nazivTipa, nazivVrste, oznake }) {
  const [uBoji, setUBoji] = useState(true);
  const [telefon, setTelefon] = useState(() => citaj("letak_telefon"));
  const [kontaktIme, setKontaktIme] = useState(() => citaj("letak_ime"));
  const [trakice, setTrakice] = useState(true);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState("");

  const telefonNevaljan = telefon.trim() !== "" && !/^[+\d\s()/-]{6,20}$/.test(telefon.trim());

  async function generiraj() {
    if (telefonNevaljan) return;
    setRadi(true);
    setGreska("");
    try {
      spremi("letak_telefon", telefon.trim());
      spremi("letak_ime", kontaktIme.trim());
      await generirajLetak({ prijava, nazivTipa, nazivVrste, oznake, uBoji, telefon, kontaktIme, trakice });
      onHide();
    } catch (error) {
      console.error("Greška pri izradi letka:", error);
      setGreska(error.message || "Letak nije moguće izraditi.");
    } finally {
      setRadi(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 d-flex align-items-center gap-2">
          <BiPrinter /> Letak za ispis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small">
          Izrađuje se A4 letak s fotografijom, opisom, kontaktom i QR kodom. Otvara se u novoj kartici, odatle ga ispiši ili spremi.
        </p>

        <Form.Label className="fw-semibold">Ispis</Form.Label>
        <div className="d-flex gap-2 mb-3">
          <Form.Check
            type="radio"
            id="letak-boja"
            name="letak-ispis"
            label="🎨 U boji"
            checked={uBoji}
            onChange={() => setUBoji(true)}
            className="border rounded px-4 py-2 flex-fill"
          />
          <Form.Check
            type="radio"
            id="letak-cb"
            name="letak-ispis"
            label="⚫ Crno-bijelo (štedi tintu)"
            checked={!uBoji}
            onChange={() => setUBoji(false)}
            className="border rounded px-4 py-2 flex-fill"
          />
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Telefon za kontakt</Form.Label>
          <Form.Control
            type="tel"
            placeholder="npr. 091 234 5678"
            value={telefon}
            isInvalid={telefonNevaljan}
            onChange={(e) => setTelefon(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Unesi samo brojeve, razmake i znakove + ( ) -
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Ime kontakt osobe (nije obavezno)</Form.Label>
          <Form.Control
            type="text"
            maxLength={30}
            placeholder="npr. Ana"
            value={kontaktIme}
            onChange={(e) => setKontaktIme(e.target.value)}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          id="letak-trakice"
          label="Dodaj odrezive trakice s brojem telefona"
          checked={trakice && telefon.trim() !== ""}
          disabled={telefon.trim() === ""}
          onChange={(e) => setTrakice(e.target.checked)}
        />

        {greska && (
          <Alert variant="danger" className="mt-3 mb-0 small">
            {greska}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={radi}>
          Odustani
        </Button>
        <Button variant="success" onClick={generiraj} disabled={radi || telefonNevaljan}>
          {radi ? <Spinner size="sm" animation="border" className="me-2" /> : <BiPrinter className="me-1" />}
          Izradi letak
        </Button>
      </Modal.Footer>
    </Modal>
  );
}