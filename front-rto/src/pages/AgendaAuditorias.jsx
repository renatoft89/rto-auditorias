// src/components/AgendaAuditorias.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Stack, CircularProgress, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PageCabecalho from '../components/Botoes/PageCabecalho';
import api from '../api/api';

import FormularioAgendamento from '../components/FormularioAgendamento';
import TabelaAuditoriasFuturas from '../components/TabelaAuditoriasFuturas';

const AgendaAuditorias = () => {
  const [clientes, setClientes] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAuditorias = useCallback(async () => {
    try {
      const response = await api.get('/auditorias/agendamentos');
      setAuditorias(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar auditorias:", err);
      toast.error('Falha ao carregar a lista de auditorias.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientesResponse] = await Promise.all([
          api.get('/clientes'),
          fetchAuditorias(),
        ]);

        setClientes(clientesResponse.data || []);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        toast.error('Erro ao carregar dados da página.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchAuditorias]);

  const handleSalvarAuditoria = async (agendamento) => {
    setIsSaving(true);
    try {
      await api.post('/auditorias/agendar', agendamento);
      toast.success('Auditoria agendada com sucesso!');
      await fetchAuditorias();
    } catch (err) {
      console.error("Erro ao agendar auditoria:", err);
      toast.error('Erro ao agendar a auditoria.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando dados...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <PageCabecalho title="Agenda de Auditorias" backTo="/" />
        <TabelaAuditoriasFuturas
          auditorias={auditorias}
          setAuditorias={setAuditorias}
        />
        <FormularioAgendamento
          clientes={clientes}
          onSave={handleSalvarAuditoria}
          isSaving={isSaving}
        />
      </Stack>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </Container>
  );
};

export default AgendaAuditorias;