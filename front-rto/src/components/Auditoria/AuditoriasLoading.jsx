import React from 'react';
import LoadingIndicator from '../LoadingIndicator';

import '../../styles/Auditorias/index.css';

const AuditoriaLoading = () => (
  <div className="auditorias-page">
    <div className="auditorias-container">
      <div className="loading-card">
        <LoadingIndicator message="Carregando auditorias..." />
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default AuditoriaLoading;