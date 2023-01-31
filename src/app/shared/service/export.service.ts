import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';

declare let jsPDF;
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const PDF_EXTENSION = '.pdf';

@Injectable({ providedIn: 'root' })
export class ExportService {

  constructor(private datePipe: DatePipe) { }

  public exportAsExcelFile(json: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const buffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + this.datePipe.transform(new Date(), 'dd_MM_yyyy_HH_mm_ss') + EXCEL_EXTENSION);
  }

  public exportAsPdfFile(head: any[], body: any[], fileName: string, title: string): void {
    const pdf = new jsPDF();
    pdf.autoTable({
      head: [head],
      body: body,
      styles: {
        fontSize: 6
      },
      margin: { top: 30 },
      didDrawPage: function (data) {
        pdf.setFontSize(12);
        pdf.setTextColor(40);
        pdf.setFontStyle('normal');
        pdf.text((title ? title : 'Carbon'), data.settings.margin.left, 22);
      }
    });
    pdf.save(fileName + '_export_' + this.datePipe.transform(new Date(), 'dd_MM_yyyy_HH_mm_ss') + PDF_EXTENSION);
  }

  public htmlToPdf(content: any, fileName: string) {
    const config = {
      filename: fileName,
      margin: [10, 5, 5, 5],
      html2canvas: {
        scale: 1,
        scrollX: 0,
        scrollY: 0,
      },
      pagebreak: { mode: 'avoid-all' },
    
    };

    html2pdf()
      .set(config)
      .from(content)
      .toPdf()
      .save();

  }
}
