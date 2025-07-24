import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, LoginOutlined, BankOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoPublico = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/perfilF');
        const data = response.data;
        setNombreEmpresa(data.NombreEmpresa || 'Nombre no disponible');
        setLogoUrl(data.Logo ? `data:image/jpeg;base64,${data.Logo}` : '');
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "home":
        navigate('/');
        break;
      case "hoteles":
        navigate('/hotelesp');
        break;
      case "login":
        navigate('/login');
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --color-primary: #2C3E50; 
          --color-secondary: #ECF0F1; 
          --color-highlight: #2980B9;
          --color-hover: #3498DB;
          --color-mobile-bg: #34495E;
          --color-mobile-text: #FFFFFF;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 5vw;
          background-color: var(--color-primary);
          color: var(--color-secondary);
          position: relative;
          z-index: 100;
        }

        .logo {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .logo img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .logo h3 {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--color-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu ul {
          display: flex;
          gap: 15px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-secondary);
          transition: background-color 0.3s, color 0.3s;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: var(--color-highlight);
          border-radius: 5px;
        }

        .mobile-menu-icon {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
          z-index: 200;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background-color: var(--color-secondary);
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .header {
            padding: 14px 2vw;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: stretch;
            padding: 0 0 0 0;
            min-height: 64px;
          }
          .logo {
            justify-content: center;
            padding: 12px 0 8px 0;
          }
          .logo h3 {
            font-size: 1rem;
            max-width: 120px;
            text-align: center;
          }
          .menu {
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
          .menu ul {
            flex-direction: column;
            position: fixed;
            top: 0;
            left: -100%;
            width: 80vw;
            max-width: 340px;
            height: 100vh;
            background-color: var(--color-mobile-bg);
            padding: 32px 20px 20px 20px;
            transition: left 0.3s cubic-bezier(.77,0,.18,1);
            box-shadow: 2px 0 8px rgba(0,0,0,0.18);
            z-index: 150;
          }
          .menu.menu-open ul {
            left: 0;
          }
          .menu ul li {
            padding: 20px 10px;
            border-bottom: 1px solid var(--color-hover);
            color: var(--color-mobile-text);
            font-size: 1.1rem;
          }
          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo Empresa" />
          )}
          <h3>{nombreEmpresa}</h3>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className={active === 'home' ? 'active' : ''} onClick={() => { handleClick('home'); handleMenuClick('home'); }}>
              <HomeOutlined style={{ color: '#2ECC71' }} />
              Inicio
            </li>
            <li className={active === 'hoteles' ? 'active' : ''} onClick={() => { handleClick('hoteles'); handleMenuClick('hoteles'); }}>
              <BankOutlined style={{ color: '#E67E22' }} />
              Hoteles
            </li>
            <li className={active === 'login' ? 'active' : ''} onClick={() => { handleClick('login'); handleMenuClick('login'); }}>
              <LoginOutlined style={{ color: '#E74C3C' }} />
              Iniciar sesión
            </li>
          </ul>
        </nav>
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
        </div>
      </header>
    </>
  );
};

export default EncabezadoPublico;
