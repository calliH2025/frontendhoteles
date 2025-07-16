import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  TextField,
  Button,
  Grid,
  Chip,
  InputAdornment,
  FormControlLabel,
  Paper,
  Container,
  Avatar,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import {
  Search as SearchIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"

export default function HotelManagement() {
  const [hotels, setHotels] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // all, visible, hidden
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHoteles()
  }, [])

  const fetchHoteles = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://backendreservas-m2zp.onrender.com/api/gestionhoteles/list')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      console.log("Respuesta del backend:", data)
      if (data.error) throw new Error(data.error)
      const processedHotels = data.map(hotel => ({
        id: hotel.id_hotel,
        name: hotel.nombrehotel,
        location: hotel.direccion || "Ubicación no especificada",
        rooms: hotel.numhabitacion,
        isVisible: hotel.visible === 1,
        category: [...new Set(hotel.cuartos.map(cuarto => cuarto.tipohabitacion.tipohabitacion))].join(', ') || "Sin categoría",
        owner: hotel.propietario_nombre || "No asignado"
      }))
      setHotels(processedHotels)
      setSuccess('Hoteles cargados exitosamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(`Error al cargar hoteles: ${err.message}`)
      console.error("Error en fetchHoteles:", err)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const toggleHotelVisibility = async (hotelId, isVisible) => {
    try {
      const endpoint = isVisible
        ? `https://backendreservas-m2zp.onrender.com/api/gestionhoteles/hide/${hotelId}`
        : `https://backendreservas-m2zp.onrender.com/api/gestionhoteles/unhide/${hotelId}`
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setHotels(prevHotels =>
        prevHotels.map(hotel =>
          hotel.id === hotelId ? { ...hotel, isVisible: !isVisible } : hotel
        )
      )
      setSuccess(isVisible ? 'Hotel ocultado exitosamente' : 'Hotel restaurado exitosamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(`Error al cambiar visibilidad del hotel: ${err.message}`)
      console.error(err)
      setTimeout(() => setError(''), 3000)
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.owner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "visible" && hotel.isVisible) ||
      (filterStatus === "hidden" && !hotel.isVisible)

    return matchesSearch && matchesFilter
  })

  const visibleCount = hotels.filter((hotel) => hotel.isVisible).length
  const hiddenCount = hotels.filter((hotel) => !hotel.isVisible).length

  const getCategoryColor = (category) => {
    const colors = {
      Lujo: "primary",
      Playa: "info",
      Rural: "success",
      Negocios: "warning",
      Histórico: "secondary",
      Moderno: "error",
    }
    return colors[category.split(', ')[0]] || "default"
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="xl">
        {/* Alertas */}
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1300, minWidth: 300 }}>
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')} 
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              onClose={() => setSuccess('')} 
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {success}
            </Alert>
          )}
        </Box>

        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Gestión de Hoteles
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Administra la visibilidad de los hoteles en la plataforma
          </Typography>
        </Box>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Hoteles
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
                    {hotels.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                  <HotelIcon fontSize="large" />
                </Avatar>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Hoteles Visibles
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                    {visibleCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#2e7d32", width: 56, height: 56 }}>
                  <VisibilityIcon fontSize="large" />
                </Avatar>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Hoteles Ocultos
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {hiddenCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#d32f2f", width: 56, height: 56 }}>
                  <VisibilityOffIcon fontSize="large" />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar hoteles por nombre, ubicación o propietario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant={filterStatus === "all" ? "contained" : "outlined"}
                  onClick={() => setFilterStatus("all")}
                  startIcon={<FilterIcon />}
                  size="small"
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === "visible" ? "contained" : "outlined"}
                  onClick={() => setFilterStatus("visible")}
                  startIcon={<VisibilityIcon />}
                  color="success"
                  size="small"
                >
                  Visibles
                </Button>
                <Button
                  variant={filterStatus === "hidden" ? "contained" : "outlined"}
                  onClick={() => setFilterStatus("hidden")}
                  startIcon={<VisibilityOffIcon />}
                  color="error"
                  size="small"
                >
                  Ocultos
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de Hoteles */}
        {loading ? (
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }} aria-label="tabla de hoteles">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Hotel</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Propietario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Habitaciones</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Visibilidad</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton width="80%" /></TableCell>
                    <TableCell><Skeleton width="60%" /></TableCell>
                    <TableCell><Skeleton width="50%" /></TableCell>
                    <TableCell><Skeleton width="40%" /></TableCell>
                    <TableCell><Skeleton width="30%" /></TableCell>
                    <TableCell><Skeleton width="40%" /></TableCell>
                    <TableCell><Skeleton width="20%" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filteredHotels.length > 0 ? (
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }} aria-label="tabla de hoteles">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Hotel</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Propietario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Habitaciones</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Visibilidad</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHotels.map((hotel) => (
                  <TableRow
                    key={hotel.id}
                    sx={{
                      opacity: hotel.isVisible ? 1 : 0.6,
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HotelIcon color="primary" />
                        {hotel.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon color="action" sx={{ fontSize: 16 }} />
                        {hotel.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleIcon color="action" sx={{ fontSize: 16 }} />
                        {hotel.owner}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={hotel.category} color={getCategoryColor(hotel.category)} size="small" />
                    </TableCell>
                    <TableCell>{hotel.rooms}</TableCell>
                    <TableCell>
                      <Chip
                        label={hotel.isVisible ? "Visible" : "Oculto"}
                        color={hotel.isVisible ? "success" : "error"}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hotel.isVisible}
                            onChange={() => toggleHotelVisibility(hotel.id, hotel.isVisible)}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper elevation={2} sx={{ p: 6, textAlign: "center", mt: 4 }}>
            <HotelIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No se encontraron hoteles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  )
}