
import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfMergerService {

  async mergePdfs(files: File[]): Promise<Uint8Array> {
    if (files.length < 2) {
      throw new Error('Please select at least two PDF files to merge.');
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        console.error(`Failed to process file: ${file.name}`, error);
        throw new Error(`Could not process "${file.name}". It might be corrupted or not a valid PDF.`);
      }
    }

    return mergedPdf.save();
  }
}
