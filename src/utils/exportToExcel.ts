// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel<T>(
  rows: T[],
  fileName = "booking.xlsx",
  sheetName = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 8 }, // Sr No
    { wch: 15 }, // Booking ID
    { wch: 25 }, // Package
    { wch: 15 }, // Date Of Scuba
    { wch: 15 }, // Location
    { wch: 20 }, // Customer Name
    { wch: 20 }, // Customer Gender
    { wch: 20 }, // Customer Age
    { wch: 20 }, // Customer Email
    { wch: 20 }, // Customer No
    { wch: 25 }, // Number Of Participants
    { wch: 25 }, // Customer Apply Coupon
    { wch: 10 }, // Price
    { wch: 15 }, // Slot Time
    { wch: 15 }, // Booking Status
    { wch: 30 }, // Is Booking From Admin
    { wch: 20 }, // Is Booking From Admin
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, sheetName);

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
}
