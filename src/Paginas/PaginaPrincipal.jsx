import { useState, useEffect } from "react"
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material"
import {
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
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Tema personalizado con colores de Xantolo/Día de los Muertos
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF6B35", // Naranja vibrante del Día de los Muertos
      light: "#FF8A65",
      dark: "#E65100",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8E24AA", // Morado/púrpura tradicional
      light: "#BA68C8",
      dark: "#4A148C",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff", // Fondo blanco como solicitado
      paper: "#ffffff",
    },
    success: {
      main: "#FFD600", // Amarillo dorado
    },
    error: {
      main: "#D32F2F", // Rojo tradicional
    },
    info: {
      main: "#FF4081", // Rosa mexicano
    },
    warning: {
      main: "#FF9800", // Naranja cálido
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
          background: "linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #8E24AA 30%, #BA68C8 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(255, 107, 53, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(142, 36, 170, 0.1), 0 10px 10px -5px rgba(255, 107, 53, 0.04)",
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
              boxShadow: "0 0 0 4px rgba(255, 107, 53, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(255, 107, 53, 0.2)",
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
})

// Componente de decoraciones de Xantolo
const XantoloDecorations = () => {
  return (
    <>
      {/* Velas flotantes */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "8px",
          height: "40px",
          background: "linear-gradient(to bottom, #FFD600 0%, #FF6B35 100%)",
          borderRadius: "4px 4px 0 0",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "12px",
            height: "12px",
            background: "radial-gradient(circle, #FFD600 30%, transparent 70%)",
            borderRadius: "50%",
            animation: "flicker 2s infinite alternate",
          },
          "@keyframes flicker": {
            "0%": { opacity: 0.8, transform: "translateX(-50%) scale(1)" },
            "100%": { opacity: 1, transform: "translateX(-50%) scale(1.1)" },
          },
        }}
      />

      {/* Pétalos flotantes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`petal-${i}`}
          sx={{
            position: "absolute",
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 90 + 5}%`,
            width: "12px",
            height: "12px",
            background: i % 2 === 0 ? "#FF4081" : "#FFD600",
            borderRadius: "50% 0 50% 0",
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `float ${3 + Math.random() * 2}s infinite ease-in-out`,
            opacity: 0.7,
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(180deg)" },
            },
          }}
        />
      ))}

      {/* Flores de cempasúchil */}
      {[...Array(4)].map((_, i) => (
        <Box
          key={`flower-${i}`}
          sx={{
            position: "absolute",
            top: `${20 + i * 20}%`,
            right: `${5 + i * 2}%`,
            width: "20px",
            height: "20px",
            background: "radial-gradient(circle, #FFD600 30%, #FF6B35 70%)",
            borderRadius: "50%",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "16px",
              height: "16px",
              background: "radial-gradient(circle, #FF8A65 40%, transparent 70%)",
              borderRadius: "50%",
            },
            animation: `bloom ${4 + i}s infinite ease-in-out`,
            "@keyframes bloom": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.2)" },
            },
          }}
        />
      ))}

      {/* Calaveras decorativas */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "8%",
          fontSize: "24px",
          opacity: 0.1,
          animation: "pulse 3s infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.1 },
            "50%": { opacity: 0.3 },
          },
        }}
      >
        💀
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          fontSize: "20px",
          opacity: 0.15,
          animation: "pulse 4s infinite",
        }}
      >
        🌺
      </Box>
    </>
  )
}

