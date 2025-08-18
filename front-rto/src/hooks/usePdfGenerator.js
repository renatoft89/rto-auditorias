import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import logo from "../assets/logo3.png"; // logo da empresa

export const usePdfGenerator = () => {
  const generatePdf = (topicos, respostas, empresaInfo, auditoriaInfo) => {
    const doc = new jsPDF();
    let yOffset = 10;

    // === TÍTULO ===
    doc.setFontSize(16);
    doc.text("Relatório de Auditoria", 105, yOffset, { align: "center" });
    yOffset += 8;
    // === DADOS DA EMPRESA ===
    if (empresaInfo) {
      doc.setFontSize(12);

      // CENTRALIZANDO AS LINHAS DE TEXTO
      doc.text(`Empresa: ${empresaInfo.razao_social || "N/D"}`, 105, yOffset, { align: "center" });
      yOffset += 6;

      if (empresaInfo.cnpj) {
        doc.text(`CNPJ: ${empresaInfo.cnpj}`, 105, yOffset, { align: "center" });
        yOffset += 4;
      }

      if (auditoriaInfo.auditor) {
        doc.text(`Endereço: ${auditoriaInfo.auditor}`, 105, yOffset, { align: "center" });
        yOffset += 4;
      }
    }

    if (auditoriaInfo) {
      doc.text(`Auditor: ${auditoriaInfo.auditorResponsavel || "N/D"}`, 105, yOffset, { align: "center" });
      yOffset += 4;

    }

    // === DATA ===
    const dataAtual = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, 105, yOffset, { align: "center" });
    yOffset += 5;

    // === CALCULAR RESULTADO GERAL ===
    let somaPercentuais = 0;
    let topicosComRespostas = 0;

    topicos.forEach(topico => {
      const perguntasDoTopico = topico.perguntas || [];
      const respostasDoTopico = perguntasDoTopico.filter(p => respostas[p.id]);
      if (respostasDoTopico.length > 0) {
        const conformes = respostasDoTopico.filter(p => respostas[p.id] === 'CF').length;
        const conformidadeParcial = respostasDoTopico.filter(p => respostas[p.id] === 'PC').length;

        const pontuacaoTotal = conformes + (conformidadeParcial * 0.5);

        const percentual = Math.round((pontuacaoTotal / respostasDoTopico.length) * 100);

        somaPercentuais += percentual;
        topicosComRespostas++;
      }
    });

    const resultadoGeral = topicosComRespostas > 0
      ? Math.round(somaPercentuais / topicosComRespostas)
      : 0;

    let corFundo = [255, 0, 0]; // vermelho
    if (resultadoGeral >= 80) corFundo = [0, 176, 80]; // verde
    else if (resultadoGeral >= 50) corFundo = [255, 255, 0]; // amarelo

    // Caixa com resultado geral
    doc.setFillColor(...corFundo);
    doc.rect(10, yOffset, 190, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Resultado Geral: ${resultadoGeral}%`, 105, yOffset + 7, { align: "center" });
    yOffset += 15;

    // === LOOP POR TÓPICOS ===
    topicos.forEach((topico, tIndex) => {
      yOffset += 5;
      doc.setFontSize(14);
      doc.text(`${tIndex + 1} - ${topico.requisitos}`, 10, yOffset);
      yOffset += 5;

      const perguntasDoTopico = topico.perguntas || [];
      const respostasDoTopico = perguntasDoTopico.filter(p => respostas[p.id]);

      if (respostasDoTopico.length > 0) {
        const conformes = respostasDoTopico.filter(p => respostas[p.id] === 'CF').length;
        const conformidadeParcial = respostasDoTopico.filter(p => respostas[p.id] === 'PC').length;

        const pontuacaoTotal = conformes + (conformidadeParcial * 0.5);

        const percentual = Math.round((pontuacaoTotal / respostasDoTopico.length) * 100);

        let classificacao = '';
        let cor = [255, 0, 0]; // vermelho

        if (percentual >= 80) {
          classificacao = 'Processos Satisfatórios';
          cor = [0, 176, 80]; // verde
        } else if (percentual >= 50) {
          classificacao = 'Processos que podem gerar riscos';
          cor = [255, 255, 0]; // amarelo
        } else {
          classificacao = 'Processos Inaceitáveis';
          cor = [255, 0, 0]; // vermelho
        }

        doc.setFontSize(11);
        doc.setFillColor(...cor);
        doc.rect(10, yOffset, 60, 6, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(`${classificacao} (${percentual}%)`, 12, yOffset + 4);
        yOffset += 8;

      }

      // Tabela de perguntas/respostas 
      const tableData = perguntasDoTopico.map(p => [
        p.ordem_pergunta,
        p.descricao_pergunta,
        respostas[p.id] === 'CF' ? 'Conforme'
          : respostas[p.id] == 'PC' ? 'Conformidade Parcial'
            : respostas[p.id] === 'NC' ? 'Não Conforme'
              : respostas[p.id] === 'NE' ? 'Não Existe'
                : 'Não Respondido'
      ]);

      autoTable(doc, {
        head: [["#", "Pergunta", "Resposta"]],
        body: tableData,
        startY: yOffset,
        styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.3, lineColor: [200, 200, 200] },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [220, 220, 220] }
      });

      yOffset = doc.lastAutoTable.finalY + 5;
    });

    // === RODAPÉ ===
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("__________________________________", 105, pageHeight - 20, { align: "center" });
    doc.text("Assinatura do Auditor", 105, pageHeight - 15, { align: "center" });

    // Visualizar o PDF
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    console.log("Safari:", isSafari);

    if (isSafari) {
      doc.save(`auditoria-${empresaInfo.razao_social}.pdf`);      

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } else {
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
  
      window.open(blobUrl, "_blank");
    }
  };

  return { generatePdf };
};
