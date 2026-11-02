import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { RouteNames, putanja } from "../constants";

const STRANICA_W = 210;
const RUB = 12;
const SIRINA = STRANICA_W - 2 * RUB; // 186 mm

// ---------- pomoćne funkcije ----------

function hexUBoju(hex, zamjena) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return zamjena;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function skratiTekst(doc, tekst, sirina, maxRedaka) {
  const redovi = doc.splitTextToSize(tekst, sirina);
  if (redovi.length <= maxRedaka) return redovi;
  const rez = redovi.slice(0, maxRedaka);
  rez[maxRedaka - 1] = rez[maxRedaka - 1].replace(/\s*\S{0,3}$/, "") + "…";
  return rez;
}

// smanjuje font dok tekst ne stane u zadanu širinu
function stisniDoSirine(doc, tekst, pocetniFont, minFont, sirina) {
  let f = pocetniFont;
  doc.setFontSize(f);
  while (f > minFont && doc.getTextWidth(tekst) > sirina) {
    f -= 1;
    doc.setFontSize(f);
  }
  return f;
}

function formatirajDatum(datum) {
  if (!datum) return "Nepoznato";
  const d = new Date(datum);
  if (isNaN(d)) return "Nepoznato";
  return (
    d.toLocaleDateString("hr-HR") +
    " u " +
    d.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" })
  );
}

// ---------- stil letka ovisi o tipu prijave ----------

const STILOVI = {
  nestanak: { boja: [185, 28, 28], naslov: "NESTALA ŽIVOTINJA", podnaslov: "Pomozite nam je pronaći!", lokacija: "ZADNJE POZNATA LOKACIJA", datum: "NESTALA", kontakt: "JAVITE SE" },
  vidjenje: { boja: [29, 78, 216], naslov: "VIĐENA ŽIVOTINJA", podnaslov: "Je li ovo vaš ljubimac?", lokacija: "VIĐENO NA LOKACIJI", datum: "VIĐENA", kontakt: "PREPOZNAJETE LI JE? JAVITE SE" },
  pronadjeno: { boja: [22, 101, 52], naslov: "PRONAĐENA ŽIVOTINJA", podnaslov: "Tražimo vlasnika!", lokacija: "PRONAĐENA NA LOKACIJI", datum: "PRONAĐENA", kontakt: "VLASNIK? JAVITE SE" },
};

// boje za sve ostale tipove (bira se prema broju tipa)
const PALETA = [[124, 58, 237], [194, 65, 12], [14, 116, 144], [190, 24, 93], [161, 98, 7], [51, 65, 85]];

function stilTipa(naziv, tipId) {
  const n = (naziv || "").toLowerCase();
  if (/nestan|nestal|izgublj/.test(n)) return STILOVI.nestanak;
  if (/viđen|vidjen/.test(n)) return STILOVI.vidjenje;
  if (/pronađ|pronad|nađen|nadjen/.test(n)) return STILOVI.pronadjeno;
  return {
    boja: PALETA[(Number(tipId) || 0) % PALETA.length],
    naslov: (naziv || "ŽIVOTINJA").toUpperCase(),
    podnaslov: "Pomozite nam!",
    lokacija: "LOKACIJA",
    datum: "DATUM",
    kontakt: "JAVITE SE",
  };
}

function sapa(doc, x, y, s) {
  [[-4.4, -2.2], [-1.5, -4.8], [1.5, -4.8], [4.4, -2.2]].forEach(([dx, dy]) => {
    doc.circle(x + dx * s, y + dy * s, 1.5 * s, "F");
  });
  doc.ellipse(x, y + 1.8 * s, 3.6 * s, 2.8 * s, "F");
}

// ---------- crtanje letka (čista funkcija, bez browsera) ----------

