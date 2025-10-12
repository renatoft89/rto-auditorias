import { useState, useCallback } from "react";
import html2pdf from "html2pdf.js";

const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportToPDF = useCallback(async (elementId, filename = "relatorio.pdf") => {
    setIsExporting(true);
    setExportError(null);

    const element = document.getElementById(elementId);
    if (!element) {
      setExportError("Elemento não encontrado para exportar.");
      setIsExporting(false);
      return;
    }

    try {
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true
        },
        jsPDF: { unit: "mm", format: "a3", orientation: "landscape" },
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      await html2pdf().set(opt).from(element).save();

    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
      setExportError(err.message);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportToPDF, isExporting, exportError };
};

export default usePdfExport;