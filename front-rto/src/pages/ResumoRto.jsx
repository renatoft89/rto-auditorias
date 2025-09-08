import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import PageCabecalho from "../components/Botoes/PageCabecalho";
import usePdfExport from "../hooks/usePdfExport";

import "../styles/ResumoRto/index.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Funções de utilidade
const getTextColor = (value) => {
  if (value === null) return '#333';
  if (value >= 80) return '#fff';
  if (value >= 50) return '#333';
  return '#fff';
};

const getBackgroundColor = (value) => {
  if (value === null) return '#E8DDE2';
  if (value >= 80) return '#1ca41c';
  if (value >= 50) return '#f2c037';
  return '#dc3545';
};

const getChartColor = (value) => {
  if (value === null) return '#E8DDE2';
  if (value >= 80) return '#1ca41c';
  if (value >= 50) return '#f2c037';
  return '#dc3545';
};

const ResumoRto = () => {
  const [empresas, setEmpresas] = useState([]);
  const [anos, setAnos] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [dadosConsolidados, setDadosConsolidados] = useState(null);
  const [overallResult, setOverallResult] = useState(null);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingAnos, setLoadingAnos] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const { exportToPDF, isExporting, exportError } = usePdfExport();

  const isLoading = loadingEmpresas || loadingAnos || loadingDashboard;

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoadingEmpresas(true);
      try {
        const res = await api.get("/clientes");
        setEmpresas(res.data);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      } finally {
        setLoadingEmpresas(false);
      }
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (!empresaSelecionada) {
      setAnos([]);
      setAnoSelecionado("");
      return;
    }
    const fetchAnos = async () => {
      setLoadingAnos(true);
      try {
        const res = await api.get(`/auditorias/data-auditoria/${empresaSelecionada}`);
        const anosDisponiveis = res.data.map(item => item.ano).sort();
        setAnos(anosDisponiveis);
        setAnoSelecionado("");
      } catch (err) {
        console.error("Erro ao buscar anos da auditoria:", err);
        setAnos([]);
        setAnoSelecionado("");
      } finally {
        setLoadingAnos(false);
      }
    };
    fetchAnos();
  }, [empresaSelecionada]);

  useEffect(() => {
    if (empresaSelecionada && anoSelecionado) {
      setLoadingDashboard(true);
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
        .catch(err => {
          console.error("Erro ao buscar dados do dashboard:", err);
          setDadosConsolidados(null);
          setOverallResult(null);
        })
        .finally(() => {
          setLoadingDashboard(false);
        });
    } else {
      setDadosConsolidados(null);
      setOverallResult(null);
    }
  }, [empresaSelecionada, anoSelecionado]);

  // Exportar PDF
  const handleExportPDF = useCallback(async () => {
    if (!dadosConsolidados || !empresaSelecionada || !anoSelecionado) {
      alert('Selecione uma empresa e ano antes de exportar o relatório.');
      return;
    }

    const empresaNome = empresas.find(emp => emp.id.toString() === empresaSelecionada)?.razao_social || empresaSelecionada;
    const filename = `Relatorio_RTO_${empresaNome.replace(/[^a-zA-Z0-9]/g, '_')}_${anoSelecionado}.pdf`;

    await exportToPDF('rto-relatorio', filename);
  }, [exportToPDF, dadosConsolidados, empresaSelecionada, anoSelecionado, empresas]);

  const dadosExibidos = dadosConsolidados;
  const mesesExibidos = dadosExibidos?.resultadosMensais.map(item => item.mes) || [];

  const chartData = {
    labels: mesesExibidos,
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
      y: { beginAtZero: true, max: 100, title: { display: true, text: 'Porcentagem (%)' } },
      x: { title: { display: true, text: 'Mês' } }
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
      <PageCabecalho title="RTO - Relatório Técnico Operacional " backTo="/" />
      <section className="rto-bloco-geral">
        <section className="rto-cabecalho-principal">
          <div className="rto-filtros destacado">
            <label>
              Empresa:
              <select value={empresaSelecionada} onChange={e => setEmpresaSelecionada(e.target.value)}>
                <option value="">Selecione</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.razao_social}</option>
                ))}
              </select>
            </label>
            <label>
              Ano:
              <select value={anoSelecionado} onChange={e => setAnoSelecionado(e.target.value)} disabled={anos.length === 0}>
                <option value="">Selecione o ano</option>
                {anos.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="rto-acoes-exportar">
            <button
              onClick={handleExportPDF}
              disabled={isExporting || !dadosConsolidados}
              style={{ opacity: isExporting ? 0.7 : 1 }}
            >
              {isExporting ? <FaSpinner className="fa-spin" /> : <FaFilePdf />}
              {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
            </button>
          </div>
        </section>

        {exportError && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            Erro ao exportar PDF: {exportError}
          </div>
        )}

        {isLoading ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>Carregando dados...</p>
        ) : !dadosConsolidados ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            Selecione uma empresa e um ano para exibir os dados.
          </p>
        ) : (
          <div id="rto-relatorio">
            <div className="rto-pdf-header">
              <h2>{empresaSelecionada ? empresas.find(emp => emp.id.toString() === empresaSelecionada)?.razao_social : ""} - {anoSelecionado}</h2>

            </div>
            <div className="rto-tabela-scroll">
              <table className="rto-tabela">
                <thead>
                  <tr>
                    <th>Processos</th>
                    {mesesExibidos.map((mes, i) => (
                      <th key={i}>{mes}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dadosExibidos.processos.map((processo) => (
                    <tr key={processo.id}>
                      <td>{processo.nome_tema}</td>
                      {mesesExibidos.map(mesHeader => {
                        const mesKey = mesHeader.split('/')[0].toLowerCase();
                        const valor = processo?.[mesKey];
                        return (
                          <td
                            key={mesKey}
                            style={{
                              backgroundColor: getBackgroundColor(valor),
                              color: getTextColor(valor),
                              textAlign: "center",
                            }}
                          >
                            {valor === null ? '-' : (typeof valor === 'number' ? `${valor}%` : '-')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rto-legenda-inline">
              <strong>Legenda:</strong>
              <div className="rto-legenda-item">
                <span className="rto-cor rto-verde"></span> Processos Satisfatórios (80% a 100%)
              </div>
              <div className="rto-legenda-item">
                <span className="rto-cor rto-amarelo"></span> Processos que podem gerar riscos (50% a 79%)
              </div>
              <div className="rto-legenda-item">
                <span className="rto-cor rto-vermelho"></span> Processos Críticos (0% a 49%)
              </div>
              <div className="rto-legenda-item">
                <span className="rto-cor rto-cinza"></span> Processos Inativos ( - )
              </div>
            </div>

            <div className="rto-graficos-wrapper">
              <div className="rto-anual-result-chart">
                <h3>Resultado Anual</h3>
                <div className="resultado-anual-conteudo">
                  <div className="rto-mini-grafico-container">
                    {overallResult !== null ? (
                      <>
                        <Doughnut
                          data={{
                            datasets: [{
                              data: [overallResult, 100 - overallResult],
                              backgroundColor: [getChartColor(overallResult), '#e0e0e0'],
                              borderColor: [getChartColor(overallResult), '#e0e0e0'],
                              borderWidth: 0,
                            }],
                          }}
                          options={{
                            cutout: '70%',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false }, tooltip: { enabled: false } }
                          }}
                        />
                        <div className="progress-text" style={{ color: '#333' }}>
                          {overallResult}%
                        </div>
                      </>
                    ) : (
                      <div className="progress-text" style={{ color: '#666' }}>
                        N/A
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="rto-bar-chart">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ResumoRto;
