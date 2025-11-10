import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);


const getBackgroundColor = (value) => {
  if (value === null) return '#999999';
  if (value >= 80) return '#1ca41c';
  if (value >= 50) return '#f2c037';
  return '#dc3545';
};

const getTextColor = (value) => {
  if (value === null) return '#333333';
  if (value >= 80) return '#ffffff';
  if (value >= 50) return '#333333';
  return '#ffffff';
};

const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportToPDF = useCallback(async (relatorioData, chartRefs, filename = "relatorio.pdf") => {
    setIsExporting(true);
    setExportError(null);

    const { dadosConsolidados, empresaNome, anoSelecionado, overallResult } = relatorioData;
    const { doughnutCanvas, barCanvas, barChartConfig } = chartRefs;

    if (!dadosConsolidados || !doughnutCanvas || !barCanvas) {
      setExportError("Dados ou referências dos gráficos ausentes.");
      setIsExporting(false);
      return;
    }

    const createNormalizedBarChart = () => {
      if (typeof document === 'undefined') return null;
      if (!barChartConfig?.data) return null;

      const canvas = document.createElement('canvas');
      const targetWidth = 1600;
      const targetHeight = 700;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext('2d');

      const normalizeAxis = (axisOptions = {}) => {
        const normalized = {
          ...axisOptions,
          ticks: {
            ...(axisOptions.ticks || {}),
            font: {
              ...(axisOptions.ticks?.font || {}),
              size: 22,
              weight: '700',
            },
          },
        };

        if (axisOptions.title) {
          normalized.title = {
            ...axisOptions.title,
            font: {
              ...(axisOptions.title?.font || {}),
              size: 26,
              weight: '700',
            },
          };
        }

        return normalized;
      };

      const normalizedOptions = {
        ...(barChartConfig.options || {}),
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
      };

      normalizedOptions.plugins = {
        ...(normalizedOptions.plugins || {}),
        datalabels: {
          ...(normalizedOptions.plugins?.datalabels || {}),
          font: {
            ...(normalizedOptions.plugins?.datalabels?.font || {}),
            size: 30,
            weight: 'bold',
          },
        },
        tooltip: {
          ...(normalizedOptions.plugins?.tooltip || {}),
          bodyFont: {
            ...(normalizedOptions.plugins?.tooltip?.bodyFont || {}),
            size: 22,
          },
          titleFont: {
            ...(normalizedOptions.plugins?.tooltip?.titleFont || {}),
            size: 24,
          },
        },
      };

      normalizedOptions.scales = {
        x: normalizeAxis((barChartConfig.options?.scales || {}).x),
        y: normalizeAxis((barChartConfig.options?.scales || {}).y),
      };

      const config = {
        type: barChartConfig.type || 'bar',
        data: barChartConfig.data,
        options: normalizedOptions,
      };

      const chartInstance = new ChartJS(context, config);
      const image = canvas.toDataURL('image/png', 1.0);
      chartInstance.destroy();

      return {
        image,
        width: targetWidth,
        height: targetHeight,
      };
    };

    try {
      const doc = new jsPDF('l', 'mm', 'a3');
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let startY = 20;

      doc.setFontSize(18);
      const safeEmpresaNome = empresaNome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      doc.text(`${safeEmpresaNome} - ${anoSelecionado}`, margin, startY);
      startY += 10;

      const head = [['Processos', ...dadosConsolidados.resultadosMensais.map(m => m.mes)]];
      const body = dadosConsolidados.processos.map((processo, index) => {
        const ordem = processo.ordem_topico ?? index + 1;
        const safeNomeTema = processo.nome_tema.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const row = [`${ordem} - ${safeNomeTema}`];
        
        dadosConsolidados.resultadosMensais.forEach(item => {
          const mesKey = item.mes.toLowerCase().substring(0, 3);
          const valor = processo[mesKey];
          row.push(valor === null ? '-' : `${valor}%`);
        });
        return row;
      });

      autoTable(doc, {
        head: head,
        body: body,
        startY: startY,
        theme: 'grid',
        headStyles: {
          fillColor: '#580f34',
          textColor: '#ffffff',
          halign: 'center',
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 100 }
        },
        styles: {
          halign: 'center',
          cellPadding: 2,
          fontSize: 8,
        },
        willDrawCell: (data) => {
          if (data.row.section === 'body' && data.column.index > 0) {
            const processo = dadosConsolidados.processos[data.row.index];
            const mes = dadosConsolidados.resultadosMensais[data.column.index - 1];
            
            if (processo && mes) {
              const mesKey = mes.mes.toLowerCase().substring(0, 3);
              const valor = processo[mesKey];
              
              doc.setFillColor(getBackgroundColor(valor));
              doc.setTextColor(getTextColor(valor));
            }
          }
        }
      });

      let chartSectionY = doc.lastAutoTable.finalY + 10;
      
      const legendMarginTop = 6;
      const legendHeight = 10;
      const spaceForLegend = legendMarginTop + legendHeight;
      const minChartHeight = 80;
      const spaceLeft = pageHeight - chartSectionY - margin;

      if (spaceLeft < (minChartHeight + spaceForLegend)) {
        doc.addPage();
        chartSectionY = margin;
      }

      const chartHeight = pageHeight - chartSectionY - margin - spaceForLegend;
      
      const chartWidth35 = (pageWidth - margin * 2) * 0.35;
      const chartGap = 5;

      doc.setFontSize(14);
      doc.text(
        "Resultado Anual",
        margin + (chartWidth35 / 2),
        chartSectionY,
        { align: 'center' }
      );
      
      const doughnutImg = doughnutCanvas.toDataURL('image/png', 1.0);
      
      const doughnutImgSize = Math.min(chartHeight, chartWidth35); 
      
      const doughnutX = margin + (chartWidth35 / 2) - (doughnutImgSize / 2);
      const doughnutY = chartSectionY + 5;
      doc.addImage(doughnutImg, 'PNG', doughnutX, doughnutY, doughnutImgSize, doughnutImgSize);
      
      doc.setFontSize(22);
      doc.text(
        overallResult !== null ? `${overallResult}%` : 'N/A', 
        doughnutX + (doughnutImgSize / 2), 
        doughnutY + (doughnutImgSize / 2),
        { 
          align: 'center',
          baseline: 'middle'
        }
      );
      
      const normalizedBarChart = createNormalizedBarChart() || {
        image: barCanvas.toDataURL('image/png', 1.0),
        width: barCanvas.width || 1,
        height: barCanvas.height || 1,
      };

      const barChartX = margin + chartWidth35 + chartGap;
      const barChartMaxHeight = chartHeight;
      const barChartMaxWidth = (pageWidth - margin - barChartX);

      const originalBarWidth = normalizedBarChart.width;
      const originalBarHeight = normalizedBarChart.height;
      const rawAspectRatio = originalBarWidth / originalBarHeight;
      const aspectRatio = Math.max(rawAspectRatio || 1, 1.6);

      let finalBarWidth = barChartMaxWidth;
      let finalBarHeight = finalBarWidth / aspectRatio;

      if (finalBarHeight > barChartMaxHeight) {
        finalBarHeight = barChartMaxHeight;
        finalBarWidth = Math.min(barChartMaxWidth, finalBarHeight * aspectRatio);
      }
      
      const barImg = normalizedBarChart.image;
      doc.addImage(barImg, 'PNG', barChartX, chartSectionY + 5, finalBarWidth, finalBarHeight);

      const legendY = chartSectionY + 5 + finalBarHeight + legendMarginTop;
      const legendX = barChartX;
      
      const legendData = [
        { color: '#1ca41c', text: 'Satisfatorio (>= 80%)' },
        { color: '#f2c037', text: 'Risco (50% a 79%)' },
        { color: '#dc3545', text: 'Critico (<= 49%)' },
        { color: '#999999', text: 'Inativo (-)' },
      ];
      
      doc.setFontSize(10);
      const legendBoxSize = 5;
      const legendSpacing = 20;
      const totalLegendWidth = legendData.reduce((acc, item) => {
        return acc + legendBoxSize + 2 + doc.getTextWidth(item.text) + legendSpacing;
      }, 0) - legendSpacing; // remove trailing spacing

      const centeredLegendX = legendX + Math.max((finalBarWidth - totalLegendWidth) / 2, 0);
      let currentLegendX = centeredLegendX;
      
      legendData.forEach(item => {
        doc.setFillColor(item.color);
        doc.rect(currentLegendX, legendY, 5, 5, 'F');
        doc.setTextColor('#333333');
        doc.text(item.text, currentLegendX + 7, legendY + 4);
        currentLegendX += doc.getTextWidth(item.text) + 20;
      });

      doc.save(filename);

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
