import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import EncabezadoPublico from '../Compartidos/EncabezadoPublico';
import EncabezadoAdministrativo from '../Compartidos/EncabezadoAdministrativo';
import EncabezadoCliente from '../Compartidos/EncabezadoCliente';
import EncabezadoPropietario from '../Compartidos/EncabezadoPropietario';
import PieDePaginaCliente from '../Compartidos/PieDePaginaCliente';
import PieDePaginaAdmin from '../Compartidos/PieDePaginaAdmin';
import PieDePagina from '../Compartidos/PieDePagina';
import PieDePaginaPropietario from '../Compartidos/PieDePaginaPropietario';
import { useTheme } from '../Temas/ThemeContext';
import { useAuth } from '../Autenticacion/AuthContext';

const LayoutConEncabezado = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();

  let encabezado;
  let pieDePagina;

  if (location.pathname.startsWith('/admin')) {
    if (!user) {
      return <Navigate to="/" replace />; 
    }
    encabezado = <EncabezadoAdministrativo />;
    pieDePagina = <PieDePaginaAdmin />;
  } else if (location.pathname.startsWith('/cliente')) {
    if (!user) {
      return <Navigate to="/" replace />; 
    }
    encabezado = <EncabezadoCliente />;
    pieDePagina = <PieDePaginaCliente />;
  } else if (location.pathname.startsWith('/propietario')) {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    encabezado = <EncabezadoPropietario />;
    pieDePagina = <PieDePaginaPropietario />;
  } else {
    encabezado = <EncabezadoPublico />;
    pieDePagina = <PieDePagina />;
  }

  return (
    <div className={`layout-container ${theme}`}>
      <header>{encabezado}</header>
      <main className="content">{children}</main>
      <footer>{pieDePagina}</footer>

      <style>{`
        :root {
          --min-header-footer-height: 60px; 
        }

        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }

        .layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .content {
          flex-grow: 1;
          background-color: ${theme === 'dark' ? '#1d1d1d' : '#ffffff'};
          color: ${theme === 'dark' ? '#ffffff' : '#000000'};
        }

        header, footer {
          width: 100%;
          min-height: var(--min-header-footer-height);
          box-sizing: border-box;
          background-color: ${theme === 'dark' ? '#333' : '#FFA500'};
        }

        footer {
          background-color: ${theme === 'dark' ? '#d45d00' : '#d45d00'};
        }
      `}</style>
    </div>
  );
};

export default LayoutConEncabezado;