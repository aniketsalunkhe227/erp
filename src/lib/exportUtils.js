import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data, fileName, columns) => {
  const doc = new jsPDF();
  
  // Prepare headers
  const headers = columns.map(col => col.label);
  
  // Prepare data
  const rows = data.map(item => {
    return columns.map(col => {
      return col.render ? col.render(item[col.key], item) : item[col.key];
    });
  });

  // Add table to PDF
  doc.autoTable({
    head: [headers],
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    margin: { top: 10 },
  });

  doc.save(`${fileName}.pdf`);
};