export function napraviLetak({
  prijava,
  nazivTipa = "",
  nazivVrste = "",
  oznake = [],
  slika = null,
  qr = null,
  fontovi,
  uBoji = true,
  telefon = "",
  kontaktIme = "",
  trakice = false,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS("LINESeedJP-Regular.ttf", fontovi.regular);
  doc.addFont("LINESeedJP-Regular.ttf", "LINESeedJP", "normal");
  doc.addFileToVFS("LINESeedJP-Bold.ttf", fontovi.bold);
  doc.addFont("LINESeedJP-Bold.ttf", "LINESeedJP", "bold");

  const stil = stilTipa(nazivTipa, prijava.tip_prijave);
  const imaTelefon = telefon.trim() !== "";
  const imaTrakice = trakice && imaTelefon;

  // paleta: u crno-bijelom samo crna/bijela/sive radi ispisa
  const AKCENT = uBoji ? stil.boja : [0, 0, 0];
  const TEKST = uBoji ? [30, 41, 59] : [0, 0, 0];
  const SIVA = uBoji ? [100, 116, 139] : [70, 70, 70];
  const SVIJETLA = uBoji ? [241, 245, 249] : [242, 242, 242];
  const BIJELA = [255, 255, 255];

  const font = (fontStil, velicina, boja) => {
    doc.setFont("LINESeedJP", fontStil);
    doc.setFontSize(velicina);
    doc.setTextColor(...boja);
  };

  // 1) Traka s naslovom
  doc.setFillColor(...AKCENT);
  doc.rect(0, 0, STRANICA_W, 42, "F");

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.22 }));
  doc.setFillColor(...BIJELA);
  sapa(doc, 178, 12, 1.3);
  sapa(doc, 193, 24, 1.7);
  sapa(doc, 176, 31, 1);
  doc.restoreGraphicsState();

  if (prijava.hitno) {
    doc.setFillColor(...BIJELA);
    doc.roundedRect(RUB, 5, 26, 8, 2, 2, "F");
    font("bold", 10, AKCENT);
    doc.text("HITNO", RUB + 13, 10.6, { align: "center" });
  }

  font("bold", 36, BIJELA);
  stisniDoSirine(doc, stil.naslov, 36, 18, 150);
  doc.text(stil.naslov, STRANICA_W / 2, 27, { align: "center" });
  font("bold", 14, BIJELA);
  doc.text(stil.podnaslov, STRANICA_W / 2, 36.5, { align: "center" });

  // 2) Fotografija
  const FY = 48;
  const FH = 82;
  doc.setFillColor(...SVIJETLA);
  doc.rect(RUB, FY, SIRINA, FH, "F");
  if (slika) {
    const omjer = Math.min(SIRINA / slika.w, FH / slika.h);
    const dw = slika.w * omjer;
    const dh = slika.h * omjer;
    doc.addImage(slika.dataUrl, "JPEG", RUB + (SIRINA - dw) / 2, FY + (FH - dh) / 2, dw, dh);
  } else {
    font("normal", 14, SIVA);
    doc.text("Nema fotografije", STRANICA_W / 2, FY + FH / 2, { align: "center" });
  }
  doc.setDrawColor(...AKCENT);
  doc.setLineWidth(0.8);
  doc.rect(RUB, FY, SIRINA, FH);

  // 3) Ime i osnovni podaci
  const imeValjano = prijava.zivotinja_ime && !/^nepoznato$/i.test(prijava.zivotinja_ime.trim());
  const ime = imeValjano ? prijava.zivotinja_ime : "Ime nepoznato";
  const fIme = stisniDoSirine(doc, ime, 34, 18, SIRINA);
  font("bold", fIme, TEKST);
  doc.text(ime, RUB, 143);

  const detalji = [
    nazivVrste,
    prijava.zivotinja_pasmina,
    prijava.zivotinja_godine ? `${prijava.zivotinja_godine} god.` : null,
    prijava.cipirana ? "čipirana" : null,
  ]
    .filter(Boolean)
    .join("  •  ");
  font("normal", 13, SIVA);
  doc.text(detalji, RUB, 151, { maxWidth: SIRINA });

  // 4) Oznake (pilule)
  let ox = RUB;
  let oy = 156;
  doc.setFont("LINESeedJP", "bold");
  doc.setFontSize(10);
  oznake.slice(0, 8).forEach((o) => {
    const w = doc.getTextWidth(o.naziv) + 8;
    if (ox + w > RUB + SIRINA) {
      ox = RUB;
      oy += 9;
    }
    if (oy > 166) return;
    if (uBoji) {
      const pozadina = hexUBoju(o.boja, [108, 117, 125]);
      const tekst = hexUBoju(o.boja_teksta, BIJELA);
      doc.setFillColor(...pozadina);
      doc.roundedRect(ox, oy, w, 7, 3.5, 3.5, "F");
      doc.setTextColor(...tekst);
    } else {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(ox, oy, w, 7, 3.5, 3.5, "S");
      doc.setTextColor(0, 0, 0);
    }
    doc.text(o.naziv, ox + w / 2, oy + 4.9, { align: "center" });
    ox += w + 3;
  });

  // 5) Lokacija i datum
  const IY = 170;
  const IH = 24;
  const lokW = 122;
  const datW = SIRINA - lokW - 4;
  doc.setDrawColor(...AKCENT);
  doc.setLineWidth(0.5);
  doc.roundedRect(RUB, IY, lokW, IH, 2, 2, "S");
  doc.roundedRect(RUB + lokW + 4, IY, datW, IH, 2, 2, "S");

  font("bold", 8, AKCENT);
  doc.text(stil.lokacija, RUB + 4, IY + 6);
  doc.text(stil.datum, RUB + lokW + 8, IY + 6);

  font("bold", 13, TEKST);
  const lokacija = prijava.lokacija?.opis || prijava.lokacija_opis || "Nepoznata lokacija";
  doc.text(skratiTekst(doc, lokacija, lokW - 8, 2), RUB + 4, IY + 13.5);
  const datum = formatirajDatum(prijava.datum).split(" u ");
  doc.text(datum[0], RUB + lokW + 8, IY + 13.5);
  font("normal", 11, TEKST);
  if (datum[1]) doc.text(`u ${datum[1]}`, RUB + lokW + 8, IY + 19.5);

  // 6) Opis
  doc.setFillColor(...AKCENT);
  doc.rect(RUB, 197.2, 5, 1, "F");
  font("bold", 8, AKCENT);
  doc.text("OPIS", RUB + 7, 199);
  font("normal", 12, TEKST);
  const opis = prijava.zivotinja_opis?.trim() || "Bez dodatnog opisa.";
  doc.text(skratiTekst(doc, opis, SIRINA, 3), RUB, 206, { lineHeightFactor: 1.35 });

  // 7) Kontakt + QR kod
  const KY = 224;
  const KH = imaTrakice ? 34 : 50;
  const QRB = 40; // širina bloka s QR kodom
  const kontaktW = qr ? SIRINA - QRB - 4 : SIRINA;
  doc.setFillColor(...AKCENT);
  doc.roundedRect(RUB, KY, kontaktW, KH, 3, 3, "F");

  if (imaTelefon) {
    font("bold", 11, BIJELA);
    doc.text(
      kontaktIme.trim() ? `${stil.kontakt}: ${kontaktIme.trim().toUpperCase()}` : stil.kontakt,
      RUB + 6,
      KY + (imaTrakice ? 10 : 15)
    );
    const f = stisniDoSirine(doc, telefon.trim(), imaTrakice ? 30 : 36, 16, kontaktW - 12);
    font("bold", f, BIJELA);
    doc.text(telefon.trim(), RUB + 6, KY + (imaTrakice ? 25 : 36));
  } else {
    font("bold", 15, BIJELA);
    doc.text("Ako imate informacija, javite se putem aplikacije PawAlert.", RUB + kontaktW / 2, KY + KH / 2 + 2, {
      align: "center",
      maxWidth: kontaktW - 12,
    });
  }

  if (qr) {
    const qx = RUB + kontaktW + 4;
    doc.setDrawColor(...AKCENT);
    doc.setLineWidth(0.8);
    doc.roundedRect(qx, KY, QRB, KH, 3, 3, "S");
    const qs = KH - 11;
    doc.addImage(qr, "PNG", qx + (QRB - qs) / 2, KY + 2, qs, qs);
    font("bold", 7, AKCENT);
    doc.text("SKENIRAJ ZA VIŠE", qx + QRB / 2, KY + KH - 3, { align: "center" });
  }

  // 8) Odrezive trakice
  if (imaTrakice) {
    const TY = 262;
    const TH = 29;
    const n = 8;
    const tw = SIRINA / n;
    doc.setDrawColor(...SIVA);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(RUB, TY, RUB + SIRINA, TY);
    for (let i = 0; i <= n; i++) doc.line(RUB + i * tw, TY, RUB + i * tw, TY + TH);
    doc.setLineDashPattern([], 0);

    const imeKratko = imeValjano ? ime : nazivVrste;
    for (let i = 0; i < n; i++) {
      const cx = RUB + i * tw + tw / 2;
      const fT = stisniDoSirine(doc, telefon.trim(), 11, 7, TH - 4);
      font("bold", fT, TEKST);
      doc.text(telefon.trim(), cx + 2.2, TY + TH - 2, { angle: 90 });
      font("normal", 7, SIVA);
      doc.text(skratiTekst(doc, imeKratko, TH - 4, 1)[0], cx - 2.4, TY + TH - 2, { angle: 90 });
    }
  }

  // 9) Podnožje
  font("normal", 7, SIVA);
  doc.text(
    `Šifra slučaja #${prijava.id ?? "-"}  •  Letak generiran u aplikaciji PawAlert  •  ${new Date().toLocaleDateString("hr-HR")}`,
    STRANICA_W / 2,
    295,
    { align: "center" }
  );

  return doc;
}

