import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '32px',
          margin: '24px auto',
          maxWidth: '800px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', marginBottom: '16px' }}>
            <AlertTriangle size={36} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
            Ocurrió un error al cargar esta sección
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px', fontFamily: 'monospace' }}>
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={16} />
            <span>Recargar Página</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
