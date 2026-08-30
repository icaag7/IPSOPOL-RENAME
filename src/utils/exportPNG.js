import html2canvas from 'html2canvas';

/**
 * Exporta un nodo del DOM (por id) a una imagen PNG de alta
 * resolución y dispara la descarga en el navegador.
 */
export async function exportElementToPNG(elementId, fileName = 'ipsopol-dashboard.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No se encontró el elemento con id "${elementId}" para exportar.`);
  }

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
