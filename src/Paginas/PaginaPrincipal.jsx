import { useState, useEffect } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  IconButton,
  Skeleton,
  Fade,
  Slide,
  Modal,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
  Badge,
  Stack,
} from "@mui/material";
import {
  Place as MapPin,
  Hotel as Bed,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  ArrowForward as ArrowRight,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Email,
  Phone,
  Star,
  Close,
  Search,
  CalendarMonth,
  Person,
  AcUnit,
  Tv,
  RoomService,
  Bathtub,
  Balcony,
  Pets,
  CheckCircle,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  LocalCafe,
  BeachAccess,
  Spa,
  Flight,
  DirectionsCar,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Tema personalizado con colores para plataforma de reservas
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00796b", // Verde turquesa - transmite confianza y relajación
      light: "#48a999",
      dark: "#004c40",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff8a65", // Coral cálido - transmite calidez y hospitalidad
      light: "#ffbb93",
      dark: "#c75b39",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7f9",
      paper: "#ffffff",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    info: {
      main: "#29b6f6",
    },
    warning: {
      main: "#ffa726",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', system-ui, -apple-system, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #00796b 30%, #48a999 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #c75b39 30%, #ff8a65 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(-4px)",
          },
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: "0 0 0 4px rgba(0, 121, 107, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(0, 121, 107, 0.2)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

// Componente Modal para detalles del hotel
const HotelDetailModal = ({ open, handleClose, hotel }) => {
  if (!hotel) return null;

  const getImageSrc = (imagen) => {
    console.log("Procesando imagen en modal:", imagen);
    if (!imagen) {
      console.warn("Imagen no proporcionada en modal");
      return "/placeholder.svg?height=400&width=600";
    }

    try {
      // Caso 1: Imagen es un objeto { data, mimeType }
      if (typeof imagen === "object" && imagen.data && imagen.mimeType) {
        return `data:${imagen.mimeType};base64,${imagen.data}`;
      }

      // Caso 2: Imagen es una URL
      if (typeof imagen === "string" && imagen.match(/^https?:\/\//)) {
        return imagen;
      }

      // Caso 3: Imagen es un string base64 directo
      if (typeof imagen === "string" && imagen.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo imagen como base64 directo en modal");
        return `data:image/jpeg;base64,${imagen}`;
      }

      console.warn("Formato de imagen no reconocido en modal:", imagen);
      return "/placeholder.svg?height=400&width=600";
    } catch (error) {
      console.error("Error al procesar imagen en modal:", error.message, imagen);
      return "/placeholder.svg?height=400&width=600";
    }
  };

  const getServiceIcons = (servicios) => {
    if (!servicios) return [];
    const serviciosList = [];
    const serviciosLower = typeof servicios === "string" ? servicios.toLowerCase() : "";

    if (serviciosLower.includes("wifi"))
      serviciosList.push({ icon: <Wifi />, name: "WiFi Gratis" });
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      serviciosList.push({ icon: <LocalParking />, name: "Estacionamiento" });
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      serviciosList.push({ icon: <Restaurant />, name: "Restaurante" });
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      serviciosList.push({ icon: <FitnessCenter />, name: "Gimnasio" });
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca"))
      serviciosList.push({ icon: <Pool />, name: "Piscina" });
    if (serviciosLower.includes("aire") || serviciosLower.includes("acondicionado"))
      serviciosList.push({ icon: <AcUnit />, name: "Aire Acondicionado" });
    if (serviciosLower.includes("tv") || serviciosLower.includes("televisión"))
      serviciosList.push({ icon: <Tv />, name: "TV" });
    if (serviciosLower.includes("servicio") || serviciosLower.includes("habitación"))
      serviciosList.push({ icon: <RoomService />, name: "Servicio a la Habitación" });
    if (serviciosLower.includes("baño") || serviciosLower.includes("tina"))
      serviciosList.push({ icon: <Bathtub />, name: "Baño Privado" });
    if (serviciosLower.includes("balcón") || serviciosLower.includes("terraza"))
      serviciosList.push({ icon: <Balcony />, name: "Balcón" });
    if (serviciosLower.includes("mascota") || serviciosLower.includes("pet"))
      serviciosList.push({ icon: <Pets />, name: "Pet Friendly" });
    if (serviciosLower.includes("desayuno") || serviciosLower.includes("breakfast"))
      serviciosList.push({ icon: <LocalCafe />, name: "Desayuno Incluido" });

    return serviciosList;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="hotel-detail-modal"
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="300"
              image={getImageSrc(hotel.imagen)}
              alt={hotel.nombrehotel}
              sx={{ objectFit: "cover" }}
            />
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "white" },
              }}
            >
              <Close />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                color: "white",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {hotel.nombrehotel}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body1">
                  {hotel.direccion || "Ubicación no especificada"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3, maxHeight: "calc(90vh - 300px)", overflow: "auto" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Acerca de este alojamiento
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                  {hotel.descripcion ||
                    "Este elegante hotel ofrece una experiencia única con instalaciones modernas y un servicio excepcional. Disfrute de una estancia confortable en un ambiente acogedor, ideal tanto para viajes de negocios como de placer."}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Servicios y Comodidades
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {getServiceIcons(hotel.servicios).map((servicio, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "rgba(0, 121, 107, 0.05)",
                          border: "1px solid rgba(0, 121, 107, 0.1)",
                        }}
                      >
                        <Box sx={{ color: "primary.main", mr: 1 }}>{servicio.icon}</Box>
                        <Typography variant="body2" fontWeight={500}>{servicio.name}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Disponibilidad
                </Typography>
                <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(76, 175, 80, 0.05)", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Bed sx={{ mr: 1, color: "success.main" }} />
                    <Typography variant="body1" fontWeight={500}>
                      {hotel.numhabitacion} habitaciones disponibles
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Reserve ahora para asegurar su estadía en este popular destino.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Información de Contacto
                  </Typography>
                  <List dense disablePadding>
                    {hotel?.telefono && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Phone fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={hotel.telefono}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    )}
                    {hotel?.correo && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Email fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={hotel.correo}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    )}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Califica este hotel
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={0}
                      precision={0.5}
                      size="large"
                      onChange={(event, newValue) => {
                        console.log("Nueva calificación:", newValue);
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Reservar Ahora
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const PaginaPrincipal = () => {
  // Simulamos la función navigate para evitar errores
  const navigate = (path) => {
    console.log(`Navegando a: ${path}`);
    // Implementar lógica de navegación si es necesario
    // Ejemplo: window.location.href = path;
  };

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [hoteles, setHoteles] = useState([]);
  const [cuartos, setCuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelesRes, cuartosRes] = await Promise.all([
        fetch("https://backendd-q0zc.onrender.com/api/detallehotel/public"),
        fetch("https://backendd-q0zc.onrender.com/api/detallesHabitacion/public"),
      ]);

      if (!hotelesRes.ok) {
        throw new Error(`Error en hoteles: ${hotelesRes.status} ${await hotelesRes.text()}`);
      }
      if (!cuartosRes.ok) {
        throw new Error(`Error en cuartos: ${cuartosRes.status} ${await cuartosRes.text()}`);
      }

      const hotelesData = await hotelesRes.json();
      const cuartosData = await cuartosRes.json();

      console.log("Hoteles Data:", hotelesData);
      console.log("Cuartos Data:", cuartosData);

      setHoteles(hotelesData.slice(0, 6));
      setCuartos(cuartosData.slice(0, 8));
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setHoteles([]);
      setCuartos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", { destination, checkIn, checkOut, guests });
  };

  const toggleFavorite = (id, type) => {
    const key = `${type}-${id}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  const handleOpenModal = (hotel) => {
    setSelectedHotel(hotel);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCardClick = (id) => {
    navigate(`/detalles-habitacion/${id}`);
  };

  const getImageSrc = (imagen) => {
    console.log("Procesando imagen:", imagen);
    if (!imagen) {
      console.warn("Imagen no proporcionada");
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    }

    try {
      // Caso 1: Imagen es un objeto { data, mimeType }
      if (typeof imagen === "object" && imagen.data && imagen.mimeType) {
        return `data:${imagen.mimeType};base64,${imagen.data}`;
      }

      // Caso 2: Imagen es una URL
      if (typeof imagen === "string" && imagen.match(/^https?:\/\//)) {
        return imagen;
      }

      // Caso 3: Imagen es un string base64 directo
      if (typeof imagen === "string" && imagen.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo imagen como base64 directo");
        return `data:image/jpeg;base64,${imagen}`;
      }

      // Caso 4: Imagen es un string JSON
      if (typeof imagen === "string" && imagen.startsWith("{")) {
        const imageData = JSON.parse(imagen);
        if (imageData.mimeType && imageData.data) {
          return `data:${imageData.mimeType};base64,${imageData.data}`;
        }
      }

      console.warn("Formato de imagen no reconocido:", imagen);
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    } catch (error) {
      console.error("Error al procesar imagen:", error.message, imagen);
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    }
  };

  const getCuartoImages = (imagenes, imagenhabitacion) => {
    console.log("Procesando imágenes de cuarto:", imagenes, "Imagen habitación:", imagenhabitacion);
    if (!imagenes && !imagenhabitacion) {
      console.warn("No hay imágenes proporcionadas");
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    }

    try {
      let imageArray = [];

      // Caso 1: imagenes es un array de objetos { data, mimeType }
      if (Array.isArray(imagenes) && imagenes.length > 0) {
        imageArray = imagenes;
      }

      // Caso 2: Si no hay imagenes, usar imagenhabitacion
      if (imageArray.length === 0 && imagenhabitacion) {
        if (typeof imagenhabitacion === "string" && imagenhabitacion.match(/^[A-Za-z0-9+/=]+$/)) {
          imageArray = [{ data: imagenhabitacion, mimeType: "image/jpeg" }];
        } else if (typeof imagenhabitacion === "object" && imagenhabitacion.data && imagenhabitacion.mimeType) {
          imageArray = [imagenhabitacion];
        }
      }

      // Verificar si tenemos imágenes válidas
      if (imageArray.length === 0) {
        console.warn("No hay imágenes válidas en el array");
        return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
      }

      // Tomar la primera imagen válida
      const firstImage = imageArray[0];

      if (typeof firstImage === "object" && firstImage.data && firstImage.mimeType) {
        return `data:${firstImage.mimeType};base64,${firstImage.data}`;
      }

      if (typeof firstImage === "string" && firstImage.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo primera imagen como base64 directo");
        return `data:image/jpeg;base64,${firstImage}`;
      }

      console.warn("Formato de imagen no reconocido en imágenes:", imageArray);
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    } catch (error) {
      console.error("Error al procesar imágenes:", error.message, imagenes, imagenhabitacion);
      return "https://via.placeholder.com/320x180/4c94bc/ffffff?text=Imagen+No+Disponible";
    }
  };

  const getServiceIcons = (servicios) => {
    if (!servicios) return [];
    const icons = [];
    const serviciosLower = typeof servicios === "string" ? servicios.toLowerCase() : "";

    if (serviciosLower.includes("wifi")) icons.push(<Wifi key="wifi" />);
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      icons.push(<LocalParking key="parking" />);
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      icons.push(<Restaurant key="restaurant" />);
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      icons.push(<FitnessCenter key="gym" />);
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca"))
      icons.push(<Pool key="pool" />);

    return icons.slice(0, 3);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === hoteles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? hoteles.length - 1 : prev - 1));
  };

  // Componente de animación simple
  const AnimatedBox = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <Box
        sx={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}
      >
        {children}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          backgroundImage: `
            linear-gradient(to bottom, rgba(245, 247, 249, 0.8), rgba(245, 247, 249, 1)),
            url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            backgroundImage: `
              linear-gradient(to bottom, rgba(0, 121, 107, 0.2), rgba(255, 255, 255, 0.9)),
              url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            borderRadius: { md: "0 0 50px 50px" },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 15%)",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
                <AnimatedBox>
                  <Typography
                    variant="h1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      background: "linear-gradient(90deg,rgb(1, 1, 1), #004c40)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Encuentra Tu Refugio Perfecto
                  </Typography>
                </AnimatedBox>

                <AnimatedBox delay={200}>
                  <Typography
                    variant="h5"
                    sx={{
                      maxWidth: 700,
                      mx: "auto",
                      mb: 6,
                      opacity: 0.95,
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    Descubre alojamientos únicos y experiencias inolvidables para tu próxima aventura
                  </Typography>
                </AnimatedBox>

                <Slide in timeout={1000} direction="up">
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    elevation={10}
                    sx={{
                      maxWidth: 1000,
                      mx: "auto",
                      p: { xs: 2, sm: 3, md: 4 },
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 4,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          placeholder="¿A dónde quieres ir?"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          label="Destino"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2.5}>
                        <TextField
                          fullWidth
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          label="Fecha Inicial"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2.5}>
                        <TextField
                          fullWidth
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          label="Fecha de Termino"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          fullWidth
                          type="number"
                          inputProps={{ min: 1 }}
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          label="Huéspedes"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          fullWidth
                          size="large"
                          endIcon={<ArrowRight />}
                          sx={{
                            py: 1.8,
                            fontWeight: 600,
                            boxShadow: "0 10px 15px -3px rgba(84, 156, 148, 0.3)",
                          }}
                        >
                          Buscar
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Slide>
              </Box>
            </Fade>
          </Container>
        </Box>

        {/* Destinos Destacados */}
        {hoteles.length > 0 && (
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(11, 117, 131, 0.05) 0%, rgba(76, 148, 188, 0.05) 100%)",
              py: 6,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 20%, rgba(179, 201, 202, 0.1) 0%, transparent 50%)",
                pointerEvents: "none",
              },
            }}
          >
            <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
              <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Chip
                    label="EXPERIENCIAS ÚNICAS"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      backgroundColor: "#00796b",
                      color: "white",
                      fontSize: "0.8rem",
                      letterSpacing: "0.5px",
                      boxShadow: "0 4px 12px rgba(84, 156, 148, 0.3)",
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#004c40",
                      textShadow: "0 2px 4px rgba(11, 117, 131, 0.1)",
                      mb: 1,
                    }}
                  >
                    Destinos Destacados
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#00796b", maxWidth: 400 }}>
                    Descubre los lugares más increíbles para tu próxima aventura
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={prevSlide}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(179, 201, 202, 0.3)",
                      boxShadow: "0 8px 24px rgba(11, 117, 131, 0.15)",
                      color: "#004c40",
                      width: 48,
                      height: 48,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "#00796b",
                        transform: "translateY(-2px) scale(1.05)",
                        boxShadow: "0 12px 32px rgba(76, 148, 188, 0.25)",
                        color: "white",
                      },
                    }}
                  >
                    <KeyboardArrowLeft sx={{ fontSize: 24 }} />
                  </IconButton>
                  <IconButton
                    onClick={nextSlide}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(179, 201, 202, 0.3)",
                      boxShadow: "0 8px 24px rgba(11, 117, 131, 0.15)",
                      color: "#004c40",
                      width: 48,
                      height: 48,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "#00796b",
                        transform: "translateY(-2px) scale(1.05)",
                        boxShadow: "0 12px 32px rgba(76, 148, 188, 0.25)",
                        color: "white",
                      },
                    }}
                  >
                    <KeyboardArrowRight sx={{ fontSize: 24 }} />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "24px",
                  height: 400,
                  boxShadow: "0 20px 60px rgba(11, 117, 131, 0.2)",
                  border: "1px solid rgba(179, 201, 202, 0.2)",
                }}
              >
                {hoteles.map((hotel, index) => (
                  <Box
                    key={hotel.id_hotel}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: index === currentSlide ? 1 : 0,
                      transform: index === currentSlide ? "scale(1)" : "scale(1.02)",
                      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      backgroundImage: `linear-gradient(135deg, rgba(11, 117, 131, 0.4) 0%, rgba(76, 148, 188, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%), url(${getImageSrc(hotel.imagen)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "white",
                      borderRadius: "24px",
                      zIndex: index === currentSlide ? 2 : 1,
                      visibility: index === currentSlide ? "visible" : "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 3,
                        textAlign: "center",
                        maxWidth: 600,
                        px: 4,
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          textShadow: "0 4px 16px rgba(0,0,0,0.7)",
                          color: "white",
                          fontSize: { xs: "2rem", md: "3rem" },
                        }}
                      >
                        {hotel.nombrehotel}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(10px)",
                          borderRadius: "20px",
                          px: 3,
                          py: 1.5,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 20, mr: 1, color: "#ff8a65" }} />
                        <Typography
                          variant="h6"
                          sx={{
                            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                            color: "white",
                          }}
                        >
                          {hotel.direccion}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        sx={{
                          px: 6,
                          py: 2,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          backgroundColor: "#00796b",
                          color: "white",
                          boxShadow: "0 8px 32px rgba(0, 121, 107, 0.4)",
                          borderRadius: "50px",
                          textTransform: "none",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "#004c40",
                            transform: "translateY(-4px) scale(1.05)",
                            boxShadow: "0 16px 48px rgba(0, 121, 107, 0.6)",
                          },
                        }}
                        onClick={() => handleOpenModal(hotel)}
                      >
                        Explorar Destino
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                    >
                      <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}>
                        {index + 1}/{hoteles.length}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 1,
                    zIndex: 10,
                  }}
                >
                  {hoteles.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: index === currentSlide ? 32 : 12,
                        height: 4,
                        borderRadius: "4px",
                        backgroundColor: index === currentSlide ? "#ff8a65" : "rgba(255, 255, 255, 0.5)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        boxShadow: index === currentSlide ? "0 2px 8px rgba(255, 138, 101, 0.5)" : "none",
                      }}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Container>
          </Box>
        )}

        {/* Sección de Hoteles Destacados */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="ALOJAMIENTOS PREMIUM"
              sx={{
                mb: 2,
                fontWeight: 600,
                px: 1,
                backgroundColor: "#00796b",
                color: "white",
                fontSize: "0.75rem",
              }}
              size="small"
            />
            <Typography variant="h3" sx={{ mb: 2, color: "#004c40", fontWeight: 700 }}>
              Hoteles Destacados
            </Typography>
            <Typography variant="h6" sx={{ color: "#00796b", fontWeight: 400, maxWidth: 700, mx: "auto" }}>
              Descubre los mejores hoteles seleccionados especialmente para ti
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={index}>
                    <Card sx={{ width: "100%", maxWidth: 320 }}>
                      <Skeleton variant="rectangular" height={180} />
                      <CardContent>
                        <Skeleton variant="text" height={28} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : hoteles.map((hotel) => (
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={hotel.id_hotel}>
                    <Card
                      sx={{
                        width: "100%",
                        maxWidth: 320,
                        height: "100%",
                        border: "1px solid rgba(179, 201, 202, 0.3)",
                        boxShadow: "0 2px 8px rgba(76, 148, 188, 0.1)",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height={180}
                          image={getImageSrc(hotel.imagen)}
                          alt={hotel.nombrehotel}
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.5s",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": {
                              backgroundColor: "#ff8a65",
                              transform: "scale(1.1)",
                              color: "white",
                            },
                            transition: "all 0.2s",
                            zIndex: 2,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(hotel.id_hotel, "hotel");
                          }}
                        >
                          {favorites.has(`hotel-${hotel.id_hotel}`) ? (
                            <Favorite sx={{ color: "#ff8a65" }} />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                        <Chip
                          label="Hotel"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            fontWeight: 600,
                            zIndex: 2,
                            backgroundColor: "#004c40",
                            color: "white",
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            color: "#004c40",
                          }}
                        >
                          {hotel.nombrehotel}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: "#00796b", mr: 0.5 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                              color: "#00796b",
                            }}
                          >
                            {hotel.direccion || "Ubicación no especificada"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Rating
                            value={0}
                            precision={0.5}
                            size="small"
                            sx={{
                              color: "#ff8a65",
                              "& .MuiRating-iconEmpty": {
                                color: "rgba(179, 201, 202, 0.5)",
                              },
                            }}
                            onChange={(event, newValue) => {
                              console.log("Nueva calificación para hotel:", hotel.id_hotel, newValue);
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              color: "#00796b",
                              fontSize: "0.75rem",
                            }}
                          >
                            Califica este hotel
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: "36px",
                            fontSize: "0.85rem",
                            color: "#00796b",
                          }}
                        >
                          {hotel.descripcion || "Hotel con excelentes servicios y comodidades"}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Bed sx={{ fontSize: 16, color: "#00796b", mr: 0.5 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                              color: "#00796b",
                            }}
                          >
                            {hotel.numhabitacion || "N/A"} habitaciones disponibles
                          </Typography>
                        </Box>

                        {hotel.servicios && (
                          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            {getServiceIcons(hotel.servicios).map((icon, index) => (
                              <Tooltip
                                key={index}
                                title={
                                  index === 0 ? "WiFi" :
                                  index === 1 ? "Estacionamiento" :
                                  index === 2 ? "Restaurante" : ""
                                }
                              >
                                <Box
                                  sx={{
                                    color: "#004c40",
                                    bgcolor: "rgba(76, 148, 188, 0.1)",
                                    p: 0.5,
                                    borderRadius: 1,
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {icon}
                                </Box>
                              </Tooltip>
                            ))}
                          </Box>
                        )}

                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          sx={{
                            mt: "auto",
                            py: 1,
                            backgroundColor: "#00796b",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#004c40",
                            },
                          }}
                          onClick={() => handleOpenModal(hotel)}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Container>

        {/* Sección de Departamentos/Habitaciones */}
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(179, 201, 202, 0.7) 0%, rgba(179, 201, 202, 0.2) 100%)",
            py: 8,
            borderRadius: { md: "50px 50px 0 0" },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="ESPACIOS ÚNICOS"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  backgroundColor: "#ff8a65",
                  color: "white",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  boxShadow: "0 4px 12px rgba(255, 138, 101, 0.3)",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  color: "#004c40",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0, 0, 64, 0.5)",
                }}
              >
                Departamentos y Habitaciones
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#00796b",
                  fontWeight: 400,
                  maxWidth: 700,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Espacios únicos y cómodos para tu estadía perfecta
              </Typography>
            </Box>

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              sx={{
                mb: 4,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "25px",
                padding: "8px",
                boxShadow: "0 4px 20px rgba(11, 35, 131, 0.1)",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#00796b",
                  height: 4,
                  borderRadius: "4px",
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  minWidth: 120,
                  color: "#00796b",
                  borderRadius: "20px",
                  margin: "0 4px",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    color: "#004c40",
                    backgroundColor: "rgba(76, 148, 188, 0.1)",
                  },
                  "&:hover": {
                    color: "#2196f3",
                    backgroundColor: "rgba(76, 148, 188, 0.05)",
                  },
                },
              }}
            >
              <Tab label="Todos" />
              <Tab label="Disponibles" />
              <Tab label="Más Valorados" />
            </Tabs>

            <Grid container spacing={3} sx={{ justifyContent: "center" }}>
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={index}>
                      <Card
                        sx={{
                          height: "100%",
                          maxWidth: "320px",
                          mx: "auto",
                          borderRadius: "20px",
                          boxShadow: "0 2px 4px rgba(0, 0, 64, 0.2)",
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          height={180}
                          sx={{ borderRadius: "20px 20px 0 0" }}
                        />
                        <CardContent>
                          <Skeleton variant="text" height={28} />
                          <Skeleton variant="text" height={20} />
                          <Skeleton variant="text" height={20} width="60%" />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : cuartos.map((cuarto) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={cuarto.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          maxWidth: "320px",
                          mx: "auto",
                          borderRadius: "20px",
                          boxShadow: "0 8px 32px rgba(8, 117, 131, 0.15)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden",
                          border: "1px solid rgba(179, 201, 202, 0.3)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 16px 48px rgba(11, 201, 131, 0.25)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height={180}
                            image={getCuartoImages(cuarto.imagenes, cuarto.imagenhabitacion)}
                            alt={cuarto.cuarto}
                            sx={{
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                              "&:hover": { transform: "scale(1.05)" },
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(179, 201, 202, 0.3)",
                              "&:hover": {
                                backgroundColor: "white",
                                transform: "scale(1.1)",
                                boxShadow: "0 4px 16px rgba(255, 138, 101, 0.3)",
                              },
                              transition: "all 0.2s ease",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(cuarto.id, "cuarto");
                            }}
                          >
                            {favorites.has(`cuarto-${cuarto.id}`) ? (
                              <Favorite sx={{ color: "#ff8a65" }} />
                            ) : (
                              <FavoriteBorder sx={{ color: "#00796b" }} />
                            )}
                          </IconButton>
                          <Chip
                            label={cuarto.estado === "Disponible" ? "Disponible" : "No Disponible"}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              fontWeight: 600,
                              zIndex: 2,
                              backgroundColor: cuarto.estado === "Disponible" ? "#00796b" : "#ff8a65",
                              color: "white",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                          {cuarto.estado === "Disponible" && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 12,
                                right: 12,
                                bgcolor: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "12px",
                                px: 1.5,
                                py: 0.5,
                                display: "flex",
                                alignItems: "center",
                                zIndex: 2,
                                border: "1px solid rgba(84, 54, 148, 0.3)",
                              }}
                            >
                              <CheckCircle sx={{ fontSize: 14, color: "#00796b", mr: 0.5 }} />
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                sx={{
                                  color: "#004c40",
                                  fontSize: "0.7rem",
                                }}
                              >
                                Verificado
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            p: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            background: "linear-gradient(to bottom, #ffffff 0%, rgba(179, 201, 202, 0.02) 100%)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              color: "#004c40",
                            }}
                          >
                            {cuarto.cuarto}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <LocationOn sx={{ fontSize: 16, color: "#00796b", mr: 0.5 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.85rem",
                                color: "#00796b",
                              }}
                            >
                              {cuarto.direccion || "Ubicación no especificada"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Rating
                              value={0}
                              precision={0.5}
                              size="small"
                              sx={{
                                "& .MuiRating-iconEmpty": {
                                  color: "rgba(179, 201, 202, 0.5)",
                                },
                                "& .MuiRating-iconFilled": {
                                  color: "#ff8a65",
                                },
                              }}
                              onChange={(event, newValue) => {
                                console.log("Nueva calificación para cuarto:", cuarto.id, newValue);
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 1,
                                color: "#00796b",
                                fontSize: "0.75rem",
                              }}
                            >
                              Califica esta habitación
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              height: "36px",
                              fontSize: "0.85rem",
                              color: "#00796b",
                              lineHeight: 1.4,
                            }}
                          >
                            {cuarto.descripcion || "Espacio cómodo y moderno para tu estancia"}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Bed sx={{ fontSize: 16, color: "#00796b", mr: 0.5 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.85rem",
                                color: "#00796b",
                              }}
                            >
                              {cuarto.numhabitacion || "1"} habitación disponible
                            </Typography>
                          </Box>

                          {cuarto.servicios && (
                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                              {getServiceIcons(cuarto.servicios).map((icon, index) => (
                                <Tooltip
                                  key={index}
                                  title={
                                    index === 0 ? "WiFi" :
                                      index === 1 ? "Estacionamiento" :
                                        index === 2 ? "Restaurante" : ""
                                  }
                                >
                                  <Box
                                    sx={{
                                      color: "#004c40",
                                      bgcolor: "rgba(76, 148, 188, 0.1)",
                                      border: "1px solid rgba(76, 148, 188, 0.2)",
                                      p: 0.8,
                                      borderRadius: "10px",
                                      fontSize: "0.9rem",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        bgcolor: "rgba(76, 148, 188, 0.2)",
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    {icon}
                                  </Box>
                                </Tooltip>
                              ))}
                            </Box>
                          )}

                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: "#004c40",
                              mb: 1,
                              fontSize: "1.2rem",
                            }}
                          >
                            ${cuarto.preciodia || "100"}
                            <Typography
                              component="span"
                              sx={{
                                fontWeight: 400,
                                color: "#00796b",
                                fontSize: "0.8rem",
                                ml: 0.5,
                              }}
                            >
                              /día
                            </Typography>
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              fontSize: "0.75rem",
                              color: "#00796b",
                            }}
                          >
                            Horario: {cuarto.horario || "2025-05-23T09:00:00Z - 2025-05-23T18:00:00Z"}
                          </Typography>

                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              mt: "auto",
                              py: 1.2,
                              background: "linear-gradient(45deg, #00796b 0%, #004c40 100%)",
                              borderRadius: "12px",
                              fontWeight: 600,
                              textTransform: "none",
                              boxShadow: "0 4px 16px rgba(76, 148, 188, 0.3)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "linear-gradient(45deg, #004c40 0%, #00796b 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(76, 148, 188, 0.4)",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(cuarto.id);
                            }}
                          >
                            Ver Detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </Container>
        </Box>

        {/* Modal para detalles del hotel */}
        <HotelDetailModal open={modalOpen} handleClose={handleCloseModal} hotel={selectedHotel} />
      </Box>
    </ThemeProvider>
  );
};

export default PaginaPrincipal;