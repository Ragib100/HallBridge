declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  export interface UserOptions {
    includeHiddenHtml?: boolean;
    useCss?: boolean;
    theme?: 'striped' | 'grid' | 'plain';
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    tableLineColor?: number | number[];
    tableLineWidth?: number;
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: { [key: string | number]: any };
    didDrawCell?: (data: any) => void;
    didDrawPage?: (data: any) => void;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    willDrawPage?: (data: any) => void;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
