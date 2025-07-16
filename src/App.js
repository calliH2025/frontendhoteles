import React from 'react';
import { Routes, Route , useParams} from 'react-router-dom';
import LayoutConEncabezado from './Componentes/Layout/LayoutConEncabezado';
import PaginaPrincipal from './Paginas/PaginaPrincipal';
import PaginaPrincipalAdministrativa from './Paginas/PaginaPrincipalAdministrativa';
import PaginaPrincipalCliente from './Paginas/PaginaPrincipalCliente';
import { ThemeProvider } from './Componentes/Temas/ThemeContext';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import Login from './Componentes/Autenticacion/Login';
import Registro from './Componentes/Autenticacion/Registro';
import VerificarCorreo from './Componentes/Autenticacion/VerificarCorreo';
import ValidarCodigo from './Componentes/Autenticacion/ValidarCodigo';
import SolicitarCodigo from './Componentes/Autenticacion/SolicitarCodigo';
import CambiarPassword from './Componentes/Autenticacion/CambiarPassword';
import PoliticasPCA from './Componentes/Compartidos/PoliticasPCA';
import TerminosPCA from './Componentes/Compartidos/TerminosPCA';
import VisionPCA from './Componentes/Compartidos/VisionPCA';
import MisionPCA from './Componentes/Compartidos/MisionPCA';

//rutas publicas
import DetallesHotel from './Componentes/Publico/DetallesHotel';
import HotelesP from './Componentes/Publico/HotelesP';
import CuartosP from './Componentes/Publico/CuartosP';
import DetallesHabitacion from './Componentes/Publico/DetalleHabitacion';
//rutas cliente
import HotelesC from './Componentes/Cliente/HotelesC';
import CuartosC from './Componentes/Cliente/CuartosC';
import DetallesHabitacionC from './Componentes/Cliente/DetalleHabitacionC';
import DetallesHotelC from './Componentes/Cliente/DetallesHotelC';
import HistorialReservas from './Componentes/Cliente/HistorialReservas';
import PerfilUsuario from './Componentes/Cliente/PerfilUsuario';
//rutas propietario
import PaginaPrincipalPropietario from './Paginas/PaginaPrincipalPropietario';
import CuartosPropietario from './Componentes/Propietario/Cuartos';
import HotelPropietario from './Componentes/Propietario/Hoteles';
import TipoHabitacionPropietario from './Componentes/Propietario/TiposHabitaciones';
import Promociones from './Componentes/Propietario/Promociones';
import GestionReservas from './Componentes/Propietario/GestionReservas';
import Reportes from './Componentes/Propietario/Reportes';
import ConexionMP from './Componentes/Propietario/ConexionMP';
import ConexionExitosa from './Componentes/Propietario/ConexionExitosa';
//rutas administrativas
import GestionUsuarios from './Componentes/Administrativo/GestionUsuarios';
import GestionHoteles from './Componentes/Administrativo/GestionHoteles';
import Terminos from './Componentes/Administrativo/Terminos';
import Vision from './Componentes/Administrativo/Vision';
import Mision from './Componentes/Administrativo/Mision';
import Politicas from './Componentes/Administrativo/Politica';
import Perfil from './Componentes/Administrativo/Perfil';
import GestionReservasAd from './Componentes/Administrativo/GestionReservasad';
import EstadisticasGenerales from './Componentes/Administrativo/EstadisticasGenerales';
import GestionPromociones from './Componentes/Administrativo/GestionPromociones';
import RegistroCatalogoPagos from './Componentes/Administrativo/RegistroCatalogoPagos';
import CataloPagos from './Componentes/Cliente/CatalogoDePagos';

const CuartosPWrapper = () => {
  const { idHotel } = useParams(); // Extrae idHotel de la URL
  return <CuartosP idHotel={idHotel} />; 
};
const CuartosCWrapper = () => {
  const { idHotel } = useParams(); // Extrae idHotel de la URL
  return <CuartosC idHotel={idHotel} />;
  
};


