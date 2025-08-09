import { useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const usePdfGenerator = () => {
  const generatePdf = useCallback((data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de Auditoria', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 30);

    const startY = 40;

    const columns = [
      { header: 'Pergunta', dataKey: 'pergunta' },
      { header: 'Resposta', dataKey: 'resposta' },
      { header: 'Comentário', dataKey: 'comentario' },
    ];

    const rows = data.respostas.map(r => ({
      pergunta: r.descricao_pergunta || r.pergunta || '---',
      resposta: r.st_pergunta || r.resposta || '---',
      comentario: r.comentario || '-',
    }));

    doc.autoTable({
      startY,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [247, 125, 51] },
    });

    doc.save('relatorio_auditoria.pdf');
  }, []);

  return { generatePdf };
};
