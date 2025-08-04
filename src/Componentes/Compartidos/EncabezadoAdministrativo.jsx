import React, { useState, useRef, useEffect } from 'react';
import { LogoutOutlined, HomeOutlined, FileTextOutlined,UserOutlined,ApartmentOutlined,TeamOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/perfilF');
        const data = response.data;

        console.log('Datos recibidos del backend:', data); // Depuración

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
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "politicas":
        navigate('/admin/politicas');
        break;
      case "home":
        navigate('/admin/');
        break;
      case "terminos":
        navigate('/admin/terminos');
        break;
      case "perfil":
        navigate('/admin/perfil');
        break;
      case "mision":
        navigate('/admin/mision');
        break;
      case "vision":
        navigate('/admin/vision');
        break;
      case "Alojamientos":
        navigate('/admin/gestionhoteles');
        break;
      case "Usuarios":
        navigate('/admin/gestionusuarios');
        break;
      case "Reservas":
        navigate('/admin/gestionreservasad');
        break;
      case "Estadisticas":
        navigate('/admin/estadisticas');
        break;
      case "Promociones":
        navigate('/admin/gestionpromociones');
        break;
      case "MetodoPago":
        navigate('/admin/metodopago');
        break;
      case "PerfilUsuario":
        navigate('/admin/perfilusuario');
        break;
      case "cerrarSesion":
        handleLogout();
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
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
          --color-highlight: #4682B4;
          --color-hover: #A9DFBF;
          --color-mobile-bg: #000000;
          --color-mobile-text: #FFFFFF;
          --color-icon:rgb(13, 226, 34);
          --color-icon2:rgb(175, 185, 30);
          --color-icon3:rgb(145, 7, 157);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          background-color: #2d3e57;
          color: var(--color-secondary);
          position: relative;
          flex-wrap: wrap;
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
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-secondary);
        }

        .menu {
          flex: 2;
          display: flex;
          justify-content: flex-end;
        }

        .menu ul {
          display: flex;
          gap: 15px;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
          color: var(--color-secondary);
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: var(--color-highlight);
          border-radius: 5px;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          left: 0;
          top: 100%;
          background-color: var(--color-primary);
          list-style: none;
          padding: 12px;
          margin-top: 10px;
          border-radius: 5px;
          z-index: 10;
          min-width: 180px;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
        }

        @media (max-width: 768px) {
          .dropdown:hover .dropdown-menu {
            display: none;
          }
        }

        .dropdown-menu li {
          padding: 8.5px 12px;
          cursor: pointer;
          color: var(--color-secondary);
        }

        .mobile-menu-icon {
          display: none;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background-color: var(--color-secondary);
        }

        @media (max-width: 768px) {
          .menu ul {
            flex-direction: column;
            position: fixed;
            top: 0;
            left: -100%;
            width: 70%;
            height: 100%;
            background-color: var(--color-mobile-bg);
            padding: 20px;
            transition: left 0.3s ease-in-out;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
            z-index: 999;
            overflow-y: auto;
          }

          .menu.menu-open ul {
            left: 0;
          }

          .menu ul li {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
            border-bottom: 1px solid var(--color-hover);
            color: var(--color-mobile-text);
          }

          .dropdown-menu {
            display: ${openDropdown ? 'block' : 'none'} !important;
            position: static !important;
            background-color: transparent !important;
            padding: 0 !important;
            margin-top: 10px;
          }

          .dropdown-menu li {
            padding: 10px 20px;
            background-color: var(--color-primary);
            color: var(--color-secondary);
            border-bottom: 1px solid var(--color-hover);
          }

          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          {logoUrl && <img src={logoUrl} alt="Logo de la Empresa" />}
          <h3>{nombreEmpresa}</h3>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => handleMenuClick('home')}>
              <HomeOutlined style={{ color: 'pink' }} />
              Home
            </li>
            
            <li
              className="dropdown"
              onClick={() => toggleDropdown('empresa')}
            >
              <span>
                <FileTextOutlined style={{ color: 'orange' }} />
                Datos de la Empresa
              </span>
              <ul className="dropdown-menu" style={{ display: openDropdown === 'empresa' ? 'block' : 'none' }}>
                <li onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>Perfil</li>
                <li onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>Términos</li>
                <li onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>Políticas</li>
                <li onClick={() => { handleClick('mision'); handleMenuClick('mision'); }}>Misión</li>
                <li onClick={() => { handleClick('vision'); handleMenuClick('vision'); }}>Visión</li>
              </ul>
            </li>

            <li
              className="dropdown"
              onClick={() => toggleDropdown('gestiongeneral')}
            >
              <span>
                <ShopOutlined style={{ color: 'var(--color-icon)' }} />
                Gestión General
              </span>
              <ul className="dropdown-menu" style={{ display: openDropdown === 'gestiongeneral' ? 'block' : 'none' }}>
                <li onClick={() => { handleClick('Alojamientos'); handleMenuClick('Alojamientos'); }}>Hoteles</li>
                <li onClick={() => { handleClick('Reservas'); handleMenuClick('Reservas'); }}>Reservas</li>
                <li onClick={() => { handleClick('Estadisticas'); handleMenuClick('Estadisticas'); }}>Estadísticas</li>
                <li onClick={() => { handleClick('Promociones'); handleMenuClick('Promociones'); }}>Promociones</li>
                <li onClick={() => { handleClick('MetodoPago'); handleMenuClick('MetodoPago'); }}>Método de Pago</li>
              </ul>
            </li>

            <li onClick={() => handleMenuClick('Usuarios')}>
              <TeamOutlined style={{ color: 'var(--color-icon2)' }} />
              Gestion de Usuarios
            </li>

            <li onClick={() => handleMenuClick('PerfilUsuario')}>
              <UserOutlined style={{ color: 'var(--color-icon3)' }} />
              Perfil
            </li>

            <li onClick={() => handleMenuClick('cerrarSesion')}>
              <LogoutOutlined style={{ color: 'Red' }} />
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

export default EncabezadoAdministrativo;