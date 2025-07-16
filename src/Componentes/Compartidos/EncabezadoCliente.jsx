import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, LogoutOutlined, UserOutlined, ShopOutlined,CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoCliente = () => {
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

  const handleMenuClick = async (key) => {
    switch (key) {
      case "home":
        navigate('/cliente/');
        break;
      case "hotelesc":
        navigate('/cliente/hotelesc');
        break;
      case "MisReservas":
        navigate('/cliente/historial-reservas');
        break;
        case "pagos":
        navigate('/cliente/catalopagos');
        break;
      case "MiPerfil":
        navigate('/cliente/perfilusuario');
        break;
      case "cerrarSesion":
        try {
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
        break;
      default:
        console.log("Opción no reconocida.");
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
          --color-primary: #000000;
          --color-secondary: #FFFFFF;
          --color-hover: #A9DFBF;
          --color-icon-home: #1E90FF; /* Blue for Home */
          --color-icon-shop: #FFD700; /* Gold for Shop/Alojamientos */
          --color-icon-user: #9932CC;
          --color-icon-usercalendar:rgb(50, 204, 99); /* Purple for User/Mis Reservas & Perfil */
          --color-icon-logout: #FF4500; /* Red for Logout */
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          background-color: #2d3e57;
          color: var(--color-secondary);
          font-family: 'Segoe UI', sans-serif;
        }

        .logo {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .logo img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .logo h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--color-secondary);
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
          transition: background-color 0.3s ease;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: var(--color-secondary);
          color: var(--color-primary);
          border-radius: 5px;
        }

        .mobile-menu-icon {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background-color: var(--color-secondary);
        }

        @media (max-width: 768px) {
          .menu ul {
            display: none;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: -100%;
            width: 70%;
            height: 100%;
            background-color: var(--color-primary);
            padding: 20px;
            transition: left 0.3s ease-in-out;
          }

          .menu.menu-open ul {
            display: flex;
            left: 0;
          }

          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo de la Empresa" />
          )}
          <h3>{nombreEmpresa}</h3>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className={active === 'home' ? 'active' : ''} onClick={() => { handleClick('home'); handleMenuClick('home'); }}>
              <HomeOutlined style={{ color: 'var(--color-icon-home)' }} />
              Home
            </li>
            <li onClick={() => handleMenuClick('hotelesc')}>
              <ShopOutlined style={{ color: 'var(--color-icon-shop)' }} />
              Alojamientos
            </li>
            <li onClick={() => handleMenuClick('MisReservas')}>
              <CalendarOutlined style={{ color: 'var(--color-icon-usercalendar)' }} />
              Mis Reservas
            </li>
            <li onClick={() => handleMenuClick('pagos')}>
              <CalendarOutlined style={{ color: 'var(--color-icon-usercalendar)' }} />
              Pagos
            </li>
            <li onClick={() => handleMenuClick('MiPerfil')}>
              <UserOutlined style={{ color: 'var(--color-icon-user)' }} />
              Perfil
            </li>
            <li className={active === 'cerrarSesion' ? 'active' : ''} onClick={() => { handleClick('cerrarSesion'); handleMenuClick('cerrarSesion'); }}>
              <LogoutOutlined style={{ color: 'var(--color-icon-logout)' }} />
              Cerrar Sesión
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

export default EncabezadoCliente;