// Componente Modal para detalles del hotel
const HotelDetailModal = ({ open, handleClose, hotel }) => {
  if (!hotel) return null

  const getImageSrc = (imagen) => {
    console.log("Procesando imagen en modal:", imagen)
    if (!imagen) {
      console.warn("Imagen no proporcionada en modal")
      return "/placeholder.svg?height=400&width=600"
    }
    try {
      if (typeof imagen === "object" && imagen.data && imagen.mimeType) {
        return `data:${imagen.mimeType};base64,${imagen.data}`
      }
      if (typeof imagen === "string" && imagen.match(/^https?:\/\//)) {
        return imagen
      }
      if (typeof imagen === "string" && imagen.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo imagen como base64 directo en modal")
        return `data:image/jpeg;base64,${imagen}`
      }
      console.warn("Formato de imagen no reconocido en modal:", imagen)
      return "/placeholder.svg?height=400&width=600"
    } catch (error) {
      console.error("Error al procesar imagen en modal:", error.message, imagen)
      return "/placeholder.svg?height=400&width=600"
    }
  }

  const getServiceIcons = (servicios) => {
    if (!servicios) return []
    const serviciosList = []
    const serviciosLower = typeof servicios === "string" ? servicios.toLowerCase() : ""
    if (serviciosLower.includes("wifi")) serviciosList.push({ icon: <Wifi />, name: "WiFi Gratis" })
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      serviciosList.push({ icon: <LocalParking />, name: "Estacionamiento" })
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      serviciosList.push({ icon: <Restaurant />, name: "Restaurante" })
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      serviciosList.push({ icon: <FitnessCenter />, name: "Gimnasio" })
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca"))
      serviciosList.push({ icon: <Pool />, name: "Piscina" })
    if (serviciosLower.includes("aire") || serviciosLower.includes("acondicionado"))
      serviciosList.push({ icon: <AcUnit />, name: "Aire Acondicionado" })
    if (serviciosLower.includes("tv") || serviciosLower.includes("televisión"))
      serviciosList.push({ icon: <Tv />, name: "TV" })
    if (serviciosLower.includes("servicio") || serviciosLower.includes("habitación"))
      serviciosList.push({ icon: <RoomService />, name: "Servicio a la Habitación" })
    if (serviciosLower.includes("baño") || serviciosLower.includes("tina"))
      serviciosList.push({ icon: <Bathtub />, name: "Baño Privado" })
    if (serviciosLower.includes("balcón") || serviciosLower.includes("terraza"))
      serviciosList.push({ icon: <Balcony />, name: "Balcón" })
    if (serviciosLower.includes("mascota") || serviciosLower.includes("pet"))
      serviciosList.push({ icon: <Pets />, name: "Pet Friendly" })
    if (serviciosLower.includes("desayuno") || serviciosLower.includes("breakfast"))
      serviciosList.push({ icon: <LocalCafe />, name: "Desayuno Incluido" })
    return serviciosList
  }

  return (
    
    <Modal open={open} onClose={handleClose} aria-labelledby="hotel-detail-modal" closeAfterTransition>
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
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40px',
              backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGdWLuXlzvaWSE17D7isKuDzo7Y7PX_KRjQ&s')`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              backgroundPosition: 'center',
              zIndex: 2
            }}
          />
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
                background: "linear-gradient(to top, rgba(142, 36, 170, 0.8), transparent)",
                color: "white",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {hotel.nombrehotel}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body1">{hotel.direccion || "Ubicación no especificada"}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3, maxHeight: "calc(90vh - 300px)", overflow: "auto" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                  Acerca de este alojamiento
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                  {hotel.descripcion ||
                    "Este elegante hotel ofrece una experiencia única con instalaciones modernas y un servicio excepcional. Disfrute de una estancia confortable en un ambiente acogedor, ideal tanto para viajes de negocios como de placer."}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "secondary.main" }}>
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
                          bgcolor: "rgba(255, 107, 53, 0.05)",
                          border: "1px solid rgba(255, 107, 53, 0.1)",
                        }}
                      >
                        <Box sx={{ color: "primary.main", mr: 1 }}>{servicio.icon}</Box>
                        <Typography variant="body2" fontWeight={500}>
                          {servicio.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "success.main" }}>
                  Disponibilidad
                </Typography>
                <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(255, 214, 0, 0.05)", borderRadius: 2 }}>
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
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                    Información de Contacto
                  </Typography>
                  <List dense disablePadding>
                    {hotel?.telefono && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Phone fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={hotel.telefono} primaryTypographyProps={{ variant: "body2" }} />
                      </ListItem>
                    )}
                    {hotel?.correo && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Email fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={hotel.correo} primaryTypographyProps={{ variant: "body2" }} />
                      </ListItem>
                    )}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "secondary.main" }}>
                    Califica este hotel
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={0}
                      precision={0.5}
                      size="large"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#FFD600",
                        },
                      }}
                      onChange={(event, newValue) => {
                        console.log("Nueva calificación:", newValue)
                      }}
                    />
                  </Box>
                  <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
                    Reservar Ahora
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

