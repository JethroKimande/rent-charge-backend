const { PDFDocument } = require('pdf-lib');

const generatePDF = async (data, type) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();
  const fontSize = 12;

  page.drawText(`${type} Details`, { x: 50, y: height - 50, size: 20 });
  page.drawText(JSON.stringify(data, null, 2), { x: 50, y: height - 100, size: fontSize });

  return await pdfDoc.save();
};

module.exports = { generatePDF };