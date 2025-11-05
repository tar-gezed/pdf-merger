import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfMergerService } from './services/pdf-merger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  private pdfMergerService = inject(PdfMergerService);

  currentYear = new Date().getFullYear();
  files = signal<File[]>([]);
  isMerging = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isDraggingOver = signal<boolean>(false);

  private draggedItemIndex: number | null = null;

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
    // Reset file input to allow selecting the same file again
    input.value = '';
  }

  addFiles(newFiles: File[]): void {
    this.errorMessage.set(null);
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== newFiles.length) {
      this.errorMessage.set('Some files were not PDFs and have been ignored.');
    }

    if (pdfFiles.length > 0) {
      this.files.update(currentFiles => [...currentFiles, ...pdfFiles]);
    }
  }

  removeFile(indexToRemove: number): void {
    this.files.update(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
  }
  
  clearFiles(): void {
    this.files.set([]);
    this.errorMessage.set(null);
  }

  async mergeAndDownload(): Promise<void> {
    if (this.files().length < 2) {
      this.errorMessage.set('You need at least two PDF files to merge.');
      return;
    }

    this.isMerging.set(true);
    this.errorMessage.set(null);

    try {
      const mergedPdfBytes = await this.pdfMergerService.mergePdfs(this.files());
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      this.clearFiles();

    } catch (error: any) {
      this.errorMessage.set(error.message || 'An unexpected error occurred during merging.');
    } finally {
      this.isMerging.set(false);
    }
  }

  // --- Drag and Drop Handlers ---

  handleDragStart(event: DragEvent, index: number): void {
    this.draggedItemIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
    if (event.target instanceof HTMLElement) {
       event.target.classList.add('opacity-50');
    }
  }
  
  handleDragEnd(event: DragEvent): void {
    if (event.target instanceof HTMLElement) {
       event.target.classList.remove('opacity-50');
    }
    this.draggedItemIndex = null;
  }

  handleDragEnter(event: DragEvent): void {
     event.preventDefault();
     this.isDraggingOver.set(true);
  }

  handleDragLeave(event: DragEvent): void {
    // Check if we are leaving the main drop zone container
    const relatedTarget = event.relatedTarget as Node;
    const currentTarget = event.currentTarget as Node;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
       this.isDraggingOver.set(false);
    }
  }
  
  handleDragOver(event: DragEvent): void {
    event.preventDefault(); // Necessary to allow dropping
  }

  handleDropOnList(event: DragEvent, toIndex: number): void {
    event.preventDefault();
    if (this.draggedItemIndex === null) return;
    
    const fromIndex = this.draggedItemIndex;

    if (fromIndex !== toIndex) {
      this.files.update(currentFiles => {
        const reorderedFiles = [...currentFiles];
        const [movedItem] = reorderedFiles.splice(fromIndex, 1);
        reorderedFiles.splice(toIndex, 0, movedItem);
        return reorderedFiles;
      });
    }
  }

  handleDropOnZone(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver.set(false);
    
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  // Utility to format file size
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