// ---------- dio koji treba browser (fontovi, slika, otvaranje) ----------

let kesFontova = null;

function blobUBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

async function dohvatiFont(ime) {
  const url = `${import.meta.env.BASE_URL}fonts/${ime}`;
  const res = await fetch(url);
  const blob = await res.blob();
  // Vite za nepostojeću datoteku vraća index.html sa statusom 200
  if (!res.ok || blob.type.includes("html") || blob.size < 10000) {
    throw new Error(`Font ${ime} nije pronađen u public/fonts.`);
  }
  return blobUBase64(blob);
}

function ucitajFontove() {
  if (!kesFontova) {
    kesFontova = Promise.all([dohvatiFont("LINESeedJP-Regular.ttf"), dohvatiFont("LINESeedJP-Bold.ttf")])
      .then(([regular, bold]) => ({ regular, bold }))
      .catch((error) => {
        kesFontova = null;
        throw error;
      });
  }
  return kesFontova;
}

function ucitajSliku(url, crnoBijelo) {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const k = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * k);
        const h = Math.round(img.naturalHeight * k);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        if (crnoBijelo) {
          const slikaPodaci = ctx.getImageData(0, 0, w, h);
          const d = slikaPodaci.data;
          for (let i = 0; i < d.length; i += 4) {
            const sivo = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            d[i] = d[i + 1] = d[i + 2] = sivo;
          }
          ctx.putImageData(slikaPodaci, 0, 0);
        }
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.85), w, h });
      } catch {
        resolve(null); // npr. slika s tuđe domene bez CORS-a
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function generirajLetak(opcije) {
  // prozor otvaramo odmah (na klik), inače ga preglednik blokira kao pop-up
  const prozor = window.open("", "_blank");
  try {
    const poveznica = window.location.origin + putanja(RouteNames.DETALJI_SLUCAJA, opcije.prijava.id);
    const [fontovi, slika, qr] = await Promise.all([
      ucitajFontove(),
      ucitajSliku(opcije.prijava.slika, !opcije.uBoji),
      QRCode.toDataURL(poveznica, { margin: 1, width: 400, errorCorrectionLevel: "M" }),
    ]);
    const doc = napraviLetak({ ...opcije, fontovi, slika, qr });
    const url = URL.createObjectURL(doc.output("blob"));
    if (prozor) {
      prozor.location.href = url;
    } else {
      doc.save(`letak-${opcije.prijava.zivotinja_ime || "zivotinja"}.pdf`);
    }
  } catch (error) {
    if (prozor) prozor.close();
    throw error;
  }
}