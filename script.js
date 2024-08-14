document.getElementById('generate-pdf').addEventListener('click', () => {
    const recipientName = document.getElementById('recipient-name').value;
    const bill2000 = parseInt(document.getElementById('bill-2000').value) || 0;
    const bill1000 = parseInt(document.getElementById('bill-1000').value) || 0;
    const bill500 = parseInt(document.getElementById('bill-500').value) || 0;
    const coin200 = parseInt(document.getElementById('coin-200').value) || 0;
    const coin100 = parseInt(document.getElementById('coin-100').value) || 0;
    const coin50 = parseInt(document.getElementById('coin-50').value) || 0;
    const coin20 = parseInt(document.getElementById('coin-20').value) || 0;
    const coin10 = parseInt(document.getElementById('coin-10').value) || 0;
    const coin5 = parseInt(document.getElementById('coin-5').value) || 0;

    const totalAmount = (bill2000 * 2000) + (bill1000 * 1000) + (bill500 * 500) +
                        (coin200 * 200) + (coin100 * 100) + (coin50 * 50) +
                        (coin20 * 20) + (coin10 * 10) + (coin5 * 5);

    document.getElementById('total-amount').textContent = `${totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} DA`;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Ajouter le logo automatiquement
    const logoFile = 'img/ALKOGAZ_LOGO.png'; // Chemin du logo

    fetch(logoFile)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const logoData = e.target.result;
                // Ajouter le logo en haut à droite avec une taille de 50x50 px
                const margin = 10; // Marge depuis le bord droit
                const pageWidth = doc.internal.pageSize.width;
                doc.addImage(logoData, 'PNG', pageWidth - 70 - margin, margin, 60, 50); // Position et taille du logo

                // Ajouter le contenu de la facture
                addInvoiceContent(doc, date, recipientName, totalAmount, bill2000, bill1000, bill500, coin200, coin100, coin50, coin20, coin10, coin5);
            };
            reader.readAsDataURL(blob);
        });
});

function addInvoiceContent(doc, date, recipientName, totalAmount, bill2000, bill1000, bill500, coin200, coin100, coin50, coin20, coin10, coin5) {
    // Title and header
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('SARL ALCOGAZ', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Date: ${date}`, 20, 30);
    doc.text(`Reçu par: ${recipientName}`, 20, 40);

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Bordereau D\'espèces Encaissées', 20, 60);
    doc.text('Service Commercial', 20, 70);
    doc.line(20, 72, 190, 72); // Ligne horizontale

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Détails des Espèces: `, 20, 85);

    // Table header
    const tableStartY = 100;
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text(20, tableStartY, 'Type');
    doc.text(80, tableStartY, 'Nombre');
    doc.text(140, tableStartY, 'Valeur');
    doc.line(20, tableStartY + 5, 190, tableStartY + 5); // Ligne horizontale

    let currentY = tableStartY + 10;

    // Section des billets
    const billData = [
        { label: 'Billet 2000 DA', amount: bill2000, value: 2000 },
        { label: 'Billet 1000 DA', amount: bill1000, value: 1000 },
        { label: 'Billet 500 DA', amount: bill500, value: 500 },
        { label: 'Pièce 200 DA', amount: coin200, value: 200 },
        { label: 'Pièce 100 DA', amount: coin100, value: 100 },
        { label: 'Pièce 50 DA', amount: coin50, value: 50 },
        { label: 'Pièce 20 DA', amount: coin20, value: 20 },
        { label: 'Pièce 10 DA', amount: coin10, value: 10 },
        { label: 'Pièce 5 DA', amount: coin5, value: 5 }
    ];

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    billData.forEach(({ label, amount, value }) => {
        if (amount > 0) {
            doc.text(20, currentY, label);
            doc.text(80, currentY, `${amount}`);
            doc.text(140, currentY, `${(amount * value).toLocaleString('fr-FR').replace(/\s/g, '')} DA`);
            currentY += 8;
        }
    });

    // Ligne horizontale au-dessus du total
    doc.line(20, currentY + 5, 190, currentY + 5);

    // Total
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text(20, currentY + 15, 'Total Montant');
    doc.text(140, currentY + 15, `${totalAmount.toLocaleString('fr-FR').replace(/\s/g, '')} DA`);
    
    // Ligne horizontale sous le total
    doc.line(20, currentY + 20, 190, currentY + 20);

    // Résumé et signature
    currentY += 30;
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.text(20, currentY, `Je soussigné(e) ${recipientName},`);
    currentY += 7;
    doc.text(20, currentY, `certifie avoir reçu la somme totale de ${totalAmount.toLocaleString('fr-FR').replace(/\s/g, '')} DA.`);
    currentY += 7;

    let billDetails = '';
    if (bill2000 > 0) billDetails += `${bill2000} billet(s) de 2000 DA, `;
    if (bill1000 > 0) billDetails += `${bill1000} billet(s) de 1000 DA, `;
    if (bill500 > 0) billDetails += `${bill500} billet(s) de 500 DA, `;
    if (coin200 > 0) billDetails += `${coin200} pièce(s) de 200 DA, `;
    if (coin100 > 0) billDetails += `${coin100} pièce(s) de 100 DA, `;
    if (coin50 > 0) billDetails += `${coin50} pièce(s) de 50 DA, `;
    if (coin20 > 0) billDetails += `${coin20} pièce(s) de 20 DA, `;
    if (coin10 > 0) billDetails += `${coin10} pièce(s) de 10 DA, `;
    if (coin5 > 0) billDetails += `${coin5} pièce(s) de 5 DA`;

    // Removing trailing comma and space
    billDetails = billDetails.replace(/, $/, '');

    // Wrap text to fit within PDF margins
    const wrappedText = doc.splitTextToSize(`Détails suivants : ${billDetails}.`, 170); // 170 is the maximum width for text on the page

    // Add wrapped text to PDF
    wrappedText.forEach((line, index) => {
        doc.text(20, currentY + (index * 7), line);
    });

    currentY += (wrappedText.length * 7) + 10;
    
    doc.text(20, currentY, `Date : ${date}`);
    currentY += 7;
    doc.text(20, currentY, `Signature : ________________________`);

    const fileName = `Bordereau_D\'espèces_Encaissées_${date.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
}


