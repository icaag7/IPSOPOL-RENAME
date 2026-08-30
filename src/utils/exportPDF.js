import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exporta un nodo del DOM (por id) a un PDF tamaño A4, en alta
 * calidad, paginando verticalmente si el contenido es más alto
 * que una página.
 */
export async function exportElementToPDF(elementId, fileName = 'ipsopol-dashboard.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No se encontró el elemento con id "${elementId}" para exportar.`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}
