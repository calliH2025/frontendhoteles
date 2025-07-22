import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import momentTz from 'moment-timezone';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  Avatar,
  Fade,
  Zoom,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Hotel,
  AccessTime,
  AttachMoney,
  RoomService,
  CheckCircle,
  Cancel,
  Schedule,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  Spa,
} from "@mui/icons-material";
import Swal from 'sweetalert2';

const DetallesHabitacion = () => {
  const { idHabitacion } = useParams();
  const navigate = useNavigate();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservation, setReservation] = useState({
    fechainicio: "",
    fechafin: "",
    tipo_tarifa: "",
  });
  const [totalpagar, setTotalpagar] = useState(null);

  const colors = {
    primary: "#4c94bc",
    secondary: "#549c94",
    accent: "#0b7583",
    success: "#549c94",
    neutral: "#b3c9ca",
  };

  const styles = {
    container: {
      backgroundColor: "#fafbfc",
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    headerCard: {
      backgroundColor: colors.primary,
      color: "white",
      borderRadius: "16px",
      marginBottom: "2rem",
      boxShadow: "0 8px 32px rgba(76, 148, 188, 0.2)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    imageCard: {
      borderRadius: "12px",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      height: "100%",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      },
    },
    detailsCard: {
      borderRadius: "16px",
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e6ed",
      height: "100%",
    },
    priceCard: {
      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 4px 16px rgba(84, 156, 148, 0.25)",
      color: "white",
    },
    reservationCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: `2px solid ${colors.neutral}`,
      height: "fit-content",
    },
    statusChip: {
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      borderRadius: "25px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    iconBox: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      transition: "all 0.2s ease",
      height: "100%",
      "&:hover": {
        backgroundColor: "#e9ecef",
        transform: "translateY(-1px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
    serviceIcon: {
      marginRight: "0.75rem",
      color: colors.accent,
      fontSize: "1.5rem",
      flexShrink: 0,
    },
    sectionTitle: {
      color: colors.accent,
      fontWeight: "600",
      marginBottom: "1.5rem",
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
    },
    originalPrice: {
      textDecoration: "line-through",
      color: "rgba(255,255,255,0.7)",
      marginRight: "0.5rem",
      fontSize: "0.9rem",
    },
    discountedPrice: {
      color: "#ffeb3b",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      padding: "0.5rem 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      "&:last-child": {
        borderBottom: "none",
        marginBottom: 0,
      },
    },
    totalPrice: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#dc3545",
      marginTop: "1rem",
      textAlign: "center",
    },
    reserveButton: {
      backgroundColor: "#dc3545",
      color: "white",
      "&:hover": {
        backgroundColor: "#c82333",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(220, 53, 69, 0.4)",
      },
      "&:disabled": {
        backgroundColor: "#dc3545",
        color: "rgba(255, 255, 255, 0.7)",
        transform: "none",
        boxShadow: "none",
      },
    },
  };

  useEffect(() => {
    if (!idHabitacion || isNaN(idHabitacion)) {
      setError("ID de habitación no válido.");
      setLoading(false);
      return;
    }
    fetchHabitacion();
  }, [idHabitacion]);

  const fetchHabitacion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backendreservas-m2zp.onrender.com/api/detallesHabitacion/detalles/${idHabitacion}`
      );
      console.log('Datos de habitación recibidos:', response.data);
      setHabitacion(response.data);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Habitación no encontrada en la base de datos."
          : err.response?.data?.error ||
          "Error al cargar los detalles de la habitación. Intente de nuevo.";
      setError(errorMessage);
      console.error("Error al obtener habitación:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => {
      const newReservation = { ...prev, [name]: value };
      if (name === "fechainicio" || name === "fechafin" || name === "tipo_tarifa") {
        validateAndCalculate(newReservation);
      }
      return newReservation;
    });
  };

  const validateAndCalculate = async (newReservation) => {
    const { fechainicio, fechafin, tipo_tarifa } = newReservation;
    if (!fechainicio || !fechafin || !tipo_tarifa) {
      setTotalpagar(null);
      setError("");
      return;
    }

    const startDateCST = momentTz(fechainicio).tz('America/Mexico_City');
    const endDateCST = momentTz(fechafin).tz('America/Mexico_City');

    if (!startDateCST.isValid() || !endDateCST.isValid() || startDateCST >= endDateCST) {
      setTotalpagar(null);
      setError("Las fechas seleccionadas no son válidas. Asegúrese de que la fecha de salida sea posterior a la de llegada.");
      return;
    }

    // Calcular duración
    let duration = 1;
    switch (tipo_tarifa) {
      case "hora":
        duration = Math.max(1, endDateCST.diff(startDateCST, 'hours'));
        break;
      case "dia":
        duration = Math.max(1, Math.ceil(endDateCST.diff(startDateCST, 'hours') / 24));
        break;
      case "noche":
        duration = Math.max(1, Math.max(0, endDateCST.diff(startDateCST, 'days') - 1));
        break;
      case "semana":
        duration = Math.max(1, Math.ceil(endDateCST.diff(startDateCST, 'days') / 7));
        break;
      default:
        duration = 1;
    }

    // Obtener precio base
    let basePrice = 0;
    switch (tipo_tarifa) {
      case "hora":
        basePrice = habitacion?.preciohora;
        break;
      case "dia":
        basePrice = habitacion?.preciodia;
        break;
      case "noche":
        basePrice = habitacion?.precionoche;
        break;
      case "semana":
        basePrice = habitacion?.preciosemana;
        break;
      default:
        basePrice = 0;
    }
    // Calcular precio con o sin promoción
    const price = getDiscountedPrice(basePrice);
    if (price === "No definido") {
      setTotalpagar(null);
      setError("No hay precio definido para la tarifa seleccionada.");
      return;
    }
    setTotalpagar(Number(price) * duration);
    setError("");
  };

  const handleReservation = () => {
    Swal.fire({
      icon: 'info',
      title: 'Inicia sesión o regístrate',
      text: 'Para hacer la reserva primero debes registrarte o iniciar sesión si ya tienes una cuenta.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1976d2',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/login';
      }
    });
  };

  const getServiceIcons = (servicios) => {
    const serviceMap = {
      wifi: <Wifi sx={styles.serviceIcon} />,
      parking: <LocalParking sx={styles.serviceIcon} />,
      restaurant: <Restaurant sx={styles.serviceIcon} />,
      gym: <FitnessCenter sx={styles.serviceIcon} />,
      pool: <Pool sx={styles.serviceIcon} />,
      spa: <Spa sx={styles.serviceIcon} />,
      internet: <Wifi sx={styles.serviceIcon} />,
      baño: <RoomService sx={styles.serviceIcon} />,
    };

    const serviceList = Array.isArray(servicios) ? servicios : [];
    return serviceList.length > 0 ? (
      serviceList.map((service, index) => {
        const trimmedService = service.trim().toLowerCase();
        return (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Box sx={styles.iconBox}>
              {serviceMap[trimmedService] || <RoomService sx={styles.serviceIcon} />}
              <Typography
                variant="body1"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "600",
                  color: colors.accent,
                  lineHeight: 1.2,
                }}
              >
                {service.trim()}
              </Typography>
            </Box>
          </Grid>
        );
      })
    ) : (
      <Grid item xs={12}>
        <Box
          sx={{
            ...styles.iconBox,
            justifyContent: "center",
            textAlign: "center",
            py: 3,
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontStyle: "italic" }}
          >
            No hay servicios especificados
          </Typography>
        </Box>
      </Grid>
    );
  };

  // Lógica de promoción activa usando moment-timezone y solo la fecha
  const nowCST = momentTz().tz('America/Mexico_City');
  const promoStart = habitacion?.promocion?.fechainicio ? momentTz(habitacion.promocion.fechainicio, 'YYYY-MM-DD').tz('America/Mexico_City') : null;
  const promoEnd = habitacion?.promocion?.fechafin ? momentTz(habitacion.promocion.fechafin, 'YYYY-MM-DD').tz('America/Mexico_City') : null;
  const hasActivePromotion =
    habitacion?.promocion?.descuento &&
    promoStart && promoEnd &&
    nowCST.isSameOrAfter(promoStart, 'day') &&
    nowCST.isSameOrBefore(promoEnd, 'day');

  const getDiscountedPrice = (originalPrice) => {
    const price = Number(originalPrice);
    if (isNaN(price) || !isFinite(price)) {
      return "No definido";
    }
    if (hasActivePromotion && habitacion.promocion?.descuento) {
      const discountFactor = 1 - (habitacion.promocion.descuento / 100);
      return Number((price * discountFactor).toFixed(2));
    }
    return Number(price.toFixed(2));
  };

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: colors.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.primary }}>
              Cargando detalles de la habitación...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={true}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "12px", fontSize: "1.1rem" }}
            >
              {error}
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (!habitacion) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="xl"> {/* Cambiar de 'lg' a 'xl' o false */}
          <Typography
            variant="h4"
            sx={{ color: colors.primary, fontWeight: "600" }}
          >
            Habitación no encontrada
          </Typography>
        </Container>
      </Box>
    );
  }

  const images =
    habitacion.imagenes &&
      Array.isArray(habitacion.imagenes) &&
      habitacion.imagenes.length > 0
      ? habitacion.imagenes
        .map((img) =>
          img.data && img.mimeType ? `data:${img.mimeType};base64,${img.data}` : null
        )
        .filter((img) => img)
      : null;
  const normalizedEstado =
    habitacion.estado?.charAt(0).toUpperCase() +
    habitacion.estado?.slice(1).toLowerCase();
  const isAvailable = normalizedEstado?.toLowerCase() === "disponible";

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Card sx={styles.headerCard}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  width: 60,
                  height: 60,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Hotel sx={{ fontSize: 30, color: "white" }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "600", mb: 1 }}>
                Habitación {habitacion.cuarto}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                Tipo: {habitacion.tipo_habitacion || "No especificado"}
              </Typography>
              <Chip
                icon={isAvailable ? <CheckCircle /> : <Cancel />}
                label={normalizedEstado || "Sin estado"}
                sx={{
                  ...styles.statusChip,
                  bgcolor: isAvailable ? colors.success : "#dc3545",
                  color: "white",
                }}
              />
            </CardContent>
          </Card>
        </Fade>

        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ ...styles.sectionTitle, textAlign: "center", mb: 2 }}
            >
              <Hotel sx={{ mr: 1, fontSize: "1.5rem" }} />
              Galería de Imágenes
            </Typography>
            <Grid container spacing={2}>
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={3} xl={3} key={index}>
                    <Card sx={styles.imageCard}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={image}
                        alt={`Imagen ${index + 1} de ${habitacion.cuarto}`}
                        sx={{ objectFit: "cover" }}
                        loading="lazy"
                      />
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      ...styles.imageCard,
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No hay imágenes disponibles
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Sección Principal - Izquierda */}
          <Grid item xs={12} lg={9}> 
            <Grid container spacing={3}>
              {/* Detalles de la Habitación */}
               <Grid item xs={12} lg={7}>
                <Fade in={true} timeout={1200}>
                  <Card sx={styles.detailsCard}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={styles.sectionTitle}>
                        <RoomService sx={{ mr: 1, fontSize: "1.5rem" }} />
                        Detalles de la Habitación
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <Box sx={styles.iconBox}>
                            <AccessTime sx={styles.serviceIcon} />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                              >
                                Horario
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#6c757d", lineHeight: 1.4 }}>
                                {habitacion.horario
                                  ? new Date(habitacion.horario).toLocaleString()
                                  : "No definido"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={styles.iconBox}>
                            <Schedule sx={styles.serviceIcon} />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                              >
                                Estado
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: isAvailable ? colors.success : "#dc3545",
                                  fontWeight: "600",
                                  lineHeight: 1.4,
                                }}
                              >
                                {normalizedEstado || "Sin estado"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={styles.iconBox}>
                            <Hotel sx={styles.serviceIcon} />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "600", color: colors.accent, mb: 0.5 }}
                              >
                                Tipo de Habitación
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#6c757d", lineHeight: 1.4 }}>
                                {habitacion.tipo_habitacion || "No definido"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderColor: colors.neutral }} />

                      <Typography variant="h6" sx={styles.sectionTitle}>
                        <Spa sx={{ mr: 1, fontSize: "1.3rem" }} />
                        Servicios del Hotel
                      </Typography>
                      <Grid container spacing={2}>
                        {getServiceIcons(habitacion.servicios)}
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Tarifas */}
              {/* Tarifas - Más ancho */}
              <Grid item xs={12} md={8}>
                <Fade in={true} timeout={1300}>
                  <Paper sx={{ ...styles.priceCard, p: 3.5, height: 'fit-content' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        fontSize: "1.2rem"
                      }}
                    >
                      <AttachMoney sx={{ mr: 1, fontSize: "1.4rem" }} />
                      Tarifas
                    </Typography>

                    {[
                      {
                        label: "Por Hora",
                        price: habitacion?.preciohora,
                      },
                      {
                        label: "Por Día",
                        price: habitacion?.preciodia,
                      },
                      {
                        label: "Por Noche",
                        price: habitacion?.precionoche,
                      },
                      {
                        label: "Por Semana",
                        price: habitacion?.preciosemana,
                      },
                    ].map((item, index) => {
                      console.log(`Tarifa ${item.label}:`, {
                        price: item.price,
                        type: typeof item.price,
                      });
                      const priceNum = Number(item.price);
                      const originalPrice = isNaN(priceNum) || !isFinite(priceNum)
                        ? "No definido"
                        : priceNum.toFixed(2);
                      const discountPrice = getDiscountedPrice(item.price);

                      return (
                        <Box key={index} sx={{
                          ...styles.priceRow,
                          mb: 1.5,
                          py: 1
                        }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "600", color: "rgba(255,255,255,0.9)" }}
                          >
                            {item.label}:
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            {hasActivePromotion && discountPrice !== originalPrice && originalPrice !== "No definido" ? (
                              <>
                                <Typography component="span" sx={styles.originalPrice}>
                                  ${originalPrice}
                                </Typography>
                                <Typography component="span" sx={styles.discountedPrice}>
                                  ${discountPrice}
                                </Typography>
                              </>
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "700", color: "white", fontSize: "1.1rem" }}
                              >
                                ${originalPrice}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                    
                    {hasActivePromotion && habitacion.promocion && (
                      <Box
                        sx={{
                          mt: 2.5,
                          p: 2,
                          background: styles.priceCard.background, // Usa el mismo fondo que la sección de tarifas
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderLeft: '4px solid #1976d2',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem" }}>
                          🎉 Promoción: {habitacion.promocion.descuento}% de descuento
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#e3f2fd", display: "block", fontSize: "0.85rem" }}>
                          Del {new Date(habitacion.promocion.fechainicio).toLocaleDateString()} al {new Date(habitacion.promocion.fechafin).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Grid>

          {/* Sección de Reserva - Derecha */}
          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={1400}>
              <Box sx={{ position: { md: 'sticky', xs: 'static' }, top: '2rem' }}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.accent,
                      fontWeight: "600",
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    Reservar Habitación
                  </Typography>

                  <TextField
                    label="Llegada"
                    type="datetime-local"
                    name="fechainicio"
                    value={reservation.fechainicio}
                    onChange={handleReservationChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    sx={{ mb: 2 }}
                    disabled={!isAvailable}
                  />
                  
                  <TextField
                    label="Salida"
                    type="datetime-local"
                    name="fechafin"
                    value={reservation.fechafin}
                    onChange={handleReservationChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: reservation.fechainicio || new Date().toISOString().slice(0, 16) }}
                    sx={{ mb: 2 }}
                    disabled={!isAvailable}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tipo de Tarifa</InputLabel>
                    <Select
                      name="tipo_tarifa"
                      value={reservation.tipo_tarifa}
                      onChange={handleReservationChange}
                      disabled={!isAvailable}
                    >
                      <MenuItem value="">Seleccione una tarifa</MenuItem>
                      <MenuItem value="hora">Por Hora</MenuItem>
                      <MenuItem value="dia">Por Día</MenuItem>
                      <MenuItem value="noche">Por Noche</MenuItem>
                      <MenuItem value="semana">Por Semana</MenuItem>
                    </Select>
                  </FormControl>

                  {totalpagar !== null && (
                    <Typography sx={styles.totalPrice}>
                      Total: ${totalpagar} MXN
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleReservation}
                    disabled={!isAvailable || !reservation.fechainicio || !reservation.fechafin || !reservation.tipo_tarifa || !totalpagar}
                    sx={styles.reserveButton}
                  >
                    Reservar
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6c757d", textAlign: "center", mt: 1, display: "block" }}
                  >
                    Continúa para seleccionar tu método de pago
                  </Typography>
                </Card>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DetallesHabitacion;