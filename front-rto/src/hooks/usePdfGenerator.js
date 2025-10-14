import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const usePdfGenerator = () => {
  const generatePdf = (topicos, respostas, empresaInfo, auditoriaInfo, fotos, comentario) => {
    const doc = new jsPDF();
    let yOffset = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    yOffset += 8;
    doc.setFontSize(16);
    doc.text("CONSULTECH", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 8;

    if (empresaInfo) {
      doc.setFontSize(10);
      doc.text(`Empresa: ${empresaInfo.razao_social}`, pageWidth / 2, yOffset, { align: "center" });
      yOffset += 4;
      if (empresaInfo.cnpj) {
        doc.setFontSize(10)
        doc.text(`CNPJ: ${empresaInfo.cnpj}`, pageWidth / 2, yOffset, { align: "center" });
        yOffset += 4;
      }
      if (auditoriaInfo.auditorResponsavel) {
        doc.setFontSize(10);
        doc.text(`Auditor: ${auditoriaInfo.auditorResponsavel}`, pageWidth / 2, yOffset, { align: "center" });
        yOffset += 4;
      }
    }

    const dataAtual = new Date().toLocaleString();
    const dataAuditoria = new Date(auditoriaInfo.dt_auditoria)
      .toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
      });

    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, pageWidth / 2, yOffset, { align: "center" });
    yOffset += 8;

    if (auditoriaInfo.observacao || auditoriaInfo.dt_auditoria) {
      doc.setFontSize(10);

      if (auditoriaInfo.observacao) {
        doc.text(`Observação Geral: ${auditoriaInfo.observacao}`, margin, yOffset, { align: "left" });
      }

      if (auditoriaInfo.dt_auditoria) {
        const rightEdge = pageWidth - margin;
        doc.text(`Auditado em: ${dataAuditoria}`, rightEdge, yOffset, { align: "right" });
      }

      yOffset += 7;
    }

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
    doc.rect(margin, yOffset, pageWidth - (margin * 2), 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Resultado Geral: ${resultadoGeral}%`, pageWidth / 2, yOffset + 7, { align: "center" });
    yOffset += 20;

    topicos.forEach((topico, tIndex) => {
      if (tIndex > 0) {
        doc.addPage();
        yOffset = margin;
      }

      doc.setFontSize(14);
      const temaTexto = doc.splitTextToSize(`${topico.nome_tema}`, pageWidth - margin * 2);
      doc.text(temaTexto, margin, yOffset);
      yOffset += temaTexto.length * 7;

      doc.setFontSize(11);
      const requisitoTexto = doc.splitTextToSize(`${topico.requisitos}`, pageWidth - margin * 2);
      doc.text(requisitoTexto, margin, yOffset);
      yOffset += requisitoTexto.length * 6;

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
        doc.rect(margin, yOffset, 80, 6, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(`${classificacao} (${percentual}%)`, margin + 2, yOffset + 4);
        yOffset += 10;
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
      });
      yOffset = doc.lastAutoTable.finalY + 5;

      const fotosDoTopico = perguntasDoTopico.flatMap(p => {
        return (fotos[p.id.toString()] || []).map(fotoUrl => ({
          ordem: p.ordem_pergunta,
          url: fotoUrl
        }));
      });

      if (fotosDoTopico.length > 0) {
        const imgWidth = (pageWidth - (margin * 3)) / 2;
        const imgHeight = (imgWidth * 3) / 4;

        if (yOffset + imgHeight + 20 > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
        }

        doc.setFontSize(10);
        doc.text(`Evidências`, margin, yOffset);
        yOffset += 5;

        for (let i = 0; i < fotosDoTopico.length; i++) {
          const foto = fotosDoTopico[i];
          const xPos = margin + (i % 2 === 1 ? imgWidth + margin : 0);

          if (i % 2 === 0) {
            if (yOffset + imgHeight + 10 > pageHeight - margin) {
              doc.addPage();
              yOffset = margin;
            }
            doc.setFontSize(8);
            doc.text(`Pergunta ${foto.ordem}`, xPos, yOffset);
            doc.addImage(`${import.meta.env.VITE_API_URL}${foto.url}`, 'JPEG', xPos, yOffset + 3, imgWidth, imgHeight);
          } else {
            doc.setFontSize(8);
            doc.text(`Pergunta ${foto.ordem}`, xPos, yOffset);
            doc.addImage(`${import.meta.env.VITE_API_URL}${foto.url}`, 'JPEG', xPos, yOffset + 3, imgWidth, imgHeight);
            yOffset += imgHeight + 8;
          }
        }

        if (fotosDoTopico.length % 2 !== 0) {
          yOffset += imgHeight + 8;
        }
      }
    });

    const finalY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("__________________________________", pageWidth / 2, finalY, { align: "center" });
    doc.text("Assinatura do Auditor", pageWidth / 2, finalY + 5, { align: "center" });

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      doc.save(`auditoria-${empresaInfo.razao_social}.pdf`);
    } else {
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    }
  };
  return { generatePdf };
};