const PaginaPrincipal = () => {
  const navigate = (path) => {
    console.log(`Navegando a: ${path}`)
  }

  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [hoteles, setHoteles] = useState([])
  const [cuartos, setCuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(new Set())
  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [hotelesRes, cuartosRes] = await Promise.all([
        fetch("https://backendreservas-m2zp.onrender.com/api/detallehotel/public"),
        fetch("https://backendreservas-m2zp.onrender.com/api/detallesHabitacion/public"),
      ])

      if (!hotelesRes.ok) {
        throw new Error(`Error en hoteles: ${hotelesRes.status} ${await hotelesRes.text()}`)
      }
      if (!cuartosRes.ok) {
        throw new Error(`Error en cuartos: ${cuartosRes.status} ${await cuartosRes.text()}`)
      }

      const hotelesData = await hotelesRes.json()
      const cuartosData = await cuartosRes.json()

      console.log("Hoteles Data:", hotelesData)
      console.log("Cuartos Data:", cuartosData)

      setHoteles(hotelesData.slice(0, 6))
      setCuartos(cuartosData.slice(0, 8))
    } catch (error) {
      console.error("Error fetching data:", error.message)
      setHoteles([])
      setCuartos([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Buscando:", { destination, checkIn, checkOut, guests })
  }

  const toggleFavorite = (id, type) => {
    const key = `${type}-${id}`
    const newFavorites = new Set(favorites)
    if (newFavorites.has(key)) {
      newFavorites.delete(key)
    } else {
      newFavorites.add(key)
    }
    setFavorites(newFavorites)
  }

  const handleOpenModal = (hotel) => {
    setSelectedHotel(hotel)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleCardClick = (id) => {
    navigate(`/detalles-habitacion/${id}`)
  }

  const getImageSrc = (imagen) => {
    console.log("Procesando imagen:", imagen)
    if (!imagen) {
      console.warn("Imagen no proporcionada")
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible"
    }
    try {
      if (typeof imagen === "object" && imagen.data && imagen.mimeType) {
        return `data:${imagen.mimeType};base64,${imagen.data}`
      }
      if (typeof imagen === "string" && imagen.match(/^https?:\/\//)) {
        return imagen
      }
      if (typeof imagen === "string" && imagen.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo imagen como base64 directo")
        return `data:image/jpeg;base64,${imagen}`
      }
      if (typeof imagen === "string" && imagen.startsWith("{")) {
        const imageData = JSON.parse(imagen)
        if (imageData.mimeType && imageData.data) {
          return `data:${imageData.mimeType};base64,${imageData.data}`
        }
      }
      console.warn("Formato de imagen no reconocido:", imagen)
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible"
    } catch (error) {
      console.error("Error al procesar imagen:", error.message, imagen)
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible"
    }
  }

  const getCuartoImages = (imagenes, imagenhabitacion) => {
    console.log("Procesando imágenes de cuarto:", imagenes, "Imagen habitación:", imagenhabitacion)
    if (!imagenes && !imagenhabitacion) {
      console.warn("No hay imágenes proporcionadas")
      return "https://via.placeholder.com/320x180/8E24AA/ffffff?text=Imagen+No+Disponible"
    }
    try {
      let imageArray = []
      if (Array.isArray(imagenes) && imagenes.length > 0) {
        imageArray = imagenes
      }
      if (imageArray.length === 0 && imagenhabitacion) {
        if (typeof imagenhabitacion === "string" && imagenhabitacion.match(/^[A-Za-z0-9+/=]+$/)) {
          imageArray = [{ data: imagenhabitacion, mimeType: "image/jpeg" }]
        } else if (typeof imagenhabitacion === "object" && imagenhabitacion.data && imagenhabitacion.mimeType) {
          imageArray = [imagenhabitacion]
        }
      }
      if (imageArray.length === 0) {
        console.warn("No hay imágenes válidas en el array")
        return "https://via.placeholder.com/320x180/8E24AA/ffffff?text=Imagen+No+Disponible"
      }
      const firstImage = imageArray[0]
      if (typeof firstImage === "object" && firstImage.data && firstImage.mimeType) {
        return `data:${firstImage.mimeType};base64,${firstImage.data}`
      }
      if (typeof firstImage === "string" && firstImage.match(/^[A-Za-z0-9+/=]+$/)) {
        console.log("Asumiendo primera imagen como base64 directo")
        return `data:image/jpeg;base64,${firstImage}`
      }
      console.warn("Formato de imagen no reconocido en imágenes:", imageArray)
      return "https://via.placeholder.com/320x180/8E24AA/ffffff?text=Imagen+No+Disponible"
    } catch (error) {
      console.error("Error al procesar imágenes:", error.message, imagenes, imagenhabitacion)
      return "https://via.placeholder.com/320x180/8E24AA/ffffff?text=Imagen+No+Disponible"
    }
  }

  const getServiceIcons = (servicios) => {
    if (!servicios) return []
    const icons = []
    const serviciosLower = typeof servicios === "string" ? servicios.toLowerCase() : ""
    if (serviciosLower.includes("wifi")) icons.push(<Wifi key="wifi" />)
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      icons.push(<LocalParking key="parking" />)
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      icons.push(<Restaurant key="restaurant" />)
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      icons.push(<FitnessCenter key="gym" />)
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca")) icons.push(<Pool key="pool" />)
    return icons.slice(0, 3)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === hoteles.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? hoteles.length - 1 : prev - 1))
  }

  const AnimatedBox = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay])

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
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default", // Fondo blanco
          position: "relative",
        }}
      >
        {/* Decoraciones de Xantolo */}
        <XantoloDecorations />

        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            background: `
              linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(142, 36, 170, 0.1) 50%, rgba(255, 214, 0, 0.1) 100%),
              url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: { md: "0 0 50px 50px" },
            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
                <AnimatedBox>
                  <Typography
                    variant="h1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      background:
                        "linear-gradient(45deg, #FF6B35 0%, #8E24AA 25%, #FFD600 50%, #FF4081 75%, #FF6B35 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundSize: "200% 200%",
                      animation: "gradientShift 4s ease infinite",
                      textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      "@keyframes gradientShift": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                      },
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
                      color: "#333",
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    Descubre alojamientos únicos y experiencias inolvidables para tu próxima aventura en esta temporada
                    especial de Xantolo
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
                      boxShadow: "0 25px 50px -12px rgba(255, 107, 53, 0.25)",
                      border: "1px solid rgba(255, 107, 53, 0.1)",
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
                            boxShadow: "0 10px 15px -3px rgba(142, 36, 170, 0.3)",
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
              background: "linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(160, 82, 45, 0.08) 100%)",
              py: 6,
              position: "relative",
            }}
          >
            <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
              <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Chip
                    label="🎭 EXPERIENCIAS ÚNICAS 🎭"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      backgroundColor: "#8B4513",
                      color: "white",
                      fontSize: "0.9rem",
                      letterSpacing: "0.5px",
                      boxShadow: "0 2px 8px rgba(139, 69, 19, 0.3)",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      fontFamily: '"Fresca", cursive',
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#8B4513",
                      textShadow: "1px 1px 3px rgba(139, 69, 19, 0.2)",
                      mb: 1,
                      fontFamily: '"Fresca", cursive',
                      position: "relative",
                      "&::after": {
                        content: '"🌺"',
                        position: "absolute",
                        right: -40,
                        top: -5,
                        fontSize: "1.2rem",
                        animation: "float 3s ease-in-out infinite",
                      },
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-8px)" },
                      },
                    }}
                  >
                    Destinos Destacados
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#A0522D", 
                      maxWidth: 400,
                      fontWeight: 500,
                      fontStyle: "italic",
                    }}
                  >
                    Descubre los lugares más increíbles 💀✨
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={prevSlide}
                    sx={{
                      bgcolor: "rgba(139, 69, 19, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid #8B4513",
                      boxShadow: "0 4px 12px rgba(139, 69, 19, 0.2)",
                      color: "#8B4513",
                      width: 48,
                      height: 48,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#8B4513",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(139, 69, 19, 0.3)",
                        color: "white",
                      },
                    }}
                  >
                    <KeyboardArrowLeft sx={{ fontSize: 24 }} />
                  </IconButton>
                  <IconButton
                    onClick={nextSlide}
                    sx={{
                      bgcolor: "rgba(139, 69, 19, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid #8B4513",
                      boxShadow: "0 4px 12px rgba(139, 69, 19, 0.2)",
                      color: "#8B4513",
                      width: 48,
                      height: 48,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#8B4513",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(139, 69, 19, 0.3)",
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
                  borderRadius: "16px",
                  height: 400,
                  boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
                  border: "3px solid #D2B48C",
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
                      transform: index === currentSlide ? "scale(1)" : "scale(1.01)",
                      transition: "all 0.6s ease",
                      backgroundImage: `linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(160, 82, 45, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%), url(${getImageSrc(hotel.imagen)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "white",
                      borderRadius: "13px",
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
                          fontWeight: 700,
                          mb: 2,
                          textShadow: "0 3px 12px rgba(0,0,0,0.7)",
                          color: "#F5DEB3",
                          fontSize: { xs: "2rem", md: "2.8rem" },
                          fontFamily: '"Fresca", cursive',
                          position: "relative",
                          "&::before": {
                            content: '"🎭"',
                            position: "absolute",
                            left: -45,
                            top: -8,
                            fontSize: "1.8rem",
                            animation: "bounce 2s infinite",
                          },
                          "&::after": {
                            content: '"🌺"',
                            position: "absolute",
                            right: -45,
                            top: -8,
                            fontSize: "1.8rem",
                            animation: "bounce 2s infinite 1s",
                          },
                          "@keyframes bounce": {
                            "0%, 100%": { transform: "translateY(0)" },
                            "50%": { transform: "translateY(-12px)" },
                          },
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
                          backgroundColor: "rgba(139, 69, 19, 0.3)",
                          backdropFilter: "blur(10px)",
                          borderRadius: "20px",
                          px: 3,
                          py: 2,
                          border: "2px solid #D2B48C",
                          boxShadow: "0 3px 15px rgba(139, 69, 19, 0.2)",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 22, mr: 1.5, color: "#F5DEB3" }} />
                        <Typography
                          variant="h6"
                          sx={{
                            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                            fontWeight: 600,
                            letterSpacing: "0.3px",
                            color: "#F5DEB3",
                            fontFamily: '"Fresca", cursive',
                          }}
                        >
                          {hotel.direccion}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          px: 6,
                          py: 2.5,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          backgroundColor: "#8B4513",
                          color: "white",
                          boxShadow: "0 6px 20px rgba(139, 69, 19, 0.3)",
                          borderRadius: "25px",
                          textTransform: "uppercase",
                          border: "2px solid #D2B48C",
                          backdropFilter: "blur(8px)",
                          fontFamily: '"Fresca", cursive',
                          letterSpacing: "0.5px",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                            transition: "left 0.5s",
                          },
                          "&:hover": {
                            backgroundColor: "#A0522D",
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 25px rgba(139, 69, 19, 0.4)",
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                        onClick={() => handleOpenModal(hotel)}
                      >
                        🎭 Explorar Destino 🌺
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 65,
                        height: 65,
                        borderRadius: "50%",
                        background: "rgba(139, 69, 19, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "2px solid #D2B48C",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        boxShadow: "0 3px 15px rgba(139, 69, 19, 0.3)",
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: "white", 
                          fontWeight: 700, 
                          fontSize: "0.9rem",
                          fontFamily: '"Fresca", cursive',
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        {index + 1}/{hoteles.length}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 2,
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "15px",
                    px: 2.5,
                    py: 1.5,
                    border: "1px solid rgba(139, 69, 19, 0.3)",
                  }}
                >
                  {hoteles.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: index === currentSlide ? 32 : 12,
                        height: 4,
                        borderRadius: "4px",
                        backgroundImage: index === currentSlide 
                          ? `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGdWLuXlzvaWSE17D7isKuDzo7Y7PX_KRjQ&s')`
                          : "none",
                        backgroundColor: index === currentSlide ? "transparent" : "rgba(255, 255, 255, 0.5)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "repeat-x",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        boxShadow: index === currentSlide ? "0 2px 8px rgba(139, 69, 19, 0.4)" : "0 1px 4px rgba(255, 255, 255, 0.2)",
                        border: index === currentSlide ? "1px solid #8B4513" : "1px solid rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          transform: "scale(1.1)",
                          backgroundColor: index === currentSlide ? "transparent" : "#8B4513",
                        },
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
<Container maxWidth="xl" sx={{ py: 8, position: 'relative' }}>
  {/* Decoración de fondo inspirada en papel picado */}
  <Box 
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 60% 40%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
      zIndex: 0
    }}
  />
  
  {/* Patrón decorativo superior */}
