import saveAs from 'file-saver';
import prijaveService from '../services/prijave/prijaveService';
import VrsteService from '../services/vrste/VrsteService';
import TipService from '../services/tip/TipService';
import OznakeService from '../services/oznake/OznakeService';
import TragoviService from '../services/tragovi/TragoviService';

const toArray = (res) => {
  const data = Array.isArray(res) ? res : (res?.data ?? []);
  return Array.isArray(data) ? data : [];
};

const escapeXml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export async function izveziSveUXml() {
  try {
    // 1. Dohvaćamo osnovne šifrarnike i prijave paralelno
    const [resPrijave, resVrste, resTipovi, resOznake] = await Promise.all([
      prijaveService.get(),
      VrsteService.get(),
      TipService.get(),
      OznakeService.get(),
    ]);

    const prijave = toArray(resPrijave);
    const vrste = toArray(resVrste);
    const tipovi = toArray(resTipovi);
    const oznake = toArray(resOznake);

    // 2. Za svaku prijavu paralelno dohvaćamo njezine tragove
    const prijaveSaTragovima = await Promise.all(
      prijave.map(async (p) => {
        try {
          const resTragovi = await TragoviService.getByPrijava(p.id);
          const tragovi = toArray(resTragovi);
          return { ...p, tragovi };
        } catch (err) {
          console.error(`Greška pri dohvatu tragova za prijavu ID ${p.id}:`, err);
          return { ...p, tragovi: [] };
        }
      })
    );

    // 3. Gradimo XML dokument
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<AplikacijaBackup datumKreiranja="${new Date().toISOString()}">\n`;

    // Vrste životinja
    xml += '  <VrsteZivotinja>\n';
    vrste.forEach(v => {
      xml += `    <Vrsta id="${escapeXml(v.id)}">\n`;
      xml += `      <Naziv>${escapeXml(v.naziv)}</Naziv>\n`;
      xml += `    </Vrsta>\n`;
    });
    xml += '  </VrsteZivotinja>\n';

    // Tipovi prijave
    xml += '  <TipoviPrijava>\n';
    tipovi.forEach(t => {
      xml += `    <Tip id="${escapeXml(t.id)}">\n`;
      xml += `      <Naziv>${escapeXml(t.naziv)}</Naziv>\n`;
      xml += `    </Tip>\n`;
    });
    xml += '  </TipoviPrijava>\n';

    // Oznake
    xml += '  <Oznake>\n';
    oznake.forEach(o => {
      xml += `    <Oznaka id="${escapeXml(o.id)}">\n`;
      xml += `      <Naziv>${escapeXml(o.naziv)}</Naziv>\n`;
       xml += `      <Boja>${escapeXml(o.boja)}</Boja>\n`;
      xml += `      <BojaTeksta>${escapeXml(o.boja_teksta)}</BojaTeksta>\n`;
      xml += `    </Oznaka>\n`;
    });
    xml += '  </Oznake>\n';

    // Prijave i njihovi tragovi
    xml += '  <Prijave>\n';
    prijaveSaTragovima.forEach(p => {
      xml += `    <Prijava id="${escapeXml(p.id)}">\n`;
      xml += `      <ZivotinjaIme>${escapeXml(p.zivotinja_ime)}</ZivotinjaIme>\n`;
      xml += `      <ZivotinjaVrstaID>${escapeXml(p.zivotinja_vrsta)}</ZivotinjaVrstaID>\n`;
      xml += `      <Godine>${escapeXml(p.zivotinja_godine)}</Godine>\n`;
      xml += `      <Cipirana>${escapeXml(p.cipirana)}</Cipirana>\n`;
      xml += `      <Opis>${escapeXml(p.zivotinja_opis)}</Opis>\n`;
      xml += `      <TipPrijaveID>${escapeXml(p.tip_prijave)}</TipPrijaveID>\n`;
      xml += `      <Status>${escapeXml(p.status)}</Status>\n`;
      xml += `      <Hitno>${escapeXml(p.hitno)}</Hitno>\n`;
      xml += `      <Datum>${escapeXml(p.datum)}</Datum>\n`;
      xml += `      <LokacijaOpis>${escapeXml(p.lokacija?.opis || p.lokacija_opis)}</LokacijaOpis>\n`;
       xml += `      <Lat>${escapeXml(p.lokacija?.lat)}</Lat>\n`;
      xml += `      <Lng>${escapeXml(p.lokacija?.lng)}</Lng>\n`;

      // Ugniježđeni tragovi za ovu prijavu
      xml += '      <Tragovi>\n';
      p.tragovi.forEach(tr => {
        xml += `        <Trag id="${escapeXml(tr.id)}">\n`;
        xml += `          <Opis>${escapeXml(tr.opis || tr.naziv || tr.napomena)}</Opis>\n`;
        xml += `          <Datum>${escapeXml(tr.datum || tr.vrijeme)}</Datum>\n`;
        xml += `          <LokacijaOpis>${escapeXml(tr.lokacija?.opis || tr.lokacija_opis)}</LokacijaOpis>\n`;
        xml += `          <Lat>${escapeXml(tr.lokacija?.lat)}</Lat>\n`;
        xml += `          <Lng>${escapeXml(tr.lokacija?.lng)}</Lng>\n`;
        xml += `        </Trag>\n`;
      });
      xml += '      </Tragovi>\n';

      xml += `    </Prijava>\n`;
    });
    xml += '  </Prijave>\n';

    xml += '</AplikacijaBackup>';

    // Preuzimanje XML datoteke
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const datumDanas = new Date().toISOString().slice(0, 10);
    saveAs(blob, `aplikacija_backup_${datumDanas}.xml`);

  } catch (error) {
    console.error("Greška pri generiranju XML backupa:", error);
    alert("Došlo je do greške prilikom izvoza podataka.");
  }
}