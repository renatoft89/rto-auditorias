import React from 'react';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import '../../styles/Auditorias/index.css';

const opcoes = [
  { valor: 'CF', texto: 'Conforme' },
  { valor: 'PC', texto: 'Conformidade Parcial' },
  { valor: 'NC', texto: 'Não Conforme' },
  { valor: 'NE', texto: 'Não Existe' },
];

const AuditoriaPerguntas = ({ pergunta, respostaSelecionada, onRespostaChange }) => (
  <div className="card-content">
    <h2 className="question-title">
      {pergunta.ordem_pergunta} - {pergunta.descricao_pergunta}
    </h2>
    <div className="options-container">
      {opcoes.map(opcao => (
        <div
          key={opcao.valor}
          className={`option-item ${respostaSelecionada === opcao.valor ? 'selected' : ''}`}
          onClick={() => onRespostaChange(pergunta.id, opcao.valor)}
        >
          <FormControlLabel
            control={
              <Radio
                checked={respostaSelecionada === opcao.valor}
                value={opcao.valor}
                icon={<RadioButtonUncheckedIcon className="radio-icon" />}
                checkedIcon={<RadioButtonCheckedIcon className="radio-icon checked" />}
              />
            }
            label={<span className="option-label">{opcao.texto}</span>}
          />
        </div>
      ))}
    </div>
  </div>
);

export default AuditoriaPerguntas;