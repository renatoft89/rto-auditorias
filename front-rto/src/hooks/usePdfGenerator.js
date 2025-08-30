import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const usePdfGenerator = () => {
  const generatePdf = (topicos, respostas, empresaInfo, auditoriaInfo, fotos, comentario) => {
    const doc = new jsPDF();
    let yOffset = 10;

    // === TÍTULO ===
    doc.setFontSize(16);
    doc.text("Relatório de Auditoria", 105, yOffset, { align: "center" });
    yOffset += 8;
    // === DADOS DA EMPRESA ===
    if (empresaInfo) {
      doc.setFontSize(12);
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
    if (auditoriaInfo.observacao) {
      doc.text(`Observação Geral: ${auditoriaInfo.observacao}`, 10, yOffset, { align: "left" });
      yOffset += 5;
    }

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
    const resultadoGeral = topicosComRespostas > 0 ? Math.round(somaPercentuais / topicosComRespostas) : 0;
    let corFundo = [255, 0, 0];
    if (resultadoGeral >= 80) corFundo = [0, 176, 80];
    else if (resultadoGeral >= 50) corFundo = [255, 255, 0];
    doc.setFillColor(...corFundo);
    doc.rect(10, yOffset, 190, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Resultado Geral: ${resultadoGeral}%`, 105, yOffset + 7, { align: "center" });
    yOffset += 15;

    // === LOOP POR TÓPICOS ===
    topicos.forEach((topico, tIndex) => {
      // Checa se há espaço para o título do próximo tópico, caso contrário, adiciona uma nova página
      if (yOffset > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yOffset = 20;
      }
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
        let cor = [255, 0, 0];
        if (percentual >= 80) {
          classificacao = 'Processos Satisfatórios';
          cor = [0, 176, 80];
        } else if (percentual >= 50) {
          classificacao = 'Processos que podem gerar riscos';
          cor = [255, 255, 0];
        } else {
          classificacao = 'Processos Inaceitáveis';
          cor = [255, 0, 0];
        }
        doc.setFontSize(11);
        doc.setFillColor(...cor);
        doc.rect(10, yOffset, 60, 6, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(`${classificacao} (${percentual}%)`, 12, yOffset + 4);
        yOffset += 8;
      }
      const tableData = perguntasDoTopico.map(p => {
        const respostaTexto = respostas[p.id] === 'CF' ? 'Conforme'
          : respostas[p.id] == 'PC' ? 'Conformidade Parcial'
            : respostas[p.id] === 'NC' ? 'Não Conforme'
              : respostas[p.id] === 'NE' ? 'Não Existe'
                : 'Não Respondido';
        const comentarioDaPergunta = comentario[p.id] ? `\n(Obs: ${comentario[p.id]})` : '';
        return [p.ordem_pergunta, p.descricao_pergunta, `${respostaTexto}${comentarioDaPergunta}`];
      });

      autoTable(doc, {
        head: [["#", "Pergunta", "Resposta"]],
        body: tableData,
        startY: yOffset,
        styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.3, lineColor: [200, 200, 200] },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [220, 220, 220] },
        didDrawPage: (data) => { yOffset = data.cursor.y + 5; } // Atualiza o yOffset após cada página da tabela
      });
      yOffset = doc.lastAutoTable.finalY + 5;

      // Adiciona a lógica para inserir as fotos aqui
      const fotosDoTopico = perguntasDoTopico.flatMap(p => {
        return (fotos[p.id.toString()] || []).map(fotoUrl => ({
          ordem: p.ordem_pergunta,
          url: fotoUrl
        }));
      });

      if (fotosDoTopico.length > 0) {
        if (yOffset > doc.internal.pageSize.height - 30) {
          doc.addPage();
          yOffset = 20;
        }
        yOffset += 5;
        doc.setFontSize(10);
        doc.text(`Evidências`, 10, yOffset);
        yOffset += 5;

        // Lógica para 2 imagens por linha
        const imgWidth = 90;
        const imgHeight = (imgWidth * 3) / 4;
        const padding = 5;

        fotosDoTopico.forEach((foto, index) => {
          if (index % 2 === 0) {
            if (yOffset + imgHeight > doc.internal.pageSize.height - 30) {
              doc.addPage();
              yOffset = 20;
            }
            doc.setFontSize(8);
            doc.text(`Pergunta ${foto.ordem}`, 10, yOffset);
            doc.addImage(`${import.meta.env.VITE_API_URL}${foto.url}`, 'JPEG', 10, yOffset + 3, imgWidth, imgHeight);
          } else {
            doc.setFontSize(8);
            doc.text(`Pergunta ${foto.ordem}`, 10 + imgWidth + padding, yOffset);
            doc.addImage(`${import.meta.env.VITE_API_URL}${foto.url}`, 'JPEG', 10 + imgWidth + padding, yOffset + 3, imgWidth, imgHeight);
            yOffset += imgHeight + 8;
          }
        });
        if (fotosDoTopico.length % 2 !== 0) {
          yOffset += imgHeight + 8;
        }
      }
    });

    // === RODAPÉ dinâmico ===
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 30; // Altura aproximada do rodapé (linha + texto)

    // Verifica se há espaço para o rodapé
    if (yOffset > pageHeight - footerHeight) {
      doc.addPage();
    }
    // Agora, adicione a assinatura no final da página atual, independentemente se uma nova foi adicionada ou não
    const finalY = pageHeight - 20;

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("__________________________________", 105, finalY, { align: "center" });
    doc.text("Assinatura do Auditor", 105, finalY + 5, { align: "center" });

    // Visualizar o PDF
    // ... o resto do seu código

    // Visualizar o PDF
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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