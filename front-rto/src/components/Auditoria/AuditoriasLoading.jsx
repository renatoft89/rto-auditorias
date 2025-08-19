import React from 'react';

import '../../styles/Auditorias/index.css';

const AuditoriaLoading = () => (
  <div className="auditorias-page">
    <div className="auditorias-container">
      <div className="loading-card">
        <p className="loading-text">Carregando...</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default AuditoriaLoading;