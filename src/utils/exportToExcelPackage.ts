// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcelPackage<T>(
  rows: T[],
  fileName = "package.xlsx",
  sheetName = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 20 }, // Sr No
    { wch: 15 }, // Booking ID
    { wch: 25 }, // Package
    { wch: 15 }, // Date Of Scuba
    { wch: 15 }, // Location
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, sheetName);

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
}
