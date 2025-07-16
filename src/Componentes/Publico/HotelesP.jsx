import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  Grid,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import { LocationOn, StarBorder, Star, Visibility, Room } from '@mui/icons-material';

const colors = {
  primary: '#FF6B35',      // Naranja vibrante
  accent: '#8B4C99',       // Morado profundo
  dark: '#2D1B39',         // Negro-morado oscuro
  secondary: '#E85A4F',    // Naranja-rojizo
  light: '#F4E4C1',       // Crema cálido
  gold: '#FFB347',        // Dorado suave
  deepPurple: '#4A1A4A',  // Morado muy oscuro
};

const HotelesP = () => {
  const [hoteles, setHoteles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHoteles();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    }
  }, []);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/detallehotel/public');
      const hotelesData = response.data.map(hotel => {
        let imagenParsed = { data: null, mimeType: 'image/jpeg' };
        try {
          if (hotel.imagen) {
            if (typeof hotel.imagen === 'object' && hotel.imagen.data && hotel.imagen.mimeType) {
              imagenParsed = hotel.imagen;
            } else if (typeof hotel.imagen === 'string' && hotel.imagen.includes('base64')) {
              imagenParsed = { data: hotel.imagen, mimeType: 'image/jpeg' };
            } else if (typeof hotel.imagen === 'string') {
              const parsed = JSON.parse(hotel.imagen);
              imagenParsed = { data: parsed.data || hotel.imagen, mimeType: parsed.mimeType || 'image/jpeg' };
            }
          }
          if (!imagenParsed.data) {
            imagenParsed.data = 'https://via.placeholder.com/320x180/FF6B35/ffffff?text=Hotel+Premium';
          }
        } catch (error) {
          imagenParsed.data = 'https://via.placeholder.com/320x180/FF6B35/ffffff?text=Hotel+Premium';
          console.warn('Error al parsear imagen para hotel', hotel.id_hotel, error);
        }
        return {
          ...hotel,
          id: hotel.id_hotel,
          imagen: imagenParsed
        };
      });
      setHoteles(hotelesData);
    } catch (error) {
      console.error('Error al obtener hoteles:', error);
    }
  };

  const handleDetailsClick = (hotel) => {
    navigate(`/detalles-hoteles/${hotel.id}`);
  };

  const handleLocationClick = (hotel) => {
    const hotelLat = parseFloat(hotel.latitud);
    const hotelLng = parseFloat(hotel.longitud);
    let url = '';

    const userLat = userLocation ? userLocation.lat : 19.4326;
    const userLng = userLocation ? userLocation.lng : -99.1332;

    url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hotelLat},${hotelLng}&travelmode=driving`;

    window.open(url, '_blank');
  };

  const handleImageClick = (hotel) => {
    navigate(`/cuartosp/${hotel.id}`);
  };

  const handleRatingChange = (hotelId, newValue) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [hotelId]: newValue
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FDF7F0',
        py: 4,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${colors.light}30 0%, transparent 30%),
          radial-gradient(circle at 80% 80%, ${colors.primary}10 0%, transparent 30%),
          radial-gradient(circle at 40% 60%, ${colors.accent}08 0%, transparent 30%)
        `,
      }}
    >
      {/* Header Section */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            background: `
              linear-gradient(135deg, ${colors.primary}95 0%, ${colors.accent}95 50%, ${colors.dark}95 100%),
              url('https://img.freepik.com/vector-gratis/salvapantallas-mexicano-colorido-pajaros_23-2148443473.jpg')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: `2px solid ${colors.gold}40`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
             
              borderRadius: 4,
              zIndex: -1,
            }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#000000',
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.2rem', md: '3rem' },
              letterSpacing: 1.5,
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 1px 2px rgba(255,255,255,0.6)',
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Hoteles Xantolo
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000000',
              fontWeight: 600,
              position: 'relative',
              zIndex: 2,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.2rem' },
              textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 1px 2px rgba(255,255,255,0.6)',
              fontStyle: 'italic',
              
              padding: '8px 16px',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
            }}
          >
            Experiencias únicas en la tradición del Día de los Muertos
          </Typography>
        </Paper>
      </Container>

      {/* Hotels Grid - Centrado */}
      <Container maxWidth="xl">
        <Grid container spacing={3} justifyContent="center">
          {hoteles.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={hotel.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: `0 8px 32px rgba(255, 107, 53, 0.15)`,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  bgcolor: '#ffffff',
                  border: `2px solid ${colors.gold}30`,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: `0 20px 40px rgba(139, 76, 153, 0.25)`,
                    border: `2px solid ${colors.gold}60`,
                    '& .hotel-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .hotel-overlay': {
                      opacity: 1,
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent}, ${colors.gold})`,
                    zIndex: 1,
                  }
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      hotel.imagen && hotel.imagen.data && hotel.imagen.mimeType
                        ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`
                        : 'https://via.placeholder.com/320x200/FF6B35/ffffff?text=Hotel+Premium'
                    }
                    alt={hotel.nombrehotel}
                    onClick={() => handleImageClick(hotel)}
                    className="hotel-image"
                    sx={{
                      cursor: 'pointer',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      filter: 'brightness(0.95) contrast(1.05)',
                    }}
                  />
                  <Box
                    className="hotel-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(45deg, ${colors.dark}85, ${colors.accent}70)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <IconButton
                      onClick={() => handleImageClick(hotel)}
                      sx={{
                        bgcolor: colors.gold,
                        color: colors.dark,
                        size: 'medium',
                        '&:hover': {
                          bgcolor: colors.primary,
                          color: '#ffffff',
                          transform: 'scale(1.15)',
                        },
                        boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <Visibility fontSize="medium" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      color: colors.dark,
                      mb: 1.5,
                      fontSize: '1.2rem',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {hotel.nombrehotel}
                  </Typography>
                  
                  {hotel.promociones && hotel.promociones.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      {hotel.promociones.map((promo, index) => (
                        <Chip
                          key={index}
                          label={`¡Promoción Especial! ${promo.descuento}%`}
                          size="small"
                          sx={{
                            bgcolor: colors.secondary,
                            color: '#ffffff',
                            fontWeight: 700,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            mb: 0.5,
                            height: 22,
                            boxShadow: `0 2px 8px rgba(232, 90, 79, 0.3)`,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Room sx={{ color: colors.accent, mr: 0.5, fontSize: '1rem' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.deepPurple,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {hotel.direccion || 'Ubicación premium'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: colors.gold, opacity: 0.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={`${hotel.numhabitacion} Habitaciones`}
                      size="small"
                      sx={{
                        bgcolor: colors.accent,
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        height: 26,
                        boxShadow: `0 2px 8px rgba(139, 76, 153, 0.3)`,
                      }}
                    />
                    <Rating
                      name={`rating-${hotel.id}`}
                      value={ratings[hotel.id] || 0}
                      onChange={(event, newValue) => handleRatingChange(hotel.id, newValue)}
                      precision={0.5}
                      size="small"
                      emptyIcon={<StarBorder fontSize="inherit" />}
                      icon={<Star fontSize="inherit" />}
                      sx={{ 
                        color: colors.gold,
                        '& .MuiRating-icon': {
                          fontSize: '1.1rem',
                        },
                        '& .MuiRating-iconFilled': {
                          color: colors.gold,
                        },
                        '& .MuiRating-iconEmpty': {
                          color: colors.light,
                        }
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2.5, pt: 0, gap: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleDetailsClick(hotel)}
                    size="medium"
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      bgcolor: colors.primary,
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${colors.secondary}, ${colors.accent})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px rgba(255, 107, 53, 0.4)`,
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px rgba(255, 107, 53, 0.3)`,
                    }}
                  >
                    Ver Detalles
                  </Button>
                  <Tooltip title="Ver ubicación" arrow>
                    <IconButton
                      onClick={() => handleLocationClick(hotel)}
                      size="medium"
                      sx={{
                        bgcolor: colors.light,
                        color: colors.dark,
                        border: `2px solid ${colors.gold}40`,
                        '&:hover': {
                          bgcolor: colors.gold,
                          color: colors.dark,
                          border: `2px solid ${colors.gold}80`,
                          transform: 'scale(1.1)',
                          boxShadow: `0 4px 12px rgba(255, 179, 71, 0.4)`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <LocationOn fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HotelesP;