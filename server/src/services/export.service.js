const XLSX = require('xlsx');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

const generateResultPDF = (student, exam, results) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('REUX Platform - Result Card', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Student Name: ${student.name}`, 20, 40);
  doc.text(`Exam: ${exam.title}`, 20, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

  const tableData = results.map(r => [
    r.questionText,
    r.overallScore,
    r.maxMarks,
    r.feedback
  ]);

  doc.autoTable({
    startY: 70,
    head: [['Question', 'Score', 'Max Marks', 'Feedback']],
    body: tableData,
  });

  return doc.output('arraybuffer');
};

module.exports = { exportToExcel, generateResultPDF };
