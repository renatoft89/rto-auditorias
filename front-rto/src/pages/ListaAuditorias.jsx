import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PageCabecalho from '../components/Botoes/PageCabecalho';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import api from '../api/api';
import { usePdfGenerator } from '../hooks/usePdfGenerator';
import { formatarData } from '../utils/formatarData';

import '../styles/ListarAuditorias/index.css';
import 'react-toastify/dist/ReactToastify.css';


const ListaAuditorias = () => {
    const [auditorias, setAuditorias] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState('dt_auditoria');
    const [sortOrder, setSortOrder] = useState('desc');

    const itemsPerPage = 8;
    const { generatePdf } = usePdfGenerator();

    useEffect(() => {
        const fetchAuditorias = async () => {
            try {
                const response = await api.get('/auditorias/listar');
                const formattedData = response.data.auditorias.map(auditoria => ({
                    id: auditoria.id,
                    cliente: {
                        razao_social: auditoria.cliente_razao_social,
                        cnpj: auditoria.cliente_cnpj
                    },
                    dt_auditoria: auditoria.dt_auditoria,
                }));
                setAuditorias(formattedData);
            } catch (err) {
                console.error("Error fetching audits:", err);
                setError("Falha ao buscar as auditorias. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchAuditorias();
    }, []);

    const handleGerarPdf = useCallback(async (auditoriaId) => {
        setIsGeneratingPdf(auditoriaId);
        try {

            const response = await api.get(`/auditorias/listar/${auditoriaId}`);
            const { topicos, respostas, auditoriaInfo, clienteInfo, fotos, observacoes } = response.data;
            generatePdf(topicos, respostas, clienteInfo, auditoriaInfo, fotos, observacoes);
            toast.success("PDF gerado com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
            toast.error("Falha ao gerar o PDF.");
        } finally {
            setIsGeneratingPdf(null);
        }
    }, [generatePdf]);

    const handleSort = useCallback((key) => {
        setSortKey(key);
        setSortOrder(prevOrder => (sortKey === key && prevOrder === 'asc' ? 'desc' : 'asc'));
        setCurrentPage(1);
    }, [sortKey]);
    
    const auditoriasOrdenadas = useMemo(() => {
        const filtradas = auditorias.filter(auditoria =>
            (auditoria.cliente?.razao_social?.toLowerCase().includes(filtro.toLowerCase())) ||
            (auditoria.cliente?.cnpj?.includes(filtro)) ||
            (auditoria.dt_auditoria && formatarData(auditoria.dt_auditoria).includes(filtro))
        );

        return [...filtradas].sort((a, b) => {
            if (!sortKey) return 0;
            let aValue = sortKey.includes('.') ? sortKey.split('.').reduce((o, i) => o?.[i], a) : a[sortKey];
            let bValue = sortKey.includes('.') ? sortKey.split('.').reduce((o, i) => o?.[i], b) : b[sortKey];

            if (sortKey === 'dt_auditoria') {
                aValue = aValue ? new Date(aValue).getTime() : 0;
                bValue = bValue ? new Date(bValue).getTime() : 0;
            }

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [auditorias, filtro, sortKey, sortOrder]);

    const totalPages = Math.ceil(auditoriasOrdenadas.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAuditorias = auditoriasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }, [currentPage, totalPages]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }, [currentPage]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [filtro]);

    return (
        <div className="lista-auditorias-container">
            <PageCabecalho title="Consultar Auditorias" backTo="/" />
            <main className="container">
                <div className="filtro-container">
                    <input
                        type="text"
                        placeholder="Filtrar por Empresa, CNPJ ou Data..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <div className="tabela-container">
                    {loading && <p>Carregando auditorias...</p>}
                    {error && <p className="error">Erro: {error}</p>}
                    {!loading && !error && (
                        <>
                            <table id="tabelaAuditorias">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('cliente.razao_social')}>
                                            Empresa {sortKey === 'cliente.razao_social' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('cliente.cnpj')}>
                                            CNPJ {sortKey === 'cliente.cnpj' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('dt_auditoria')}>
                                            Data {sortKey === 'dt_auditoria' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAuditorias.length > 0 ? (
                                        currentAuditorias.map(auditoria => (
                                            <tr key={auditoria.id}>
                                                <td data-label="Empresa">{auditoria.cliente.razao_social}</td>
                                                <td data-label="CNPJ">{auditoria.cliente.cnpj}</td>
                                                <td data-label="Data">{formatarData(auditoria.dt_auditoria)}</td>
                                                <td data-label="Ações" className="tabela-acoes">
                                                    <button
                                                        onClick={() => handleGerarPdf(auditoria.id)}
                                                        className="btn-pdf"
                                                        disabled={isGeneratingPdf === auditoria.id}
                                                    >
                                                        {isGeneratingPdf === auditoria.id ? 'Gerando...' : 'Criar PDF'}
                                                        <FontAwesomeIcon icon={faFilePdf} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">Nenhuma auditoria encontrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {auditoriasOrdenadas.length > itemsPerPage && (
                                <div className="pagination">
                                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                        Anterior
                                    </button>
                                    <span>Página {currentPage} de {totalPages}</span>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                        Próxima
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListaAuditorias;