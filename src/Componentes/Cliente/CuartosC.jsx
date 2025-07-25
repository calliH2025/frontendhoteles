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

  // Paleta de colores
  const colors = {
    primary: '#4c94bc',    // color1
    secondary: '#f3a384',  // color2
    accent: '#0b7583',     // color3
    success: '#549c94',    // color4
    neutral: '#b3c9ca',    // color5
  };

  const styles = {
    container: {
      backgroundColor: '#fafbfc',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
    headerSection: {
      backgroundColor: colors.primary,
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(76, 148, 188, 0.2)',
    },
    gridContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    roomCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e0e6ed',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(76, 148, 188, 0.15)',
        border: `1px solid ${colors.primary}`,
      },
    },
    imageContainer: {
      position: 'relative',
      height: '220px',
      borderRadius: '12px 12px 0 0',
    },
    noImageBox: {
      height: '220px',
      backgroundColor: colors.neutral,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px 12px 0 0',
      flexDirection: 'column',
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
      fontWeight: '600',
      fontSize: '1.25rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    roomType: {
      color: '#6c757d',
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem',
    },
    statusChip: {
      fontWeight: '600',
      borderRadius: '20px',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
    },
    infoBox: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.5rem',
      color: '#6c757d',
      fontSize: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px dashed #e0e6ed',
      marginTop: '2rem',
    },
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
    navigate(`/cliente/detalles-habitacionc/${id}`);
  };

  const getStatusColor = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    switch (normalizedEstado) {
      case 'disponible':
        return colors.success;
      case 'ocupado':
        return colors.secondary;
      case 'mantenimiento':
        return colors.accent;
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    return normalizedEstado === 'disponible' ? <CheckCircle /> : <Cancel />;
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl">
        {/* Error Alert */}
        {errorMessage && (
          <Fade in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="error" 
                onClose={() => setErrorMessage('')}
                sx={{ borderRadius: '8px', fontSize: '1rem' }}
              >
                {errorMessage}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Rooms Grid - Mejor diseño y sin header */}
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
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
                      boxShadow: '0 4px 24px rgba(76, 148, 188, 0.07)',
                      border: '1px solid #e0e6ed',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.02)',
                        boxShadow: '0 12px 32px rgba(76, 148, 188, 0.15)',
                        border: `1.5px solid ${colors.primary}`,
                      },
                    }}
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
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.03)',
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={styles.noImageBox}>
                        <Hotel sx={{ fontSize: 50, color: 'white', mb: 1 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ color: 'white', fontStyle: 'italic' }}
                        >
                          Sin imagen disponible
                        </Typography>
                      </Box>
                    )}

                    {/* Content Section */}
                    <CardContent sx={{ ...styles.cardContent, padding: '1.5rem' }}>
                      <Box>
                        <Typography variant="h6" sx={{ ...styles.roomTitle, fontSize: '1.15rem', mb: 0.5 }}>
                          <Hotel sx={{ mr: 1, fontSize: '1.3rem' }} />
                          Habitación {cuarto.cuarto}
                        </Typography>
                        <Typography variant="body1" sx={{ ...styles.roomType, fontWeight: 600, color: colors.primary, mb: 1 }}>
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

                      <Box>
                        <Box sx={styles.infoBox}>
                          <Schedule sx={{ mr: 1, fontSize: '1.3rem', color: colors.accent }} />
                          <Typography variant="body1">
                            {cuarto.horario 
                              ? new Date(cuarto.horario).toLocaleDateString()
                              : 'Horario no especificado'
                            }
                          </Typography>
                        </Box>
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
              <Hotel sx={{ fontSize: 60, color: colors.neutral, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: '600', mb: 1 }}>
                No hay habitaciones disponibles
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
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