const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutConEncabezado>
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-correo" element={<VerificarCorreo />} />
            <Route path="/validar-codigo" element={<ValidarCodigo />} />
            <Route path="/verificar_correo" element={<SolicitarCodigo />} />
            <Route path="/hotelesp" element={<HotelesP />} />
            <Route path="/cuartosp/:idHotel" element={<CuartosPWrapper />} />
            <Route path="/detalles-habitacion/:idHabitacion" element={<DetallesHabitacion />} />
            <Route path="/cambiar_password" element={<CambiarPassword />} />
            <Route path="/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/terminospca" element={<TerminosPCA/>} />
            <Route path="/visionpca" element={<VisionPCA/>} />
            <Route path="/misionpca" element={<MisionPCA/>} />
            <Route path="/detalles-hoteles/:id" element={<DetallesHotel />} />
            
            
            {/* Rutas para la administración */}

            <Route path="/admin" element={<PaginaPrincipalAdministrativa />} />
            <Route path="/admin/perfil" element={<Perfil />} />
            <Route path="admin/politicas" element={<Politicas/>} />
            <Route path="/admin/terminos" element={<Terminos />} />
            <Route path="/admin/vision" element={<Vision />} />
            <Route path="/admin/mision" element={<Mision />} />
            <Route path="/admin/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/admin/terminospca" element={<TerminosPCA/>} />
            <Route path="/admin/visionpca" element={<VisionPCA/>} />
            <Route path="/admin/misionpca" element={<MisionPCA/>} />
            <Route path="/admin/perfilusuario" element={<PerfilUsuario />} />
            <Route path="/admin/gestionusuarios" element={<GestionUsuarios />} />
            <Route path="/admin/gestionhoteles" element={<GestionHoteles />} />
            <Route path="/admin/gestionreservasad" element={<GestionReservasAd />} />
            <Route path="/admin/estadisticas" element={<EstadisticasGenerales />} />
            <Route path="/admin/gestionpromociones" element={<GestionPromociones />} />
            <Route path="/admin/metodopago" element={<RegistroCatalogoPagos />} />

            {/* Rutas para el cliente */}
            <Route path="/cliente" element={<PaginaPrincipalCliente />} />
            <Route path="/cliente/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/cliente/terminospca" element={<TerminosPCA/>} />
            <Route path="/cliente/visionpca" element={<VisionPCA/>} />
            <Route path="/cliente/misionpca" element={<MisionPCA/>} />
            <Route path="/cliente/hotelesc" element={<HotelesC/>} />
            <Route path="/cliente/cuartosc/:idHotel" element={<CuartosCWrapper/>} />
            <Route path="/cliente/detalles-habitacionc/:idHabitacion" element={<DetallesHabitacionC />} />
            <Route path="/cliente/detalles-hoteles/:id" element={<DetallesHotelC />} />
            <Route path="/cliente/historial-reservas" element={<HistorialReservas />} />
            <Route path="/cliente/perfilusuario" element={<PerfilUsuario />} />
            <Route path="/cliente/catalopagos" element={<CataloPagos />} />


            {/* Rutas para el propietario */}
            <Route path="/propietario" element={<PaginaPrincipalPropietario />} />
            <Route path="/propietario/cuartos/:id" element={<CuartosPropietario />} />
            <Route path="/propietario/hoteles" element={<HotelPropietario />} />
            <Route path="/propietario/tiposhabitaciones" element={<TipoHabitacionPropietario />} />
            <Route path="/propietario/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/propietario/terminospca" element={<TerminosPCA/>} />
            <Route path="/propietario/visionpca" element={<VisionPCA/>} />
            <Route path="/propietario/misionpca" element={<MisionPCA/>} />
            <Route path="/propietario/promociones" element={<Promociones />} />
            <Route path="/propietario/perfilusuario" element={<PerfilUsuario />} />
            <Route path="/propietario/gestionreservas" element={<GestionReservas />} />
            <Route path="/propietario/reportes" element={<Reportes />} />
            <Route path="/propietario/conexionmp" element={<ConexionMP />} />
            <Route path="/propietario/conexion-exitosa" element={<ConexionExitosa />} />

            {/* Rutas para el cliente */}
            
          </Routes>
        </LayoutConEncabezado>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;