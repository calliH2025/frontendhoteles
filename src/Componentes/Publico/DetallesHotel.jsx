import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Person as PersonIcon } from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  Container, 
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Rating,
  Grid
} from '@mui/material';
import { LocationOn, Directions, Hotel, Phone, Email, Home, Info, RoomService } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar el ícono personalizado naranja
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DetallesHoteles = () => {
  const { id } = useParams(); // Obtener el ID del hotel desde los parámetros de la URL
  const navigate = useNavigate(); // Hook para redirigir a otras rutas
  const [hotel, setHotel] = useState(null); // Estado para almacenar los datos del hotel
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [comentarios, setComentarios] = useState([]); // Estado para los comentarios

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://backendreservas-m2zp.onrender.com/api/detallehotel/public/${id}`);
        let imagenParsed = null;
        try {
          if (response.data.imagen) {
            if (typeof response.data.imagen === 'object' && response.data.imagen.data && response.data.imagen.mimeType) {
              imagenParsed = response.data.imagen;
            } else {
              const parsed = JSON.parse(response.data.imagen);
              if (parsed.data && parsed.mimeType) {
                imagenParsed = { data: parsed.data, mimeType: parsed.mimeType };
              } else {
                imagenParsed = { data: response.data.imagen, mimeType: 'image/jpeg' };
              }
            }
          }
        } catch (parseError) {
          imagenParsed = { data: response.data.imagen, mimeType: 'image/jpeg' };
        }
        const hotelData = {
          ...response.data,
          id: response.data.id_hotel,
          imagen: imagenParsed
        };
        setHotel(hotelData);
        setError(null);
      } catch (error) {
        console.error('Error al obtener detalles del hotel:', error);
        setError(`No se pudieron cargar los detalles del hotel: ${error.message}. Por favor, verifica que el servidor esté corriendo y el ID sea correcto.`);
      } finally {
        setLoading(false);
      }
    };

    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`https://backendreservas-m2zp.onrender.com/api/detallehotel/hotel/${id}`);
        setComentarios(response.data);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchHotel();
    fetchComentarios();
  }, [id]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)',
    border: '2px solid #FFB347',
  };

  const center = hotel && hotel.latitud && hotel.longitud ? {
    lat: parseFloat(hotel.latitud),
    lng: parseFloat(hotel.longitud)
  } : {
    lat: 19.4326, // Default: Ciudad de México
    lng: -99.1332
  };

  const getGoogleMapsLink = () => {
    if (!hotel || !hotel.latitud || !hotel.longitud) return '#';
    const hotelLat = parseFloat(hotel.latitud);
    const hotelLng = parseFloat(hotel.longitud);
    return `https://www.google.com/maps/dir/?api=1&destination=${hotelLat},${hotelLng}&travelmode=driving`;
  };

  const handleViewRooms = () => {
    navigate(`/cuartosp/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(255, 140, 0, 0.3)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #FFB347'
        }}>
          <Typography variant="h5" sx={{ color: '#FF8C00', fontWeight: 600 }}>
            Cargando detalles del hotel...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(255, 140, 0, 0.3)',
          background: 'rgba(255, 255, 255, 0.95)',
          maxWidth: 600,
          border: '1px solid #FFB347'
        }}>
          <Typography variant="h5" sx={{ color: '#FF8C00', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </Typography>
        </Card>
      </Box>
    );
  }

  if (!hotel) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(255, 140, 0, 0.3)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #FFB347'
        }}>
          <Typography variant="h5" sx={{ color: '#FF8C00', fontWeight: 600 }}>
            No se encontró el hotel.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        {/* Header con título */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: 4,
            backgroundImage: 'url(https://img.freepik.com/vector-gratis/salvapantallas-mexicano-colorido-pajaros_23-2148443473.jpg?semt=ais_hybrid&w=740)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: '0 12px 40px rgba(255, 140, 0, 0.4)',
            overflow: 'hidden',
            border: '2px solid #FFD700',
            position: 'relative'
          }}
        >
          {/* Overlay para mejorar la legibilidad del texto */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              
            }}
          />
          <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'black',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: 1,
                textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                mb: 1
              }}
            >
              {hotel.nombrehotel}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#1a0329',
                fontWeight: 500,
                opacity: 0.9,
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              Detalles completos del establecimiento
            </Typography>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Información del hotel */}
          <Box sx={{ flex: 2 }}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 179, 71, 0.3)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {/* Nombre */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton sx={{ bgcolor: '#FF8C00', color: 'white', '&:hover': { bgcolor: '#2E0854' } }}>
                      <Hotel />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '0.7rem' }}>
                        NOMBRE DEL HOTEL
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FF8C00', fontWeight: 600, fontSize: '1rem' }}>
                        {hotel.nombrehotel}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#FFB347', opacity: 0.5 }} />

                  {/* Dirección */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton sx={{ bgcolor: '#2E0854', color: 'white', '&:hover': { bgcolor: '#FF8C00' } }}>
                      <Home />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '0.7rem' }}>
                        DIRECCIÓN
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FF8C00', fontWeight: 500, fontSize: '0.9rem' }}>
                        {hotel.direccion || 'Sin dirección disponible'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#FFB347', opacity: 0.5 }} />

                  {/* Contacto */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton sx={{ bgcolor: '#9A4C95', color: 'white', '&:hover': { bgcolor: '#FF8C00' } }}>
                        <Phone />
                      </IconButton>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '0.7rem' }}>
                          TELÉFONO
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FF8C00', fontWeight: 500, fontSize: '0.9rem' }}>
                          {hotel.telefono || 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton sx={{ bgcolor: '#FFB347', color: '#2E0854', '&:hover': { bgcolor: '#FF8C00', color: 'white' } }}>
                        <Email />
                      </IconButton>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '0.7rem' }}>
                          CORREO ELECTRÓNICO
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FF8C00', fontWeight: 500, fontSize: '0.9rem' }}>
                          {hotel.correo || 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#FFB347', opacity: 0.5 }} />

                  {/* Habitaciones */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={`${hotel.numhabitacion} Habitaciones`}
                      sx={{ 
                        bgcolor: '#2E0854', 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 2,
                        '&:hover': { bgcolor: '#9A4C95' }
                      }}
                    />
                  </Box>

                  {/* Descripción */}
                  {hotel.descripcion && (
                    <>
                      <Divider sx={{ borderColor: '#FFB347', opacity: 0.5 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <IconButton sx={{ bgcolor: '#FF8C00', color: 'white' }}>
                            <Info />
                          </IconButton>
                          <Typography variant="body1" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '1rem' }}>
                            Descripción
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#2E0854', 
                            lineHeight: 1.6,
                            backgroundColor: 'rgba(255, 179, 71, 0.1)',
                            p: 3,
                            borderRadius: 2,
                            borderLeft: '4px solid #FF8C00'
                          }}
                        >
                          {hotel.descripcion}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {/* Servicios */}
                  {hotel.servicios && (
                    <>
                      <Divider sx={{ borderColor: '#FFB347', opacity: 0.5 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <IconButton sx={{ bgcolor: '#9A4C95', color: 'white' }}>
                            <RoomService />
                          </IconButton>
                          <Typography variant="body1" sx={{ color: '#2E0854', fontWeight: 600, fontSize: '1rem' }}>
                            Servicios
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#2E0854', 
                            lineHeight: 1.6,
                            backgroundColor: 'rgba(154, 76, 149, 0.1)',
                            p: 3,
                            borderRadius: 2,
                            borderLeft: '4px solid #9A4C95'
                          }}
                        >
                          {hotel.servicios}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Imagen del hotel */}
          <Box sx={{ flex: 1 }}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.98)',
                height: 'fit-content',
                border: '2px solid #FFB347'
              }}
            >
              {hotel.imagen && hotel.imagen.data && hotel.imagen.mimeType ? (
                <img
                  src={`data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`}
                  alt="Hotel"
                  style={{
                    width: '100%',
                    height: '550px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '550px',
                    background: 'linear-gradient(135deg, #2E0854 0%, #9A4C95 50%, #FF8C00 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  <Hotel sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    Imagen no disponible
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Box>

        {/* Botón Ver Habitaciones */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Hotel />}
            onClick={handleViewRooms}
            sx={{ 
              background: 'linear-gradient(135deg, #FF8C00 0%, #FFB347 100%)',
              color: '#2E0854',
              fontWeight: 700,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(255, 140, 0, 0.4)',
              border: '2px solid #FFD700',
              '&:hover': {
                background: 'linear-gradient(135deg, #2E0854 0%, #9A4C95 100%)',
                color: 'white',
                boxShadow: '0 12px 32px rgba(46, 8, 84, 0.5)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Ver Habitaciones Disponibles
          </Button>
        </Box>

        {/* Sección del mapa */}
        <Card 
          sx={{ 
            mt: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(255, 140, 0, 0.2)',
            background: 'rgba(255, 255, 255, 0.98)',
            overflow: 'hidden',
            border: '1px solid #FFB347'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <IconButton 
                sx={{ 
                  bgcolor: '#FF8C00', 
                  color: 'white', 
                  mr: 2,
                  size: 'small',
                  '&:hover': { bgcolor: '#2E0854' }
                }}
              >
                <LocationOn fontSize="small" />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2E0854',
                  fontSize: '1.1rem'
                }}
              >
                Ubicación del Hotel
              </Typography>
            </Box>
            
            <MapContainer center={[center.lat, center.lng]} zoom={19} style={mapContainerStyle}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='© <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
              <Marker position={[center.lat, center.lng]} icon={orangeIcon}>
                <Popup>{hotel.nombrehotel}</Popup>
              </Marker>
            </MapContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Directions />}
                onClick={() => window.open(getGoogleMapsLink(), '_blank')}
                sx={{ 
                  background: 'linear-gradient(135deg, #2E0854 0%, #9A4C95 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(46, 8, 84, 0.4)',
                  border: '1px solid #FFB347',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8C00 0%, #FFB347 100%)',
                    color: '#2E0854',
                    boxShadow: '0 8px 28px rgba(255, 140, 0, 0.5)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Obtener Direcciones
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Sección de comentarios */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#2E0854', fontWeight: 600, mb: 2, textAlign: 'center' }}>
            Comentarios de los Clientes
          </Typography>
          <Grid container spacing={2}>
            {comentarios.map((comentario) => (
              <Grid item xs={12} key={comentario.id_comentario}>
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  boxShadow: '0 4px 12px rgba(255, 140, 0, 0.15)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 179, 71, 0.3)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <PersonIcon sx={{ color: '#FF8C00', mr: 1, fontSize: '18px', mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2E0854' }}>
                          {comentario.Nombre} {comentario.ApellidoP} {comentario.ApellidoM}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9A4C95' }}>
                          {new Date(comentario.fecha).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating 
                      value={comentario.calificacion} 
                      readOnly 
                      sx={{ 
                        mb: 1,
                        '& .MuiRating-iconFilled': {
                          color: '#FF8C00'
                        }
                      }} 
                    />
                    <Typography variant="body1" sx={{ color: '#2E0854', lineHeight: 1.5 }}>
                      {comentario.comentario}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {comentarios.length === 0 && (
              <Typography variant="body2" sx={{ color: '#9A4C95', textAlign: 'center', mt: 2, width: '100%' }}>
                No hay comentarios disponibles.
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DetallesHoteles;