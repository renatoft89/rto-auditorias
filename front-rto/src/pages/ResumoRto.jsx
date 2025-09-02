import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import "../styles/ResumoRto/index.css";
import PageCabecalho from "../components/Botoes/PageCabecalho";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Utilitários de cor e formatação
const getTextColor = (value) => {
  if (value === null) return '#333';
  if (value >= 80) return '#fff';
  if (value >= 50) return '#333';
  return '#fff';
};

const getBackgroundColor = (value) => {
  if (value === null) return '#999';
  if (value >= 80) return '#1ca41c';
  if (value >= 50) return '#f2c037';
  return '#dc3545';
};

const getChartColor = (value) => {
  if (value === null) return '#999';
  if (value >= 80) return '#1ca41c';
  if (value >= 50) return '#f2c037';
  return '#dc3545';
};

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const ResumoRto = () => {
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState([]);
  const [anos, setAnos] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [dadosConsolidados, setDadosConsolidados] = useState(null);
  const [overallResult, setOverallResult] = useState(null);
  const [semestreSelecionado, setSemestreSelecionado] = useState("");

  // 1. Efeito para buscar a lista de empresas e processos (carregamento inicial)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const empresasRes = await api.get("/clientes");
        setEmpresas(empresasRes.data);
        const anoAtual = new Date().getFullYear();
        const arrAnos = Array.from({ length: 5 }, (_, i) => anoAtual - i).sort();
        setAnos(arrAnos);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Efeito para buscar os dados consolidados do relatório quando os filtros mudam
  useEffect(() => {
    if (empresaSelecionada && anoSelecionado) {
      setLoading(true);
      api.get(`/auditorias/listar-dashboard`, {
        params: { clienteId: empresaSelecionada, ano: anoSelecionado }
      })
        .then(res => {
          setDadosConsolidados(res.data);
          setProcessos(res.data.processos);
          const resultadosAnuais = res.data.resultadosMensais.map(r => r.resultado);
          const validResults = resultadosAnuais.filter(r => typeof r === 'number');
          if (validResults.length > 0) {
            const sum = validResults.reduce((acc, curr) => acc + curr, 0);
            setOverallResult(Math.round(sum / validResults.length));
          } else {
            setOverallResult(null);
          }
        })
        .catch(() => {
          setDadosConsolidados(null);
          setOverallResult(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDadosConsolidados(null);
      setOverallResult(null);
    }
  }, [empresaSelecionada, anoSelecionado]);

  // Lógica para filtrar os dados do semestre
  const resultadosPorSemestre = (semestre) => {
    if (!dadosConsolidados) return { processos: [], resultadosMensais: [] };

    const mesesDoSemestre = semestre === 'sem1' ? meses.slice(0, 6).map(m => m.toLowerCase()) : meses.slice(6, 12).map(m => m.toLowerCase());
    const mesesDoSemestreUI = semestre === 'sem1' ? meses.slice(0, 6) : meses.slice(6, 12);

    const processosSemestrais = dadosConsolidados.processos.map(proc => {
      const novoProc = { ...proc };
      Object.keys(novoProc).forEach(key => {
        if (meses.map(m => m.toLowerCase()).includes(key) && !mesesDoSemestre.includes(key)) {
          delete novoProc[key];
        }
      });
      return novoProc;
    });

    const resultadosMensaisSemestrais = dadosConsolidados.resultadosMensais.filter(item => {
      const mesAbrev = item.mes.split('/')[0].toLowerCase();
      return mesesDoSemestre.includes(mesAbrev);
    });

    return { processos: processosSemestrais, resultadosMensais: resultadosMensaisSemestrais };
  };

  const dadosExibidos = semestreSelecionado ? resultadosPorSemestre(semestreSelecionado) : dadosConsolidados;

  // AQUI: Cria uma lista de meses para renderizar, evitando colunas extras.
  const mesesExibidos = dadosExibidos?.resultadosMensais.map(item => item.mes) || [];

  const chartData = {
    labels: dadosExibidos?.resultadosMensais.map(item => item.mes) || [],
    datasets: [{
      label: 'Resultado de Auditoria (%)',
      data: dadosExibidos?.resultadosMensais.map(item => typeof item.resultado === 'number' ? item.resultado : 0) || [],
      backgroundColor: dadosExibidos?.resultadosMensais.map(item => getChartColor(item.resultado)) || [],
      borderColor: dadosExibidos?.resultadosMensais.map(item => getChartColor(item.resultado)) || [],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Porcentagem (%)' }
      },
      x: {
        title: { display: true, text: 'Mês' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value !== 0 ? `${value}%` : "N/A";
          }
        }
      }
    }
  };

  return (
    <main className="rto-conteudo">
      <PageCabecalho
        title="RTO - Relatório Técnico Operacional "
        backTo="/"
      />
      <section className="rto-bloco-geral">
        <section className="rto-filtros destacado">
          <label>
            Empresa:
            <select
              id="selectEmpresa"
              value={empresaSelecionada}
              onChange={e => setEmpresaSelecionada(e.target.value)}
            >
              <option value="">Selecione</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.razao_social}</option>
              ))}
            </select>
          </label>
          <label>
            Ano:
            <select
              id="filtroAno"
              value={anoSelecionado}
              onChange={e => setAnoSelecionado(e.target.value)}
            >
              <option value="">Selecione o ano</option>
              {anos.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </label>
          <label>
            Semestre:
            <select
              id="filtroMes"
              value={semestreSelecionado}
              onChange={e => setSemestreSelecionado(e.target.value)}
            >
              <option value="">Selecione o semestre</option>
              <option value="sem1">1º Semestre</option>
              <option value="sem2">2º Semestre</option>
            </select>
          </label>
          <div className="rto-acoes-exportar">
            <button id="exportarPDF">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>Carregando dados...</p>
        ) : !dadosConsolidados ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            Selecione uma empresa e um ano para exibir os dados.
          </p>
        ) : (
          <>
            <div className="rto-tabela-scroll">
              <table className="rto-tabela">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Processo</th>
                    {dadosExibidos.resultadosMensais.map((item, i) => (
                      <th key={i}>{item.mes}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dadosExibidos.processos.map((processo, idx) => {
                    return (
                      <tr key={processo.id}>
                        <td style={{ color: '#000' }}>{idx + 1}</td>
                        <td style={{ color: '#000' }}>{processo.nome_tema}</td>
                        {
                          // CORREÇÃO APLICADA AQUI
                          mesesExibidos.map(mesHeader => {
                            const mesKey = mesHeader.split('/')[0].toLowerCase();
                            const valor = processo?.[mesKey];
                            return (
                              <td
                                key={mesKey}
                                style={{
                                  backgroundColor: getBackgroundColor(valor),
                                  color: getTextColor(valor),
                                }}
                              >
                                {valor === null ? '-' : (typeof valor === 'number' ? `${valor}%` : '-')}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="rto-legenda">
              <h3>Legenda</h3>
              <ul>
                <li><span className="rto-cor rto-verde"></span> Processos Satisfatórios (80% a 100%)</li>
                <li><span className="rto-cor rto-amarelo"></span> Processos que podem gerar riscos (50% a 79%)</li>
                <li><span className="rto-cor rto-vermelho"></span> Processos Críticos (0% a 49%)</li>
                <li><span className="rto-cor rto-cinza"></span> Processos Inativos (N/A)</li>
              </ul>
            </div>

            <div className="rto-resultado-auditorias-wrapper">
              <div className="rto-resultado-auditorias">
                <h3>Resultado Anual</h3>
                <ul id="listaAuditorias">
                  <li>
                    Ano: {anoSelecionado}
                  </li>
                  <li>
                    Resultado Geral: {overallResult !== null ? `${overallResult}%` : 'N/A'}
                  </li>
                </ul>
              </div>
              <div className="rto-grafico-auditorias">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default ResumoRto;