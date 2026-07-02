"use client";

// مصدّر Excel (.xlsx) منمّق ومشترك لكل جداول لوحة التحكّم.
// ترويسة بلون البراند + حدود + تظليل صفوف متبادل + اتجاه RTL + تجميد الترويسة.
// exceljs يُحمَّل عند الضغط فقط (dynamic import) فلا يثقّل الحزمة.

export type SheetColumn = {
  header: string;
  width?: number;
  link?: boolean; // اعرض الخلية كرابط قابل للضغط (القيمة = رابط الملف)
  date?: boolean; // قيمة تاريخ/وقت — تُقرأ LTR حتى لا تتلخبط الأرقام مع النص العربي
};

export async function exportSheet(opts: {
  filename: string; // بدون امتداد
  sheetName: string;
  columns: SheetColumn[];
  rows: string[][]; // كل صف = مصفوفة قيم نصّية بترتيب الأعمدة
}) {
  const mod = await import("exceljs");
  const ExcelJS = (mod as unknown as { default?: typeof mod }).default ?? mod;

  const wb = new ExcelJS.Workbook();
  wb.creator = "مركز عبور — لوحة التحكّم";
  const ws = wb.addWorksheet(opts.sheetName, {
    views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }],
  });

  const thin = {
    top: { style: "thin" as const, color: { argb: "FFDDE7E9" } },
    bottom: { style: "thin" as const, color: { argb: "FFDDE7E9" } },
    left: { style: "thin" as const, color: { argb: "FFDDE7E9" } },
    right: { style: "thin" as const, color: { argb: "FFDDE7E9" } },
  };

  ws.columns = opts.columns.map((c) => ({ header: c.header, width: c.width ?? 22 }));

  // الترويسة
  const header = ws.getRow(1);
  header.height = 28;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0E6C73" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = thin;
  });

  // الصفوف — كل الخلايا موسّطة (justify)؛ التاريخ يُقرأ LTR
  opts.rows.forEach((r, i) => {
    const row = ws.addRow(r);
    row.height = 20;
    row.eachCell((cell, colNumber) => {
      const col = opts.columns[colNumber - 1];
      cell.alignment = { vertical: "middle", horizontal: "center", readingOrder: col?.date ? "ltr" : "rtl" };
      cell.border = thin;
      if (i % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F9FA" } };
      }
      const val = cell.value == null ? "" : String(cell.value);
      if (col?.link && val) {
        cell.value = { text: "فتح الملف ↗", hyperlink: val };
        cell.font = { color: { argb: "FF0F6C73" }, underline: true, bold: true };
      }
    });
  });

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${opts.filename}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
