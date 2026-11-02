import { jsPDF } from 'jspdf';

export default function PrijavaPDFGenerator({ prijava, tragovi }) {

    const fetchFontAsBase64 = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return null;
        }
    };

    const fetchImageDetails = async (url) => {
        if (!url) return null;
        try {
            const imgSrc = url.startsWith('data:image') ? url : url;
            const response = await fetch(imgSrc, { mode: 'cors' });
            if (!response.ok) return null;
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;
                    const img = new Image();
                    img.onload = () => resolve({ base64, width: img.width, height: img.height });
                    img.onerror = () => resolve(null);
                    img.src = base64;
                };
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return null;
        }
    };

    const generirajPDF = async (isColor = true) => {
        const doc = new jsPDF();

        const [regBase64, boldBase64, rowdiesBase64, imgDetails] = await Promise.all([
            fetchFontAsBase64('/fonts/Poppins/Poppins-Regular.ttf'),
            fetchFontAsBase64('/fonts/Poppins/Poppins-Bold.ttf'),
            fetchFontAsBase64('/fonts/Rowdies/Rowdies-Bold.ttf'),
            fetchImageDetails(prijava?.slika)
        ]);

        if (regBase64 && boldBase64) {
            doc.addFileToVFS('Poppins-Regular.ttf', regBase64);
            doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
            doc.addFileToVFS('Poppins-Bold.ttf', boldBase64);
            doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
        }

        if (rowdiesBase64) {
            doc.addFileToVFS('Rowdies-Bold.ttf', rowdiesBase64);
            doc.addFont('Rowdies-Bold.ttf', 'Rowdies', 'bold');
        }

        const mainFont = doc.getFontList()['Poppins'] ? 'Poppins' : 'helvetica';
        const titleFont = doc.getFontList()['Rowdies'] ? 'Rowdies' : mainFont;

        const palette = {
            headerBg: isColor ? [200, 35, 35] : [40, 40, 40],
            headerText: [255, 255, 255],
            textPrimary: [25, 33, 43],
            textSecondary: [100, 116, 139],
            border: isColor ? [200, 35, 35] : [80, 80, 80],
            contactBg: isColor ? [200, 35, 35] : [60, 60, 60],
            badgeBg: isColor ? [217, 83, 79] : [70, 70, 70]
        };

        doc.setFillColor(...palette.headerBg);
        doc.roundedRect(15, 10, 180, 30, 3, 3, 'F');

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 15, 22, 6, 2, 2, 'F');
        doc.setFont(titleFont, 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...palette.headerBg);
        doc.text('HITNO', 31, 19, { align: 'center' });

        doc.setFont(titleFont, 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...palette.headerText);
        doc.text('NESTALA ŽIVOTINJA', 105, 22, { align: 'center' });

        doc.setFont(mainFont, 'normal');
        doc.setFontSize(8.5);
        doc.text('Pomozite nam je pronaći!', 105, 30, { align: 'center' });

        let currentY = 46;

        const boxWidth = 180;
        const boxHeight = 62;
        doc.setDrawColor(...palette.border);
        doc.setLineWidth(0.6);
        doc.roundedRect(15, currentY, boxWidth, boxHeight, 2, 2, 'S');

        if (imgDetails && imgDetails.base64) {
            try {
                const imgRatio = imgDetails.width / imgDetails.height;
                const maxW = boxWidth - 4;
                const maxH = boxHeight - 4;
                let renderW = maxW;
                let renderH = maxW / imgRatio;

                if (renderH > maxH) {
                    renderH = maxH;
                    renderW = maxH * imgRatio;
                }

                const renderX = 15 + (boxWidth - renderW) / 2;
                const renderY = currentY + (boxHeight - renderH) / 2;

                doc.addImage(imgDetails.base64, 'JPEG', renderX, renderY, renderW, renderH);
            } catch (e) {
                doc.setFont(mainFont, 'normal');
                doc.setFontSize(10);
                doc.setTextColor(...palette.textSecondary);
                doc.text('Nema fotografije', 105, currentY + 33, { align: 'center' });
            }
        } else {
            doc.setFont(mainFont, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...palette.textSecondary);
            doc.text('Nema fotografije', 105, currentY + 33, { align: 'center' });
        }

        currentY += boxHeight + 8;

        doc.setFont(titleFont, 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...palette.textPrimary);
        doc.text(prijava?.zivotinja_ime || 'Nepoznato', 15, currentY);

        currentY += 6;
        doc.setFont(mainFont, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...palette.textSecondary);
        const infoPodaci = [
            prijava?.vrsta || 'Pas',
            prijava?.pasmina || 'Mješanac',
            prijava?.starost ? `${prijava.starost}` : '',
            prijava?.cipirana ? 'čipirana' : ''
        ].filter(Boolean).join('  •  ');
        doc.text(infoPodaci, 15, currentY);

        currentY += 8;

        const oznakeList = prijava?.oznakeNazivi || ['Ogrlica', 'Družljiv'];
        let badgeX = 15;
        oznakeList.forEach(oznaka => {
            const textWidth = doc.getTextWidth(oznaka) + 8;
            doc.setFillColor(...palette.badgeBg); 
            doc.roundedRect(badgeX, currentY, textWidth, 6, 3, 3, 'F');
            doc.setFont(mainFont, 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(255, 255, 255);
            doc.text(oznaka, badgeX + (textWidth / 2), currentY + 4.1, { align: 'center' });
            badgeX += textWidth + 4;
        });

        currentY += 12;

        const cardWidth = 87;
        const cardHeight = 16;
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.roundedRect(15, currentY, cardWidth, cardHeight, 2, 2, 'S');
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...palette.textSecondary);
        doc.text('ZADNJE POZNATA LOKACIJA', 19, currentY + 5);
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...palette.textPrimary);
        const lokacijaStr = prijava?.lokacija?.opis || prijava?.lokacija_opis || 'Nepoznata lokacija';
        doc.text(lokacijaStr, 19, currentY + 12, { maxWidth: cardWidth - 8 });

        doc.roundedRect(108, currentY, cardWidth, cardHeight, 2, 2, 'S');
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...palette.textSecondary);
        doc.text('NESTALA', 112, currentY + 5);
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...palette.textPrimary);
        const datumStr = prijava?.datum 
            ? new Date(prijava.datum).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
            : '-';
        doc.text(datumStr, 112, currentY + 12);

        currentY += cardHeight + 8;

        doc.setFont(mainFont, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...palette.textPrimary);
        const opisTekst = prijava?.zivotinja_opis || 'Nema unesenog opisa.';
        const splitOpis = doc.splitTextToSize(`OPIS: ${opisTekst}`, 180);
        doc.text(splitOpis, 15, currentY);

        const contactY = 230;
        doc.setFillColor(...palette.contactBg);
        doc.roundedRect(15, contactY, 180, 22, 2, 2, 'F');
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('JAVITE SE: VLASNIK / UDRUGA', 105, contactY + 6, { align: 'center' });
        doc.setFont(mainFont, 'bold');
        doc.setFontSize(16);
        doc.text(prijava?.kontakt || prijava?.telefon || '091 234 5678', 105, contactY + 16, { align: 'center' });

        doc.setFont(mainFont, 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(150, 150, 150);
        doc.text(`Letak generiran u sustavu • ${new Date().toLocaleDateString('hr-HR')}`, 105, 275, { align: 'center' });

        doc.save(`Letak_${prijava?.zivotinja_ime || 'slucaj'}.pdf`);
    };

    return generirajPDF;
}