import { useState, useCallback } from "react";
import html2pdf from "html2pdf.js";

const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportToPDF = useCallback(async (elementId, filename = "relatorio.pdf") => {
    setIsExporting(true);
    setExportError(null);

    try {
      const element = document.getElementById(elementId);

      if (!element) {
        throw new Error("Elemento não encontrado para exportar.");
      }

      // Ajusta a largura pro tamanho de A4 landscape (~1600px)
      const originalWidth = element.style.width;
      element.style.width = "1490px";

      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: "mm", format: [420, 297], orientation: "landscape" }
      };

      // espera renderização dos gráficos (Chart.js precisa desse delay)
      await new Promise(resolve => setTimeout(resolve, 1500));

      await html2pdf().set(opt).from(element).save();

      // restaura largura original
      element.style.width = originalWidth;
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
