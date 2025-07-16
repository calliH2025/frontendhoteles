import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Alert,
  Chip,
  Paper,
  Fade,
} from '@mui/material';
import {
  Hotel,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';

const CuartosP = ({ idHotel }) => {
  const [cuartos, setCuartos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Paleta de colores inspirada en Xantolo
  const colors = {
    primary: '#FF6B35',      // Naranja vibrante (como las flores de cempasúchil)
    secondary: '#2D1B69',    // Morado profundo (misterio y espiritualidad)
    accent: '#1A1A1A',       // Negro elegante (la noche y lo sagrado)
    success: '#FF8C42',      // Naranja claro (disponibilidad y calidez)
    warning: '#FFD23F',      // Dorado (veladoras y ofrendas)
    neutral: '#4A4A4A',      // Gris oscuro
    background: '#FFF8F0',   // Crema cálido
    cardBg: '#FFFFFF',       // Blanco puro
  };

  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
    headerSection: {
      backgroundImage: `url('https://img.freepik.com/vector-gratis/salvapantallas-mexicano-colorido-pajaros_23-2148443473.jpg?semt=ais_hybrid&w=740')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '16px',
      padding: '2.5rem',
      marginBottom: '2rem',
      color: 'black',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
        pointerEvents: 'none',
      }
    },
    gridContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    roomCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      backgroundColor: colors.cardBg,
      boxShadow: '0 4px 20px rgba(45, 27, 105, 0.1)',
      border: `2px solid transparent`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(255, 107, 53, 0.2)',
        border: `2px solid ${colors.primary}`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      }
    },
    imageContainer: {
      position: 'relative',
      height: '220px',
      borderRadius: '16px 16px 0 0',
      overflow: 'hidden',
    },
    noImageBox: {
      height: '220px',
      background: `linear-gradient(135deg, ${colors.neutral} 0%, ${colors.accent} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px 16px 0 0',
      flexDirection: 'column',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
        pointerEvents: 'none',
      }
    },
    cardContent: {
      flexGrow: 1,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    roomTitle: {
      color: colors.accent,
      fontWeight: '700',
      fontSize: '1.3rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    roomType: {
      color: colors.neutral,
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem',
    },
    statusChip: {
      fontWeight: '700',
      borderRadius: '25px',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      padding: '0.6rem 1.2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    infoBox: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.5rem',
      padding: '0.8rem',
      backgroundColor: colors.background,
      borderRadius: '12px',
      color: colors.neutral,
      fontSize: '1rem',
      border: `1px solid ${colors.primary}20`,
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      background: `linear-gradient(135deg, ${colors.cardBg} 0%, ${colors.background} 100%)`,
      borderRadius: '16px',
      border: `2px dashed ${colors.primary}`,
      marginTop: '2rem',
      boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
    },
    errorAlert: {
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: colors.cardBg,
      color: colors.accent,
      border: `1px solid ${colors.primary}`,
      '& .MuiAlert-icon': {
        color: colors.primary,
      }
    }
  };

  useEffect(() => {
    fetchCuartos();
  }, [idHotel]);

  const fetchCuartos = async () => {
    try {
      const response = await axios.get(`https://backendreservas-m2zp.onrender.com/api/detallesHabitacion/hotel/${idHotel}`);
      const cuartosData = response.data.map(cuarto => {
        let imagenParsed = null;
        try {
          if (cuarto.imagenhabitacion) {
            if (typeof cuarto.imagenhabitacion === 'object' && cuarto.imagenhabitacion.data && cuarto.imagenhabitacion.mimeType) {
              imagenParsed = cuarto.imagenhabitacion;
            } else {
              const parsed = JSON.parse(cuarto.imagenhabitacion);
              if (parsed.data && parsed.mimeType) {
                imagenParsed = { data: parsed.data, mimeType: parsed.mimeType };
              } else {
                imagenParsed = { data: cuarto.imagenhabitacion, mimeType: 'image/jpeg' };
              }
            }
          }
        } catch (parseError) {
          imagenParsed = { data: cuarto.imagenhabitacion, mimeType: 'image/jpeg' };
        }
        return {
          ...cuarto,
          imagenhabitacion: imagenParsed,
          tipohabitacion: cuarto.idtipohabitacion // Asumimos que idtipohabitacion podría ser un ID que necesitaría mapeo a un nombre en el futuro
        };
      });
      setCuartos(cuartosData);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener cuartos:', error);
      setErrorMessage('Error al cargar los cuartos. Intente de nuevo.');
    }
  };

  const handleCardClick = (id) => {
    navigate(`/detalles-habitacion/${id}`);
  };

  const getStatusColor = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    switch (normalizedEstado) {
      case 'disponible':
        return colors.success;
      case 'ocupado':
        return colors.secondary;
      case 'mantenimiento':
        return colors.warning;
      default:
        return colors.neutral;
    }
  };

  const getStatusIcon = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    return normalizedEstado === 'disponible' ? <CheckCircle /> : <Cancel />;
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in={true} timeout={600}>
          <Paper sx={styles.headerSection}>
            <Hotel sx={{ fontSize: 45, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Habitaciones Disponibles
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1.1rem' }}>
              Explora nuestras habitaciones y encuentra la perfecta para ti
            </Typography>
          </Paper>
        </Fade>

        {/* Error Alert */}
        {errorMessage && (
          <Fade in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="error" 
                onClose={() => setErrorMessage('')}
                sx={styles.errorAlert}
              >
                {errorMessage}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Rooms Grid - Centrado y más grande (3 columnas máximo) */}
        <Grid container spacing={4} sx={styles.gridContainer}>
          {cuartos.map((cuarto, index) => {
            const primaryImage = cuarto.imagenhabitacion && cuarto.imagenhabitacion.data && cuarto.imagenhabitacion.mimeType
              ? `data:${cuarto.imagenhabitacion.mimeType};base64,${cuarto.imagenhabitacion.data}`
              : null;
            const normalizedEstado = cuarto.estado?.charAt(0).toUpperCase() + cuarto.estado?.slice(1).toLowerCase();
            const isAvailable = cuarto.estado?.toLowerCase() === 'disponible';

            return (
              <Grid item xs={12} sm={6} md={4} key={cuarto.id}>
                <Fade in={true} timeout={800 + index * 100}>
                  <Card
                    sx={styles.roomCard}
                    onClick={() => handleCardClick(cuarto.id)}
                  >
                    {/* Image Section */}
                    {primaryImage ? (
                      <Box sx={styles.imageContainer}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={primaryImage}
                          alt={`Imagen de ${cuarto.cuarto}`}
                          sx={{ 
                            objectFit: 'cover', 
                            borderRadius: '16px 16px 0 0',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={styles.noImageBox}>
                        <Hotel sx={{ fontSize: 55, color: 'white', mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                        <Typography 
                          variant="body1" 
                          sx={{ color: 'white', fontStyle: 'italic', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          Sin imagen disponible
                        </Typography>
                      </Box>
                    )}

                    {/* Content Section */}
                    <CardContent sx={styles.cardContent}>
                      <Box>
                        <Typography variant="h6" sx={styles.roomTitle}>
                          <Hotel sx={{ mr: 1, fontSize: '1.5rem', color: colors.primary }} />
                          Habitación {cuarto.cuarto}
                        </Typography>
                        <Typography variant="body1" sx={styles.roomType}>
                          Tipo: {cuarto.tipohabitacion || 'No especificado'}
                        </Typography>

                        <Chip
                          icon={getStatusIcon(cuarto.estado)}
                          label={normalizedEstado || 'Sin estado'}
                          sx={{
                            ...styles.statusChip,
                            bgcolor: getStatusColor(cuarto.estado),
                            color: 'white',
                            mb: 2,
                          }}
                        />
                      </Box>

                      <Box sx={styles.infoBox}>
                        <Schedule sx={{ mr: 1, fontSize: '1.4rem', color: colors.primary }} />
                        <Typography variant="body1" sx={{ fontWeight: '500' }}>
                          {cuarto.horario 
                            ? new Date(cuarto.horario).toLocaleDateString()
                            : 'Horario no especificado'
                          }
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Empty State */}
        {cuartos.length === 0 && !errorMessage && (
          <Fade in={true} timeout={1000}>
            <Box sx={styles.emptyState}>
              <Hotel sx={{ fontSize: 70, color: colors.primary, mb: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
              <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: '700', mb: 1 }}>
                No hay habitaciones disponibles
              </Typography>
              <Typography variant="body1" sx={{ color: colors.neutral, fontSize: '1.1rem' }}>
                No se encontraron habitaciones para este hotel en este momento.
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default CuartosP;