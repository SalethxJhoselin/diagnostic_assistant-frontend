import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Organization } from "@/lib/interfaces";
import type { PatientHistory } from '@/services/consultations.services';
import logo from '@/assets/logo.png'

export const generatePatientReport = (patientHistory: PatientHistory, organization:Organization, dateFilter?: { startDate: string, endDate: string }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    //--------aqui se puede cambiar los colores--------------------
    const azul: [number, number, number] = [44, 62, 80]; // Azul institucional
    const lila: [number, number, number] = [112, 108, 252];
    const gris: [number, number, number] = [245, 247, 250];
    const grisOscuro: [number, number, number] = [100, 100, 100];
    const margen = 18;

    // Encabezado profesional
    const drawHeader = () => {
        doc.setFillColor(...lila);
        doc.rect(0, 0, pageWidth, 38, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(`${organization?.name}`, margen, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Reporte de Historial Médico', margen, 28);
        
        // Mostrar información del filtro de fecha si está presente
        if (dateFilter) {
            doc.setFontSize(9);
            doc.text(`Filtrado: ${dateFilter.startDate} - ${dateFilter.endDate}`, margen, 34);
        }
        
        // Espacio para logo a la derecha
        doc.addImage(logo, 'PNG', pageWidth - 38, 8, 24, 24);
    };

    const drawHeaderFondo = () => {
        doc.setFillColor(...lila);
        doc.rect(0, 0, pageWidth, 38, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(`${organization?.name}`, margen, 18);
        doc.addImage(logo, 'PNG', pageWidth - 38, 8, 24, 24);
    };

    // Pie de página profesional
    const drawFooter = (pageNum: number, totalPages: number) => {
        doc.setDrawColor(...lila);
        doc.setLineWidth(0.5);
        doc.line(margen, pageHeight - 18, pageWidth - margen, pageHeight - 18);
        doc.setFontSize(9);
        doc.setTextColor(...grisOscuro);
        doc.text(
            `Página ${pageNum} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
        doc.text(
            `Generado el ${new Date().toLocaleDateString()}`,
            pageWidth - margen,
            pageHeight - 10,
            { align: 'right' }
        );
    };

    drawHeader();

    // Información del Paciente
    let y = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...lila);
    doc.text('Datos del Paciente', margen, y);
    y += 6;
    doc.setDrawColor(...lila);
    doc.setLineWidth(1);
    doc.line(margen, y, pageWidth - margen, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    const datos = [
        ['Nombre Completo', `${patientHistory.patient.name} ${patientHistory.patient.aPaternal} ${patientHistory.patient.aMaternal}`],
        ['Identificación', patientHistory.patient.ci.toString()],
        ['Sexo', patientHistory.patient.sexo === 'F' ? 'Femenino' : 'Masculino'],
        ['Fecha de Nacimiento', new Date(patientHistory.patient.birthDate).toLocaleDateString()],
        ['Teléfono', patientHistory.patient.phone.toString()],
        ['Email', patientHistory.patient.email],
        ['Tipo de Sangre', patientHistory.patient.bloodType || 'No registrado'],
        ['Enfermedades Crónicas', Array.isArray(patientHistory.patient.chronicDiseases) ? patientHistory.patient.chronicDiseases.join(', ') : patientHistory.patient.chronicDiseases || 'Ninguna'],
        ['Alergias', Array.isArray(patientHistory.patient.allergies) ? patientHistory.patient.allergies.join(', ') : patientHistory.patient.allergies || 'Ninguna'],
    ];

    autoTable(doc, {
        startY: y,
        body: datos,
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 3,
            textColor: [30, 30, 30],
        },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: azul },
            1: { cellWidth: 110 },
        },
        alternateRowStyles: { fillColor: gris },
        margin: { left: margen, right: margen },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Historial de Consultas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...lila);
    doc.text('Historial de Consultas', margen, y);
    y += 6;
    doc.setDrawColor(...lila);
    doc.setLineWidth(1);
    doc.line(margen, y, pageWidth - margen, y);
    y += 4;

    patientHistory.consultations.forEach((consulta, idx) => {
        if (y > pageHeight - 60) {
            doc.addPage();
            drawHeaderFondo();
            y = 48;
        }
        // Tarjeta visual para cada consulta
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...lila);
        doc.setLineWidth(0.7);
        doc.roundedRect(margen, y, pageWidth - 2 * margen, 44, 4, 4, 'D');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...lila);
        doc.text(`Consulta del ${new Date(consulta.consultationDate).toLocaleDateString()}`, margen + 4, y + 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(30, 30, 30);
        doc.text(`Doctor: ${consulta.user.email}`, margen + 4, y + 16);
        doc.text(`Motivo: ${consulta.motivo}`, margen + 4, y + 24);
        doc.text(`Observaciones: ${consulta.observaciones}`, margen + 4, y + 32);
        y += 48;

        // Diagnósticos
        if (consulta.diagnoses.length > 0) {
            if (y > pageHeight - 60) {
                doc.addPage();
                drawHeaderFondo();
                y = 48;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(...lila);
            doc.text('Diagnósticos:', margen + 4, y);
            y += 4;
            const diagData = consulta.diagnoses.map(({ diagnosis }) => [diagnosis.name, diagnosis.description]);
            autoTable(doc, {
                startY: y,
                head: [['Diagnóstico', 'Descripción']],
                body: diagData,
                theme: 'grid',
                headStyles: {
                    fillColor: lila,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 11,
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    lineColor: lila,
                    lineWidth: 0.1,
                },
                margin: { left: margen, right: margen },
            });
            y = (doc as any).lastAutoTable.finalY + 4;
        }

        // Tratamientos
        if (consulta.treatments.length > 0) {
            if (y > pageHeight - 60) {
                doc.addPage();
                drawHeaderFondo();
                y = 48;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(...lila);
            doc.text('Tratamientos:', margen + 4, y);
            y += 4;
            const treatData = consulta.treatments.map(({ treatment }) => [treatment.description, treatment.duration, treatment.instructions]);
            autoTable(doc, {
                startY: y,
                head: [['Tratamiento', 'Duración', 'Instrucciones']],
                body: treatData,
                theme: 'grid',
                headStyles: {
                    fillColor: lila,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 11,
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    lineColor: lila,
                    lineWidth: 0.1,
                },
                margin: { left: margen, right: margen },
            });
            y = (doc as any).lastAutoTable.finalY + 4;
        }
        y += 4;
    });

    // Pie de página en todas las páginas
    const totalPages = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(i, totalPages);
    }

    return doc;
}; 