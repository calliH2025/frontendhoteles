import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fade,
  Stack,
  Avatar,
  Backdrop,
  CircularProgress,
} from "@mui/material"
import {
  StarBorder,
  Star,
  Room,
  Bed,
  FilterList,
  Navigation,
  Hotel,
  LocalOffer,
} from "@mui/icons-material"

// Lista de servicios disponibles
const serviciosDisponibles = [
  "Pet-friendly",
  "Sustentable",
  "Con asistencia para discapacitados",
  "Cocina",
  "Alberca",
  "Lavanderia",
  "Restaurant",
  "Internet",
  "Agua Caliente",
  "Todos",
]

const theme = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#f50057",
    light: "#ff5983",
    dark: "#c51162",
  },
  accent: {
    main: "#ff9800",
    light: "#ffb74d",
    dark: "#f57c00",
  },
  success: {
    main: "#4caf50",
    light: "#81c784",
    dark: "#388e3c",
  },
  background: {
    default: "#fafafa",
    paper: "#ffffff",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
}

const HotelesC = () => {
  const [hoteles, setHoteles] = useState([])
  const [filteredHoteles, setFilteredHoteles] = useState([])
  const [selectedService, setSelectedService] = useState("Todos")
  const [ratings, setRatings] = useState({})
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHoteles()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error)
        },
      )
    }
  }, [])

  useEffect(() => {
    if (selectedService === "Todos") {
      setFilteredHoteles(hoteles)
    } else {
      const filtered = hoteles.filter((hotel) => hotel.servicios && hotel.servicios.includes(selectedService))
      setFilteredHoteles(filtered)
    }
  }, [hoteles, selectedService])

  const fetchHoteles = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://backendreservas-m2zp.onrender.com/api/detallehotel/public")
      const hotelesData = response.data.map((hotel) => {
        let imagenParsed = { data: null, mimeType: "image/jpeg" }
        try {
          if (hotel.imagen) {
            if (typeof hotel.imagen === "object" && hotel.imagen.data && hotel.imagen.mimeType) {
              imagenParsed = hotel.imagen
            } else if (typeof hotel.imagen === "string" && hotel.imagen.includes("base64")) {
              imagenParsed = { data: hotel.imagen, mimeType: "image/jpeg" }
            } else if (typeof hotel.imagen === "string") {
              const parsed = JSON.parse(hotel.imagen)
              imagenParsed = { data: parsed.data || hotel.imagen, mimeType: parsed.mimeType || "image/jpeg" }
            }
          }
          if (!imagenParsed.data) {
            imagenParsed.data = "https://via.placeholder.com/400x240/1976d2/ffffff?text=Hotel+Premium"
          }
        } catch (error) {
          imagenParsed.data = "https://via.placeholder.com/400x240/1976d2/ffffff?text=Hotel+Premium"
          console.warn("Error al parsear imagen para hotel", hotel.id_hotel, error)
        }
        return {
          ...hotel,
          id: hotel.id_hotel,
          imagen: imagenParsed,
          servicios: hotel.servicios ? hotel.servicios.split(",") : [],
        }
      })
      setHoteles(hotelesData)
    } catch (error) {
      console.error("Error al obtener hoteles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDetailsClick = (hotel) => {
    navigate(`/cliente/detalles-hoteles/${hotel.id}`)
  }

  const handleLocationClick = (hotel) => {
    const hotelLat = Number.parseFloat(hotel.latitud)
    const hotelLng = Number.parseFloat(hotel.longitud)
    const userLat = userLocation ? userLocation.lat : 19.4326
    const userLng = userLocation ? userLocation.lng : -99.1332
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hotelLat},${hotelLng}&travelmode=driving`
    window.open(url, "_blank")
  }

  const handleImageClick = (hotel) => {
    navigate(`/cliente/cuartosc/${hotel.id}`)
  }

  const handleRatingChange = (hotelId, newValue) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [hotelId]: newValue,
    }))
  }

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Filter Section Mejorado */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e0e7ff",
            bgcolor: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterList sx={{ color: theme.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#374151" }}>
                Filtrar por:
              </Typography>
            </Stack>

            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel
                sx={{
                  color: theme.primary.main,
                  fontWeight: 600,
                  "&.Mui-focused": { color: theme.primary.dark },
                }}
              >
                Servicio
              </InputLabel>
              <Select
                value={selectedService}
                onChange={handleServiceChange}
                label="Servicio"
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                    borderWidth: 2,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.primary.light,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.primary.main,
                  },
                }}
              >
                {serviciosDisponibles.map((servicio) => (
                  <MenuItem key={servicio} value={servicio}>
                    {servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Chip
              label={`${filteredHoteles.length} resultados`}
              sx={{
                bgcolor: theme.primary.main,
                color: "white",
                fontWeight: 600,
                ml: "auto",
              }}
            />
          </Stack>
        </Paper>

        {/* Alert para sin resultados */}
        {filteredHoteles.length === 0 && selectedService !== "Todos" && (
          <Fade in={true}>
            <Alert
              severity="info"
              sx={{
                mb: 4,
                borderRadius: 2,
                bgcolor: "#eff6ff",
                border: "1px solid #bfdbfe",
                "& .MuiAlert-icon": { color: theme.primary.main },
              }}
            >
              No se encontraron hoteles con el servicio "{selectedService}". Selecciona otro servicio o elige "Todos"
              para ver todos los hoteles.
            </Alert>
          </Fade>
        )}

        {/* Grid de Hoteles Mejorado */}
        <Grid container spacing={3}>
          {filteredHoteles.map((hotel, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={hotel.id}>
              <Fade in={true} timeout={300 + index * 100}>
                <Card
                  onMouseEnter={() => setHoveredCard(hotel.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    cursor: "pointer",
                    position: "relative",
                    background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
                    boxShadow: "0 4px 24px rgba(25, 118, 210, 0.07)",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      "& .hotel-image": {
                        transform: "scale(1.1)",
                      },
                      "& .hotel-overlay": {
                        opacity: 1,
                      },
                      "& .hotel-content": {
                        bgcolor: "#f8fafc",
                      },
                    },
                  }}
                >
                  {/* Imagen con Overlay */}
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        hotel.imagen && hotel.imagen.data && hotel.imagen.mimeType
                          ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`
                          : "https://via.placeholder.com/400x200/1976d2/ffffff?text=Hotel+Premium"
                      }
                      alt={hotel.nombrehotel}
                      className="hotel-image"
                      sx={{
                        transition: "transform 0.6s ease",
                        objectFit: "cover",
                      }}
                    />

                    {/* Overlay con botones */}
                    <Box
                      className="hotel-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(45deg, rgba(25,118,210,0.8) 0%, rgba(21,101,192,0.6) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Bed />}
                        onClick={() => handleImageClick(hotel)}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          color: theme.primary.main,
                          backdropFilter: "blur(10px)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          borderRadius: 2,
                          px: 3,
                          py: 1.2,
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.12)",
                          "&:hover": {
                            bgcolor: "white",
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        Ver Cuartos
                      </Button>
                    </Box>

                    {/* Badges de promoción y habitaciones */}
                    {hotel.promociones && hotel.promociones.length > 0 && (
                      <Chip
                        icon={<LocalOffer />}
                        label={`¡Oferta! ${hotel.promociones[0].descuento}%`}
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: theme.secondary.main,
                          color: "white",
                          fontWeight: 700,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0.8 },
                          },
                        }}
                      />
                    )}

                    <Chip
                      icon={<Bed />}
                      label={`${hotel.numhabitacion} Hab.`}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255,255,255,0.95)",
                        color: theme.primary.main,
                        fontWeight: 600,
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </Box>

                  {/* Contenido de la tarjeta */}
                  <CardContent
                    className="hotel-content"
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        mb: 1.5,
                        fontSize: "1.1rem",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {hotel.nombrehotel}
                    </Typography>

                    {/* Ubicación */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Room sx={{ color: theme.primary.main, fontSize: "1rem" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {hotel.direccion || "Ubicación premium"}
                      </Typography>
                    </Stack>

                    {/* Servicios */}
                    {hotel.servicios && hotel.servicios.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {hotel.servicios.slice(0, 3).map((servicio, idx) => (
                            <Chip
                              key={idx}
                              label={servicio}
                              size="small"
                              sx={{
                                bgcolor: "#eff6ff",
                                color: theme.primary.main,
                                fontSize: "0.7rem",
                                height: 24,
                                fontWeight: 500,
                              }}
                            />
                          ))}
                          {hotel.servicios.length > 3 && (
                            <Chip
                              label={`+${hotel.servicios.length - 3}`}
                              size="small"
                              sx={{
                                bgcolor: "#f3f4f6",
                                color: "#6b7280",
                                fontSize: "0.7rem",
                                height: 24,
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}

                    <Divider sx={{ my: 2, borderColor: "#e5e7eb" }} />

                  </CardContent>

                  {/* Acciones */}
                  <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleDetailsClick(hotel)}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        py: 1,
                        fontWeight: 600,
                        bgcolor: theme.primary.main,
                        "&:hover": {
                          bgcolor: theme.primary.dark,
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Ver Detalles
                    </Button>
                    <Tooltip title="Ver ubicación en mapa">
                      <IconButton
                        onClick={() => handleLocationClick(hotel)}
                        sx={{
                          bgcolor: "#f3f4f6",
                          color: theme.primary.main,
                          "&:hover": {
                            bgcolor: theme.primary.main,
                            color: "white",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Navigation />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Estado vacío */}
        {filteredHoteles.length === 0 && selectedService === "Todos" && (
          <Paper
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
              borderRadius: 3,
              border: "2px dashed #d1d5db",
              bgcolor: "#f9fafb",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#f3f4f6",
                color: "#9ca3af",
                mx: "auto",
                mb: 3,
              }}
            >
              <Hotel fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
              No hay hoteles disponibles
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Intenta recargar la página o contacta con soporte.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default HotelesC;
