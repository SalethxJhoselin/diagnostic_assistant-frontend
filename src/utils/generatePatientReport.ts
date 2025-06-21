import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PatientHistory } from '@/services/consultations.services';


export const generatePatientReport = (patientHistory: PatientHistory) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Función para dibujar un rectángulo redondeado
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        doc.setDrawColor(101, 93, 255);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, width, height, radius, radius);
    };

    // Encabezado con logo y fondo degradado
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Logo o ícono en el encabezado
    doc.setFillColor(255, 255, 255);
    // doc.circle(pageWidth / 2, 25, 15, 'F');
    doc.setFillColor(101, 93, 255);
    doc.circle(pageWidth / 2, 25, 12, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial Médico', pageWidth / 2, 25, { align: 'center' });
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el ${new Date().toLocaleDateString()}`, pageWidth - 20, 15, { align: 'right' });
    
    // Información del Paciente
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Información Personal', 20, 70);
    
    // Línea decorativa
    doc.setDrawColor(101, 93, 255);
    doc.setLineWidth(2);
    doc.line(20, 75, pageWidth - 20, 75);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const patientInfo = [
        ['Nombre Completo:', `${patientHistory.patient.name} ${patientHistory.patient.aPaternal} ${patientHistory.patient.aMaternal}`],
        ['Identificación:', patientHistory.patient.ci.toString()],
        ['Sexo:', patientHistory.patient.sexo === 'F' ? 'Femenino' : 'Masculino'],
        ['Fecha de Nacimiento:', new Date(patientHistory.patient.birthDate).toLocaleDateString()],
        ['Teléfono:', patientHistory.patient.phone.toString()],
        ['Email:', patientHistory.patient.email]
    ];
    
    autoTable(doc, {
        startY: 85,
        head: [['Campo', 'Valor']],
        body: patientInfo,
        theme: 'grid',
        headStyles: { 
            fillColor: [101, 93, 255],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: { 
            fontSize: 11,
            cellPadding: 8,
            lineColor: [101, 93, 255],
            lineWidth: 0.1
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 }
    });

    // Historial de Consultas
    let yPos = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial de Consultas', 20, yPos);
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    yPos += 15;

    patientHistory.consultations.forEach((consultation) => {
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = 20;
        }

        // Fondo para cada consulta
        drawRoundedRect(15, yPos - 5, pageWidth - 30, 0, 3);

        doc.setFontSize(16);
        doc.setTextColor(101, 93, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`Consulta del ${new Date(consultation.consultationDate).toLocaleDateString()}`, 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const consultationInfo = [
            ['Doctor:', consultation.user.email],
            ['Motivo:', consultation.motivo],
            ['Observaciones:', consultation.observaciones]
        ];

        autoTable(doc, {
            startY: yPos,
            body: consultationInfo,
            theme: 'grid',
            styles: { 
                fontSize: 11,
                cellPadding: 8,
                lineColor: [101, 93, 255],
                lineWidth: 0.1
            },
            headStyles: { 
                fillColor: [101, 93, 255],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            margin: { left: 20, right: 20 }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;

        // Diagnósticos
        if (consultation.diagnoses.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(101, 93, 255);
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnósticos:', 20, yPos);
            yPos += 10;

            const diagnosesData = consultation.diagnoses.map(({ diagnosis }) => [
                diagnosis.name,
                diagnosis.description
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Diagnóstico', 'Descripción']],
                body: diagnosesData,
                theme: 'grid',
                headStyles: { 
                    fillColor: [101, 93, 255],
                    textColor: [255, 255, 255],
                    halign: 'center'
                },
                styles: { 
                    fontSize: 11,
                    cellPadding: 8,
                    lineColor: [101, 93, 255],
                    lineWidth: 0.1
                },
                margin: { left: 20, right: 20 }
            });

            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Tratamientos
        if (consultation.treatments.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(101, 93, 255);
            doc.setFont('helvetica', 'bold');
            doc.text('Tratamientos:', 20, yPos);
            yPos += 10;

            const treatmentsData = consultation.treatments.map(({ treatment }) => [
                treatment.description,
                treatment.duration,
                treatment.instructions
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Tratamiento', 'Duración', 'Instrucciones']],
                body: treatmentsData,
                theme: 'grid',
                headStyles: { 
                    fillColor: [101, 93, 255],
                    textColor: [255, 255, 255],
                    halign: 'center'
                },
                styles: { 
                    fontSize: 11,
                    cellPadding: 8,
                    lineColor: [101, 93, 255],
                    lineWidth: 0.1
                },
                margin: { left: 20, right: 20 }
            });

            yPos = (doc as any).lastAutoTable.finalY + 20;
        }
    });

    // Pie de página
    const totalPages = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Línea decorativa
        doc.setDrawColor(101, 93, 255);
        doc.setLineWidth(0.5);
        doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
        
        // Número de página
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    return doc;
}; 