<Box
  sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40px', // Más grueso que antes (era 20px)
    backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGdWLuXlzvaWSE17D7isKuDzo7Y7PX_KRjQ&s')`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'auto 100%', // Se ajusta a la altura completa
    backgroundPosition: 'center',
    zIndex: 1
  }}

  />
  
  <Box sx={{ textAlign: "center", mb: 6, position: 'relative', zIndex: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
      <Box 
        sx={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, #FF6B35, #FFC107)',
          borderRadius: '2px',
          mr: 2
        }}
      />
      <Chip
        label="🏨 ALOJAMIENTOS PREMIUM XANTOLO 🎭"
        sx={{
          mb: 0,
          fontWeight: 700,
          px: 3,
          py: 1,
          background: 'linear-gradient(135deg, #FF6B35, #FF4081)',
          color: "white",
          fontSize: "0.9rem",
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
          },
          transition: 'all 0.3s ease'
        }}
        size="medium"
      />
      <Box 
        sx={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, #FFC107, #9C27B0)',
          borderRadius: '2px',
          ml: 2
        }}
      />
    </Box>
    
    <Typography 
      variant="h3" 
      sx={{ 
        mb: 2, 
        background: 'linear-gradient(45deg, #FF6B35, #9C27B0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 800,
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '4px',
          background: 'linear-gradient(90deg, #FFC107, #FF4081)',
          borderRadius: '2px'
        }
      }}
    >
      Hoteles Destacados
    </Typography>
    
    <Typography 
      variant="h6" 
      sx={{ 
        color: "#9C27B0", 
        fontWeight: 500, 
        maxWidth: 700, 
        mx: "auto",
        fontSize: '1.1rem',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}
    >
      🌺 Los mejores hoteles para celebrar la tradición de Xantolo 🌺
    </Typography>
  </Box>
  
  <Grid container spacing={3} sx={{ justifyContent: "center", position: 'relative', zIndex: 2 }}>
    {loading
      ? Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={index}>
            <Card sx={{ 
              width: "100%", 
              maxWidth: 320,
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(156, 39, 176, 0.1))',
              borderRadius: '20px',
              border: '2px solid rgba(255, 193, 7, 0.3)'
            }}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '20px 20px 0 0' }} />
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
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 193, 7, 0.05))',
                border: "3px solid transparent",
                backgroundClip: "padding-box",
                borderRadius: '20px',
                boxShadow: "0 8px 30px rgba(255, 107, 53, 0.2)",
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #FF6B35, #FFC107, #9C27B0, #FF4081)',
                  borderRadius: '20px',
                  padding: '3px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  zIndex: -1
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: "0 15px 40px rgba(255, 107, 53, 0.3)",
                  '&::before': {
                    background: 'linear-gradient(135deg, #FF4081, #9C27B0, #FF6B35, #FFC107)',
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                    transition: "transform 0.5s ease",
                    "&:hover": { transform: "scale(1.1)" },
                    borderRadius: '20px 20px 0 0',
                    filter: 'brightness(1.1) saturate(1.2)',
                  }}
                />
                
                {/* Overlay decorativo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(156, 39, 176, 0.1))',
                    borderRadius: '20px 20px 0 0',
                    pointerEvents: 'none'
                  }}
                />
                
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 193, 7, 0.2))',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    "&:hover": {
                      background: 'linear-gradient(135deg, #FF4081, #9C27B0)',
                      transform: "scale(1.2) rotate(10deg)",
                      color: "white",
                      boxShadow: '0 6px 20px rgba(255, 64, 129, 0.4)',
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: 3,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(hotel.id_hotel, "hotel")
                  }}
                >
                  {favorites.has(`hotel-${hotel.id_hotel}`) ? (
                    <Favorite sx={{ color: "#FF4081" }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                
                <Chip
                  label="🏨 Hotel"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    fontWeight: 700,
                    zIndex: 3,
                    background: 'linear-gradient(135deg, #9C27B0, #FF4081)',
                    color: "white",
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                    fontSize: '0.75rem',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                {/* Decoración floral sutil */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: '1.5rem',
                    opacity: 0.1,
                    transform: 'rotate(15deg)',
                    color: '#FF6B35'
                  }}
                >
                  🌸
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    background: 'linear-gradient(45deg, #FF6B35, #9C27B0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {hotel.nombrehotel}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #9C27B0, #FF4081)',
                      borderRadius: '50%',
                      p: 0.5,
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <LocationOn sx={{ fontSize: 16, color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      color: "#9C27B0",
                      fontWeight: 500,
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
                      color: "#FFC107",
                      "& .MuiRating-iconEmpty": {
                        color: "rgba(255, 193, 7, 0.3)",
                      },
                      "& .MuiRating-iconFilled": {
                        filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3))',
                      },
                    }}
                    onChange={(event, newValue) => {
                      console.log("Nueva calificación para hotel:", hotel.id_hotel, newValue)
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: "#9C27B0",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    ⭐ Califica este hotel
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
                    height: "40px",
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: 1.4,
                  }}
                >
                  {hotel.descripcion || "🎭 Hotel con excelentes servicios y comodidades para celebrar Xantolo 🌺"}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35, #FFC107)',
                      borderRadius: '50%',
                      p: 0.5,
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Bed sx={{ fontSize: 16, color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      color: "#FF6B35",
                      fontWeight: 600,
                    }}
                  >
                    {hotel.numhabitacion || "N/A"} habitaciones disponibles
                  </Typography>
                </Box>
                
                {hotel.servicios && (
                  <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                    {getServiceIcons(hotel.servicios).map((icon, index) => (
                      <Tooltip
                        key={index}
                        title={
                          index === 0
                            ? "WiFi"
                            : index === 1
                              ? "Estacionamiento"
                              : index === 2
                                ? "Restaurante"
                                : ""
                        }
                      >
                        <Box
                          sx={{
                            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(255, 193, 7, 0.1))',
                            color: "#9C27B0",
                            border: '2px solid rgba(156, 39, 176, 0.2)',
                            p: 1,
                            borderRadius: '12px',
                            fontSize: "1rem",
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #9C27B0, #FF4081)',
                              color: 'white',
                              transform: 'translateY(-2px) scale(1.1)',
                              boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                            }
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
                  size="medium"
                  sx={{
                    mt: "auto",
                    py: 1.5,
                    background: 'linear-gradient(135deg, #FF6B35, #FF4081)',
                    color: "white",
                    borderRadius: '15px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    "&:hover": {
                      background: 'linear-gradient(135deg, #9C27B0, #FF6B35)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(156, 39, 176, 0.4)',
                    },
                    "&:active": {
                      transform: 'translateY(0px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      transition: 'left 0.5s',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                  }}
                  onClick={() => handleOpenModal(hotel)}
                >
                  🎭 Ver Detalles 🌺
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
  </Grid>
  
 {/* Patrón decorativo superior */}
<Box
  sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40px', // Más grueso que antes (era 20px)
    backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGdWLuXlzvaWSE17D7isKuDzo7Y7PX_KRjQ&s')`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'auto 100%', // Se ajusta a la altura completa
    backgroundPosition: 'center',
    zIndex: 1
  }}
/>
</Container>

        {/* Sección de Departamentos/Habitaciones */}
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(255, 214, 0, 0.1) 0%, rgba(255, 64, 129, 0.1) 100%)",
            py: 8,
            borderRadius: { md: "50px 50px 0 0" },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="ESPACIOS ÚNICOS XANTOLO"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  backgroundColor: "#FF4081",
                  color: "white",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  boxShadow: "0 4px 12px rgba(255, 64, 129, 0.3)",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  color: "#8E24AA",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(142, 36, 170, 0.1)",
                }}
              >
                Departamentos y Habitaciones
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#FF6B35",
                  fontWeight: 400,
                  maxWidth: 700,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Espacios únicos y cómodos para celebrar Xantolo en grande
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
                boxShadow: "0 4px 20px rgba(255, 107, 53, 0.1)",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FF6B35",
                  height: 4,
                  borderRadius: "4px",
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  minWidth: 120,
                  color: "#8E24AA",
                  borderRadius: "20px",
                  margin: "0 4px",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    color: "#FF6B35",
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  },
                  "&:hover": {
                    color: "#FF4081",
                    backgroundColor: "rgba(255, 64, 129, 0.05)",
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
                          boxShadow: "0 2px 4px rgba(142, 36, 170, 0.2)",
                        }}
                      >
                        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: "20px 20px 0 0" }} />
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
                          boxShadow: "0 8px 32px rgba(255, 107, 53, 0.15)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden",
                          border: "1px solid rgba(255, 107, 53, 0.3)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 16px 48px rgba(142, 36, 170, 0.25)",
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
                              border: "1px solid rgba(255, 107, 53, 0.3)",
                              "&:hover": {
                                backgroundColor: "white",
                                transform: "scale(1.1)",
                                boxShadow: "0 4px 16px rgba(255, 64, 129, 0.3)",
                              },
                              transition: "all 0.2s ease",
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(cuarto.id, "cuarto")
                            }}
                          >
                            {favorites.has(`cuarto-${cuarto.id}`) ? (
                              <Favorite sx={{ color: "#FF4081" }} />
                            ) : (
                              <FavoriteBorder sx={{ color: "#FF6B35" }} />
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
                              backgroundColor: cuarto.estado === "Disponible" ? "#FFD600" : "#FF4081",
                              color: cuarto.estado === "Disponible" ? "#8E24AA" : "white",
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
                                border: "1px solid rgba(255, 107, 53, 0.3)",
                              }}
                            >
                              <CheckCircle sx={{ fontSize: 14, color: "#FFD600", mr: 0.5 }} />
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                sx={{
                                  color: "#8E24AA",
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
                            background: "linear-gradient(to bottom, #ffffff 0%, rgba(255, 214, 0, 0.02) 100%)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              color: "#FF6B35",
                            }}
                          >
                            {cuarto.cuarto}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <LocationOn sx={{ fontSize: 16, color: "#8E24AA", mr: 0.5 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.85rem",
                                color: "#8E24AA",
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
                                  color: "rgba(255, 214, 0, 0.3)",
                                },
                                "& .MuiRating-iconFilled": {
                                  color: "#FFD600",
                                },
                              }}
                              onChange={(event, newValue) => {
                                console.log("Nueva calificación para cuarto:", cuarto.id, newValue)
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 1,
                                color: "#8E24AA",
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
                              color: "#666",
                              lineHeight: 1.4,
                            }}
                          >
                            {cuarto.descripcion || "Espacio cómodo y moderno para celebrar Xantolo"}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Bed sx={{ fontSize: 16, color: "#FF6B35", mr: 0.5 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.85rem",
                                color: "#FF6B35",
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
                                    index === 0
                                      ? "WiFi"
                                      : index === 1
                                        ? "Estacionamiento"
                                        : index === 2
                                          ? "Restaurante"
                                          : ""
                                  }
                                >
                                  <Box
                                    sx={{
                                      color: "#8E24AA",
                                      bgcolor: "rgba(142, 36, 170, 0.1)",
                                      border: "1px solid rgba(142, 36, 170, 0.2)",
                                      p: 0.8,
                                      borderRadius: "10px",
                                      fontSize: "0.9rem",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        bgcolor: "rgba(142, 36, 170, 0.2)",
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
                              color: "#FF6B35",
                              mb: 1,
                              fontSize: "1.2rem",
                            }}
                          >
                            ${cuarto.preciodia || "100"}
                            <Typography
                              component="span"
                              sx={{
                                fontWeight: 400,
                                color: "#8E24AA",
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
                              color: "#8E24AA",
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
                              background: "linear-gradient(45deg, #FF6B35 0%, #8E24AA 100%)",
                              borderRadius: "12px",
                              fontWeight: 600,
                              textTransform: "none",
                              boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "linear-gradient(45deg, #8E24AA 0%, #FF4081 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(142, 36, 170, 0.4)",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCardClick(cuarto.id)
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
  )
}

export default PaginaPrincipal;
