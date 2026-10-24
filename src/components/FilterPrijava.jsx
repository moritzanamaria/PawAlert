import { useState } from "react";
import { Row, Col, Form, Button, Badge, Collapse } from "react-bootstrap";
import { BiFilterAlt } from "react-icons/bi";
import PretragaInput from "./PretragaInput";
import VrstaSelect from "./VrstaSelect";
import { PRAZNI_FILTERI } from "../utils/filterHelpers";

const SVA_POLJA = ["pretraga", "vrsta", "tip", "status", "hitno"];

export default function FilterPrijava({
  filteri,
  setFilteri,
  vrste = [],
  tipovi = [],
  polja = SVA_POLJA,
  sortiranje,
  setSortiranje,
}) {
  const [otvoreno, setOtvoreno] = useState(false);

  const promijeni = (kljuc, vrijednost) => setFilteri({ ...filteri, [kljuc]: vrijednost });
  const ima = (polje) => polja.includes(polje);

  const imaOpcije = ima("vrsta") || ima("tip") || ima("status") || ima("hitno") || Boolean(setSortiranje);

  const brojAktivnih = [
    ima("vrsta") && filteri.vrsta,
    ima("tip") && filteri.tip,
    ima("status") && filteri.status,
    ima("hitno") && filteri.samoHitne,
  ].filter(Boolean).length;

  return (
    <>
      <Row className="g-2 align-items-end">
        {ima("pretraga") && (
          <Col xs>
            <PretragaInput
              pretraga={filteri.pretraga}
              setPretraga={(v) => promijeni("pretraga", v)}
            />
          </Col>
        )}

        {imaOpcije && (
          <Col xs="auto">
            <Button
              size="sm"
              variant={brojAktivnih > 0 ? "primary" : "outline-secondary"}
              onClick={() => setOtvoreno(!otvoreno)}
              aria-expanded={otvoreno}
              aria-controls="filter-opcije"
              className="d-flex align-items-center gap-1"
            >
              <BiFilterAlt size={16} /> Filteri
              {brojAktivnih > 0 && (
                <Badge bg="light" text="dark" pill>{brojAktivnih}</Badge>
              )}
            </Button>
          </Col>
        )}
      </Row>

      {imaOpcije && (
        <Collapse in={otvoreno}>
          <div id="filter-opcije">
            <Row className="g-3 mt-1 align-items-end">
              {ima("vrsta") && (
                <Col xs={12} md>
                  <VrstaSelect
                    vrsta={filteri.vrsta}
                    setVrsta={(v) => promijeni("vrsta", v)}
                    vrste={vrste}
                  />
                </Col>
              )}

              {ima("tip") && (
                <Col xs={12} md>
                  <label htmlFor="tipSelect" className="form-label small fw-bold text-muted mb-1">Tip</label>
                  <Form.Select id="tipSelect" size="sm" value={filteri.tip} onChange={(e) => promijeni("tip", e.target.value)}>
                    <option value="">Svi tipovi</option>
                    {tipovi.map((t) => (
                      <option key={t.id} value={t.id}>{t.naziv}</option>
                    ))}
                  </Form.Select>
                </Col>
              )}

              {ima("status") && (
                <Col xs={12} md>
                  <label htmlFor="statusSelect" className="form-label small fw-bold text-muted mb-1">Status</label>
                  <Form.Select id="statusSelect" size="sm" value={filteri.status} onChange={(e) => promijeni("status", e.target.value)}>
                    <option value="">Svi statusi</option>
                    <option value="otvorena">Otvorena</option>
                    <option value="zatvorena">Zatvorena</option>
                  </Form.Select>
                </Col>
              )}

              {setSortiranje && (
                <Col xs={12} md>
                  <label htmlFor="sortSelect" className="form-label small fw-bold text-muted mb-1">Sortiranje</label>
                  <Form.Select id="sortSelect" size="sm" value={sortiranje} onChange={(e) => setSortiranje(e.target.value)}>
                    <option value="najnovije">Najnovije prvo</option>
                    <option value="najstarije">Najstarije prvo</option>
                  </Form.Select>
                </Col>
              )}

              {ima("hitno") && (
                <Col xs={12} md="auto">
                  <Form.Check
                    type="checkbox"
                    id="samoHitne"
                    label="🚨 Samo hitne"
                    className="fw-medium text-danger"
                    checked={filteri.samoHitne}
                    onChange={(e) => promijeni("samoHitne", e.target.checked)}
                  />
                </Col>
              )}

              {brojAktivnih > 0 && (
                <Col xs={12} md="auto">
                  <Button variant="link" size="sm" className="p-0" onClick={() => setFilteri(PRAZNI_FILTERI)}>
                    Očisti sve
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        </Collapse>
      )}
    </>
  );
}