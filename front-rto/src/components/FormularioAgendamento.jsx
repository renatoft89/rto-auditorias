import React, { useState } from 'react';
import {
  Typography, Box, TextField, Autocomplete, Paper
} from '@mui/material';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const FormularioAgendamento = ({ clientes, onSave, isSaving }) => {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [observacoes, setObservacoes] = useState('');

  const handleSalvar = async () => {
    if (!clienteSelecionado || !dataSelecionada) {
      toast.error('Por favor, selecione um cliente e uma data.');
      return;
    }

    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      toast.error('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }
    const userData = JSON.parse(userDataString);

    const agendamento = {
      cliente: clienteSelecionado,
      usuario: userData,
      data_auditoria: format(dataSelecionada, 'yyyy-MM-dd'),
      observacoes: observacoes,
    };

    await onSave(agendamento);
    setClienteSelecionado(null);
    setDataSelecionada(new Date());
    setObservacoes('');
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
        Criar Agendamento
      </Typography>

      <Autocomplete
        options={clientes}
        getOptionLabel={(option) => option.razao_social}
        value={clienteSelecionado}
        onChange={(event, newValue) => {
          setClienteSelecionado(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Selecione o Cliente" required />}
        sx={{ mb: 3 }}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <MobileDatePicker
          label="Data da Auditoria"
          value={dataSelecionada}
          onChange={(newValue) => setDataSelecionada(newValue)}
          minDate={new Date()}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: 'Selecione a data para a visita',
              required: true,
            },
          }}
          sx={{ mb: 3 }}
        />
      </LocalizationProvider>

      <TextField
        label="Observações"
        name="observacoes"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleSalvar}
        fullWidth
        disabled={!clienteSelecionado || isSaving}
        startIcon={<AddCircleOutlineIcon />}
        size="large"
        sx={{
          py: 1.5,
          textTransform: 'none',
          fontSize: '1rem',
          backgroundColor: '#580f34',
          '&:hover': {
            backgroundColor: '#4a0c2b',
          },
        }}
      >
        Agendar Auditoria
      </Button>
    </Paper>
  );
};

export default FormularioAgendamento;