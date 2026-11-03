import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx';
import { saveAs } from 'file-saver';

export const generirajPrijaveWord = async (prijave = [], vrste = [], tipovi = [], oznake = []) => {
    if (!prijave || prijave.length === 0) {
        alert("Nema prijava za izvoz.");
        return;
    }

    const getNazivVrste = (id) => vrste.find((v) => Number(v.id) === Number(id))?.naziv ?? "-";
    const getNazivTipa = (id) => tipovi.find((t) => Number(t.id) === Number(id))?.naziv ?? "-";

    const docChildren = [];

    prijave.forEach((prijava, index) => {
        const imeValjano = prijava.zivotinja_ime && !/^nepoznato$/i.test(prijava.zivotinja_ime.trim());
        const ime = imeValjano ? prijava.zivotinja_ime : "NEPOZNATO IME";

        const vrstaNaziv = getNazivVrste(prijava.zivotinja_vrsta || prijava.vrsta);
        const tipNaziv = getNazivTipa(prijava.tip_prijave || prijava.tip);

        const oznakeIDs = prijava.oznake ?? (
            prijava.oznaka_id != null ? [prijava.oznaka_id] : (prijava.oznaka != null ? [prijava.oznaka] : [])
        );
        const naziviOznaka = oznakeIDs
            .map(id => oznake.find(o => Number(o.id) === Number(typeof id === 'object' ? id.id : id))?.naziv)
            .filter(Boolean)
            .join(', ');

        const datumStr = prijava.datum 
            ? new Date(prijava.datum).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Nepoznato';

        const lokacijaStr = prijava.lokacija?.opis || prijava.lokacija_opis || 'Nepoznata lokacija';

        docChildren.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `ZAPISNIK SLUČAJA #${prijava.id || (index + 1)}: ${ime.toUpperCase()}`,
                        bold: true,
                        size: 32,
                        color: prijava.hitno ? "B91C1C" : "1E293B"
                    }),
                    ...(prijava.hitno ? [
                        new TextRun({
                            text: "  [HITNO]",
                            bold: true,
                            size: 26,
                            color: "B91C1C"
                        })
                    ] : [])
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 100, after: 300 }
            })
        );

        const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                stvoriZaglavljeTablice("SVOJSTVO / ATRIBUT", "PODATAK O PRIJAVI"),
                stvoriRedakTablice('Ime životinje', ime),
                stvoriRedakTablice('Tip prijave', tipNaziv),
                stvoriRedakTablice('Vrsta', vrstaNaziv),
                stvoriRedakTablice('Starost / Godine', prijava.zivotinja_godine ? `${prijava.zivotinja_godine} god.` : (prijava.starost ? `${prijava.starost}` : '-')),
                stvoriRedakTablice('Čipirana', prijava.cipirana ? 'Da' : 'Ne'),
                stvoriRedakTablice('Hitno', prijava.hitno ? 'Da' : 'Ne'),
                stvoriRedakTablice('Oznake', naziviOznaka || '-'),
                stvoriRedakTablice('Datum i vrijeme', datumStr),
                stvoriRedakTablice('Lokacija', lokacijaStr),
                stvoriRedakTablice('Opis', prijava.zivotinja_opis || prijava.opis || 'Bez dodatnog opisa.')
            ]
        });

        docChildren.push(table);

        if (index < prijave.length - 1) {
            docChildren.push(new Paragraph({ children: [new PageBreak()] }));
        }
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: docChildren
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Katalog_Prijava_${new Date().toISOString().slice(0, 10)}.docx`);
};

function stvoriZaglavljeTablice(kol1, kol2) {
    return new TableRow({
        tableHeader: true,
        children: [
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                shading: { fill: "1E293B", type: ShadingType.CLEAR, color: "auto" },
                children: [
                    new Paragraph({ 
                        children: [new TextRun({ text: kol1, bold: true, size: 22, color: "FFFFFF" })],
                        spacing: { before: 160, after: 160 }
                    })
                ],
                margins: { top: 160, bottom: 160, left: 180, right: 180 }
            }),
            new TableCell({
                width: { size: 65, type: WidthType.PERCENTAGE },
                shading: { fill: "1E293B", type: ShadingType.CLEAR, color: "auto" },
                children: [
                    new Paragraph({ 
                        children: [new TextRun({ text: kol2, bold: true, size: 22, color: "FFFFFF" })],
                        spacing: { before: 160, after: 160 }
                    })
                ],
                margins: { top: 160, bottom: 160, left: 180, right: 180 }
            })
        ]
    });
}

function stvoriRedakTablice(label, value) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({ 
                        children: [new TextRun({ text: label, bold: true, size: 22, color: "334155" })],
                        spacing: { before: 140, after: 140 }
                    })
                ],
                margins: { top: 140, bottom: 140, left: 180, right: 180 },
                borders: {
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" }
                }
            }),
            new TableCell({
                width: { size: 65, type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({ 
                        children: [new TextRun({ text: String(value), size: 22, color: "0F172A" })],
                        spacing: { before: 140, after: 140 }
                    })
                ],
                margins: { top: 140, bottom: 140, left: 180, right: 180 },
                borders: {
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" }
                }
            })
        ]
    });
}