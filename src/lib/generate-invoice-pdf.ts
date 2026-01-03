import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Bill {
    seatrent: number;
    messbill: number;
    othercharges: number;
}

interface Invoice {
    invoice_id: string;
    month: string;
    billinfo: Bill;
    amount: number;
    media?: "Bkash" | "Nagad" | "Rocket" | "Card";
}

interface StudentInfo {
    name?: string;
    studentId?: string;
    hallName?: string;
    roomNo?: string;
}

export const generateInvoicePDF = (
    invoice: Invoice,
    dueDate: string,
    studentInfo?: StudentInfo
) => {
    const doc = new jsPDF();
    
    // Set fonts
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    
    // Header
    doc.text('HallBridge', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Invoice', 105, 30, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const startY = 45;
    
    // Left column - Student Info
    if (studentInfo) {
        doc.setFont('helvetica', 'bold');
        doc.text('Student Information:', 20, startY);
        doc.setFont('helvetica', 'normal');
        
        if (studentInfo.name) {
            doc.text(`Name: ${studentInfo.name}`, 20, startY + 7);
        }
        if (studentInfo.studentId) {
            doc.text(`Student ID: ${studentInfo.studentId}`, 20, startY + 14);
        }
        if (studentInfo.hallName) {
            doc.text(`Hall: ${studentInfo.hallName}`, 20, startY + 21);
        }
        if (studentInfo.roomNo) {
            doc.text(`Room No: ${studentInfo.roomNo}`, 20, startY + 28);
        }
    }
    
    // Right column - Invoice Info
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', 120, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice ID: ${invoice.invoice_id}`, 120, startY + 7);
    doc.text(`Month: ${invoice.month}`, 120, startY + 14);
    doc.text(`Due Date: ${dueDate}`, 120, startY + 21);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 120, startY + 28);
    
    // Billing breakdown table
    const tableStartY = startY + 45;
    
    // Prepare table data
    const tableData: any[] = [];
    
    Object.entries(invoice.billinfo).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        tableData.push([label, `Taka ${value.toFixed(2)}`]);
    });
    
    // Add total row
    tableData.push(['Total Amount', `Taka ${invoice.amount.toFixed(2)}`]);
    
    autoTable(doc, {
        startY: tableStartY,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [100, 157, 250],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            textColor: 50
        },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { halign: 'right', cellWidth: 40 }
        },
        didParseCell: function(data) {
            // Make the last row (total) bold
            if (data.row.index === tableData.length - 1 && data.section === 'body') {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [240, 240, 240];
                data.cell.styles.fontSize = 12;
            }
        }
    });
    
    // Payment status
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    if (invoice.media) {
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Method:', 20, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.media, 60, finalY);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 128, 0);
        doc.text('Status: PAID', 20, finalY + 10);
        doc.setTextColor(0, 0, 0);
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0);
        doc.text('Status: UNPAID', 20, finalY);
        doc.setTextColor(0, 0, 0);
    }
    
    // Save the PDF
    doc.save(`Invoice_${invoice.invoice_id}.pdf`);
    
    return doc;
};

export const generateInvoicePDFBlob = (
    invoice: Invoice,
    dueDate: string,
    studentInfo?: StudentInfo
): Blob => {
    const doc = new jsPDF();
    
    // Same PDF generation code as above
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('HallBridge', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Invoice', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const startY = 45;
    
    if (studentInfo) {
        doc.setFont('helvetica', 'bold');
        doc.text('Student Information:', 20, startY);
        doc.setFont('helvetica', 'normal');
        
        if (studentInfo.name) doc.text(`Name: ${studentInfo.name}`, 20, startY + 7);
        if (studentInfo.studentId) doc.text(`Student ID: ${studentInfo.studentId}`, 20, startY + 14);
        if (studentInfo.hallName) doc.text(`Hall: ${studentInfo.hallName}`, 20, startY + 21);
        if (studentInfo.roomNo) doc.text(`Room No: ${studentInfo.roomNo}`, 20, startY + 28);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', 120, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice ID: ${invoice.invoice_id}`, 120, startY + 7);
    doc.text(`Month: ${invoice.month}`, 120, startY + 14);
    doc.text(`Due Date: ${dueDate}`, 120, startY + 21);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 120, startY + 28);
    
    const tableStartY = startY + 45;
    const tableData: any[] = [];
    
    Object.entries(invoice.billinfo).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        tableData.push([label, `Taka ${value.toFixed(2)}`]);
    });
    
    tableData.push(['Total Amount', `Taka ${invoice.amount.toFixed(2)}`]);
    
    autoTable(doc, {
        startY: tableStartY,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [100, 157, 250],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            textColor: 50
        },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { halign: 'right', cellWidth: 40 }
        },
        didParseCell: function(data) {
            if (data.row.index === tableData.length - 1 && data.section === 'body') {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [240, 240, 240];
                data.cell.styles.fontSize = 12;
            }
        }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    if (invoice.media) {
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Method:', 20, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.media, 60, finalY);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 128, 0);
        doc.text('Status: PAID', 20, finalY + 10);
        doc.setTextColor(0, 0, 0);
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0);
        doc.text('Status: UNPAID', 20, finalY);
        doc.setTextColor(0, 0, 0);
    }
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your payment!', 105, 280, { align: 'center' });
    doc.text('For any queries, please contact the hall administration.', 105, 285, { align: 'center' });
    
    return doc.output('blob');
};
